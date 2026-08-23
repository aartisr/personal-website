import { getAllBlogPosts } from "@/lib/blog";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

export async function GET() {
  const posts = getAllBlogPosts();
  const feedUrl = absoluteUrl("/blog/rss.xml");

  const rssItems = posts
    .map((post) => {
      const postUrl = absoluteUrl(`/blog/${post.slug}`);
      return `
        <item>
          <title><![CDATA[${post.title}]]></title>
          <link>${postUrl}</link>
          <guid>${postUrl}</guid>
          <pubDate>${new Date(post.date).toUTCString()}</pubDate>
          <description><![CDATA[${post.excerpt}]]></description>
        </item>
      `;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Aarti Sri Ravikumar Blog</title>
    <link>${absoluteUrl("/blog")}</link>
    <description>Academic and engineering notes from Aarti Sri Ravikumar.</description>
    <language>en-us</language>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
    ${rssItems}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
