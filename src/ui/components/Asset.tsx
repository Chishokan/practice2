import { useState, type ReactNode } from 'react';

// 画像スロット。読み込み失敗（未配置＝404）なら fallback を描く＝現行UIのまま破綻しない。
// 遅延読込で初期表示を重くしない。画像は装飾レイヤー（ルール・進行に影響しない）。
export default function Asset({
  src,
  alt,
  className,
  fallback = null,
}: {
  src: string;
  alt: string;
  className?: string;
  fallback?: ReactNode;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) return <>{fallback}</>;
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
