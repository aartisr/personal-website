import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllBlogSlugs, getBlogPost } from "@/lib/blog";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export async function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return {
      title: "Post Not Found | Aarti Sri Ravikumar",
    };
  }

  return {
    title: `${post.title} | Aarti Sri Ravikumar`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen" style={{ background: "var(--background)" }}>
      <article className="max-w-3xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link
            href="/blog"
            className="text-sm font-medium"
            style={{ color: "var(--primary)" }}
          >
            ← Back to Blog
          </Link>

          <h1
            className="mt-4 text-4xl font-bold tracking-tight"
            style={{ color: "var(--foreground)" }}
          >
            {post.title}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm" style={{ color: "var(--muted-foreground)" }}>
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span>•</span>
            <span>{post.author ?? "Aarti Sri Ravikumar"}</span>
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs rounded-full px-3 py-1 border"
                  style={{
                    borderColor: "var(--border)",
                    color: "var(--muted-foreground)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {post.coverImage && (
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full aspect-video object-cover rounded-xl mb-8"
          />
        )}

        <div className="space-y-5 text-base leading-8" style={{ color: "var(--foreground)" }}>
          {post.body.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </article>
    </main>
  );
}
