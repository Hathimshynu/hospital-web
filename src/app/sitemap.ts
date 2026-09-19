import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/utils";
import { listedDepartments } from "@/data/departments";
import { doctors } from "@/data/doctors";
import { blogPosts } from "@/data/blog";

const staticRoutes = ["/", "/about", "/departments", "/doctors", "/services", "/facilities", "/appointments", "/contact", "/emergency", "/blog", "/privacy-policy", "/terms"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    ...staticRoutes.map((p) => ({ url: absoluteUrl(p), lastModified: now, changeFrequency: "monthly" as const, priority: p === "/" ? 1 : 0.7 })),
    ...listedDepartments.map((d) => ({ url: absoluteUrl(`/departments/${d.slug}`), lastModified: now, priority: 0.6 })),
    ...doctors.map((d) => ({ url: absoluteUrl(`/doctors/${d.slug}`), lastModified: now, priority: 0.6 })),
    ...blogPosts.map((p) => ({ url: absoluteUrl(`/blog/${p.slug}`), lastModified: new Date(p.publishedAt), priority: 0.5 })),
  ];
}
