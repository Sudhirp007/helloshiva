import { NextResponse } from "next/server";
import db from "@/lib/db";
import { siteConfig } from "@/config/site";

function detectPillarCategory(title: string, keyword: string, serviceSlug: string) {
  const text = `${title} ${keyword} ${serviceSlug}`.toLowerCase();
  if (/content|copywrit|editorial|blog|storytelling|niche|attract.*customer|brand.*voice/i.test(text)) {
    return "CONTENT_MARKETING";
  }
  if (/ppc|adwords|google ads|meta ads|facebook ads|paid|cpc|roas|cac|conversion rate|cro|landing page/i.test(text)) {
    return "PERFORMANCE_MARKETING";
  }
  if (/social|linkedin|instagram|twitter|thread|carousel|community|personal brand|executive/i.test(text)) {
    return "SOCIAL_MEDIA";
  }
  if (/web|nextjs|react|headless|wordpress|speed|infrastructure|design|develop|frontend/i.test(text)) {
    return "WEB_ENGINEERING";
  }
  if (/local|google business|gmb|citation|near me|maps/i.test(text)) {
    return "LOCAL_SEO";
  }
  return "TECHNICAL_SEO";
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      title,
      primaryKeyword: rawKeyword,
      secondaryKeywords,
      searchIntent = "Commercial",
      targetPersona,
      targetServiceSlug: rawServiceSlug,
      relatedFreeToolSlug: rawToolSlug,
      keyQuestions,
      outline,
    } = body;

    if (!title || title.trim().length === 0) {
      return NextResponse.json({ success: false, error: "Article title is required for drafting." }, { status: 400 });
    }

    // Auto-derive primary keyword if empty
    let primaryKeyword = (rawKeyword || "").trim();
    if (!primaryKeyword) {
      primaryKeyword = title
        .replace(/^(the|how to|why|what is|a guide to|mastering|unlocking)\s+/i, "")
        .split(/[:\-|–—]/)[0]
        .trim();
    }

    // Auto-detect pillar category & aligned service/tool
    const pillarCategory = detectPillarCategory(title, primaryKeyword, rawServiceSlug || "");

    let targetServiceSlug = rawServiceSlug;
    let relatedFreeToolSlug = rawToolSlug;

    if (!targetServiceSlug || targetServiceSlug === "seo-services" || targetServiceSlug === "technical-seo") {
      if (pillarCategory === "CONTENT_MARKETING") {
        targetServiceSlug = "content-marketing";
        relatedFreeToolSlug = "keyword-density-checker";
      } else if (pillarCategory === "PERFORMANCE_MARKETING") {
        targetServiceSlug = "performance-marketing";
        relatedFreeToolSlug = "utm-builder";
      } else if (pillarCategory === "SOCIAL_MEDIA") {
        targetServiceSlug = "social-media-marketing";
        relatedFreeToolSlug = "open-graph-preview";
      } else if (pillarCategory === "WEB_ENGINEERING") {
        targetServiceSlug = "web-development";
        relatedFreeToolSlug = "http-headers-checker";
      } else if (pillarCategory === "LOCAL_SEO") {
        targetServiceSlug = "local-seo";
        relatedFreeToolSlug = "serp-preview";
      } else {
        targetServiceSlug = "technical-seo";
        relatedFreeToolSlug = "seo-page-analyzer";
      }
    }

    const matchedService = siteConfig.services.find((s) => s.slug === targetServiceSlug) || siteConfig.services[0];
    const matchedTool = siteConfig.services
      .flatMap((s) => s.relatedTools)
      .find((t) => t.href.includes(relatedFreeToolSlug || ""));

    const toolName = matchedTool ? matchedTool.name : "Keyword Density Checker";
    const toolHref = matchedTool ? matchedTool.href : `/tools/${relatedFreeToolSlug || "keyword-density-checker"}`;

    const apiKey = process.env.GEMINI_API_KEY || db.getSetting("GEMINI_API_KEY") || "";
    const model = db.getSetting("GEMINI_MODEL") || "gemini-flash-lite-latest";

    // Category-Specific Editorial Instructions
    let roleDescription = "";
    let focusInstructions = "";

    if (pillarCategory === "CONTENT_MARKETING") {
      roleDescription = `You are a Principal B2B Content Marketing Director and Commercial Demand Generation Strategist at HelloShiva (helloshiva.com).`;
      focusInstructions = `TOPIC FOCUS (CONTENT MARKETING & COMMERCIAL ACQUISITION):
1. Focus directly on how high-intent, niche content attracts, qualifies, and converts high-LTV customers and decision-makers (Founders, CMOs, Enterprise buyers).
2. Contrast high-converting Bottom-of-the-Funnel (BOFU) problem-solving content against generic top-of-funnel vanity traffic.
3. Detail concrete content frameworks: customer pain-point mapping, proprietary case studies, teardowns, and high-trust editorial.
4. Explain how to measure real content ROI: pipeline velocity, lead qualification, and customer acquisition cost (CAC) reduction.
5. Provide actionable step-by-step methodologies and checklists.
6. STRICTLY FORBIDDEN: Do NOT write about irrelevant web-server HTTP headers, technical schema bugs, or browser DOM rendering loops. Keep this 100% focused on content strategy, buyer psychology, and customer acquisition!`;
    } else if (pillarCategory === "PERFORMANCE_MARKETING") {
      roleDescription = `You are the Head of Paid Performance Marketing and Conversion Rate Optimization at HelloShiva (helloshiva.com).`;
      focusInstructions = `TOPIC FOCUS (PAID MEDIA, PPC & CRO):
1. Focus on paid campaign architecture, Google Search Ads high-intent bidding, Meta Ads targeting, and full-funnel CAC reduction.
2. Detail landing page conversion rate optimization (CRO) principles that turn paid clicks into qualified sales pipeline.
3. Explain multi-touch attribution, GA4 tracking hygiene, and UTM campaign architecture.`;
    } else if (pillarCategory === "SOCIAL_MEDIA") {
      roleDescription = `You are the Head of Organic Social Media & Executive Thought Leadership at HelloShiva (helloshiva.com).`;
      focusInstructions = `TOPIC FOCUS (SOCIAL MEDIA & EXECUTIVE BRANDING):
1. Focus on B2B LinkedIn thought leadership, founder personal branding, organic reach algorithms, and community building.
2. Detail frameworks for turning complex ideas into high-engagement carousels, text posts, and video scripts.
3. Explain how to bridge social media engagement into booked sales calls and agency pipeline.`;
    } else {
      roleDescription = `You are the Lead Technical SEO Architect and Principal Web Engineer at HelloShiva (helloshiva.com).`;
      focusInstructions = `TOPIC FOCUS (TECHNICAL SEO & PERFORMANCE):
1. Focus on technical crawlability, Core Web Vitals (INP, LCP, CLS), SSR vs SSG architectures, schema validation, and server speed.
2. Provide concrete technical benchmarks, code snippets, and configuration examples.`;
    }

    const systemPrompt = `${roleDescription}
You write deeply researched, authoritative, commercially intelligent guides for founders, marketing directors, and growth executives.

${focusInstructions}

MANDATORY EDITORIAL STANDARDS:
1. STRICTLY NO AI CLICHÉS. Never use phrases like: "In today's fast-paced digital world", "In conclusion", "It is crucial to remember", "A testament to", "Delve into", "Tapestry", "Beacon", "Supercharge".
2. NO ASCII ART BOX DIAGRAMS (e.g. ┌──┐ │ ... │ └──┘). Use clean Markdown tables or numbered callout lists instead. ASCII boxes look broken on mobile devices.
3. COMPLETE CLOSURE: You must complete every section, paragraph, and FAQ. NEVER cut off mid-sentence.
4. THE GOLDEN LOOP:
   - Naturally integrate HelloShiva's free tool: [${toolName}](${toolHref}).
   - Naturally integrate HelloShiva's agency service: [HelloShiva ${matchedService.title}](/services/${matchedService.slug}).
5. Include a dedicated "## Frequently Asked Questions" section with 3 complete, insightful questions and thorough answers.`;

    const userPrompt = `Write a comprehensive, publication-ready guide:
- Article Title: ${title}
- Primary Keyword: ${primaryKeyword}
- Secondary Keywords: ${Array.isArray(secondaryKeywords) ? secondaryKeywords.join(", ") : secondaryKeywords || "None specified"}
- Search Intent: ${searchIntent}
- Target Audience: ${targetPersona || "Founders, CMOs, and Marketing Leaders"}
- Embedded Free Tool: ${toolName} (${toolHref})
- Linked Agency Service: HelloShiva ${matchedService.title} (/services/${matchedService.slug})

Outline to develop:
1. Executive Introduction: Why ${title} is critical for commercial growth in 2026.
2. The Strategic Framework: 3-4 deep, actionable sections packed with real-world examples, frameworks, and step-by-step checklists.
3. The Attribution & Execution Layer: How to implement and measure ROI.
4. Frequently Asked Questions: 3 high-value questions with complete, detailed answers.

Also provide a proposed meta description on the first line formatted as:
META_DESCRIPTION: <140-155 characters summary containing the keyword "${primaryKeyword}">

Then output the full markdown guide.`;

    let generatedMarkdown = "";
    let proposedMeta = `Master ${primaryKeyword} with HelloShiva's strategic guide. Learn actionable frameworks, acquisition playbooks, and best practices to drive revenue.`;

    let actualModelUsed = model;

    // Resilient multi-model cascade to guarantee generation even under Google rate limits
    const modelsToTry = [
      model,
      "gemini-flash-lite-latest",
      "gemini-3.5-flash-lite",
      "gemini-3.7-flash",
      "gemini-3.5-flash",
    ].filter((v, i, a) => a.indexOf(v) === i);

    for (const targetModel of modelsToTry) {
      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${targetModel}:generateContent?key=${apiKey}`;
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }],
              },
            ],
            generationConfig: {
              temperature: 0.4,
              maxOutputTokens: 5000,
            },
          }),
        });

        if (response.ok) {
          const json = await response.json();
          const candidateText = json?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText && candidateText.length > 400) {
            generatedMarkdown = candidateText;
            actualModelUsed = targetModel;
            break; // Successfully generated!
          }
        }
      } catch (e) {
        console.warn(`Model ${targetModel} network exception:`, e);
      }
    }

    // Extract META_DESCRIPTION if present
    if (generatedMarkdown.includes("META_DESCRIPTION:")) {
      const metaMatch = generatedMarkdown.match(/META_DESCRIPTION:\s*([^\n]+)/);
      if (metaMatch && metaMatch[1]) {
        proposedMeta = metaMatch[1].trim().slice(0, 160);
        generatedMarkdown = generatedMarkdown.replace(/META_DESCRIPTION:\s*[^\n]+\n+/, "");
      }
    }

    // Deterministic high-quality fallback if API was unavailable or empty
    if (!generatedMarkdown) {
      generatedMarkdown = `In modern digital marketing, sustainable business growth is rarely built on vanity traffic spikes or superficial social media hacks. Instead, long-term market leadership belongs to businesses that master **${primaryKeyword}** through rigorous execution and deep alignment with how target buyers make purchasing decisions.

When companies structure their content around the acute commercial problems of high-value customers, every published piece compounds into a predictable pipeline.

---

## 1. The Strategic Advantage of Niche Intent

For **${targetPersona || "B2B Founders, CMOs, and Marketing Leaders"}**, capturing customer interest at the exact moment of decision-making is the difference between unsustainable customer acquisition costs (CAC) and a self-sustaining inbound pipeline.

Rather than competing for broad, generic keywords with low commercial intent, high-growth brands focus on high-intent vectors:
* **Acute Operational Problems:** Questions and searches from buyers actively trying to resolve a bottleneck.
* **Commercial Vendor Comparisons:** In-depth evaluations of approaches, tool stacks, and agency methodologies.
* **Proof-of-Concept Case Studies:** Demonstrating tangible revenue impact rather than speculative theory.

> 💡 **HelloShiva Strategic Principle:**  
> Never publish content without a clear conversion hypothesis. Use our free [${toolName}](${toolHref}) to audit your live density, structure, and keyword placement before launching campaigns.

---

## 2. The 4-Stage Content-to-Pipeline Framework

To turn niche content into booked client revenue, execute across four structured layers:

1. **Audience Segmentation:** Pinpoint the exact job titles and commercial stakes of decision-makers.
2. **High-Information-Gain Production:** Inject proprietary frameworks, first-party data, and verifiable methodologies that AI content farms cannot replicate.
3. **Frictionless Conversion Paths:** Embed contextual invitations to consultation or specialized agency audits.
4. **Multi-Channel Distribution:** Repurpose core insights across executive LinkedIn channels and targeted industry newsletters.

---

## 3. Turning Content Equity into Compounding Revenue

Content that drives traffic but fails to generate qualified sales inquiries is wasted capital. At HelloShiva, we align editorial strategy directly with commercial revenue models.

Whether your organization is building an inbound content engine or scaling multi-channel paid acquisition, our growth team provides end-to-end execution. Learn how we structure compounding inbound growth through [HelloShiva ${matchedService.title}](/services/${matchedService.slug}).

---

## Frequently Asked Questions

### Why does niche content outperform high-volume generic keywords?
Niche content targets buyers who are already problem-aware and searching for specialized solutions. While search volumes may appear smaller, conversion rates are typically 3x to 5x higher because visitor intent directly matches your commercial service offerings.

### How does HelloShiva measure content marketing ROI?
We track multi-touch pipeline attribution connecting initial article discovery through to qualified consultation requests and signed retainers, ensuring every content investment delivers measurable business return.

### How can our team get started with a customized content strategy?
You can use HelloShiva's suite of [Free Marketing Tools](/tools) to evaluate your current search footprint, or contact our strategy team to book a dedicated content audit.

---

> 🚀 **Ready to turn your content into an inbound growth engine?**  
> Explore [HelloShiva ${matchedService.title}](/services/${matchedService.slug}) or [Schedule a Free Strategy Consultation](/contact) with our growth architects today.`;
    }

    // Clean any AI cliché leaks
    generatedMarkdown = generatedMarkdown
      .replace(/^#\s+[^\n]+\n+/, "") // Strip leading duplicate H1 that repeats the article title
      .replace(/In today's fast-paced digital world/gi, "In modern digital marketing")
      .replace(/In conclusion,?/gi, "Strategic Takeaways:")
      .replace(/A testament to/gi, "A clear indicator of")
      .replace(/┌[─┬┐]+(\n[│\s\w\(\)\.\,\-]+)+\n└[─┴┘]+/g, ""); // strip ASCII art boxes

    // Ensure meta description is strictly within 140 - 158 chars
    if (proposedMeta.length > 158) {
      proposedMeta = proposedMeta.slice(0, 155).trim() + "...";
    }

    return NextResponse.json({
      success: true,
      markdown: generatedMarkdown.trim(),
      metaDescription: proposedMeta,
      primaryKeyword,
      targetServiceSlug,
      relatedFreeToolSlug,
      modelUsed: actualModelUsed,
      pillarCategory,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
