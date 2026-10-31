import { NextRequest, NextResponse } from "next/server";
import { safeFetch } from "@/lib/ssrf";

export async function POST(req: NextRequest) {
  try {
    const { url, fallback } = await req.json();

    let meta: Record<string, string> = {
      title: fallback?.title || "",
      description: fallback?.description || "",
      image: fallback?.image || "",
      site_name: fallback?.site_name || "",
      url: url || "",
      twitter_card: "summary_large_image",
    };

    if (url) {
      const fetchResult = await safeFetch(url, { timeoutMs: 5000 });
      const html = fetchResult.bodyText;

      const extractMeta = (prop: string) => {
        const match =
          html.match(new RegExp(`<meta\\s+property=["']${prop}["']\\s+content=["']([\\s\\S]*?)["']`, "i")) ||
          html.match(new RegExp(`<meta\\s+content=["']([\\s\\S]*?)["']\\s+property=["']${prop}["']`, "i")) ||
          html.match(new RegExp(`<meta\\s+name=["']${prop}["']\\s+content=["']([\\s\\S]*?)["']`, "i")) ||
          html.match(new RegExp(`<meta\\s+content=["']([\\s\\S]*?)["']\\s+name=["']${prop}["']`, "i"));
        return match ? match[1].trim() : null;
      };

      meta.title = extractMeta("og:title") || extractMeta("twitter:title") || "";
      if (!meta.title) {
        const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
        meta.title = titleMatch ? titleMatch[1].trim() : "";
      }

      meta.description = extractMeta("og:description") || extractMeta("twitter:description") || extractMeta("description") || "";
      meta.image = extractMeta("og:image") || extractMeta("twitter:image") || "";
      meta.site_name = extractMeta("og:site_name") || "";
      meta.twitter_card = extractMeta("twitter:card") || "summary_large_image";
      meta.url = extractMeta("og:url") || fetchResult.finalUrl;
    }

    const missingTags: string[] = [];
    if (!meta.title) missingTags.push("og:title (Required for headline in social feeds)");
    if (!meta.description) missingTags.push("og:description (Provides context below headline)");
    if (!meta.image) missingTags.push("og:image (Critical: Without an image, posts get up to 80% lower CTR)");

    return NextResponse.json({
      success: true,
      meta,
      missingTags,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to extract Open Graph metadata." },
      { status: 400 }
    );
  }
}
