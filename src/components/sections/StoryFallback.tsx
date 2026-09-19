import { Icon } from "@/components/ui/Icon";
import type { StoryStage } from "@/types";

const tones = [
  "from-[#e4f5f6] to-[#b7e6e8]",
  "from-[#eaf3fb] to-[#c6dcf1]",
  "from-[#e4f5f6] to-[#9fd9dc]",
  "from-[#fff3ef] to-[#ffd6cc]",
  "from-[#fff3ef] to-[#d6f0f1]",
  "from-[#e4f5f6] to-[#ffe6c7]",
];

/**
 * Designed scene shown until a photograph is added at public/images/story/<key>.jpg.
 * Intentionally abstract: no faces, no people - just warmth, calm colour and the stage's icon.
 */
export function StoryFallback({ stage, index }: { stage: StoryStage; index: number }) {
  return (
    <div className={`relative size-full overflow-hidden bg-gradient-to-br ${tones[index % tones.length]}`}>
      <div aria-hidden="true" className="absolute -left-16 -top-16 size-64 rounded-full bg-white/50 blur-2xl" />
      <div aria-hidden="true" className="absolute -bottom-20 -right-10 size-72 rounded-full bg-white/40 blur-2xl" />
      <div aria-hidden="true" className="absolute inset-[12%] rounded-full border border-white/70" />
      <div aria-hidden="true" className="absolute inset-[26%] rounded-full border border-white/60" />
      <span aria-hidden="true" className="absolute bottom-3 left-5 text-[clamp(4rem,14vw,8rem)] font-semibold leading-none tracking-tighter text-white/70">{stage.n}</span>
      <div className="absolute inset-0 grid place-items-center">
        <span className="grid size-20 place-items-center rounded-3xl bg-white text-brand-600 shadow-[0_20px_40px_-16px_rgba(8,35,59,0.35)] sm:size-24">
          <Icon name={stage.icon} className="size-10 sm:size-12" strokeWidth={1.4} />
        </span>
      </div>
    </div>
  );
}
