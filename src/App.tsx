import { useGameStore } from './store/gameStore';
import Reception from './ui/screens/Reception';
import Shelf from './ui/screens/Shelf';

// Phase 0: 受付 → 書架 → 受付 の遷移だけが動く空の状態。
export default function App() {
  const screen = useGameStore((s) => s.screen);

  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-900 text-neutral-100">
      {screen === 'shelf' ? <Shelf /> : <Reception />}
    </main>
  );
}
