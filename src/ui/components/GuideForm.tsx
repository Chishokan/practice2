import { useGameStore } from '../../store/gameStore';
import { guideForm } from '../../domain/assets';
import { FLAG_GUIDE_REDEEMED } from '../../content/story';
import { GUIDE_FORM_BASE, GUIDE_FORM_REDEEMED } from '../../content/finale';
import Asset from './Asset';

// 妖精のフォーム表示。道中 base 固定・救済時のみ redeemed（guide-redeemed フラグに接続）。
// 未配置ならテキストのプレースホルダにフォールバック。redeemed の差し色は
// --erasure とは実装上別（restoration 系・§ディレクター裁定）＝ここは画像で表現し色は借りない。
export default function GuideForm({ className }: { className?: string }) {
  const flags = useGameStore((s) => s.world.flags);
  const form = guideForm(flags, FLAG_GUIDE_REDEEMED);
  const label = form === 'redeemed' ? GUIDE_FORM_REDEEMED : GUIDE_FORM_BASE;
  return (
    <Asset
      src={`/assets/guide/${form}.webp`}
      alt="案内役"
      className={className ?? 'h-24 w-24 object-contain'}
      fallback={<p className="text-xs text-neutral-500">{label}</p>}
    />
  );
}
