import { useGameStore, VISITOR_ORDER } from '../../store/gameStore';
import { backgroundKey } from '../../domain/assets';
import Asset from './Asset';

// 画面ごとの背景（装飾レイヤー）。未配置なら画像は消え、暗いスクリムだけが残る＝現行の
// 無地に近い見た目のまま。本文の可読性のためスクリムを重ねる。
export default function Background() {
  const screen = useGameStore((s) => s.screen);
  const visitorIndex = useGameStore((s) => s.visitorIndex);
  const finalDay = visitorIndex >= VISITOR_ORDER.length;
  const key = backgroundKey(screen, { finalDay });
  if (!key) return null;

  return (
    <div className="fixed inset-0 -z-10">
      <Asset src={`/assets/bg/${key}.webp`} alt="" className="h-full w-full object-cover opacity-30" />
      <div className="absolute inset-0 bg-neutral-900/70" />
    </div>
  );
}
