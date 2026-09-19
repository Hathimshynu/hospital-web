import { Icon } from "@/components/ui/Icon";
import { AnimatedCard } from "@/components/ui/AnimatedCard";
import { Tilt3D } from "@/components/animations/Tilt3D";
import type { IconName } from "@/types";

/** Qualitative promises only - no invented numbers or unverified claims. */
const items: { icon: IconName; title: string; text: string }[] = [
  { icon: "stethoscope", title: "Expert Doctors", text: "Experienced & caring physicians" },
  { icon: "microscope", title: "Advanced Diagnostics", text: "Laboratory and ultrasound, reliable results" },
  { icon: "building", title: "Modern Facilities", text: "Comfortable, well-equipped spaces" },
  { icon: "heart", title: "Patient-Centered Care", text: "Time to listen, for you and your family" },
];

export function TrustSection() {
  return (
    <section aria-labelledby="trust-title" className="bg-white pb-6 pt-2 md:pb-10">
      <div className="container-x">
        <h2 id="trust-title" className="sr-only">Why families choose us</h2>
        <ul className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {items.map((i, k) => (
            <AnimatedCard key={i.title} as="li" delay={k * 0.07} className="h-full border-transparent bg-mist shadow-[0_18px_40px_-30px_rgba(8,35,59,0.5)]">
              <Tilt3D className="h-full" max={7}>
                <div className="flex h-full flex-col gap-3 p-4 sm:p-6">
                  <span className="grid size-11 place-items-center rounded-xl bg-white text-brand-600 shadow-sm"><Icon name={i.icon} className="size-5" /></span>
                  <h3 className="text-[15px] font-bold leading-tight text-navy-950 sm:text-base">{i.title}</h3>
                  <p className="text-[13px] leading-snug text-slate-body sm:text-sm">{i.text}</p>
                </div>
              </Tilt3D>
            </AnimatedCard>
          ))}
        </ul>
      </div>
    </section>
  );
}
