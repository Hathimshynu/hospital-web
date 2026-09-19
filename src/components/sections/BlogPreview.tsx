import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Media } from "@/components/ui/Media";
import { AnimatedCard } from "@/components/ui/AnimatedCard";
import { resolveImage } from "@/lib/assets";
import { blogPosts } from "@/data/blog";
import { formatDate } from "@/lib/utils";
import type { BlogPost } from "@/types";

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <AnimatedCard as="li" className="group h-full overflow-hidden">
      <article className="h-full">
        <Link href={`/blog/${post.slug}`} className="flex h-full flex-col">
          <Media src={resolveImage(post.imageKey)} alt={`Illustration for ${post.title}`} icon="clipboard" zoom className="aspect-[16/10]" sizes="(min-width:1024px) 33vw, 100vw" />
          <div className="flex flex-1 flex-col p-6">
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="rounded-full bg-mint px-3 py-1 font-bold text-brand-700">{post.category}</span>
              <time dateTime={post.publishedAt} className="text-slate-body">{formatDate(post.publishedAt)}</time>
            </div>
            <h2 className="mt-4 text-lg font-bold leading-snug text-navy-950">{post.title}</h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-body">{post.excerpt}</p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-brand-700">Read article <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1.5" aria-hidden="true" /></span>
          </div>
        </Link>
      </article>
    </AnimatedCard>
  );
}

export function BlogGrid({ posts = blogPosts }: { posts?: BlogPost[] }) {
  return <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{posts.map((p) => <BlogCard key={p.slug} post={p} />)}</ul>;
}
