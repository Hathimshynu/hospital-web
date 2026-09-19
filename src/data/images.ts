/**
 * SINGLE SOURCE OF TRUTH for every photograph on the site.
 * Files live in /public/images/optimized (real WebP, resized) - the untouched
 * originals you supplied stay alongside in /public/images. To swap a picture,
 * drop a new WebP in optimized/ and change the path here; components never
 * contain image paths.
 */
export interface SiteImage { src: string; alt: string }

const p = (path: string, alt: string): SiteImage => ({ src: `/images/optimized/${path}`, alt });

export const hospitalImages = {
  hero: p("hospital/building.webp", "Illustrated view of the hospital building with its glass entrance and ambulance bay"),
  exterior: p("hospital/building.webp", "Illustrated view of the hospital building in Eraniel, Kanyakumari District"),
};

export const doctorImages = {
  "dr-melbin": p("doctors/dr-melbin.webp", "Portrait of Dr. Melbin, Consultant Physician, wearing a white coat and stethoscope"),
};

export const departmentImages = {
  "general-medicine": p("departments/general-medicine.webp", "A physician in scrubs standing in a bright General Medicine consultation room"),
  "obstetrics-and-gynecology": p("departments/obstetrics-gynecology.webp", "A woman doctor talking with a patient in an obstetrics consultation room with an ultrasound machine"),
};

export const facilityImages = {
  "consultation-rooms": p("facilities/consultation-room.webp", "A doctor and patient talking across a desk in a bright consultation room"),
  laboratory: p("facilities/laboratory.webp", "Laboratory sample tubes, analyser and glassware"),
  ultrasound: p("facilities/ultrasound-scanning.webp", "Ultrasound monitor showing a scan, with an ultrasound probe"),
  pharmacy: p("facilities/pharmacy.webp", "Pharmacy counter with medicines and paper dispensing bags"),
};

/** Services reuse the matching facility photographs. */
export const serviceImages = {
  "general-medicine": departmentImages["general-medicine"],
  "blood-checking-and-typing": facilityImages.laboratory,
  "lab-investigations": facilityImages.laboratory,
  "ultrasound-scanning": facilityImages.ultrasound,
  pharmacy: facilityImages.pharmacy,
} as Record<string, SiteImage>;

/** The six-stage mother & child story, in order. */
export const pregnancyImages = [
  p("story/01.webp", "An expectant mother at home on a sofa, comforted by her husband and an older family member"),
  p("story/02.webp", "A pregnant woman supported by her husband as they walk in through a hospital entrance"),
  p("story/03.webp", "A doctor and nurse in scrubs talking with a pregnant woman in a wheelchair and her husband in a hospital corridor"),
  p("story/04.webp", "A mother resting in a hospital bed with her husband beside her as two clinicians talk with her"),
  p("story/05.webp", "A newborn baby sleeping in a clear hospital bassinet with the mother and father holding hands behind"),
  p("story/06.webp", "A father holding his newborn while the mother and grandparents smile in a hospital room"),
];

/** No dedicated photographs supplied yet - sections fall back to designed visuals. */
export const emergencyImages: SiteImage[] = [];
export const galleryImages: SiteImage[] = [];
export const blogImages: Record<string, SiteImage> = {};
