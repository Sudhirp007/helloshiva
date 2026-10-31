import db from "@/lib/db";

export interface StudioKeywordCluster {
  cluster_name: string;
  primary_keywords: string[];
  search_intent: string;
  competitor_gap: string;
  backlink_targets: string[];
  trend_hook: string;
}

export const DIGITAL_MARKETING_KEYWORD_CLUSTERS: Record<string, StudioKeywordCluster> = {
  performance_marketing: {
    cluster_name: "B2B Performance Marketing & ROAS Scaling",
    primary_keywords: [
      "b2b performance marketing agency",
      "google ads conversion rate optimization",
      "meta ads roas scaling framework",
      "high ticket lead generation agency",
      "b2b customer acquisition cost cac reduction",
      "first party data ga4 attribution modeling",
    ],
    search_intent: "Commercial Investigation / High-Ticket Transactional",
    competitor_gap:
      "Competitor agencies post generic ad checklist articles without sharing real media spend allocation models, blended CAC math, or creative fatigue mitigation frameworks.",
    backlink_targets: [
      "Think with Google Commercial Benchmark Reports",
      "Meta Business Engineering Insights",
      "Demand Gen Report B2B Marketing Survey",
      "HubSpot State of Marketing Research",
    ],
    trend_hook: "First-Party Data Attribution & Eliminating Paid Ad Budget Waste in 2026",
  },
  technical_seo: {
    cluster_name: "Technical SEO Audits & Core Web Vitals Dominance",
    primary_keywords: [
      "technical seo audit for nextjs websites",
      "sub second lcp core web vitals agency",
      "interaction to next paint inp optimization",
      "enterprise crawl budget optimization",
      "javascript seo hydration bottlenecks",
      "programmatic seo architecture",
    ],
    search_intent: "Technical Diagnostic / Commercial Investigation",
    competitor_gap:
      "Most SEO agencies only audit surface-level meta tags while failing to diagnose server-side rendering latency, DOM hydration blocks, and TTFB server response headers.",
    backlink_targets: [
      "Google Search Central Engineering Documentation",
      "web.dev Core Web Vitals Engineering Guidelines",
      "W3C Web Performance Working Group",
      "Mozilla Developer Network (MDN) Performance Index",
    ],
    trend_hook: "INP Latency Elimination & Sub-Second Page Hydration on Edge CDNs",
  },
  local_seo: {
    cluster_name: "Local Search Domination & Multi-Location 3-Pack",
    primary_keywords: [
      "local seo 3 pack ranking factors",
      "google business profile optimization for service businesses",
      "multi location local citation management",
      "hyper local schema markup generator",
      "service area business sab ranking strategy",
      "geo grid local ranking tracking",
    ],
    search_intent: "Commercial & Local Buyer Intent",
    competitor_gap:
      "Generic agencies provide basic address tips but overlook geo-grid ranking radius tracking, automated review velocity scripts, and localized entity graph mapping.",
    backlink_targets: [
      "BrightLocal Local Consumer Review Survey",
      "Whitespark Local Search Ranking Factors",
      "Near Media Local Search Studies",
      "Search Engine Land Local Search Column",
    ],
    trend_hook: "Geo-Grid Ranking Radius Dominance & Review Velocity Engineering",
  },
  b2b_saas_organic: {
    cluster_name: "B2B SaaS Content Engineering & Bottom-of-Funnel Pipeline",
    primary_keywords: [
      "b2b saas content marketing strategy",
      "bottom of funnel bofu keywords that convert",
      "product led seo frameworks",
      "competitor alternative comparison page template",
      "organic pipeline velocity attribution",
      "saas free trial to paid conversion optimization",
    ],
    search_intent: "High-Intent Commercial / Transactional",
    competitor_gap:
      "Agencies produce endless top-of-funnel fluff that generates vanity traffic but zero demo bookings. They fail to build high-intent product comparison and ROI calculator pages.",
    backlink_targets: [
      "SaaStr Executive Insights",
      "Gartner Tech Marketing Benchmarks",
      "OpenView Product-Led Growth Index",
      "First Round Review Growth Playbooks",
    ],
    trend_hook: "Targeting Bottom-of-Funnel Commercial Intent Over Vanity Search Volume",
  },
  conversion_cro: {
    cluster_name: "Conversion Rate Optimization (CRO) & Funnel Engineering",
    primary_keywords: [
      "conversion rate optimization agency delhi",
      "high converting b2b landing page architecture",
      "frictionless multi step form design",
      "form abandonment recovery strategies",
      "e commerce checkout cro audit",
      "landing page cognitive load reduction",
    ],
    search_intent: "Commercial / High-Ticket Transactional",
    competitor_gap:
      "Traditional CRO agencies run random A/B tests on button colors instead of fixing cognitive load friction, trust credential placement, and mobile viewport interaction bottlenecks.",
    backlink_targets: [
      "Baymard Institute E-Commerce Usability Research",
      "Nielsen Norman Group UX Benchmarks",
      "CXL Conversion Research Studies",
      "Unbounce Conversion Benchmark Reports",
    ],
    trend_hook: "Micro-Conversion Engineering & Frictionless Mobile Lead Capture",
  },
};

export class ContentStudioService {
  private getApiKey(): string {
    try {
      const row = db.prepare("SELECT value FROM integration_settings WHERE key = 'GEMINI_API_KEY'").get() as { value: string } | undefined;
      return row?.value || process.env.GEMINI_API_KEY || "";
    } catch {
      return process.env.GEMINI_API_KEY || "";
    }
  }

  private getModelName(modelOverride?: string): string {
    if (modelOverride && !modelOverride.includes("1.5")) return modelOverride;
    try {
      const row = db.prepare("SELECT value FROM integration_settings WHERE key = 'GEMINI_MODEL'").get() as { value: string } | undefined;
      const model = row?.value || process.env.GEMINI_MODEL || "gemini-3.5-flash";
      if (model.includes("1.5")) return "gemini-3.5-flash";
      return model;
    } catch {
      return "gemini-3.5-flash";
    }
  }

  public isAiAvailable(): boolean {
    return Boolean(this.getApiKey().trim());
  }

  /**
   * Helper to invoke Gemini API and parse JSON cleanly with multi-model resilience.
   */
  private async callGeminiJson<T>(prompt: string, modelOverride?: string): Promise<T | null> {
    const apiKey = this.getApiKey();
    if (!apiKey) return null;

    const baseModel = this.getModelName(modelOverride);
    const candidateModels = Array.from(
      new Set([baseModel, "gemini-3.5-flash", "gemini-3.6-flash", "gemini-flash-latest", "gemini-pro-latest"])
    ).filter((m) => !m.includes("1.5"));

    for (const model of candidateModels) {
      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 3000,
              responseMimeType: "application/json",
            },
          }),
        });

        if (!res.ok) {
          const errText = await res.text();
          console.warn(`Gemini API call failed for model ${model}:`, res.status, errText);
          continue;
        }

        const data = await res.json();
        const parts = data.candidates?.[0]?.content?.parts || [];
        const rawText = parts.map((p: any) => p.text).filter(Boolean).join("");
        if (!rawText) continue;

        try {
          return JSON.parse(rawText) as T;
        } catch {
          const cleaned = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
          return JSON.parse(cleaned) as T;
        }
      } catch (err) {
        console.warn(`Error invoking Gemini model ${model}:`, err);
      }
    }
    return null;
  }

  /**
   * 1. Research keywords, competitor gaps, citations, and content opportunities.
   */
  async researchKeywordsAndOpportunities(niche: string, market: string = "Global Remote & India B2B", modelOverride?: string) {
    const cleanNiche = niche.trim();
    const cleanMarket = market.trim();

    if (this.isAiAvailable()) {
      try {
        const prompt = `You are a Principal Technical SEO Director & Chief Content Strategist at 'HelloShiva' (helloshiva.com), a premier digital marketing agency.
Analyze this target topic and market:
- Target Topic / Niche: ${cleanNiche}
- Target Market / Audience: ${cleanMarket}

Generate an exhaustive, highly actionable SEO, competitor blindspot, and backlink research briefing formatted strictly as JSON with this exact schema:
{
  "focus_niche": "${cleanNiche}",
  "market": "${cleanMarket}",
  "primary_keywords": ["list of 5 high-intent commercial organic keywords"],
  "long_tail_keywords": ["list of 5 conversion-focused long-tail search queries"],
  "search_intent": "Transactional | Commercial Investigation | Technical Diagnostic",
  "competitor_gaps": "Specific analysis of what mainstream agency blogs fail to address on this topic",
  "backlink_opportunities": ["3 to 4 specific high-authority citations, research reports, or industry authorities to cite or earn backlinks from"],
  "content_opportunities": [
    {
      "headline": "Compelling, high-CTR article headline",
      "angle": "Unique editorial perspective / commercial thesis",
      "recommended_format": "Market Authority Guide | Technical Teardown & Audit Checklist | B2B Case Study"
    },
    {
      "headline": "Second headline option",
      "angle": "Second unique angle",
      "recommended_format": "Technical Teardown & Audit Checklist"
    },
    {
      "headline": "Third headline option",
      "angle": "Third unique angle",
      "recommended_format": "Market Authority Guide"
    }
  ]
}

Return ONLY valid JSON.`;

        const aiResult = await this.callGeminiJson<any>(prompt, modelOverride);
        if (aiResult && aiResult.primary_keywords && aiResult.primary_keywords.length > 0) {
          return aiResult;
        }
      } catch (err) {
        console.warn("Gemini research call failed, using curated repository fallback:", err);
      }
    }

    // Curated Fallback
    const clusterKey = Object.keys(DIGITAL_MARKETING_KEYWORD_CLUSTERS).find((k) =>
      cleanNiche.toLowerCase().includes(k) || k.includes(cleanNiche.toLowerCase())
    ) || "performance_marketing";

    const cluster = DIGITAL_MARKETING_KEYWORD_CLUSTERS[clusterKey] || DIGITAL_MARKETING_KEYWORD_CLUSTERS.performance_marketing;

    return {
      focus_niche: cleanNiche || cluster.cluster_name,
      market: cleanMarket,
      primary_keywords: cluster.primary_keywords,
      long_tail_keywords: [
        `how to fix ${cleanNiche || "seo"} bottlenecks in nextjs 14`,
        `${cleanNiche || "b2b"} agency vs in-house team roi calculator`,
        `best practices for scaling ${cleanNiche || "organic pipeline"} in 2026`,
        `first-party data attribution framework for ${cleanNiche || "growth"}`,
        `auditing ${cleanNiche || "core web vitals"} with real user metrics`,
      ],
      search_intent: cluster.search_intent,
      competitor_gaps: cluster.competitor_gap,
      backlink_opportunities: cluster.backlink_targets,
      content_opportunities: [
        {
          headline: `The 2026 ${cleanNiche || "Digital Marketing"} Blueprint: 5 Structural Bottlenecks to Fix`,
          angle: "Code-level diagnostics and attribution clarity over superficial marketing hacks.",
          recommended_format: "Technical Teardown & Audit Checklist",
        },
        {
          headline: `Beyond Vanity Metrics: How to Turn ${cleanNiche || "Search Traffic"} into Predictable Pipeline Revenue`,
          angle: "Connecting search impressions directly to bottom-of-funnel customer acquisition.",
          recommended_format: "Market Authority Guide",
        },
        {
          headline: `Hiring a ${cleanNiche || "Growth"} Agency vs. Building In-House: The Complete Financial ROI Teardown`,
          angle: "Comprehensive financial model comparing agency retainer velocity against full-time payroll overhead.",
          recommended_format: "B2B Financial Evaluation",
        },
      ],
    };
  }

  /**
   * 2. Generate 7-Day SEO & Social Content Calendar Runway.
   */
  async generateSevenDayCalendar(market: string = "Global Remote & India B2B", focusNiche?: string, modelOverride?: string) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (this.isAiAvailable()) {
      try {
        const nicheText = focusNiche || "Performance Marketing, Technical SEO, Local 3-Pack, B2B SaaS BOFU, and Conversion Rate Optimization";
        const prompt = `You are Chief Content Officer and SEO Director at 'HelloShiva' (helloshiva.com), a premier digital marketing agency.
Construct an actionable 7-Day Content Publishing Calendar for the upcoming week.
- Target Market / Focus: ${market}
- Key Themes to Cover: ${nicheText}
- Starting Date: ${tomorrow.toISOString().split("T")[0]}

Each day must have a distinct high-intent SEO angle and social hooks for LinkedIn and X.
Format strictly as JSON with this exact schema:
{
  "calendar_title": "7-Day Strategic Content & SEO Distribution Pipeline",
  "market": "${market}",
  "start_date": "${tomorrow.toISOString().split("T")[0]}",
  "days": [
    {
      "day_number": 1,
      "date": "Nov 01, 2026",
      "weekday": "Monday",
      "theme": "Theme title (e.g. Sub-Second LCP & Web Vitals)",
      "primary_keyword": "target organic search query",
      "secondary_keywords": ["keyword 1", "keyword 2"],
      "search_intent": "Technical Diagnostic",
      "competitor_gap": "What typical agency blogs fail to address",
      "backlink_target": "Source to cite (e.g. web.dev / W3C)",
      "proposed_headline": "High-CTR Executive Headline",
      "content_brief": "2 to 3 sentence brief summarizing key architectural solutions and frameworks",
      "social_hook": "Engaging teaser hook for LinkedIn and X"
    }
  ]
}

Ensure there are exactly 7 distinct days (day_number 1 to 7). Return ONLY valid JSON.`;

        const aiCalendar = await this.callGeminiJson<any>(prompt, modelOverride);
        if (aiCalendar && aiCalendar.days && Array.isArray(aiCalendar.days) && aiCalendar.days.length >= 5) {
          return aiCalendar;
        }
      } catch (err) {
        console.warn("Gemini calendar generation failed, using curated repository fallback:", err);
      }
    }

    // Curated 7-Day Runway Fallback
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const curatedThemes = [
      {
        theme: "Technical SEO & Edge Performance",
        primary_keyword: "nextjs 14 technical seo audit",
        secondary_keywords: ["sub second lcp", "inp optimization", "hydration bottlenecks"],
        search_intent: "Technical Diagnostic",
        competitor_gap: "Competitors only show Lighthouse screenshots without server header or TTFB fixes.",
        backlink_target: "web.dev Core Web Vitals Working Group",
        proposed_headline: "The 2026 Next.js SEO Architecture: Achieving Sub-Second LCP and Flawless INP",
        content_brief: "Detailed breakdown of code-level hydration optimizations, server response header tuning, and edge caching for enterprise web applications.",
        social_hook: "Why 80% of modern Next.js sites fail Core Web Vitals despite having clean code — and the 3 server headers that fix it instantly.",
      },
      {
        theme: "Performance Marketing & ROAS Scaling",
        primary_keyword: "b2b google ads roas scaling framework",
        secondary_keywords: ["first party ga4 tracking", "offline conversion import", "cac reduction"],
        search_intent: "Commercial Investigation",
        competitor_gap: "Agencies provide basic bid settings instead of offline conversion import and CRM pipeline value matching.",
        backlink_target: "Think with Google B2B Marketing Benchmarks",
        proposed_headline: "Eliminating Paid Ad Waste: How to Scale B2B Google Ads with First-Party CRM Signals",
        content_brief: "Strategic guide on importing qualified lead value into Google Ads to train smart bidding on closed revenue rather than junk form fills.",
        social_hook: "Stop bidding on vanity form completions. Here is how feeding offline CRM deal values drops blended B2B CAC by 34%.",
      },
      {
        theme: "Local Search Domination",
        primary_keyword: "local seo 3 pack ranking factors 2026",
        secondary_keywords: ["google business profile optimization", "geo grid tracking", "local citation audit"],
        search_intent: "Local Commercial Intent",
        competitor_gap: "Portals overlook review velocity scripts and localized entity relationship graphs.",
        backlink_target: "Whitespark Local Search Ranking Studies",
        proposed_headline: "How to Own the Local 3-Pack: The Definitive Geo-Grid Playbook for Service Brands",
        content_brief: "Step-by-step implementation for multi-location operators to maximize local map pack visibility and capture high-intent phone calls.",
        social_hook: "Most local businesses optimize for their city center while losing 90% of suburban customers. Here is how geo-grid auditing solves it.",
      },
      {
        theme: "B2B SaaS Content & Pipeline Velocity",
        primary_keyword: "bottom of the funnel bofu keywords that convert",
        secondary_keywords: ["product led seo", "competitor alternative pages", "demo conversion rate"],
        search_intent: "High-Ticket Commercial",
        competitor_gap: "Agencies write high-volume top-of-funnel glossaries that bring zero demo bookings.",
        backlink_target: "SaaStr Executive Growth Reports",
        proposed_headline: "Beyond Traffic: Why Bottom-of-Funnel Product Comparison Pages Drive 70% of SaaS Demos",
        content_brief: "Framework for designing authoritative alternative and evaluation pages that capture buyers in active vendor selection.",
        social_hook: "1,000 visitors on a 'Versus' page will always generate more revenue than 100,000 visitors on a definition post. Here is the teardown.",
      },
      {
        theme: "Conversion Rate Optimization (CRO)",
        primary_keyword: "high converting b2b landing page architecture",
        secondary_keywords: ["multi step lead forms", "mobile viewport cro", "cognitive load reduction"],
        search_intent: "Commercial Investigation",
        competitor_gap: "Agencies test button colors instead of restructuring form cognitive friction and social proof placement.",
        backlink_target: "Baymard Institute Conversion Usability Index",
        proposed_headline: "The Anatomy of a 14% Converting B2B Landing Page: 7 UX Rules Most Agencies Ignore",
        content_brief: "Practical teardown of progressive disclosure forms, mobile viewport hierarchy, and social proof anchors that maximize demo submissions.",
        social_hook: "We audited 50 enterprise landing pages. The #1 conversion killer was asking for phone numbers on step 1 of the form.",
      },
      {
        theme: "Crawl Budget & Server Indexing",
        primary_keyword: "robots txt and crawl budget optimization",
        secondary_keywords: ["googlebot indexing rate", "faceted navigation seo", "xml sitemap hygiene"],
        search_intent: "Technical Diagnostic",
        competitor_gap: "Most guides don't address crawl traps created by faceted navigation and query parameter bloat.",
        backlink_target: "Google Search Central Crawling & Indexing Documentation",
        proposed_headline: "Crawl Budget Disasters: How Faceted Navigation Wipes Out Googlebot Indexing",
        content_brief: "Engineering guide to managing parameterized URLs, canonical consolidation, and robots.txt rules to ensure deep catalog indexing.",
        social_hook: "If Googlebot is spending 70% of its budget crawling duplicate filter pages, your newest products will never get indexed.",
      },
      {
        theme: "Omnichannel Social Repurposing",
        primary_keyword: "b2b content distribution engine",
        secondary_keywords: ["linkedin thought leadership", "x twitter thread strategy", "content repurposing"],
        search_intent: "Strategic Advisory",
        competitor_gap: "Brands post random quotes rather than restructuring long-form insights into platform-native formats.",
        backlink_target: "Demand Gen Report Content Preferences Survey",
        proposed_headline: "The Multi-Channel Distribution Engine: Turning 1 Technical Article into 10 High-Engagement Social Assets",
        content_brief: "Actionable playbook detailing how HelloShiva transforms a single long-form guide into LinkedIn carousels, X threads, and Reddit value discussions.",
        social_hook: "Writing the article is only 30% of the battle. Here is our 5-channel repurposing blueprint that turns 1 blog post into 50k impressions.",
      },
    ];

    const days = curatedThemes.map((t, idx) => {
      const curDate = new Date(tomorrow);
      curDate.setDate(tomorrow.getDate() + idx);
      const dateStr = `${months[curDate.getMonth()]} ${String(curDate.getDate()).padStart(2, "0")}, ${curDate.getFullYear()}`;
      const weekdayStr = weekdays[curDate.getDay()];

      return {
        day_number: idx + 1,
        date: dateStr,
        weekday: weekdayStr,
        theme: t.theme,
        primary_keyword: t.primary_keyword,
        secondary_keywords: t.secondary_keywords,
        search_intent: t.search_intent,
        competitor_gap: t.competitor_gap,
        backlink_target: t.backlink_target,
        proposed_headline: t.proposed_headline,
        content_brief: t.content_brief,
        social_hook: t.social_hook,
      };
    });

    return {
      calendar_title: "7-Day Strategic Content & SEO Distribution Pipeline",
      market,
      start_date: tomorrow.toISOString().split("T")[0],
      days,
    };
  }

  /**
   * 3. Generate High-Authority Article or Technical Dossier.
   */
  async generateArticle(params: {
    keywords: string;
    trend: string;
    market?: string;
    content_type?: string;
    service_anchor?: string;
    brief?: string;
    modelOverride?: string;
    mode?: "ai" | "template";
  }) {
    const keywords = (params.keywords || "b2b performance marketing").trim();
    const trend = (params.trend || "First-Party Data Attribution & Eliminating Budget Waste").trim();
    const market = params.market || "Global Remote & India B2B";
    const contentType = params.content_type || "article";
    const serviceAnchor = params.service_anchor || "/services/seo-services";
    const customBrief = params.brief || "";
    const isTemplateMode = params.mode === "template";

    const slug = keywords.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    if (this.isAiAvailable() && !isTemplateMode) {
      try {
        const model = this.getModelName(params.modelOverride);
        const prompt = `You are a Principal Technical SEO Director and Enterprise Editorial Strategist at HelloShiva (helloshiva.com), an elite digital marketing agency.
Generate an authoritative, humanized, original commercial guide based on this brief:
- Target Focus Keywords: ${keywords}
- Strategic Trend / Thesis: ${trend}
- Target Market / Audience: ${market}
- Format: ${contentType === "dossier" ? "Enterprise Technical Teardown Dossier" : "Market Authority Guide"}
- Custom Editorial Notes: ${customBrief}

CRITICAL EDITORIAL & HUMANIZATION RULES:
1. Tone: Authoritative, strategic, direct, and actionable. Write like an experienced agency partner speaking to founders, CMOs, and engineering leaders. Avoid shallow fluff, generic bullet dumps, or synthetic enthusiasm.
2. Formatting:
   - Do NOT output a top-level H1 hashtag (#) because the page layout already displays the title.
   - Do NOT use markdown separator lines (---).
   - Do NOT overuse bold asterisks (**like this**) across sentences; write clean, elegant prose.
   - Structure into 3–4 comprehensive main sections using ## Section Heading, with supporting ### Subsection headings.
3. Content Substance:
   - Detail concrete technical architectures, diagnostic workflows, and real-world implementation pitfalls.
   - Naturally weave in the focus keyword "${keywords}" with a natural density of 1.2%–2.0%.
   - Reference HelloShiva services (${serviceAnchor}, /services/technical-seo, /services/performance-marketing) and tools (/tools/seo-page-analyzer, /tools/http-headers-checker).
4. FAQ: Include a dedicated "## Frequently Asked Questions" section with 3 distinct questions and comprehensive, direct answers.
5. CTA: Conclude with an executive strategic action summary encouraging readers to discuss their digital roadmap with HelloShiva.`;

        const candidateModels = Array.from(
          new Set([model, "gemini-3.5-flash", "gemini-3.6-flash", "gemini-flash-latest", "gemini-pro-latest"])
        ).filter((m) => !m.includes("1.5"));

        for (const candidateModel of candidateModels) {
          try {
            const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${candidateModel}:generateContent?key=${this.getApiKey()}`;
            const res = await fetch(endpoint, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.7, maxOutputTokens: 3000 },
              }),
            });

            if (res.ok) {
              const data = await res.json();
              const parts = data.candidates?.[0]?.content?.parts || [];
              let generatedText = parts
                .map((p: any) => p.text)
                .filter(Boolean)
                .join("\n");

              if (generatedText && generatedText.trim().length > 200) {
                generatedText = generatedText
                  .replace(/^#\s+[^\n]+\n+/, "")
                  .replace(/\n---\n/g, "\n\n")
                  .trim();

                const wordCount = generatedText.split(/\s+/).filter(Boolean).length;
                const readTime = `${Math.max(1, Math.ceil(wordCount / 225))} min read`;

                return {
                  title: `The 2026 Strategic Blueprint: How to Master ${keywords.charAt(0).toUpperCase() + keywords.slice(1)}`,
                  slug,
                  category: "Market Insights",
                  excerpt: `Master ${keywords} with HelloShiva's strategic blueprint. Actionable technical frameworks, attribution clarity, and commercial scaling strategies.`,
                  content: generatedText,
                  read_time: readTime,
                  canonical_url: `https://helloshiva.com/blog/${slug}`,
                  model_used: `Google ${candidateModel} (Live AI Engine)`,
                };
              }
            } else {
              console.warn(`Model ${candidateModel} returned HTTP ${res.status}. Trying next available model...`);
            }
          } catch (mErr) {
            console.warn(`Error invoking Gemini model ${candidateModel}:`, mErr);
          }
        }
      } catch (err) {
        console.warn("Gemini article generation failed, falling back to deterministic template:", err);
      }
    }

    // High-quality deterministic fallback
    const fallbackCopy = `In high-growth digital marketing, sustainable commercial expansion is rarely achieved through ephemeral advertising hacks or superficial social media volume. Long-term market leadership consistently belongs to organizations that master ${keywords} through rigorous technical execution, clear search intent alignment, and high-performance web architecture.

## 1. Strategic Foundations: Why ${trend} Drives Measurable Revenue

For leadership teams operating across ${market}, capturing target customers at the exact moment of search discovery represents the difference between unsustainable customer acquisition costs and a compounding organic pipeline.

When prospective buyers explore solutions related to ${keywords}, they are not looking for high-level theory. They require reproducible operational frameworks that mitigate search volatility and align organic search equity with measurable revenue generation.

Strategic search visibility requires three synchronized pillars:
1. Technical Crawlability: Ensuring search engines can access and render core content without JavaScript or DOM bottlenecks.
2. Intent Satisfaction: Structuring copy, data tables, and diagrams to directly answer the user's commercial search query.
3. Conversion Architecture: Guiding qualified visitors seamlessly toward consultation booking or solution evaluation.

## 2. Technical Diagnostic Architecture for ${keywords}

Achieving durable competitive advantage requires auditing the code-level foundations that underpin user experience and crawler discovery.

### Eliminating Render-Blocking Bottlenecks
Web applications built on modern frameworks often incur severe DOM hydration penalties. When initial response times lag, both mobile user engagement and Google search crawl budgets deteriorate.

To diagnose performance bottlenecks:
- Audit server response headers and cache validation directives using our free [HTTP Headers Checker](/tools/http-headers-checker).
- Ensure critical above-the-fold stylesheets are inlined and secondary assets load asynchronously.
- Structure semantic HTML hierarchies to allow search crawlers to extract primary entities within milliseconds.

### Architectural Best Practices
Before scaling your editorial production, audit your URL parameters with our [SEO Page Analyzer](/tools/seo-page-analyzer) and verify crawler access rules in [Robots.txt Tester](/tools/robots-txt-tester).

## 3. Implementation Playbook and Roadmap

Executing an authoritative campaign around ${keywords} follows a disciplined four-stage cycle:

### Phase 1: Diagnostic Discovery and Entity Mapping
Identify the core search queries and technical bottlenecks across your existing domain. Group keywords by buyer journey stage, distinguishing informational queries from high-intent commercial terms.

### Phase 2: High-Performance Content Architecture
Develop comprehensive, authoritative resources that thoroughly satisfy user intent. Supplement prose with technical specifications, architecture diagrams, and structured data schemas.

### Phase 3: Internal Link Distribution and Equity Transfer
Connect related service pages and analytical guides through contextual internal links. For example, link relevant technical audits directly to [HelloShiva Technical SEO Services](/services/technical-seo) and [HelloShiva Performance Marketing](/services/performance-marketing).

### Phase 4: Full-Funnel Attribution Modeling
Configure server-side analytics and campaign tagging through our [UTM Campaign Builder](/tools/utm-builder). Connecting top-of-funnel discovery to qualified sales pipeline ensures marketing investments are attributed accurately.

## 4. Benchmark Performance Metrics

| Optimization Parameter | Industry Average | HelloShiva Enterprise Standard |
| --- | --- | --- |
| Largest Contentful Paint (LCP) | 3.4 seconds | Sub-1.2 seconds |
| Interaction to Next Paint (INP) | 280 milliseconds | Sub-150 milliseconds |
| Search Intent Alignment Score | 54% | 94%+ High Intent |
| Blended Customer Acquisition Cost | High Volatility | Compounding Reduction |

## Frequently Asked Questions

### Why is ${keywords} critical for long-term growth?
It captures high-intent commercial search volume without recurring per-click advertising costs, compounding market share and lowering customer acquisition costs over time.

### How long does it take to see measurable ranking gains?
Technical crawl and indexing optimizations reflect in 3 to 6 weeks, with compounding organic search pipeline maturing within 3 to 6 months.

### Can HelloShiva manage our end-to-end search architecture?
Yes. Our senior growth engineers manage everything from technical infrastructure audits to full-funnel attribution and commercial content scaling.

## Strategic Next Steps

Building compounding market leadership requires aligning technical web performance with commercial search intent. Explore our specialized services:
- [HelloShiva Performance Marketing](/services/performance-marketing)
- [HelloShiva Technical SEO Solutions](/services/technical-seo)
- [Explore 10 Free Engineering & Marketing Tools](/tools)

Contact our senior engineering team today to review your domain architecture and unlock sustainable organic pipeline.`;

    const wordCount = fallbackCopy.split(/\s+/).filter(Boolean).length;

    return {
      title: `The 2026 Strategic Blueprint: How to Master ${keywords.charAt(0).toUpperCase() + keywords.slice(1)}`,
      slug,
      category: "Market Insights",
      excerpt: `Master ${keywords} with HelloShiva's strategic blueprint. Actionable technical frameworks, attribution clarity, and commercial scaling strategies.`,
      content: fallbackCopy,
      read_time: `${Math.max(1, Math.ceil(wordCount / 225))} min read`,
      canonical_url: `https://helloshiva.com/blog/${slug}`,
      model_used: "Deterministic Agency Template Engine",
    };
  }

  /**
   * 4. Improve and re-optimize an existing article with AI.
   */
  async improveExistingContent(params: {
    articleId: string;
    goal: string;
    keywords?: string;
    modelOverride?: string;
  }) {
    const article = db.prepare("SELECT * FROM articles WHERE id = ?").get(params.articleId) as any;
    if (!article) {
      throw new Error(`Article with ID '${params.articleId}' not found.`);
    }

    const goal = params.goal.trim();
    const keywords = (params.keywords || "").trim();

    if (this.isAiAvailable()) {
      try {
        const model = this.getModelName(params.modelOverride);
        const prompt = `You are a Principal Technical SEO Director at HelloShiva.
Re-optimize and elevate this existing article to maximize commercial search ranking and CTR.

ARTICLE TITLE: ${article.title}
CURRENT EXCERPT: ${article.meta_description || article.excerpt}
CURRENT CONTENT:
${article.content_markdown || article.content}

ENHANCEMENT GOAL: ${goal}
KEYWORDS TO INJECT / OPTIMIZE: ${keywords || "Ensure focus keyword density of 1.5% and structured FAQ schema"}

RULES:
1. Do NOT output a top-level H1 tag (#).
2. Do NOT use markdown divider lines (---).
3. Do NOT use excessive bolding.
4. Elevate the content to be more authoritative, specific, and conversion-focused.
5. If the goal mentions FAQ schema, append an institutional "## Frequently Asked Questions" section with 3 clear questions and answers.
6. Provide a concise 2-sentence summary of what was improved.

Format strictly as JSON:
{
  "title": "Optimized article title",
  "excerpt": "Optimized 140-160 char meta description",
  "content": "Full enhanced article markdown",
  "improvements": ["Improvement 1", "Improvement 2", "Improvement 3"]
}

Return ONLY valid JSON.`;

        const aiResult = await this.callGeminiJson<any>(prompt, params.modelOverride);
        if (aiResult && aiResult.content) {
          return {
            success: true,
            title: aiResult.title || article.title,
            excerpt: aiResult.excerpt || article.meta_description,
            content: aiResult.content,
            improvements: aiResult.improvements || ["Enhanced semantic headings", "Injected structured FAQ schema"],
          };
        }
      } catch (err) {
        console.warn("Gemini article improvement failed, using rule-based enhancement:", err);
      }
    }

    // Rule-based fallback enhancement
    const faqBlock = `

## Frequently Asked Questions

### How does this strategy directly de-risk marketing investments?
Aligning technical infrastructure with high-intent commercial keywords eliminates wasted advertising spend and creates a durable, compounding organic pipeline.

### What is the recommended cadence for technical auditing?
We recommend bi-weekly automated health audits and comprehensive quarterly architecture reviews to identify crawl anomalies before they impact revenue.

### How can our team get started with an audit?
You can use HelloShiva's suite of [10 Free Marketing Tools](/tools) to analyze individual pages immediately, or contact our engineering team to book a dedicated architecture audit.`;

    const existingContent = (article.content_markdown || article.content || "").replace(/---/g, "");
    const updatedContent = existingContent.includes("Frequently Asked Questions")
      ? existingContent
      : existingContent + faqBlock;

    return {
      success: true,
      title: article.title,
      excerpt: article.meta_description || article.excerpt,
      content: updatedContent,
      improvements: [
        "Injected structured FAQ schema section",
        "Cleaned markdown syntax dividers",
        "Preserved core architectural research body",
      ],
    };
  }

  /**
   * 5. Save and publish article directly to website database.
   */
  async publishArticle(params: {
    id?: string;
    title: string;
    slug?: string;
    category?: string;
    excerpt?: string;
    content: string;
    read_time?: string;
    status?: "PUBLISHED" | "SCHEDULED" | "DRAFT_READY";
    scheduled_date?: string;
  }) {
    const title = params.title.trim();
    const slug = (params.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")).trim();
    const category = params.category || "Market Insights";
    const excerpt = (params.excerpt || `Strategic agency guide to ${title}.`).trim();
    const content = params.content.trim();
    const status = params.status || "PUBLISHED";
    const nowIso = new Date().toISOString();

    let articleId = params.id;

    if (articleId) {
      // Update existing
      db.prepare(`
        UPDATE articles 
        SET title = ?, slug = ?, category = ?, meta_description = ?, content_markdown = ?, status = ?, updated_at = ?, published_at = ?
        WHERE id = ?
      `).run(
        title,
        slug,
        category,
        excerpt,
        content,
        status,
        nowIso,
        status === "PUBLISHED" ? nowIso : null,
        articleId
      );
    } else {
      // Check if article with slug exists
      const existing = db.prepare("SELECT id FROM articles WHERE slug = ?").get(slug) as { id: string } | undefined;
      if (existing) {
        articleId = existing.id;
        db.prepare(`
          UPDATE articles 
          SET title = ?, category = ?, meta_description = ?, content_markdown = ?, status = ?, updated_at = ?, published_at = ?
          WHERE id = ?
        `).run(
          title,
          category,
          excerpt,
          content,
          status,
          nowIso,
          status === "PUBLISHED" ? nowIso : null,
          articleId
        );
      } else {
        articleId = `art-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        db.prepare(`
          INSERT INTO articles (
            id, title, slug, meta_description, category, content_markdown, current_version, status, author, created_at, updated_at, published_at
          ) VALUES (?, ?, ?, ?, ?, ?, 1, ?, 'HelloShiva Advisory Desk', ?, ?, ?)
        `).run(
          articleId,
          title,
          slug,
          excerpt,
          category,
          content,
          status,
          nowIso,
          nowIso,
          status === "PUBLISHED" ? nowIso : null
        );
      }
    }

    const canonicalUrl = `https://helloshiva.com/blog/${slug}`;

    return {
      success: true,
      message: status === "PUBLISHED" ? "Article successfully published live to website!" : "Article saved to drafts.",
      article_id: articleId,
      url: canonicalUrl,
      slug,
    };
  }

  /**
   * 6. Generate bespoke social media campaigns across 5 networks (X, LinkedIn, Facebook, Instagram, Reddit).
   */
  generateSocialCampaign(title: string, url: string, content: string, keywords: string = "Digital Marketing, SEO, Growth") {
    const cleanTitle = title.trim();
    const shortTitle = cleanTitle.length > 70 ? cleanTitle.substring(0, 67) + "..." : cleanTitle;
    const cleanUrl = url.trim() || `https://helloshiva.com/blog/${cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
    const cleanKeywords = keywords.split(",").map((k) => k.trim()).filter(Boolean);
    const kwHashtags = cleanKeywords.map((k) => `#${k.replace(/\s+/g, "")}`).slice(0, 4).join(" ");

    // 1. X.com (Twitter)
    const x_twitter = `⚡ ${shortTitle}

Key technical takeaways for growth leaders:
• 80%+ conversion intent alignment vs vanity traffic
• Eliminating DOM hydration and LCP latency
• First-party attribution without paid budget waste

Full engineering teardown 👇
${cleanUrl}

#DigitalMarketing #TechnicalSEO #GrowthMarketing #HelloShiva ${kwHashtags}`;

    // 2. LinkedIn (B2B Executive / Investor Advisory)
    const linkedin = `🏛️ [Executive Growth & Technical Strategy] ${cleanTitle}

In high-growth digital marketing, sustainable pipeline expansion is rarely built on vanity metrics or superficial advertising hacks.

Long-term market leadership consistently belongs to organizations that master ${keywords} through code-level performance, clear search intent alignment, and high-converting funnel architecture.

Key Takeaways for Marketing & Engineering Leaders:
• Technical Foundation: Why sub-second LCP and INP latency directly impact organic ranking and paid ad Quality Scores.
• Commercial Intent: How targeting bottom-of-funnel decision-makers drops customer acquisition costs (CAC).
• Attribution Clarity: Connecting search clicks directly to qualified revenue through fail-safe first-party data tracking.

Read our complete architectural breakdown:
👉 ${cleanUrl}

What is your team's biggest challenge when balancing organic search against paid customer acquisition cost? Let's discuss in the comments below.

#DigitalMarketing #B2BMarketing #SEOStrategy #WebEngineering #HelloShivaAgency ${kwHashtags}`;

    // 3. Facebook
    const facebook = `✨ Elevating Digital Growth: ${cleanTitle}

Looking to generate more qualified commercial leads from your website this quarter without burning your ad budget?

Our senior growth engineering team just published a comprehensive technical teardown on HelloShiva. Whether you are diagnosing Core Web Vitals latency or building high-intent organic funnels, this guide gives you actionable steps you can execute today.

Read the complete market breakdown:
🔗 ${cleanUrl}

#DigitalMarketing #SEO #HelloShiva #BusinessGrowth ${kwHashtags}`;

    // 4. Instagram (Carousel Guide + Caption)
    const instagram = `Slide 1: THE MACRO THESIS
${cleanTitle}

Slide 2: THE CORE BOTTLENECK
Why 80% of modern web applications suffer from crawl budget waste, hydration penalties, and high customer acquisition costs.

Slide 3: THE TECHNICAL FIX
Sub-second Largest Contentful Paint (LCP), flawless Interaction to Next Paint (INP), and structured JSON-LD FAQ schemas.

Slide 4: COMMERCIAL ATTRIBUTION
Mapping organic search intent directly to qualified demo bookings using server-side analytics.

Slide 5: TAKE ACTION TODAY
Audit your website in 60 seconds using HelloShiva's 10 Free Engineering & Marketing Tools. Link in bio.

---
CAPTION:
Vanity impressions do not pay payroll. Swipe through for the 4-step framework we use at HelloShiva to engineer compounding organic pipeline.

Save this post for your next quarterly website review! 🔖
Link in bio to read the full technical teardown.

#SEOStrategy #WebEngineering #DigitalMarketingTips #B2BGrowth #HelloShiva ${kwHashtags}`;

    // 5. Reddit (Community Deep Dive / Markdown)
    const reddit = `**Technical Teardown / Architecture: ${cleanTitle}**

Hey everyone on r/SEO and r/marketing,

I often see teams running into the same trap when scaling organic traffic: spending heavily on content production while ignoring the underlying code-level bottlenecks that prevent search engine crawlers from properly indexing topical relevance.

Here are 4 specific technical observations from our recent platform benchmarks:

1. **Heading Trees Outweigh Keyword Density:** Skipping from H1 directly to H3 or overusing generic bold tags confuses semantic entity parsing. Always maintain clean H1 -> H2 -> H3 hierarchy.
2. **TTFB and Edge Response Headers:** If your server Time to First Byte exceeds 600ms, Googlebot spends its crawl allocation waiting on server threads rather than indexing new articles.
3. **Structured FAQ Schema:** Enforcing valid FAQPage JSON-LD schemas remains one of the most consistent ways to claim high-CTR SERP real estate without building hundreds of backlinks.
4. **Bottom-of-Funnel Conversion Architecture:** Connecting informational guides back to high-intent commercial service pages creates natural link equity circulation and books actual qualified pipeline.

Full breakdown with code examples:
${cleanUrl}

Happy to answer any questions about technical audits or crawl architecture in the comments below!`;

    const share_urls = {
      x_twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(x_twitter)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(cleanUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(cleanUrl)}`,
      reddit: `https://www.reddit.com/submit?title=${encodeURIComponent(cleanTitle)}&text=${encodeURIComponent(reddit)}`,
    };

    return {
      channels: {
        x_twitter,
        linkedin,
        facebook,
        instagram,
        reddit,
      },
      share_urls,
    };
  }
}

export const contentStudioService = new ContentStudioService();
