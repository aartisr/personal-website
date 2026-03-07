import { notFound } from "next/navigation";
import { getPageData } from "@/lib/get-page-data";
import { resolvePageSlug } from "@/lib/resolve-path";
import { PuckRenderer } from "@/lib/puck-render";

type PageProps = {
  params: Promise<{ puckPath?: string[] }>;
};

export default async function Page({ params }: PageProps) {
  const { puckPath } = await params;
  const slug = resolvePageSlug(puckPath);
  const data = getPageData(slug);

  if (!data) {
    notFound();
  }

  return <PuckRenderer data={data} />;
}
