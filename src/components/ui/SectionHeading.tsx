import { cn } from "@/lib/utils";
import { Reveal, TextReveal } from "./Reveal";
import { ParticleText } from "@/components/animations/ParticleText";

/** Section title. `as` lets pages keep a single H1 and a clean H2 → H3 hierarchy. */
export function SectionHeading({
  eyebrow, lines, text, dark, align = "left", className, id, as: Tag = "h2", particles,
}: {
  id?: string;
  eyebrow: string;
  lines: string[];
  text?: string;
  dark?: boolean;
  align?: "left" | "center";
  className?: string;
  as?: "h1" | "h2";
  /** major headings only: forms the title from particles (the HTML heading is always present) */
  particles?: boolean;
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      <Reveal>
        <p className={cn("mb-3 text-xs font-bold uppercase tracking-[0.2em]", dark ? "text-brand-300" : "text-brand-700")}>{eyebrow}</p>
      </Reveal>
      {particles ? (
        <ParticleText
          as={Tag} id={id} lines={lines} align={align} color={dark ? "#ffffff" : "#08233B"}
          particleColor={dark ? ["#27C4C8", "#7DE7E8", "#FFFFFF", "#0F9FA8"] : undefined}
          className="text-[clamp(1.85rem,6.2vw,3rem)] font-semibold leading-[1.1] tracking-tight"
        />
      ) : (
        <Tag id={id} className={cn("text-[clamp(1.85rem,6.2vw,3rem)] font-semibold leading-[1.1] tracking-tight", dark ? "text-white" : "text-navy-950")}>
          {/* full title stays a single accessible string; the animated lines are decorative */}
          <span className="sr-only">{lines.join(" ")}</span>
          <span aria-hidden="true"><TextReveal lines={lines} /></span>
        </Tag>
      )}
      {text && (
        <Reveal delay={0.15}>
          <p className={cn("mt-4 text-base leading-relaxed md:text-lg", dark ? "text-white/75" : "text-slate-body")}>{text}</p>
        </Reveal>
      )}
    </div>
  );
}
