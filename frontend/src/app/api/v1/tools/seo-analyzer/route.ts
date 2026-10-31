import { NextRequest, NextResponse } from "next/server";
import { safeFetch } from "@/lib/ssrf";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json({ success: false, message: "Valid URL is required." }, { status: 400 });
    }

    const startTime = Date.now();
    const fetchResult = await safeFetch(url, { timeoutMs: 6000 });
    const responseTimeMs = Date.now() - startTime;
    const html = fetchResult.bodyText;

    // 1. Title Check
    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : null;

    // 2. Meta Description Check
    const descMatch =
      html.match(/<meta\s+name=["']description["']\s+content=["']([\s\S]*?)["']/i) ||
      html.match(/<meta\s+content=["']([\s\S]*?)["']\s+name=["']description["']/i);
    const metaDescription = descMatch ? descMatch[1].trim() : null;

    // 3. Canonical Tag
    const canonicalMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']*)["']/i);
    const canonical = canonicalMatch ? canonicalMatch[1].trim() : null;

    // 4. Robots Directives
    const robotsMatch = html.match(/<meta\s+name=["']robots["']\s+content=["']([\s\S]*?)["']/i);
    const robotsDirective = robotsMatch ? robotsMatch[1].trim() : "index, follow (default)";

    // 5. Headings count
    const h1Matches = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || [];
    const h2Matches = html.match(/<h2[^>]*>([\s\S]*?)<\/h2>/gi) || [];

    // 6. Viewport Tag
    const hasViewport = /<meta\s+name=["']viewport["']/i.test(html);

    // 7. Open Graph
    const hasOgTitle = /<meta\s+property=["']og:title["']/i.test(html);
    const hasOgImage = /<meta\s+property=["']og:image["']/i.test(html);

    // Build structured checks
    const checks = [
      {
        name: "Page Title",
        value: title || "Missing",
        status: !title ? "FAIL" : title.length >= 40 && title.length <= 65 ? "PASS" : "WARN",
        recommendation: !title
          ? "Add a unique title tag to summarize page content."
          : title.length > 65
          ? `Title is ${title.length} characters (may be truncated in search results; keep between 50-60).`
          : title.length < 40
          ? `Title is relatively short (${title.length} characters). Consider including primary search keywords.`
          : "Optimal title length for desktop and mobile SERPs.",
      },
      {
        name: "Meta Description",
        value: metaDescription || "Missing",
        status: !metaDescription ? "FAIL" : metaDescription.length >= 120 && metaDescription.length <= 165 ? "PASS" : "WARN",
        recommendation: !metaDescription
          ? "Add a meta description to entice search click-throughs."
          : metaDescription.length > 165
          ? `Description is ${metaDescription.length} characters (may truncate; aim for 150-160).`
          : metaDescription.length < 120
          ? `Description is short (${metaDescription.length} characters). Expand to highlight key benefits.`
          : "Optimal meta description length.",
      },
      {
        name: "Canonical Tag",
        value: canonical || "None declared",
        status: canonical ? "PASS" : "WARN",
        recommendation: canonical
          ? "Self-referencing canonical tag is properly configured."
          : "Specify a canonical tag to prevent duplicate content indexation.",
      },
      {
        name: "H1 Heading Hierarchy",
        value: `${h1Matches.length} H1 tag(s) found`,
        status: h1Matches.length === 1 ? "PASS" : h1Matches.length === 0 ? "FAIL" : "WARN",
        recommendation:
          h1Matches.length === 1
            ? "Exactly one H1 tag detected."
            : h1Matches.length === 0
            ? "Page lacks an H1 tag. Add one primary H1 matching user search intent."
            : `Multiple H1 tags (${h1Matches.length}) found. Consolidate into a single H1 and use H2s for subheadings.`,
      },
      {
        name: "Mobile Viewport Meta",
        value: hasViewport ? "Configured" : "Missing",
        status: hasViewport ? "PASS" : "FAIL",
        recommendation: hasViewport
          ? "Responsive viewport tag declared."
          : "Missing viewport meta tag; mobile responsiveness will fail.",
      },
      {
        name: "Robots Indexing Directive",
        value: robotsDirective,
        status: robotsDirective.toLowerCase().includes("noindex") ? "WARN" : "PASS",
        recommendation: robotsDirective.toLowerCase().includes("noindex")
          ? "Warning: Page specifies 'noindex'. Search engines will not index this page."
          : "Page allows search engine indexing.",
      },
      {
        name: "Open Graph Tags",
        value: `og:title (${hasOgTitle ? "✓" : "✗"}), og:image (${hasOgImage ? "✓" : "✗"})`,
        status: hasOgTitle && hasOgImage ? "PASS" : "WARN",
        recommendation:
          hasOgTitle && hasOgImage
            ? "Social sharing cards configured."
            : "Add complete Open Graph tags to ensure attractive snippets on social networks.",
      },
    ];

    return NextResponse.json({
      success: true,
      url: fetchResult.finalUrl,
      statusCode: fetchResult.statusCode,
      responseTimeMs,
      checks,
      h2Count: h2Matches.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to analyze webpage." },
      { status: 400 }
    );
  }
}
