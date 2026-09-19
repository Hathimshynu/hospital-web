/**
 * Domain types. They mirror the shapes a Laravel API would return, so the
 * `data/` modules can be swapped for API calls without touching components.
 */

export type IconName =
  | "heart" | "brain" | "bone" | "baby" | "stethoscope" | "scissors" | "sparkles"
  | "ear" | "eye" | "scan" | "siren" | "ambulance" | "pill" | "flask" | "shield"
  | "activity" | "bed" | "microscope" | "droplet" | "users" | "calendar" | "monitor"
  | "clipboard" | "flower" | "building" | "smile" | "car";

export interface PhoneNumber {
  /** Text shown to visitors, e.g. "04651 - 260666" */
  display: string;
  /** Dialable international form for tel: links, e.g. "+914651260666" */
  tel: string;
}

export interface Hospital {
  name: string;
  tagline: string;
  description: string;
  url: string;
  address: {
    lines: string[];
    locality: string;
    district: string;
    region: string;
    postalCode: string;
    country: string;
    countryName: string;
  };
  contact: {
    phone: PhoneNumber;
    mobile: PhoneNumber;
    whatsapp: { display: string; /** digits only, country code first */ e164: string };
    /** null until a dedicated emergency line is confirmed */
    emergency: PhoneNumber | null;
    /** null until a public email is confirmed */
    email: string | null;
  };
  /** null until opening hours are confirmed */
  hours: { label: string; value: string }[] | null;
  /** null until exact coordinates are confirmed */
  coordinates: { lat: number; lng: number } | null;
  social: { label: string; href: string }[];
  mapQuery: string;
  seo: { title: string; description: string; keywords: string[] };
}

export interface Department {
  slug: string;
  name: string;
  icon: IconName;
  summary: string;
  overview: string;
  careAreas: string[];
  /** Only listed departments are shown, linked and indexed. */
  listed: boolean;
  image?: string;
}

export interface Doctor {
  slug: string;
  name: string;
  qualification: string;
  title: string;
  specialization: string;
  departmentSlug: string;
  areasOfCare: string[];
  bio: string;
  /** Image key resolved from /public/images (see public/images/README.md) */
  imageKey: string;
  featured?: boolean;
}

export interface Service {
  slug: string;
  name: string;
  icon: IconName;
  summary: string;
  detail: string;
}

export interface Facility {
  slug: string;
  name: string;
  icon: IconName;
  summary: string;
  imageKey: string;
}

export interface StoryStage {
  id: string;
  n: string;
  title: string;
  kicker: string;
  text: string;
  icon: IconName;
  imageKey: string;
  alt: string;
}

export interface BlogSection { heading: string; paragraphs: string[] }

export interface BlogPost {
  slug: string;
  title: string;
  category: "Health Tips" | "Medical Awareness" | "Preventive Care" | "Expert Advice";
  excerpt: string;
  description: string;
  sections: BlogSection[];
  publishedAt: string; // ISO date
  readMinutes: number;
  imageKey: string;
}
