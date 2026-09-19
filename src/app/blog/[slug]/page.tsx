import { notFound } from "next/navigation";
import { PageHero } from "@/components/layout/PageHero";
import { BlogGrid } from "@/components/sections/BlogPreview";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { blogPosts, getPost } from "@/data/blog";
import { hospital } from "@/data/hospital";
import { pageMeta } from "@/lib/seo";
import { jsonLdScript } from "@/lib/jsonld";
import { absoluteUrl, formatDate } from "@/lib/utils";
import { resolveImage } from "@/lib/assets";

export const dynamicParams = false;
export const generateStaticParams = () => blogPosts.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const p = getPost((await params).slug);
  return p ? pageMeta(p.title, p.description, `/blog/${p.slug}`, { type: "article", publishedTime: p.publishedAt }) : {};
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = getPost((await params).slug);
  if (!p) notFound();
  const more = blogPosts.filter((x) => x.slug !== p.slug).slice(0, 3);
  const path = `/blog/${p.slug}`;
  const img = resolveImage(p.imageKey);

  const ld = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: p.title,
    description: p.description,
    datePublished: p.publishedAt,
    dateModified: p.publishedAt,
    author: { "@type": "Organization", name: hospital.name },
    publisher: { "@type": "Organization", name: hospital.name, url: absoluteUrl("/") },
    mainEntityOfPage: absoluteUrl(path),
    ...(img ? { image: absoluteUrl(img) } : {}),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(ld) }} />
      <PageHero eyebrow={p.category} title={p.title} crumbs={[{ label: "Blog", href: "/blog" }, { label: p.title }]} path={path} />
      <article className="bg-white py-12 md:py-20">
        <div className="container-x max-w-3xl">
          <p className="mb-8 flex flex-wrap items-center gap-x-3 text-sm text-slate-body">
            <time dateTime={p.publishedAt}>{formatDate(p.publishedAt)}</time><span aria-hidden="true">·</span><span>{p.readMinutes} min read</span><span aria-hidden="true">·</span><span>By {hospital.name}</span>
          </p>
          <p className="text-xl leading-relaxed text-navy-950">{p.excerpt}</p>
          {p.sections.map((s) => (
            <section key={s.heading} className="mt-10">
              <h2 className="text-2xl font-semibold tracking-tight text-navy-950">{s.heading}</h2>
              {s.paragraphs.map((t, i) => <p key={i} className="mt-4 text-lg leading-relaxed text-slate-body">{t}</p>)}
            </section>
          ))}
          <aside className="mt-12 rounded-3xl bg-mint p-6">
            <p className="text-sm text-navy-950">This article is general health information and is not a substitute for advice from your doctor. If you are unwell or worried, please consult a doctor.</p>
            <div className="mt-4"><WhatsAppButton>Book Appointment on WhatsApp</WhatsAppButton></div>
          </aside>
        </div>
      </article>
      <section className="bg-mist py-14 md:py-20" aria-labelledby="more">
        <div className="container-x"><h2 id="more" className="mb-8 text-2xl font-semibold text-navy-950">More articles</h2><BlogGrid posts={more} /></div>
      </section>
    </>
  );
}
