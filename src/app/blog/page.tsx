import { PageHero } from "@/components/layout/PageHero";
import { BlogGrid } from "@/components/sections/BlogPreview";
import { pageMeta } from "@/lib/seo";
import { hospital } from "@/data/hospital";

export const metadata = pageMeta(
  "Health Blog - Tips, Awareness & Preventive Care",
  `Practical health articles from ${hospital.name}, Eraniel: fever, diabetes care, pregnancy check-ups and more.`,
  "/blog",
);

export default function BlogPage() {
  return (
    <>
      <PageHero eyebrow="Health Blog" title="Knowledge for healthier living." text="General health information from our team. It does not replace advice from your doctor." crumbs={[{ label: "Blog" }]} path="/blog" />
      <section className="bg-white py-14 md:py-20"><div className="container-x"><BlogGrid /></div></section>
    </>
  );
}
