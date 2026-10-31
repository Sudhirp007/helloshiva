import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title = "", metaDescription = "", markdown = "", primaryKeyword = "" } = body;

    const words = markdown.trim().split(/\s+/).filter(Boolean).length;
    const readTimeMinutes = Math.max(1, Math.ceil(words / 225));

    const titleLength = title.trim().length;
    const metaLength = metaDescription.trim().length;

    // Headings
    const h1Matches = markdown.match(/^#\s+[^\n]+/gm) || [];
    const h2Matches = markdown.match(/^##\s+[^\n]+/gm) || [];
    const h3Matches = markdown.match(/^###\s+[^\n]+/gm) || [];

    // Internal & External links
    const markdownLinks = markdown.match(/\[([^\]]+)\]\(([^)]+)\)/g) || [];
    let internalLinksCount = 0;
    let agencyServiceLinksCount = 0;
    let freeToolLinksCount = 0;
    let externalLinksCount = 0;

    markdownLinks.forEach((l: string) => {
      const match = l.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (match) {
        const href = match[2];
        if (href.startsWith("/") || href.includes("helloshiva.com")) {
          internalLinksCount++;
          if (href.includes("/services/")) agencyServiceLinksCount++;
          if (href.includes("/tools/")) freeToolLinksCount++;
        } else if (href.startsWith("http")) {
          externalLinksCount++;
        }
      }
    });

    // Keyword density
    const cleanKw = primaryKeyword.trim().toLowerCase();
    let keywordCount = 0;
    if (cleanKw) {
      const regex = new RegExp(`\\b${cleanKw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi");
      keywordCount = (markdown.match(regex) || []).length;
    }
    const keywordDensity = words > 0 ? Number(((keywordCount / words) * 100).toFixed(2)) : 0;

    // FAQ detection
    const hasFaqSection = /##\s+Frequently Asked Questions/i.test(markdown) || /###\s+.*\?/i.test(markdown);
    const faqCount = (markdown.match(/###\s+.*\?/g) || []).length;

    // Scoring calculation (Max 100)
    let score = 0;
    const checklist: { item: string; current: string; benchmark: string; passed: boolean; tip: string }[] = [];

    // 1. Title Length (15 pts)
    const titlePassed = titleLength >= 45 && titleLength <= 65;
    if (titlePassed) score += 15;
    else if (titleLength >= 30 && titleLength <= 75) score += 10;
    checklist.push({
      item: "Title Length Optimization",
      current: `${titleLength} characters`,
      benchmark: "45 - 65 characters",
      passed: titlePassed,
      tip: titlePassed ? "Optimal title length for desktop and mobile SERPs." : `Adjust title length to 50-60 characters to avoid truncation in Google SERPs.`,
    });

    // 2. Meta Description Length (15 pts)
    const metaPassed = metaLength >= 135 && metaLength <= 165;
    if (metaPassed) score += 15;
    else if (metaLength >= 100 && metaLength <= 180) score += 10;
    checklist.push({
      item: "Meta Description Length",
      current: `${metaLength} characters`,
      benchmark: "135 - 165 characters",
      passed: metaPassed,
      tip: metaPassed ? "Optimal length for Google snippet rendering." : `Expand or shorten description to between 140 and 160 characters for complete display.`,
    });

    // 3. Document Word Count & Depth (20 pts)
    const wordsPassed = words >= 800;
    if (words >= 1200) score += 20;
    else if (words >= 800) score += 15;
    else if (words >= 400) score += 8;
    checklist.push({
      item: "In-Depth Content Volume",
      current: `${words} words (~${readTimeMinutes} min read)`,
      benchmark: "800+ words (1,200+ for pillar guides)",
      passed: wordsPassed,
      tip: wordsPassed ? "Sufficient depth to achieve high search Information Gain." : "Consider expanding technical sections or adding practical code examples.",
    });

    // 4. Heading Structure (15 pts)
    const totalH1Count = (title.trim() ? 1 : 0) + h1Matches.length;
    const headingsPassed = h2Matches.length >= 3;
    if (headingsPassed) score += 15;
    else if (h2Matches.length >= 1) score += 8;
    checklist.push({
      item: "Semantic Heading Hierarchy",
      current: `${totalH1Count} H1, ${h2Matches.length} H2, ${h3Matches.length} H3`,
      benchmark: "At least 3 structured H2 sections",
      passed: headingsPassed,
      tip: headingsPassed ? "Clear logical structure for search spiders and readers." : "Add at least 3 descriptive H2 sections to break up your content.",
    });

    // 5. Agency Service & Free Tool Linking (15 pts)
    const agencyLinksPassed = agencyServiceLinksCount >= 1 && freeToolLinksCount >= 1;
    if (agencyLinksPassed) score += 15;
    else if (internalLinksCount >= 2) score += 10;
    checklist.push({
      item: "The Golden Loop (Service & Tool Links)",
      current: `${agencyServiceLinksCount} Service links, ${freeToolLinksCount} Free Tool links`,
      benchmark: "Min 1 HelloShiva service link + 1 Free tool link",
      passed: agencyLinksPassed,
      tip: agencyLinksPassed ? "Successfully integrates HelloShiva's agency services and free tools." : "Insert a contextual link to a relevant HelloShiva service (/services/*) and free tool (/tools/*).",
    });

    // 6. Keyword Placement & Density (10 pts)
    const kwPassed = keywordDensity >= 0.5 && keywordDensity <= 2.2;
    if (kwPassed) score += 10;
    else if (keywordCount >= 1) score += 5;
    checklist.push({
      item: "Primary Keyword Density",
      current: `${keywordDensity}% (${keywordCount} occurrences)`,
      benchmark: "0.5% - 2.0% density",
      passed: kwPassed,
      tip: kwPassed ? "Natural keyword frequency without stuffing." : cleanKw ? `Ensure "${cleanKw}" appears naturally throughout key headings and body paragraphs.` : "Define a primary keyword to evaluate search density.",
    });

    // 7. Structured FAQ Section (10 pts)
    const faqPassed = hasFaqSection && faqCount >= 2;
    if (faqPassed) score += 10;
    else if (hasFaqSection) score += 5;
    checklist.push({
      item: "Rich FAQ Schema Readiness",
      current: `${faqCount} FAQ items detected`,
      benchmark: "At least 2-3 FAQ questions",
      passed: faqPassed,
      tip: faqPassed ? "Eligible for Google FAQ rich snippet enhancements." : "Add a '## Frequently Asked Questions' section with 2-3 questions for rich SERP carousels.",
    });

    return NextResponse.json({
      success: true,
      score: Math.min(100, score),
      words,
      readTimeMinutes,
      titleLength,
      metaLength,
      checklist,
      links: {
        totalInternal: internalLinksCount,
        serviceLinks: agencyServiceLinksCount,
        toolLinks: freeToolLinksCount,
        externalLinks: externalLinksCount,
      },
      keywordDensity,
      faqCount,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
