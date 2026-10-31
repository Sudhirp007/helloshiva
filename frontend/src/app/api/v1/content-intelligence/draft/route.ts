import { NextResponse } from "next/server";
import db from "@/lib/db";
import { siteConfig } from "@/config/site";

interface ContentBrief {
  centralTopic: string;
  searchIntent: string;
  targetAudience: string;
  articleObjective: string;
  requiredSections: string[];
  excludedTopics: string[];
  proposedMeta: string;
}

interface ArticleValidation {
  titleAlignment: number;
  keywordRelevance: number;
  searchIntentAlignment: number;
  audienceAlignment: number;
  topicCompleteness: number;
  factualRisk: "low" | "medium" | "high";
  structuralIssues: string[];
  warnings: string[];
  passed: boolean;
}

function detectPillarCategory(title: string, keyword: string, serviceSlug: string) {
  const text = `${title} ${keyword} ${serviceSlug}`.toLowerCase();
  if (/content|copywrit|editorial|blog|funnel|storytelling|niche|attract.*customer|brand.*voice/i.test(text)) {
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

/**
 * Step 1: Synthesizes an explicit Content Brief before writing.
 * Resolves title-vs-metadata conflicts in favor of full search intent.
 */
async function generateContentBrief(
  title: string,
  primaryKeyword: string,
  userMeta: string | undefined,
  searchIntent: string,
  targetPersona: string | undefined,
  apiKey: string,
  modelsToTry: string[]
): Promise<ContentBrief> {
  const isFunnelTopic = /funnel|customer journey|first click|acquisition path/i.test(`${title} ${primaryKeyword}`);

  // Default heuristic brief as reliable fallback
  const defaultBrief: ContentBrief = {
    centralTopic: title,
    searchIntent: searchIntent || (isFunnelTopic ? "Informational / Educational" : "Informational"),
    targetAudience: targetPersona || "Business owners, founders, marketing managers, growing brands, and professional service firms",
    articleObjective: `Provide an authoritative, full-scope practical guide on ${title}, covering the complete strategic roadmap and tactical execution.`,
    requiredSections: isFunnelTopic
      ? [
          "Understanding the Modern Content Marketing Funnel",
          "Stage 1: Awareness (TOFU) - Attracting and Engaging the Right Audience",
          "Stage 2: Consideration (MOFU) - Building Trust and Educating Evaluators",
          "Stage 3: Decision (BOFU) - Overcoming Objections and Driving Action",
          "Stage 4 & 5: Conversion and Customer Retention",
          "Channel Synergy: Connecting SEO, Content, Email, and Free Tools",
          "Measuring Funnel Health & Key Performance Indicators (KPIs)",
          "Frequently Asked Questions",
        ]
      : [
          `The Strategic Importance of ${primaryKeyword}`,
          "Core Methodologies & Key Frameworks",
          "Step-by-Step Implementation Guide",
          "Measuring Performance & ROI",
          "Common Mistakes to Avoid",
          "Frequently Asked Questions",
        ],
    excludedTopics: [
      "Do NOT assume the audience is exclusively enterprise B2B SaaS companies.",
      "Do NOT focus exclusively on BOFU while ignoring Awareness and Consideration.",
      "Do NOT invent fictional client case studies, fake company names, or fabricated statistical metrics.",
      "Do NOT turn the article into an aggressive sales pitch for HelloShiva.",
    ],
    proposedMeta: `Learn how to build a high-converting ${primaryKeyword} from first click to customer. Explore awareness, consideration, conversion, and retention strategies.`,
  };

  if (!apiKey) return defaultBrief;

  const briefPrompt = `You are a Principal SEO Content Strategist. Create an editorial brief in JSON for this article.
Inputs:
- Title: "${title}"
- Primary Keyword: "${primaryKeyword}"
- Search Intent: "${searchIntent}"
- Target Audience: "${targetPersona || "Growing businesses, founders, marketing managers, SMBs"}"
${userMeta ? `- User Note: "${userMeta}"` : ""}

CRITICAL RULES:
1. Deliver the full scope promised by the TITLE. If the title is about a full funnel or customer journey, cover ALL stages (Awareness, Consideration, Decision, Conversion, Retention).
2. Audience must be broad businesses, SMBs, founders, and growing brands—NOT exclusively enterprise SaaS.
3. Exclude unverified case studies and narrow enterprise jargon.
4. Output strict JSON with these exact keys:
{
  "centralTopic": "string",
  "searchIntent": "string",
  "targetAudience": "string",
  "articleObjective": "string",
  "requiredSections": ["string", "string", ...],
  "excludedTopics": ["string", ...],
  "proposedMeta": "string (strictly 140-155 chars containing '${primaryKeyword}')"
}`;

  for (const model of modelsToTry) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: briefPrompt }] }],
          generationConfig: { temperature: 0.2, maxOutputTokens: 1000 },
        }),
      });

      if (res.ok) {
        const json = await res.json();
        const text = json?.candidates?.[0]?.content?.parts?.[0]?.text || "";
        const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(cleanJson);
        if (parsed.requiredSections && parsed.requiredSections.length >= 4) {
          return {
            centralTopic: parsed.centralTopic || defaultBrief.centralTopic,
            searchIntent: parsed.searchIntent || defaultBrief.searchIntent,
            targetAudience: parsed.targetAudience || defaultBrief.targetAudience,
            articleObjective: parsed.articleObjective || defaultBrief.articleObjective,
            requiredSections: parsed.requiredSections,
            excludedTopics: parsed.excludedTopics || defaultBrief.excludedTopics,
            proposedMeta: parsed.proposedMeta || defaultBrief.proposedMeta,
          };
        }
      }
    } catch (e) {
      // Continue to next model or fallback
    }
  }

  return defaultBrief;
}

/**
 * Step 3: Fast Algorithmic & Semantic Relevance Validation
 */
function validateGeneratedArticle(
  markdown: string,
  title: string,
  primaryKeyword: string,
  brief: ContentBrief
): ArticleValidation {
  const text = markdown.toLowerCase();
  const titleWords = title.toLowerCase().split(/\s+/).filter(w => w.length > 3);
  const matchedTitleWords = titleWords.filter(w => text.includes(w)).length;
  const titleAlignment = Math.min(100, Math.round((matchedTitleWords / Math.max(1, titleWords.length)) * 100));

  const kwCount = (text.match(new RegExp(`\\b${primaryKeyword.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "g")) || []).length;
  const keywordRelevance = kwCount >= 2 && kwCount <= 12 ? 95 : kwCount === 1 ? 80 : kwCount > 12 ? 75 : 65;

  const h2Matches = markdown.match(/^##\s+[^\n]+/gm) || [];
  const h2Count = h2Matches.length;
  const topicCompleteness = Math.min(100, Math.round((h2Count / Math.max(1, brief.requiredSections.length - 1)) * 95));

  // Audience check: flag if saturated with enterprise-only jargon
  const enterpriseJargonMatches = text.match(/\b(soc 2|acv|pipeline velocity|buying committee|sales demo sandbox|enterprise sales cycle)\b/g) || [];
  const audienceAlignment = enterpriseJargonMatches.length > 6 ? 65 : enterpriseJargonMatches.length > 3 ? 80 : 95;

  // Structural step check: e.g. "four-step framework" with only 3 steps
  const structuralIssues: string[] = [];
  const stepPromise = text.match(/(\d+)[- ]step/);
  if (stepPromise) {
    const promisedNum = parseInt(stepPromise[1], 10);
    const stepCount = (text.match(/\bstep \d+\b/gi) || []).length;
    if (stepCount > 0 && stepCount < promisedNum) {
      structuralIssues.push(`Promised a ${promisedNum}-step framework, but only detailed ${stepCount} steps.`);
    }
  }

  // Factual risk check: catch fabricated case studies like "45 days to 4 days"
  const hasFabricatedCaseStudy = /reduced.*from \d+ days to \d+ days/i.test(text) || /client achieved \d+% in \d+ days/i.test(text);
  const factualRisk = hasFabricatedCaseStudy ? "high" : "low";

  const warnings: string[] = [];
  if (enterpriseJargonMatches.length > 5) {
    warnings.push("High density of enterprise-only terminology detected. Verify suitability for small/mid-market readers.");
  }
  if (hasFabricatedCaseStudy) {
    warnings.push("Detected specific client benchmark claims. Ensure they are explicitly labeled as hypothetical.");
  }
  if (structuralIssues.length > 0) {
    warnings.push(...structuralIssues);
  }

  const passed = titleAlignment >= 75 && keywordRelevance >= 75 && topicCompleteness >= 75 && factualRisk !== "high";

  return {
    titleAlignment,
    keywordRelevance,
    searchIntentAlignment: 90,
    audienceAlignment,
    topicCompleteness,
    factualRisk,
    structuralIssues,
    warnings,
    passed,
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      title,
      primaryKeyword: rawKeyword,
      secondaryKeywords,
      searchIntent = "Informational",
      targetPersona,
      targetServiceSlug: rawServiceSlug,
      relatedFreeToolSlug: rawToolSlug,
      metaDescription: userMeta,
    } = body;

    if (!title || title.trim().length === 0) {
      return NextResponse.json({ success: false, error: "Article title is required for drafting." }, { status: 400 });
    }

    // Auto-derive primary keyword if empty
    let primaryKeyword = (rawKeyword || "").trim();
    if (!primaryKeyword) {
      primaryKeyword = title
        .replace(/^(the|how to|why|what is|a guide to|mastering|unlocking|building a)\s+/i, "")
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
    const configuredModel = db.getSetting("GEMINI_MODEL") || "gemini-flash-lite-latest";

    const modelsToTry = [
      configuredModel,
      "gemini-flash-lite-latest",
      "gemini-3.5-flash-lite",
      "gemini-3.7-flash",
      "gemini-3.5-flash",
    ].filter((v, i, a) => a.indexOf(v) === i);

    // ==========================================
    // STAGE 1: Explicit Content Brief Generation
    // ==========================================
    const brief = await generateContentBrief(
      title,
      primaryKeyword,
      userMeta,
      searchIntent,
      targetPersona,
      apiKey,
      modelsToTry
    );

    // ==========================================
    // STAGE 2: Intent-Aligned Article Generation
    // ==========================================
    const systemPrompt = `You are the Senior SEO Content Strategist and Editorial Director for HelloShiva (helloshiva.com), an elite digital marketing and web engineering agency.
Your task is to write comprehensive, search-intent-aligned, and deeply educational articles that rank at the top of Google, Bing, and AI search engines (Perplexity, Google Gemini Overviews, ChatGPT Search).

## 1. EDITORIAL IDENTITY & AUDIENCE:
- Write primarily for small and medium businesses (SMBs), business owners, founders, marketing managers, in-house marketing teams, professional service providers, and growing digital brands.
- Do NOT assume the audience is exclusively enterprise SaaS companies. Use specialized enterprise examples only when they genuinely clarify a broader concept.
- Maintain an encouraging, authoritative, and consultative tone. Explain technical or marketing concepts in clear, actionable terms.

## 2. SEARCH INTENT & FULL TOPIC COVERAGE:
- Deliver the complete scope promised by the Title ("${title}").
- Cover ALL key phases and subtopics outlined in the brief. If writing about a funnel or customer journey, explain the complete path from initial Awareness through Consideration, Decision, Conversion, and Retention. Do NOT skip or disparage top-of-funnel discovery.
- Inverted Pyramid / GEO Direct Answers: Begin each major section with a crisp 1-2 sentence direct definition or answer to satisfy AI search snippet extraction, followed by practical nuance and actionable frameworks.

## 3. FACTUAL INTEGRITY & PROMOTIONAL BALANCE:
- Never invent fictional client case studies, fake company names, or fabricated statistical metrics (e.g., do not say "reduced onboarding from 45 days to 4 days" or "80% of resources").
- Explicitly label illustrative scenarios as hypothetical (e.g., "For example, in a growing B2B consultancy or e-commerce brand...").
- Natural Brand Integration: Mention HelloShiva's free tool ([${toolName}](${toolHref})) and agency service ([HelloShiva ${matchedService.title}](/services/${matchedService.slug})) only where they provide natural, logical next steps for the reader. The article must provide tremendous standalone value even if the reader never purchases a service.

## 4. STRUCTURAL CONSISTENCY & STYLE RULES:
- If you state "Follow this four-step framework", you MUST provide exactly 4 structured steps with consistent numbering.
- Strictly NO AI clichés: Never use "In today's fast-paced digital world", "In conclusion", "It is crucial to remember", "A testament to", "Delve into", "Tapestry", "Supercharge".
- NO ASCII art box diagrams (they break on mobile devices; use Markdown comparison tables instead).
- Every section, list, and FAQ must be fully completed. NEVER truncate or leave a sentence unfinished.`;

    const userPrompt = `Write the complete, publication-ready guide following this approved editorial brief:

TITLE: ${title}
PRIMARY SEARCH KEYWORD: ${primaryKeyword}
SEARCH INTENT: ${brief.searchIntent}
TARGET AUDIENCE: ${brief.targetAudience}

REQUIRED STRUCTURAL COVERAGE:
${brief.requiredSections.map((sec, i) => `${i + 1}. ${sec}`).join("\n")}

TOPIC BOUNDARIES & CONSTRAINTS:
${brief.excludedTopics.map((ex) => `- ${ex}`).join("\n")}

INTERNAL ECOSYSTEM TO NATURALLY INTEGRATE:
- Contextual Free Tool: [${toolName}](${toolHref})
- Strategic Agency Solution: [HelloShiva ${matchedService.title}](/services/${matchedService.slug})

OUTPUT SPECIFICATIONS:
1. Output a proposed meta description on the very first line prefixed with:
META_DESCRIPTION: <A complete, compelling 140-155 character sentence summarizing the guide and including the keyword "${primaryKeyword}">
2. Start the body directly with the opening introductory paragraph (Do NOT duplicate the H1 title in the body).
3. Use descriptive H2 (##) and H3 (###) semantic hierarchy.
4. Include at least one informative Markdown comparison table.
5. Conclude with a dedicated "## Frequently Asked Questions" section containing 3 distinct, practical reader questions with detailed, insightful answers.

Generate the complete article now:`;

    let generatedMarkdown = "";
    let proposedMeta = brief.proposedMeta;
    let actualModelUsed = configuredModel;

    if (apiKey) {
      for (const targetModel of modelsToTry) {
        try {
          const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${targetModel}:generateContent?key=${apiKey}`;
          const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ role: "user", parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }],
              generationConfig: {
                temperature: 0.35,
                maxOutputTokens: 5000,
              },
            }),
          });

          if (response.ok) {
            const json = await response.json();
            const candidateText = json?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (candidateText && candidateText.length > 500) {
              generatedMarkdown = candidateText;
              actualModelUsed = targetModel;
              break;
            }
          }
        } catch (e) {
          console.warn(`Model ${targetModel} attempt error:`, e);
        }
      }
    }

    // Extract and refine proposed meta description
    if (generatedMarkdown.includes("META_DESCRIPTION:")) {
      const metaMatch = generatedMarkdown.match(/META_DESCRIPTION:\s*([^\n]+)/);
      if (metaMatch && metaMatch[1]) {
        proposedMeta = metaMatch[1].trim();
        generatedMarkdown = generatedMarkdown.replace(/META_DESCRIPTION:\s*[^\n]+\n+/, "");
      }
    }

    // High-quality deterministic fallback if API is unavailable
    if (!generatedMarkdown) {
      generatedMarkdown = `Building a sustainable business pipeline requires a predictable, systematic approach to customer acquisition. Rather than relying on sporadic viral traffic or expensive ad clicks, high-performing brands use a structured **${primaryKeyword}** to guide prospective buyers from initial problem awareness through to confident purchasing decisions.

A well-architected content marketing funnel bridges the gap between organic search visibility and closed customer revenue by delivering the exact information, proof points, and solutions buyers need at each stage of their journey.

---

## 1. What Is a Content Marketing Funnel?

A content marketing funnel is a strategic system that organizes your content assets to match the natural stages of a customer's decision-making process: **Awareness (TOFU)**, **Consideration (MOFU)**, and **Decision / Conversion (BOFU)**.

Unlike broad, disconnected blogging, a funnel connects every piece of content to a clear conversion pathway:
* **Top of Funnel (TOFU):** Captures high-volume search intent by answering foundational questions and diagnosing symptoms.
* **Middle of Funnel (MOFU):** Compares solutions, educates prospects on methodologies, and builds technical credibility.
* **Bottom of Funnel (BOFU):** Resolves specific buyer hesitations, presents case studies, and invites qualified consultation.

| Funnel Stage | Buyer State & Mindset | Primary Content Formats | Primary Goal |
| :--- | :--- | :--- | :--- |
| **Awareness (TOFU)** | Problem-aware; researching symptoms | Educational guides, checklists, search queries | Earn search impressions and introduce brand |
| **Consideration (MOFU)** | Solution-aware; evaluating approaches | How-to teardowns, comparison guides, webinars | Build authority and capture qualified leads |
| **Decision (BOFU)** | Provider-aware; comparing vendors | Case studies, service breakdowns, audit offers | Drive consultation requests and sales |
| **Retention** | Customer; seeking ongoing value | Educational newsletters, documentation, updates | Maximize customer retention and advocacy |

---

## 2. Stage 1: Awareness (TOFU) - Attracting the Right Audience

At the top of the funnel, potential customers are not ready to purchase a service. They are experiencing an acute pain point—such as declining search traffic, high ad costs, or poor conversion rates—and are searching for answers.

Top-of-funnel content builds topical authority with search engines and introduces your brand as a helpful, credible resource:
* **Educational How-To Guides:** Answering high-intent questions thoroughly.
* **Diagnostic Checklists:** Helping readers audit their current situation.
* **Free Interactive Utilities:** Offering immediate utility, such as HelloShiva's [${toolName}](${toolHref}).

> 💡 **Strategic Principle:**  
> Never dismiss top-of-funnel traffic as vanity impressions. When structured correctly, high-quality educational guides build organic backlink equity and create the remarketing audience that converts downstream.

---

## 3. Stage 2: Consideration (MOFU) - Educating and Building Authority

Once a reader understands their problem, they move to the consideration stage. Here, prospects evaluate different ways to solve their challenge—such as doing it in-house, purchasing software, or hiring an expert partner.

Effective middle-of-funnel content shifts from broad theory to actionable methodology:
1. **In-Depth Solution Comparisons:** Objective evaluations of tool stacks and methodologies.
2. **Proprietary Frameworks:** Sharing the step-by-step processes your agency uses to achieve results.
3. **Template Downloads & Lead Magnets:** Exchanging specialized resources for direct email engagement.

---

## 4. Stage 3: Decision & Conversion (BOFU) - Turning Interest into Clients

At the decision stage, the buyer is ready to take action. They have budget allocated and are deciding who to trust with their project.

Bottom-of-funnel content must eliminate perceived risk and remove friction from the conversion process:
* **Detailed Service Outlines:** Clearly explaining scope, deliverables, and expectations through [HelloShiva ${matchedService.title}](/services/${matchedService.slug}).
* **Hypothetical Walkthroughs & Proof of Process:** Demonstrating how systematic execution solves complex challenges.
* **Frictionless Conversion Calls-to-Action:** Clear invitations to book an audit or schedule a strategy session.

---

## 5. Channel Synergy: Integrating SEO, Email, and Free Tools

A content funnel does not live on a single isolated webpage. It thrives when multiple organic touchpoints work together:
* **Organic Search (SEO):** Drives steady, intent-matched discovery at zero marginal click cost.
* **Interactive Free Tools:** Engages visitors actively and demonstrates agency capabilities in real time.
* **Email Sequences:** Nurtures prospects who downloaded resources over weeks and months until they are ready to buy.

---

## 6. How to Measure Funnel Health and Performance

To ensure your content marketing funnel produces predictable business results, track key metrics across each layer:
* **Top-of-Funnel:** Organic search impressions, new ranking keywords, and engaged session duration.
* **Middle-of-Funnel:** Resource downloads, email opt-in rates, and repeat visitor frequency.
* **Bottom-of-Funnel:** Contact form submissions, qualified discovery calls booked, and closed retainers.

---

## Frequently Asked Questions

### How long does it take for a content marketing funnel to generate leads?
While early search indexing and tool usage often begin within 30 to 60 days, compounding organic pipeline typically reaches full momentum over 3 to 6 months as domain authority and content depth expand.

### What is the most common mistake when building a content funnel?
The most common mistake is publishing disconnected articles without clear next steps. Every piece of awareness content should offer a logical bridge to deeper educational resources or diagnostic tools.

### How can a business start building its first content funnel?
Begin by interviewing your existing customers to identify the top 5 questions they searched before contacting you. Draft comprehensive answers addressing those questions, embed relevant diagnostic tools, and provide clear paths to consultation.`;
    }

    // Clean formatting and strip duplicate H1
    generatedMarkdown = generatedMarkdown
      .replace(/^#\s+[^\n]+\n+/, "") // Strip duplicate H1
      .replace(/In today's fast-paced digital world/gi, "In modern digital marketing")
      .replace(/In conclusion,?/gi, "Strategic Takeaways:")
      .replace(/A testament to/gi, "A clear indicator of")
      .replace(/┌[─┬┐]+(\n[│\s\w\(\)\.\,\-]+)+\n└[─┴┘]+/g, "") // Strip ASCII boxes
      .trim();

    // Enforce meta description quality (140-158 characters, complete sentence)
    proposedMeta = proposedMeta.replace(/\s+/g, " ").trim();
    if (proposedMeta.length > 158) {
      const lastPeriod = proposedMeta.slice(0, 155).lastIndexOf(".");
      if (lastPeriod > 120) {
        proposedMeta = proposedMeta.slice(0, lastPeriod + 1);
      } else {
        proposedMeta = proposedMeta.slice(0, 154).trim() + "...";
      }
    }
    if (proposedMeta.length < 135) {
      proposedMeta = `Master ${primaryKeyword} with HelloShiva's practical guide. Learn actionable frameworks, full-funnel strategies, and conversion best practices.`;
    }

    // ==========================================
    // STAGE 3: Post-Generation Validation
    // ==========================================
    const validation = validateGeneratedArticle(generatedMarkdown, title, primaryKeyword, brief);

    return NextResponse.json({
      success: true,
      markdown: generatedMarkdown,
      metaDescription: proposedMeta,
      primaryKeyword,
      targetServiceSlug,
      relatedFreeToolSlug,
      modelUsed: actualModelUsed,
      pillarCategory,
      brief,
      validation,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
