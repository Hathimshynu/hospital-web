import { Check } from "lucide-react";
import { Media } from "@/components/ui/Media";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ImageReveal } from "@/components/animations/ImageReveal";
import { Tilt3D } from "@/components/animations/Tilt3D";
import { Button } from "@/components/ui/Button";
import { HospitalIllustration } from "@/components/hero/HospitalIllustration";
import { hospital } from "@/data/hospital";
import { SceneLayer } from "@/components/three/SceneLayer";
import { hospitalImages } from "@/data/images";

const points = [
  "Patient-centered care for every visit",
  "Experienced medical professionals",
  "Modern facilities under one roof",
  "Accessible healthcare for the community",
  "Laboratory and ultrasound diagnostics on site",
  "Care for the whole family",
];

export function About({ full }: { full?: boolean }) {
  const image = hospitalImages.exterior.src;
  return (
    <section aria-labelledby="about-title" className="relative isolate overflow-hidden bg-white py-16 md:py-24">
      <SceneLayer scene="about" className="-z-10" />
      <div className="container-x grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <ImageReveal>
          <Tilt3D max={4}><Media
            src={image} alt={hospitalImages.exterior.alt}
            objectPosition="50% 55%"
            fallback={<HospitalIllustration />}
            className="aspect-[4/3] rounded-[1.75rem] shadow-[0_36px_70px_-40px_rgba(8,35,59,0.5)] lg:aspect-[4/4.2]"
            sizes="(min-width: 1024px) 45vw, 100vw"
          /></Tilt3D>
        </ImageReveal>

        <div>
          <SectionHeading id="about-title" eyebrow="About Us" lines={["About Our Hospital"]} />
          <div className="mt-5 space-y-4 text-base leading-relaxed text-slate-body md:text-lg">
            <Reveal><p>{hospital.name} is a multispeciality hospital in Eraniel, Kanyakumari District, built around a simple idea: good healthcare should be close to home, easy to reach and delivered with genuine care.</p></Reveal>
            <Reveal delay={0.08}><p>From a consultation with an experienced physician to laboratory tests, ultrasound scanning and medicines from our pharmacy, we bring the essentials of your care together under one roof - for you and your family.</p></Reveal>
          </div>
          <ul className="mt-7 grid gap-3 sm:grid-cols-2">
            {points.map((p, i) => (
              <Reveal key={p} as="li" delay={i * 0.04} className="flex items-start gap-3 text-sm font-medium text-navy-950">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand-600 text-white"><Check className="size-3" aria-hidden="true" /></span>{p}
              </Reveal>
            ))}
          </ul>
          {!full && <div className="mt-8"><Button href="/about" variant="ghost" arrow>More about us</Button></div>}
        </div>
      </div>
    </section>
  );
}
