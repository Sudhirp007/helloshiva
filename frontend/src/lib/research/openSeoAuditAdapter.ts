export interface OpenSeoAuditResult {
  score: number;
  checks: {
    category: string;
    passed: boolean;
    title: string;
    detail: string;
    recommendation: string;
  }[];
}

/**
 * OpenSEO On-Page Audit Adapter
 * Replicates the on-page analysis rules of openwarelabs/open-seo without Redis/BullMQ requirements.
 */
export class OpenSeoAuditAdapter {
  name = "OpenSEO Rules Adapter";

  auditContent(title: string, metaDescription: string, markdownContent: string): OpenSeoAuditResult {
    const checks = [];
    let passedCount = 0;

    // 1. Title Check
    const titleLen = title ? title.length : 0;
    const titleOk = titleLen >= 45 && titleLen <= 65;
    if (titleOk) passedCount++;
    checks.push({
      category: "Metadata",
      passed: titleOk,
      title: "Title Length Optimization",
      detail: `Current title is ${titleLen} characters.`,
      recommendation: titleOk
        ? "Optimal title length between 45 and 65 characters."
        : "Keep title between 45–65 characters to prevent desktop/mobile SERP truncation.",
    });

    // 2. Meta Description
    const descLen = metaDescription ? metaDescription.length : 0;
    const descOk = descLen >= 120 && descLen <= 165;
    if (descOk) passedCount++;
    checks.push({
      category: "Metadata",
      passed: descOk,
      title: "Meta Description Length",
      detail: `Current meta description is ${descLen} characters.`,
      recommendation: descOk
        ? "Optimal meta description length."
        : "Aim for 120–165 characters including primary search keywords.",
    });

    // 3. Heading Structure
    const hasH2 = /^##\s+/m.test(markdownContent);
    const hasH3 = /^###\s+/m.test(markdownContent);
    const headingsOk = hasH2 && hasH3;
    if (headingsOk) passedCount++;
    checks.push({
      category: "Content Structure",
      passed: headingsOk,
      title: "Subheading Hierarchy (H2 & H3)",
      detail: `H2 subheadings: ${hasH2 ? "Present" : "Missing"} | H3 subheadings: ${hasH3 ? "Present" : "Missing"}`,
      recommendation: headingsOk
        ? "Healthy semantic heading hierarchy."
        : "Add structured H2 section headers and H3 sub-points to improve crawler readability.",
    });

    // 4. Content Depth & Length
    const words = markdownContent.trim().split(/\s+/).filter(Boolean).length;
    const wordCountOk = words >= 800;
    if (wordCountOk) passedCount++;
    checks.push({
      category: "Content Depth",
      passed: wordCountOk,
      title: "Comprehensive Word Count",
      detail: `Article contains ${words} words.`,
      recommendation: wordCountOk
        ? "Comprehensive depth meeting topical coverage expectations."
        : "Expand content to at least 800–1,200 words to thoroughly answer user intent.",
    });

    // 5. Frequently Asked Questions (FAQ) Section
    const hasFaq = /faq|frequently asked/i.test(markdownContent);
    if (hasFaq) passedCount++;
    checks.push({
      category: "Search Features",
      passed: hasFaq,
      title: "FAQ Section with Schema Readiness",
      detail: hasFaq ? "FAQ section present." : "No explicit FAQ section detected.",
      recommendation: hasFaq
        ? "FAQ section detected. Suitable for FAQPage schema markup."
        : "Add a 3-question FAQ section at the end of the article to capture PAA (People Also Ask) search snippets.",
    });

    // 6. Internal Linking
    const hasInternalLinks = /\[.*?\]\(\/(services|tools|contact|portfolio).*?\)/.test(markdownContent);
    if (hasInternalLinks) passedCount++;
    checks.push({
      category: "Internal Linking",
      passed: hasInternalLinks,
      title: "Contextual Internal Links to HelloShiva Services",
      detail: hasInternalLinks ? "Internal links to HelloShiva detected." : "No HelloShiva internal links found.",
      recommendation: hasInternalLinks
        ? "Internal link equity properly routed."
        : "Include at least 2 contextual links pointing to HelloShiva services or companion free tools.",
    });

    const score = Math.round((passedCount / checks.length) * 100);

    return { score, checks };
  }
}

export const defaultOpenSeoAuditAdapter = new OpenSeoAuditAdapter();
