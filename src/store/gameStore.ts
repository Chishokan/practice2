import { create } from 'zustand';
import type { BookId, Scene, WorldState } from '../domain/types';
import { createInitialWorldState, startNextCycle } from '../domain/worldState';
import { addToShelf, isShelfOverCapacity, removeFromShelf } from '../domain/shelf';
import { handOver, selectReaction } from '../domain/visitor';
import { applyChoice } from '../domain/choice';
import { evaluateAnomalies } from '../domain/anomaly';
import { allBooks } from '../content/books';
import { allVisitors, getVisitor } from '../content/visitors';
import { anomalyRules, TOWN_STAGES } from '../content/anomalies';
import { ANCHOR_BOOK_ID } from '../content/story';
import type { SaveData, SaveDataV2 } from '../save/persistence';
import { loadSave, writeSave, clearSave } from '../save/persistence';

// Zustand は domain/ の純粋関数を呼ぶだけの薄い層に留める。
// 分岐やルールの本体は domain 側に置く。

/** 表示中の画面。'intro' は着任時の案内役登場、'closed' は周回の終端 */
export type Screen = 'intro' | 'reception' | 'shelf' | 'archive' | 'ledger' | 'closed';

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

  goTo: (screen: Screen) => void;
  /** 性格スケッチ選択を選ぶ（無反応で要望へ合流する） */
  chooseCharacter: (choiceId: string) => void;
  /** 現在の来訪者に本を手渡す */
  handOverToCurrent: (bookId: BookId) => void;
  /** 現在の来訪者を断る */
  refuseCurrent: () => void;
  /** 反応シーンを読み終えて次へ進む（新刊到着・整理・次の来訪者） */
  proceed: () => void;
  /** 整理で1冊降ろす */
  lowerFromShelf: (bookId: BookId) => void;
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

  goTo: (screen) => set({ screen }),

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
    });
  },

  restart: () => {
    clearSave();
    set({ ...freshRuntime() });
  },
}));

// 実行状態が変わるたびに自動保存する。
// これにより conscience を含む途中状態が、周回途中のリロードでも失われない。
useGameStore.subscribe((s) => writeSave(toSnapshot(s)));

// 次の来訪者へ進む。居なければ閉館（エンディングへ）。
function advance(
  set: (partial: Partial<GameStore>) => void,
  world: WorldState,
  donationIndex: number,
  visitorIndex: number,
): void {
  const nextIndex = visitorIndex + 1;
  const done = nextIndex >= VISITOR_ORDER.length;
  set({
    world,
    donationIndex,
    visitorIndex: nextIndex,
    pendingScenes: null,
    handedOver: false,
    characterAnswered: false,
    screen: done ? 'closed' : 'reception',
  });
}

export { VISITOR_ORDER };
