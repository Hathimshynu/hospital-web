import type { Metadata } from "next";
import { hospital } from "@/data/hospital";
import { absoluteUrl } from "@/lib/utils";

/**
 * Unique, complete metadata for a page: title, description, canonical,
 * Open Graph and Twitter. `title` is used with the site template
 * ("%s | Hospital"); pass `absolute` for a fully custom title.
 */
export function pageMeta(
  title: string,
  description: string,
  path: string,
  opts: { absolute?: boolean; type?: "website" | "article"; publishedTime?: string } = {},
): Metadata {
  const fullTitle = opts.absolute ? title : `${title} | ${hospital.name}`;
  return {
    title: opts.absolute ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle, description, url: absoluteUrl(path), siteName: hospital.name,
      locale: "en_IN", type: opts.type ?? "website",
      ...(opts.publishedTime ? { publishedTime: opts.publishedTime } : {}),
    },
    twitter: { card: "summary_large_image", title: fullTitle, description },
  };
}
