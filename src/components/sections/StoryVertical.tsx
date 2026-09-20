import { Media } from "@/components/ui/Media";
import { StoryFallback } from "./StoryFallback";
import { cn } from "@/lib/utils";
import type { StoryStage } from "@/types";

export type Stage = StoryStage & { src?: string };

/**
 * The vertical story used on phones, tablets, reduced-motion and no-WebGL - and the crawlable HTML
 * for everyone. A SERVER component: images unveil with CSS (tipping back into the page) triggered
 * by the global IntersectionObserver, so it costs no hydration.
 */
export function StoryVertical({ stages }: { stages: Stage[] }) {
  return (
    <div className="container-x mt-12">
      <ol className="space-y-14 md:space-y-20">
        {stages.map((s, i) => (
          <li key={s.id} className="grid items-center gap-5 md:grid-cols-2 md:gap-12">
            <div data-reveal-clip="" className={cn(i % 2 === 1 && "md:order-2")}>
              <div className="reveal-clip reveal-up overflow-hidden rounded-[1.75rem] shadow-[0_30px_60px_-38px_rgba(8,35,59,0.55)]">
                <Media
                  src={s.src} alt={s.alt} fallback={<StoryFallback stage={s} index={i} />}
                  className="aspect-[16/10] sm:aspect-[16/9]" sizes="(min-width:768px) 45vw, 100vw"
                />
              </div>
            </div>
            <div data-reveal="" style={{ "--d": "0.1s" } as React.CSSProperties}>
              <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-brand-700">
                <span className="text-3xl font-semibold leading-none tracking-normal text-brand-600/40">{s.n}</span>{s.kicker}
              </p>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight text-navy-950 md:text-3xl">{s.title}</h3>
              <p className="mt-3 text-base leading-relaxed text-slate-body md:text-lg">{s.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
