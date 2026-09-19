import type { Hospital } from "@/types";

/**
 * SINGLE SOURCE OF TRUTH for hospital identity and contact details.
 *
 * To rebrand: change `name` / `tagline` here - every component, page title,
 * metadata block and JSON-LD reads from this object.
 *
 * Optional values (`emergency`, `email`, `hours`, `coordinates`, `social`)
 * are hidden automatically while they are null / empty. Fill them in once the
 * hospital confirms them - nothing else needs to change.
 */
export const hospital: Hospital = {
  name: "Hospital",
  tagline: "Multispeciality Care",
  description:
    "Advanced multispeciality healthcare with modern facilities and a human-centered approach for you and your family.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  address: {
    lines: ["M.L. Road (Near Mosque)", "Eraniel"],
    locality: "Eraniel",
    district: "Kanyakumari District",
    region: "Tamil Nadu",
    postalCode: "629301",
    country: "IN",
    countryName: "India",
  },
  contact: {
    phone: { display: "04651 - 260666", tel: "+914651260666" },
    mobile: { display: "+91 9597610074", tel: "+919597610074" },
    whatsapp: { display: "+91 95976 10074", e164: "919597610074" },
    emergency: null,
    email: null,
  },
  hours: null,
  coordinates: null,
  social: [],
  mapQuery: "M.L. Road, Eraniel, Kanyakumari, Tamil Nadu 629301",
  seo: {
    title: "Hospital | Multispeciality Healthcare in Eraniel, Kanyakumari",
    description:
      "Access trusted multispeciality healthcare, experienced doctors, diagnostic services and patient-focused care in Eraniel, Kanyakumari.",
    keywords: [
      "hospital in Eraniel",
      "multispeciality hospital Kanyakumari",
      "general physician Eraniel",
      "ultrasound scanning Kanyakumari",
      "maternity care Kanyakumari",
    ],
  },
};

export const nav = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Departments", href: "/departments" },
  { label: "Doctors", href: "/doctors" },
  { label: "Services", href: "/services" },
  { label: "Facilities", href: "/facilities" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
] as const;

/** The number urgent-help buttons dial: the dedicated line if set, else the main line. */
export const urgentPhone = () => hospital.contact.emergency ?? hospital.contact.phone;

export const telHref = (p: { tel: string }) => `tel:${p.tel}`;

export const fullAddress = () => {
  const a = hospital.address;
  return `${a.lines.join(", ")}, ${a.district} - ${a.postalCode.slice(0, 3)} ${a.postalCode.slice(3)}, ${a.region}, ${a.countryName}`;
};

export const mapEmbedUrl = () =>
  `https://www.google.com/maps?q=${encodeURIComponent(hospital.mapQuery)}&output=embed`;

export const directionsUrl = () =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(hospital.mapQuery)}`;
