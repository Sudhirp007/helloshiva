export interface OpenSeoCheck {
  category: string;
  passed: boolean;
  title: string;
  currentMetric: string;
  targetMetric: string;
  detail: string;
  recommendation: string;
  type: "length" | "density" | "structure" | "links" | "schema";
}

export interface OpenSeoAuditResult {
  score: number;
  wordCount: number;
  readingTimeMinutes: number;
  checks: OpenSeoCheck[];
  metrics: {
    titleLength: number;
    metaLength: number;
    wordCount: number;
    h2Count: number;
    h3Count: number;
    keywordOccurrences: number;
    keywordDensityPercent: number;
    internalLinkCount: number;
    faqQuestionsCount: number;
  };
}

/**
 * OpenSEO On-Page Audit Adapter
 * Enhanced with rich quantitative measurements, keyword density analysis,
 * heading breakdown, and contextual internal linking heuristics.
 */
export class OpenSeoAuditAdapter {
  name = "OpenSEO Quantitative Heuristics Adapter";

  auditContent(
    title: string,
    metaDescription: string,
    markdownContent: string,
    primaryKeyword?: string
  ): OpenSeoAuditResult {
    const checks: OpenSeoCheck[] = [];
    let passedCount = 0;

    const content = markdownContent || "";

    // 1. Title Check
    const titleLen = (title || "").trim().length;
    const titleOk = titleLen >= 45 && titleLen <= 65;
    if (titleOk) passedCount++;
    checks.push({
      category: "Metadata",
      passed: titleOk,
      type: "length",
      title: "Title Length Optimization",
      currentMetric: `${titleLen} chars`,
      targetMetric: "45–65 chars",
      detail:
        titleLen === 0
          ? "No title provided."
          : titleLen < 45
          ? `Current title is ${titleLen} characters (too short for high SERP CTR).`
          : titleLen > 65
          ? `Current title is ${titleLen} characters (exceeds desktop/mobile display cutoff).`
          : `Current title is ${titleLen} characters — within the ideal Google display boundary.`,
      recommendation: titleOk
        ? "Optimal title length between 45 and 65 characters."
        : "Refine title to 45–65 characters so it renders completely on desktop and mobile SERPs without truncation.",
    });

    // 2. Meta Description Check
    const descLen = (metaDescription || "").trim().length;
    const descOk = descLen >= 120 && descLen <= 165;
    if (descOk) passedCount++;
    checks.push({
      category: "Metadata",
      passed: descOk,
      type: "length",
      title: "Meta Description Length",
      currentMetric: `${descLen} chars`,
      targetMetric: "120–165 chars",
      detail:
        descLen === 0
          ? "No meta description provided."
          : descLen < 120
          ? `Current meta description is ${descLen} characters (misses opportunity to summarize intent).`
          : descLen > 165
          ? `Current meta description is ${descLen} characters (will be truncated in Google search snippets).`
          : `Current meta description is ${descLen} characters — fully visible on search result snippets.`,
      recommendation: descOk
        ? "Optimal meta description length."
        : "Aim for 120–165 characters including primary search keywords and a compelling value hook.",
    });

    // 3. Word Count & Content Depth
    const wordsArray = content.trim().split(/\s+/).filter(Boolean);
    const wordCount = wordsArray.length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 225));
    const wordCountOk = wordCount >= 800;
    if (wordCountOk) passedCount++;
    checks.push({
      category: "Content Depth",
      passed: wordCountOk,
      type: "length",
      title: "Comprehensive Word Count",
      currentMetric: `${wordCount.toLocaleString()} words`,
      targetMetric: "≥ 800 words",
      detail:
        wordCount >= 800
          ? `Article contains ${wordCount.toLocaleString()} words (~${readingTime} min read), demonstrating thorough topical depth.`
          : `Article has only ${wordCount} words. Commercial ranking benchmarks generally require 800–1,500 words to answer user intent.`,
      recommendation: wordCountOk
        ? "Comprehensive depth meeting topical coverage expectations."
        : "Expand content to at least 800–1,200 words with concrete frameworks, examples, and implementation tips.",
    });

    // 4. Heading Structure (H2 & H3)
    const h2Matches = content.match(/^##\s+.+$/gm) || [];
    const h3Matches = content.match(/^###\s+.+$/gm) || [];
    const h2Count = h2Matches.length;
    const h3Count = h3Matches.length;
    const headingsOk = h2Count >= 2 && h3Count >= 1;
    if (headingsOk) passedCount++;
    checks.push({
      category: "Content Structure",
      passed: headingsOk,
      type: "structure",
      title: "Subheading Hierarchy (H2 & H3)",
      currentMetric: `${h2Count} H2s, ${h3Count} H3s`,
      targetMetric: "≥ 2 H2s, ≥ 1 H3",
      detail: `Found ${h2Count} main section headers (H2) and ${h3Count} subsection headers (H3).`,
      recommendation: headingsOk
        ? "Healthy semantic heading hierarchy enabling efficient crawler parsing."
        : "Structure the article with at least 2 primary H2 sections and 1 supporting H3 subsection to improve readability.",
    });

    // 5. Focus Keyword Density
    const kw = (primaryKeyword || "").trim().toLowerCase();
    let kwOccurrences = 0;
    let kwDensity = 0;
    if (kw && wordCount > 0) {
      const cleanText = content.toLowerCase();
      // Match whole phrase or word
      const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`\\b${escaped}\\b`, "gi");
      const matches = cleanText.match(regex);
      kwOccurrences = matches ? matches.length : 0;
      const kwWords = kw.split(/\s+/).filter(Boolean).length;
      kwDensity = Number((((kwOccurrences * kwWords) / wordCount) * 100).toFixed(1));
    }
    const densityOk = kw ? kwDensity >= 0.8 && kwDensity <= 2.8 : true;
    if (densityOk && kw) passedCount++;
    checks.push({
      category: "Keyword Relevance",
      passed: kw ? densityOk : true,
      type: "density",
      title: "Focus Keyword Density",
      currentMetric: kw
        ? `${kwOccurrences} times (${kwDensity}%)`
        : "No keyword specified",
      targetMetric: "1.0%–2.5%",
      detail: kw
        ? kwOccurrences === 0
          ? `Primary keyword "${kw}" does not appear in the body text.`
          : kwDensity < 0.8
          ? `Primary keyword "${kw}" appears ${kwOccurrences} times (${kwDensity}%). Slightly low for topical relevance.`
          : kwDensity > 2.8
          ? `Primary keyword "${kw}" appears ${kwOccurrences} times (${kwDensity}%). Risk of keyword stuffing penalty.`
          : `Primary keyword "${kw}" appears ${kwOccurrences} times (${kwDensity}%) — natural, balanced frequency.`
        : "Set a primary focus keyword to audit keyword density.",
      recommendation:
        !kw || densityOk
          ? "Natural keyword distribution throughout headings and paragraph copy."
          : "Maintain keyword density between 1.0% and 2.5% across headings, intro, body, and conclusion.",
    });

    // 6. Frequently Asked Questions (FAQ) Section
    const hasFaqHeading = /##\s*frequently asked questions|##\s*faq/i.test(content);
    // Count questions (### lines after FAQ header)
    let faqQuestionsCount = 0;
    if (hasFaqHeading) {
      const faqPart = content.split(/##\s*frequently asked questions|##\s*faq/i)[1] || "";
      const qMatches = faqPart.match(/^###\s+.+\?/gm) || faqPart.match(/^###\s+.+/gm);
      faqQuestionsCount = qMatches ? qMatches.length : 0;
    }
    const faqOk = hasFaqHeading && faqQuestionsCount >= 1;
    if (faqOk) passedCount++;
    checks.push({
      category: "Search Features",
      passed: faqOk,
      type: "schema",
      title: "FAQ Section & Schema Readiness",
      currentMetric: `${faqQuestionsCount} FAQ questions`,
      targetMetric: "≥ 2 questions",
      detail: hasFaqHeading
        ? `FAQ section detected with ${faqQuestionsCount} question/answer pairs.`
        : "No dedicated FAQ section found in the article.",
      recommendation: faqOk
        ? "FAQ section ready for Google FAQPage schema injection to claim rich SERP snippets."
        : "Add an '## Frequently Asked Questions' section with 2–3 questions to capture Google 'People Also Ask' (PAA) real estate.",
    });

    // 7. Contextual Internal Links to HelloShiva
    const internalLinksMatch = content.match(/\[.*?\]\(\/(services|tools|contact|portfolio).*?\)/g) || [];
    const internalLinkCount = internalLinksMatch.length;
    const internalLinksOk = internalLinkCount >= 2;
    if (internalLinksOk) passedCount++;
    checks.push({
      category: "Internal Linking",
      passed: internalLinksOk,
      type: "links",
      title: "Contextual Links to Agency Services & Tools",
      currentMetric: `${internalLinkCount} links`,
      targetMetric: "≥ 2 internal links",
      detail:
        internalLinkCount > 0
          ? `Found ${internalLinkCount} contextual links pointing to HelloShiva services or tools.`
          : "No internal links to HelloShiva services, tools, or contact pages detected.",
      recommendation: internalLinksOk
        ? "Internal page equity and commercial conversion funnel properly connected."
        : "Include at least 2 contextual links pointing to relevant HelloShiva services (/services/technical-seo, etc.) or free tools.",
    });

    const score = Math.round((passedCount / checks.length) * 100);

    return {
      score,
      wordCount,
      readingTimeMinutes: readingTime,
      checks,
      metrics: {
        titleLength: titleLen,
        metaLength: descLen,
        wordCount,
        h2Count,
        h3Count,
        keywordOccurrences: kwOccurrences,
        keywordDensityPercent: kwDensity,
        internalLinkCount,
        faqQuestionsCount,
      },
    };
  }
}

export const defaultOpenSeoAuditAdapter = new OpenSeoAuditAdapter();
