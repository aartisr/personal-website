import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  estimateReadingTimeMinutes,
  getAllBlogSlugs,
  getBlogPost,
  getRelatedBlogPosts,
} from "@/lib/blog";
import { ShareButtons } from "@/components/blog/share-buttons";
import { absoluteUrl } from "@/lib/site";

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
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url: absoluteUrl(`/blog/${post.slug}`),
      publishedTime: post.date,
      images: post.coverImage
        ? [
            {
              url: post.coverImage,
              alt: post.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const readingTimeMinutes = estimateReadingTimeMinutes(post);
  const relatedPosts = getRelatedBlogPosts(post.slug, 2);
  const postUrl = absoluteUrl(`/blog/${post.slug}`);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: {
      "@type": "Person",
      name: post.author ?? "Aarti Sri Ravikumar",
    },
    mainEntityOfPage: postUrl,
    image: post.coverImage,
  };

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <article className="max-w-3xl mx-auto px-4 py-12">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <div className="mb-8">
          <Link
            href="/blog"
            className="text-sm font-medium text-[color:var(--primary)]"
          >
            ← Back to Blog
          </Link>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-[color:var(--foreground)]">
            {post.title}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-[color:var(--muted-foreground)]">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span>•</span>
            <span>{post.author ?? "Aarti Sri Ravikumar"}</span>
            <span>•</span>
            <span>{readingTimeMinutes} min read</span>
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs rounded-full px-3 py-1 border border-[color:var(--border)] text-[color:var(--muted-foreground)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-5">
            <ShareButtons url={postUrl} title={post.title} />
          </div>
        </div>

        {post.coverImage && (
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full aspect-video object-cover rounded-xl mb-8"
          />
        )}

        <div className="space-y-5 text-base leading-8 text-[color:var(--foreground)]">
          {post.body.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        {relatedPosts.length > 0 && (
          <section className="mt-12 border-t pt-8 border-[color:var(--border)]">
            <h2 className="text-xl font-semibold text-[color:var(--foreground)]">
              Related Reading
            </h2>
            <div className="mt-4 grid gap-4">
              {relatedPosts.map((relatedPost) => (
                <article
                  key={relatedPost.slug}
                  className="rounded-lg border p-4 border-[color:var(--border)] bg-[var(--card)]"
                >
                  <h3 className="font-semibold text-[color:var(--foreground)]">
                    <Link href={`/blog/${relatedPost.slug}`} className="hover:underline">
                      {relatedPost.title}
                    </Link>
                  </h3>
                  <p className="mt-1 text-sm text-[color:var(--muted-foreground)]">
                    {relatedPost.excerpt}
                  </p>
                </article>
              ))}
            </div>
          </section>
        )}
      </article>
    </main>
  );
}
