import { NextRequest, NextResponse } from "next/server";
import { safeFetch } from "@/lib/ssrf";

export async function POST(req: NextRequest) {
  try {
    const { url, xmlContent } = await req.json();

    let xml = xmlContent || "";

    if (!xml && url) {
      const fetchResult = await safeFetch(url, { timeoutMs: 6000 });
      xml = fetchResult.bodyText;
    }

    if (!xml || typeof xml !== "string" || !xml.trim()) {
      return NextResponse.json({ success: false, message: "Sitemap URL or XML content is required." }, { status: 400 });
    }

    const warnings: string[] = [];
    const isSitemapIndex = /<sitemapindex/i.test(xml);
    const isUrlset = /<urlset/i.test(xml);

    if (!isSitemapIndex && !isUrlset) {
      return NextResponse.json({
        success: false,
        message: "Invalid XML format: Missing standard <urlset> or <sitemapindex> root namespace.",
      }, { status: 400 });
    }

    // Extract entries
    const locMatches = Array.from(xml.matchAll(/<loc>([\s\S]*?)<\/loc>/gi)).map((m) => m[1].trim());
    const totalEntries = locMatches.length;

    if (totalEntries === 0) {
      warnings.push("No <loc> URLs discovered inside the sitemap.");
    } else if (totalEntries > 50000) {
      warnings.push(`Sitemap contains ${totalEntries} URLs, exceeding Google's maximum limit of 50,000 URLs per file.`);
    }

    // Check for HTTP instead of HTTPS
    const insecureUrls = locMatches.filter((u) => u.startsWith("http://"));
    if (insecureUrls.length > 0) {
      warnings.push(`${insecureUrls.length} URL(s) use insecure 'http://' instead of 'https://'.`);
    }

    return NextResponse.json({
      success: true,
      format: isSitemapIndex ? "Sitemap Index (Collection)" : "Standard URL Sitemap",
      totalEntries,
      sampleUrls: locMatches.slice(0, 10),
      warnings,
      isValid: warnings.length === 0,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to parse sitemap XML." },
      { status: 400 }
    );
  }
}
