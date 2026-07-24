import { create } from 'zustand';
import type { BookId, Scene, WorldState } from '../domain/types';
import { createInitialWorldState } from '../domain/worldState';
import { addToShelf, isShelfOverCapacity, removeFromShelf } from '../domain/shelf';
import { handOver, selectReaction } from '../domain/visitor';
import { allBooks } from '../content/books';
import { allVisitors, getVisitor } from '../content/visitors';

// Zustand は domain/ の純粋関数を呼ぶだけの薄い層に留める。
// 分岐やルールの本体は domain 側に置く。

/** 表示中の画面。'closed' は本日の閉館（Phase 1 の暫定終端） */
export type Screen = 'reception' | 'shelf' | 'archive' | 'ledger' | 'closed';

// 初期配置：先頭9冊を書架に、残り3冊を新刊の到着分として控える。
// 容量ちょうどから始めるので、手渡しで1冊届くたびに整理が要求される。
const INITIAL_SHELF: BookId[] = allBooks.slice(0, 9).map((b) => b.id);
const SHELF_CAPACITY = INITIAL_SHELF.length;
const DONATIONS: BookId[] = allBooks.slice(9).map((b) => b.id);

const VISITOR_ORDER = allVisitors.map((v) => v.id);

interface GameStore {
  screen: Screen;
  world: WorldState;

  /** 現在の来訪者の位置 */
  visitorIndex: number;
  /** 次に届く新刊（未消費の寄贈）のキュー位置 */
  donationIndex: number;
  /** 反応／断りのシーン。表示中は要望ではなくこれを見せる */
  pendingScenes: Scene[] | null;
  /** この来訪で手渡し済みか（新刊到着の判定に使う） */
  handedOver: boolean;

  goTo: (screen: Screen) => void;
  /** 現在の来訪者に本を手渡す */
  handOverToCurrent: (bookId: BookId) => void;
  /** 現在の来訪者を断る */
  refuseCurrent: () => void;
  /** 反応シーンを読み終えて次へ進む（新刊到着・整理・次の来訪者） */
  proceed: () => void;
  /** 整理で1冊降ろす */
  lowerFromShelf: (bookId: BookId) => void;
}

function currentVisitorId(index: number): string | undefined {
  return VISITOR_ORDER[index];
}

export const useGameStore = create<GameStore>((set, get) => ({
  screen: 'reception',
  world: createInitialWorldState({ shelf: INITIAL_SHELF, shelfCapacity: SHELF_CAPACITY }),
  visitorIndex: 0,
  donationIndex: 0,
  pendingScenes: null,
  handedOver: false,

  goTo: (screen) => set({ screen }),

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
    const { world, handedOver, donationIndex, visitorIndex } = get();

    // 手渡した回のみ、新刊が1冊届く（コアループ）。
    let nextWorld = world;
    let nextDonationIndex = donationIndex;
    if (handedOver && donationIndex < DONATIONS.length) {
      nextWorld = addToShelf(world, DONATIONS[donationIndex]);
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
    const nextWorld = removeFromShelf(world, bookId);
    // まだ超過しているなら整理を続ける。解消したら次の来訪者へ。
    if (isShelfOverCapacity(nextWorld)) {
      set({ world: nextWorld });
      return;
    }
    advance(set, nextWorld, donationIndex, visitorIndex);
  },
}));

// 次の来訪者へ進む。居なければ閉館。
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
    screen: done ? 'closed' : 'reception',
  });
}

export { VISITOR_ORDER };
