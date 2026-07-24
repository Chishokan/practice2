import { useGameStore } from './store/gameStore';
import Reception from './ui/screens/Reception';
import Shelf from './ui/screens/Shelf';
import Archive from './ui/screens/Archive';
import Ledger from './ui/screens/Ledger';
import Closed from './ui/screens/Closed';

// 画面の出し分け。Phase 1 のコアループ（受付→書架→反応→整理）を通す。
export default function App() {
  const screen = useGameStore((s) => s.screen);

  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-900 text-neutral-100 py-12">
      {screen === 'shelf' && <Shelf />}
      {screen === 'archive' && <Archive />}
      {screen === 'ledger' && <Ledger />}
      {screen === 'closed' && <Closed />}
      {screen === 'reception' && <Reception />}
    </main>
  );
}
