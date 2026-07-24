import type { Scene } from '../../domain/types';

// シーン列（会話・地の文）を素朴に表示する。装飾は Phase 5 で詰める。
export default function SceneView({ scenes }: { scenes: Scene[] }) {
  return (
    <div className="flex flex-col gap-3 max-w-prose">
      {scenes.map((scene) => (
        <p key={scene.id} className="leading-relaxed">
          {scene.speaker && (
            <span className="mr-2 text-neutral-400">{scene.speaker}</span>
          )}
          {scene.text}
        </p>
      ))}
    </div>
  );
}
