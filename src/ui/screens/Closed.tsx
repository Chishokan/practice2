import { useGameStore } from '../../store/gameStore';

// Phase 1 の暫定終端。エンディング判定は Phase 3 の範囲。
export default function Closed() {
  const reputation = useGameStore((s) => s.world.reputation);

  return (
    <section className="flex flex-col items-center gap-4 px-6 text-center">
      <h1 className="text-xl text-neutral-300">本日は閉館です</h1>
      <p className="text-neutral-500">今日の来訪者は全員帰りました。</p>
      <p className="text-neutral-600 text-sm">評判：{reputation}</p>
    </section>
  );
}
