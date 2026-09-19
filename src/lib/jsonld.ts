import { hospital } from "@/data/hospital";
import { absoluteUrl } from "@/lib/utils";
import { listedDepartments } from "@/data/departments";
import { services } from "@/data/services";

/** Only verified facts are emitted - no ratings, reviews or unconfirmed claims. */
export function hospitalJsonLd() {
  const { address, contact } = hospital;
  return {
    "@context": "https://schema.org",
    "@type": ["Hospital", "MedicalOrganization"],
    "@id": absoluteUrl("/") + "#hospital",
    name: hospital.name,
    url: absoluteUrl("/"),
    description: hospital.seo.description,
    slogan: hospital.tagline,
    telephone: contact.phone.tel,
    address: {
      "@type": "PostalAddress",
      streetAddress: address.lines.join(", "),
      addressLocality: address.locality,
      addressRegion: address.region,
      postalCode: address.postalCode,
      addressCountry: address.country,
    },
    ...(hospital.coordinates ? { geo: { "@type": "GeoCoordinates", latitude: hospital.coordinates.lat, longitude: hospital.coordinates.lng } } : {}),
    ...(contact.email ? { email: contact.email } : {}),
    ...(hospital.social.length ? { sameAs: hospital.social.map((s) => s.href) } : {}),
    contactPoint: [
      { "@type": "ContactPoint", telephone: contact.phone.tel, contactType: "customer service", areaServed: "IN" },
      { "@type": "ContactPoint", telephone: contact.mobile.tel, contactType: "customer service", areaServed: "IN" },
    ],
    medicalSpecialty: listedDepartments.map((d) => d.name),
    availableService: services.map((s) => ({ "@type": "MedicalProcedure", name: s.name })),
  };
}

export function breadcrumbJsonLd(items: { label: string; href?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.label,
      ...(it.href ? { item: absoluteUrl(it.href) } : {}),
    })),
  };
}

export const jsonLdScript = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c");
