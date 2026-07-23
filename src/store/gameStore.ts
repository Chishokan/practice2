import { create } from 'zustand';

// Zustand ストアの骨格。この層は domain/ の純粋関数を呼ぶだけの薄い層に留める。
// Phase 0 では画面遷移のみを持ち、ゲームロジックはまだ実装しない。

/** 表示中の画面。設計書「9.」の screens に対応する */
export type Screen = 'reception' | 'shelf' | 'archive' | 'ledger';

interface GameStore {
  screen: Screen;
  /** 指定した画面へ遷移する */
  goTo: (screen: Screen) => void;
}

export const useGameStore = create<GameStore>((set) => ({
  screen: 'reception',
  goTo: (screen) => set({ screen }),
}));
