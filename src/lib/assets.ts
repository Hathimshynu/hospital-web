import { blogImages, departmentImages, doctorImages, facilityImages, hospitalImages, pregnancyImages } from "@/data/images";

/** Flat lookup used by data files that store an `imageKey`. Returns undefined when no photo exists. */
const registry: Record<string, string> = {
  "hospital/building": hospitalImages.hero.src,
  ...Object.fromEntries(Object.entries(doctorImages).map(([k, v]) => [`doctors/${k}`, v.src])),
  ...Object.fromEntries(Object.entries(departmentImages).map(([k, v]) => [`departments/${k}`, v.src])),
  ...Object.fromEntries(Object.entries(facilityImages).map(([k, v]) => [`facilities/${k}`, v.src])),
  ...Object.fromEntries(pregnancyImages.map((v, i) => [`story/0${i + 1}`, v.src])),
  ...Object.fromEntries(Object.entries(blogImages).map(([k, v]) => [`blog/${k}`, v.src])),
};

export const resolveImage = (key: string): string | undefined => registry[key];
