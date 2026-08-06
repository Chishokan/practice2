import { create } from 'zustand';
import type { BookId, Scene, WorldState } from '../domain/types';
import { createInitialWorldState, startNextCycle } from '../domain/worldState';
import { addToShelf, isShelfOverCapacity, removeFromShelf } from '../domain/shelf';
import { handOver, selectReaction } from '../domain/visitor';
import { applyChoice } from '../domain/choice';
import { evaluateAnomalies } from '../domain/anomaly';
import { chapterTransition } from '../domain/chapter';
import {
  revealCatalogFinalIfDue,
  shouldFireGuideFinalRemark,
  markGuideFinalRemarkFired,
} from '../domain/catalog';
import { applyDescent, addFlag } from '../domain/basement';
import { allBooks } from '../content/books';
import { allVisitors, getVisitor } from '../content/visitors';
import { anomalyRules, TOWN_STAGES } from '../content/anomalies';
import type { FlagId } from '../domain/types';
import {
  ANCHOR_BOOK_ID,
  FLAG_V17_RESOLVED,
  FLAG_CATALOG_FINAL_REVEALED,
  FLAG_GUIDE_FINAL_REMARK,
  FLAG_TRUTH_REACHED,
  CATALOG_FINAL_REVEAL_LABEL,
} from '../content/story';
import { guideFinalRemarkScenes } from '../content/guide';
import type { SaveData, SaveDataV2 } from '../save/persistence';
import { loadSave, writeSave, clearSave } from '../save/persistence';

// Zustand は domain/ の純粋関数を呼ぶだけの薄い層に留める。
// 分岐やルールの本体は domain 側に置く。

/** 表示中の画面。'intro'=着任時の案内役、'interlude'=章の幕間、'closed'=周回の終端 */
export type Screen =
  | 'intro'
  | 'interlude'
  | 'reception'
  | 'shelf'
  | 'archive'
  | 'ledger'
  | 'basement'
  | 'confront'
  | 'naming'
  | 'rescue'
  | 'closed';

// 初期配置：先頭9冊を書架に、残り3冊を新刊の到着分として控える。
// 容量ちょうどから始めるので、手渡しで1冊届くたびに整理が要求される。
const INITIAL_SHELF: BookId[] = allBooks.slice(0, 9).map((b) => b.id);
const SHELF_CAPACITY = INITIAL_SHELF.length;
const DONATIONS: BookId[] = allBooks.slice(9).map((b) => b.id);

const VISITOR_ORDER = allVisitors.map((v) => v.id);

const CYCLE_PARAMS = {
  baseShelf: INITIAL_SHELF,
  shelfCapacity: SHELF_CAPACITY,
  anchorId: ANCHOR_BOOK_ID,
  townText: TOWN_STAGES[0],
};

interface GameStore {
  screen: Screen;
  world: WorldState;

  /** 現在の来訪者の位置 */
  visitorIndex: number;
  /** この周回で未消費の新刊キュー（前周で消した本は届かない） */
  donationQueue: BookId[];
  /** 次に届く新刊のキュー位置 */
  donationIndex: number;
  /** 反応／断りのシーン。表示中は要望ではなくこれを見せる */
  pendingScenes: Scene[] | null;
  /** この来訪で手渡し済みか（新刊到着の判定に使う） */
  handedOver: boolean;
  /** この来訪で性格スケッチ選択を済ませたか（一度だけ提示する） */
  characterAnswered: boolean;
  /** 是正3（妖精の一言）の表示シーン。null で非表示。永続しない（実行中のみ） */
  guideRemark: Scene[] | null;
  /** 書架を開いたときの初期検索語（金色の絵本の探索導線）。消費したら null に戻す */
  pendingShelfQuery: string | null;
  /** 台帳を閉じたときの戻り先（受付／地下の錠から見に来た場合など）。永続しない */
  ledgerReturn: Screen;

  goTo: (screen: Screen) => void;
  /** 台帳（目録）を開く。戻り先を覚えつつ、必要なら cat-final を開示する */
  openLedger: (origin: Screen) => void;
  /** 台帳を閉じて戻り先へ帰る */
  closeLedger: () => void;
  /** 地下へ降りる（真相到達の契機：truth-reached＋conscience+1 を同居） */
  descendToBasement: () => void;
  /** 地下から地上へ戻る（18b 未実装でも進行不能にしない） */
  returnFromBasement: () => void;
  /** 地下の進行フラグを立てる（錠解除・絵本発見）。conscience には影響しない */
  markFlag: (flag: FlagId) => void;
  /** 性格スケッチ選択を選ぶ（無反応で要望へ合流する） */
  chooseCharacter: (choiceId: string) => void;
  /** 現在の来訪者に本を手渡す */
  handOverToCurrent: (bookId: BookId) => void;
  /** 現在の来訪者を断る */
  refuseCurrent: () => void;
  /** 反応シーンを読み終えて次へ進む（新刊到着・整理・次の来訪者） */
  proceed: () => void;
  /** 章の幕間を読み終えて次章へ進む */
  proceedInterlude: () => void;
  /** 整理で1冊降ろす */
  lowerFromShelf: (bookId: BookId) => void;
  /** 目録の予約枠（金色の絵本）を探しに行く＝書架で空振り→是正3を一度だけ発火 */
  seekCatalogFinal: () => void;
  /** 是正3の表示を閉じる */
  dismissGuideRemark: () => void;
  /** 書架の初期検索語を消費する（一度使ったら消す） */
  consumePendingShelfQuery: () => void;
  /** 次の周回を始める（erasedBooks/conscience を引き継ぐ） */
  nextCycle: () => void;
  /** すべて捨てて1周目からやり直す（セーブも消す） */
  restart: () => void;
}

function currentVisitorId(index: number): string | undefined {
  return VISITOR_ORDER[index];
}

/** 前周で消した本は届かない。届く新刊のキューを作る */
function donationsFor(world: WorldState): BookId[] {
  return DONATIONS.filter((id) => !world.erasedBooks.includes(id));
}

/** 保存・復元する実行状態のスライス（アクションを除く） */
type Runtime = Pick<
  GameStore,
  | 'screen'
  | 'world'
  | 'visitorIndex'
  | 'donationQueue'
  | 'donationIndex'
  | 'pendingScenes'
  | 'handedOver'
  | 'characterAnswered'
>;

/** 実行状態を丸ごとスナップショットにする（flags は配列化） */
function toSnapshot(s: Runtime): SaveDataV2 {
  return {
    version: 2,
    world: { ...s.world, flags: [...s.world.flags] },
    visitorIndex: s.visitorIndex,
    donationQueue: s.donationQueue,
    donationIndex: s.donationIndex,
    handedOver: s.handedOver,
    characterAnswered: s.characterAnswered,
    pendingScenes: s.pendingScenes,
    screen: s.screen,
  };
}

/** 1周目の初期実行状態。着任時は案内役の登場（intro）から始まる */
function freshRuntime(): Runtime {
  const world = createInitialWorldState({
    shelf: INITIAL_SHELF,
    shelfCapacity: SHELF_CAPACITY,
    townText: TOWN_STAGES[0],
  });
  return {
    screen: 'intro',
    world,
    visitorIndex: 0,
    donationQueue: donationsFor(world),
    donationIndex: 0,
    pendingScenes: null,
    handedOver: false,
    characterAnswered: false,
  };
}

/** 旧 v1（周回境界のみ）を、その周回の開始点として復元する */
function runtimeFromV1(save: Extract<SaveData, { version: 1 }>): Runtime {
  const shelf = INITIAL_SHELF.filter((id) => !save.erasedBooks.includes(id));
  const world = {
    ...createInitialWorldState({ shelf, shelfCapacity: SHELF_CAPACITY, townText: TOWN_STAGES[0] }),
    cycle: save.cycle,
    erasedBooks: save.erasedBooks,
    conscience: save.conscience,
  };
  return {
    screen: 'reception',
    world,
    visitorIndex: 0,
    donationQueue: donationsFor(world),
    donationIndex: 0,
    pendingScenes: null,
    handedOver: false,
    characterAnswered: false,
  };
}

/** v2（中断地点）をそのまま復元する。flags は Set へ戻す */
function runtimeFromV2(save: SaveDataV2): Runtime {
  return {
    screen: save.screen as Screen,
    world: { ...save.world, flags: new Set(save.world.flags) },
    visitorIndex: save.visitorIndex,
    donationQueue: save.donationQueue,
    donationIndex: save.donationIndex,
    pendingScenes: save.pendingScenes,
    handedOver: save.handedOver,
    characterAnswered: save.characterAnswered,
  };
}

// セーブがあれば中断地点（v2）または周回開始点（v1）から復元し、無ければ1周目を作る。
function buildInitialRuntime(): Runtime {
  const save = loadSave();
  if (!save) {
    const fresh = freshRuntime();
    writeSave(toSnapshot(fresh)); // 初回の開始点を保存
    return fresh;
  }
  return save.version === 2 ? runtimeFromV2(save) : runtimeFromV1(save);
}

const initial = buildInitialRuntime();

export const useGameStore = create<GameStore>((set, get) => ({
  ...initial,
  guideRemark: null,
  pendingShelfQuery: null,
  ledgerReturn: 'reception',

  goTo: (screen) => set({ screen }),

  openLedger: (origin) => {
    // 台帳を開くとき、v17 完了後なら cat-final の正体を静かに開示する（開いたら変わっている）。
    const revealed = revealCatalogFinalIfDue(
      get().world,
      FLAG_V17_RESOLVED,
      FLAG_CATALOG_FINAL_REVEALED,
    );
    set({ screen: 'ledger', world: revealed, ledgerReturn: origin });
  },

  closeLedger: () => set({ screen: get().ledgerReturn }),

  descendToBasement: () => {
    // 「降りてみる」＝真相到達の契機。truth-reached＋conscience+1 を同居（初回のみ）。
    set({ world: applyDescent(get().world, FLAG_TRUTH_REACHED), screen: 'basement' });
  },

  // 手記・絵本を見て地上へ戻ると、妖精が待っている（終幕・対峙へ）。
  returnFromBasement: () => set({ screen: 'confront' }),

  markFlag: (flag) => set({ world: addFlag(get().world, flag) }),

  chooseCharacter: (choiceId) => {
    const { world, visitorIndex } = get();
    const visitor = getVisitor(currentVisitorId(visitorIndex) ?? '');
    const choice = visitor?.characterScene?.choices.find((c) => c.id === choiceId);
    if (!choice) return;
    // 選択は無反応で合流する。conscience は不可視に加算される。
    set({ world: applyChoice(world, choice), characterAnswered: true });
  },

  handOverToCurrent: (bookId) => {
    const { world, visitorIndex } = get();
    const visitor = getVisitor(currentVisitorId(visitorIndex) ?? '');
    if (!visitor) return;
    set({
      world: handOver(world, visitor, bookId),
      pendingScenes: selectReaction(visitor, bookId),
      handedOver: true,
      screen: 'reception',
    });
  },

  refuseCurrent: () => {
    const { visitorIndex } = get();
    const visitor = getVisitor(currentVisitorId(visitorIndex) ?? '');
    if (!visitor) return;
    set({ pendingScenes: visitor.refuseScene, handedOver: false, screen: 'reception' });
  },

  proceed: () => {
    const { world, handedOver, donationQueue, donationIndex, visitorIndex } = get();

    // 手渡した回のみ、新刊が1冊届く（コアループ）。
    let nextWorld = world;
    let nextDonationIndex = donationIndex;
    if (handedOver && donationIndex < donationQueue.length) {
      nextWorld = addToShelf(world, donationQueue[donationIndex]);
      nextDonationIndex = donationIndex + 1;
    }

    // 容量を超えたら整理へ。超えていなければ次の来訪者へ。
    if (isShelfOverCapacity(nextWorld)) {
      set({
        world: nextWorld,
        donationIndex: nextDonationIndex,
        pendingScenes: null,
        screen: 'archive',
      });
      return;
    }

    advance(set, nextWorld, nextDonationIndex, visitorIndex);
  },

  proceedInterlude: () => {
    // 幕間中は visitorIndex が次章の先頭を指す。来訪者が居なければ閉館へ。
    const { visitorIndex } = get();
    set({ screen: visitorIndex >= VISITOR_ORDER.length ? 'closed' : 'reception' });
  },

  lowerFromShelf: (bookId) => {
    const { world, donationIndex, visitorIndex } = get();
    // 降ろした直後に綻びを評価する（整理実行時に評価するのが設計）。
    // ここで台帳の書き換えなどが静かに起こる。UI へは何も通知しない。
    const nextWorld = evaluateAnomalies(removeFromShelf(world, bookId), anomalyRules);
    // まだ超過しているなら整理を続ける。解消したら次の来訪者へ。
    if (isShelfOverCapacity(nextWorld)) {
      set({ world: nextWorld });
      return;
    }
    advance(set, nextWorld, donationIndex, visitorIndex);
  },

  seekCatalogFinal: () => {
    // 金色の絵本を探す＝書架で当該語を検索（現存蔵書に無く必ず空振り）。
    // 開示済みかつ是正3が未発火なら、空振りの直後に妖精の一言を一度だけ出す。
    const { world } = get();
    const fire = shouldFireGuideFinalRemark(
      world,
      FLAG_CATALOG_FINAL_REVEALED,
      FLAG_GUIDE_FINAL_REMARK,
    );
    set({
      screen: 'shelf',
      pendingShelfQuery: CATALOG_FINAL_REVEAL_LABEL,
      guideRemark: fire ? guideFinalRemarkScenes : null,
      world: fire ? markGuideFinalRemarkFired(world, FLAG_GUIDE_FINAL_REMARK) : world,
    });
  },

  dismissGuideRemark: () => set({ guideRemark: null }),

  consumePendingShelfQuery: () => set({ pendingShelfQuery: null }),

  nextCycle: () => {
    // 周回跨ぎのキャリーは startNextCycle のまま（挙動不変）。保存は自動保存に任せる。
    const next = startNextCycle(get().world, CYCLE_PARAMS);
    set({
      world: next,
      visitorIndex: 0,
      donationQueue: donationsFor(next),
      donationIndex: 0,
      pendingScenes: null,
      handedOver: false,
      characterAnswered: false,
      screen: 'reception',
      guideRemark: null,
      pendingShelfQuery: null,
      ledgerReturn: 'reception',
    });
  },

  restart: () => {
    clearSave();
    set({
      ...freshRuntime(),
      guideRemark: null,
      pendingShelfQuery: null,
      ledgerReturn: 'reception',
    });
  },
}));

// 実行状態が変わるたびに自動保存する。
// これにより conscience を含む途中状態が、周回途中のリロードでも失われない。
useGameStore.subscribe((s) => writeSave(toSnapshot(s)));

// 次の来訪者へ進む。章が上がるなら幕間、来訪者が尽きたら閉館（エンディングへ）。
function advance(
  set: (partial: Partial<GameStore>) => void,
  world: WorldState,
  donationIndex: number,
  visitorIndex: number,
): void {
  const nextIndex = visitorIndex + 1;
  const total = VISITOR_ORDER.length;
  const nextVisitorChapter =
    nextIndex < total ? getVisitor(VISITOR_ORDER[nextIndex])?.chapter ?? null : null;
  const t = chapterTransition({
    currentChapter: world.chapter,
    nextIndex,
    total,
    nextVisitorChapter,
  });

  const base = {
    donationIndex,
    visitorIndex: nextIndex,
    pendingScenes: null,
    handedOver: false,
    characterAnswered: false,
  };

  if (t.interlude) {
    // 章遷移時に綻びを再評価する（新しい章上限で anomalyLevel を更新し、
    // 第3章では searchBlock 発動域に到達させる）。UI へは何も通知しない。
    const nextWorld = evaluateAnomalies(
      { ...world, chapter: t.chapter as 1 | 2 | 3 },
      anomalyRules,
    );
    set({ ...base, world: nextWorld, screen: 'interlude' });
    return;
  }

  set({ ...base, world, screen: t.done ? 'closed' : 'reception' });
}

export { VISITOR_ORDER };
