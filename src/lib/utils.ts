import { hospital } from "@/data/hospital";

export function cn(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

export const siteUrl = hospital.url;
export const absoluteUrl = (path = "/") => `${siteUrl}${path === "/" ? "" : path}`;

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
