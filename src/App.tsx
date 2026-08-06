import { useGameStore } from './store/gameStore';
import Intro from './ui/screens/Intro';
import Interlude from './ui/screens/Interlude';
import Reception from './ui/screens/Reception';
import Shelf from './ui/screens/Shelf';
import Archive from './ui/screens/Archive';
import Ledger from './ui/screens/Ledger';
import Basement from './ui/screens/Basement';
import Confront from './ui/screens/Confront';
import Naming from './ui/screens/Naming';
import Rescue from './ui/screens/Rescue';
import Closed from './ui/screens/Closed';
import GuideRemark from './ui/components/GuideRemark';

// 画面の出し分け。Phase 1 のコアループ（受付→書架→反応→整理）を通す。
export default function App() {
  const screen = useGameStore((s) => s.screen);

  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-900 text-neutral-100 py-12">
      {screen === 'intro' && <Intro />}
      {screen === 'interlude' && <Interlude />}
      {screen === 'shelf' && <Shelf />}
      {screen === 'archive' && <Archive />}
      {screen === 'ledger' && <Ledger />}
      {screen === 'basement' && <Basement />}
      {screen === 'confront' && <Confront />}
      {screen === 'naming' && <Naming />}
      {screen === 'rescue' && <Rescue />}
      {screen === 'closed' && <Closed />}
      {screen === 'reception' && <Reception />}
      {/* 是正3（妖精の一言）は画面に依らず最前面のオーバーレイで出す */}
      <GuideRemark />
    </main>
  );
}
