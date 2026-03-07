import { existsSync, readFileSync, readdirSync } from "fs";
import { join } from "path";

const BLOG_DIR = join(process.cwd(), "content", "blog");

type BlogPostFile = {
  title: string;
  excerpt: string;
  date: string;
  author?: string;
  tags?: string[];
  coverImage?: string;
  body: string[];
};

export type BlogPost = BlogPostFile & {
  slug: string;
};

function readPostFile(slug: string): BlogPost | null {
  const filePath = join(BLOG_DIR, `${slug}.json`);

  if (!existsSync(filePath)) {
    return null;
  }

  const raw = readFileSync(filePath, "utf-8");
  const parsed = JSON.parse(raw) as BlogPostFile;

  return {
    slug,
    ...parsed,
  };
}

export function getAllBlogSlugs(): string[] {
  if (!existsSync(BLOG_DIR)) {
    return [];
  }

  return readdirSync(BLOG_DIR)
    .filter((fileName) => fileName.endsWith(".json"))
    .map((fileName) => fileName.replace(/\.json$/, ""));
}

export function getAllBlogPosts(): BlogPost[] {
  return getAllBlogSlugs()
    .map((slug) => readPostFile(slug))
    .filter((post): post is BlogPost => post !== null)
    .sort((first, second) => {
      return (
        new Date(second.date).getTime() -
        new Date(first.date).getTime()
      );
    });
}

export function getBlogPost(slug: string): BlogPost | null {
  return readPostFile(slug);
}
