import db from "@/lib/db";

export interface CalendarEntry {
  id: string;
  scheduled_date: string;
  theme: string;
  primary_keyword: string;
  supporting_keywords: string;
  search_intent: string;
  competitor_gap_notes: string;
  suggested_headline: string;
  content_format: string;
  target_audience: string;
  suggested_internal_links: string;
  suggested_cta: string;
  status: "PROPOSED" | "APPROVED" | "REJECTED" | "IN_DRAFTING";
}

/**
 * Generates a structured 7-day editorial calendar proposals based on HelloShiva's strategic priorities.
 */
export function generateSevenDayCalendar(startDate?: string): CalendarEntry[] {
  const baseDate = startDate ? new Date(startDate) : new Date();
  
  const calendarTemplates = [
    {
      theme: "Core Web Vitals & Technical Speed",
      primary_keyword: "core web vitals optimization guide",
      supporting_keywords: "INP, LCP, CLS, nextjs performance, speed audit",
      search_intent: "Informational",
      competitor_gap_notes: "Competitors only explain definitions. Our guide must offer code-level Next.js and server header fixes.",
      suggested_headline: "The 2026 Core Web Vitals Blueprint: How to Achieve Sub-Second LCP and Flawless INP",
      content_format: "Technical Deep-Dive",
      target_audience: "CTOs, Technical Marketers & Web Developers",
      suggested_internal_links: "/services/technical-seo, /tools/http-headers-checker",
      suggested_cta: "Book a Comprehensive Web Performance Audit with HelloShiva",
    },
    {
      theme: "Local Search Domination",
      primary_keyword: "local seo 3 pack strategy",
      supporting_keywords: "google business profile, local citations, service area business",
      search_intent: "Commercial",
      competitor_gap_notes: "Most articles overlook multi-location citation consistency and review velocity scripts.",
      suggested_headline: "How to Own the Local 3-Pack: A Step-by-Step Playbook for Service Businesses",
      content_format: "Strategic Playbook",
      target_audience: "Local Business Owners & Multi-Location Operators",
      suggested_internal_links: "/services/local-seo, /tools/serp-preview",
      suggested_cta: "Explore HelloShiva Local SEO Packages",
    },
    {
      theme: "Attribution & Paid Performance",
      primary_keyword: "utm campaign tracking architecture",
      supporting_keywords: "ga4 tracking, campaign parameters, paid ad attribution, cac",
      search_intent: "Informational",
      competitor_gap_notes: "Lack of clear naming conventions causing messy GA4 reporting.",
      suggested_headline: "Mastering Campaign Attribution: How to Build a Fail-Safe UTM Architecture",
      content_format: "Practical Guide & Spreadsheet Template",
      target_audience: "PPC Managers & Growth Directors",
      suggested_internal_links: "/services/performance-marketing, /tools/utm-builder",
      suggested_cta: "Consult HelloShiva on Full-Funnel Attribution Modeling",
    },
    {
      theme: "Crawl Architecture & Indexing",
      primary_keyword: "robots txt vs access control",
      supporting_keywords: "crawl budget, index coverage, googlebot disallow, sitemaps",
      search_intent: "Informational",
      competitor_gap_notes: "Companies accidentally de-indexing pages during staging migrations.",
      suggested_headline: "Robots.txt Disasters: 5 Migration Mistakes That Wipe Out Organic Rankings",
      content_format: "Case Study & Checklist",
      target_audience: "Webmasters, SEO Engineers, Product Managers",
      suggested_internal_links: "/services/technical-seo, /tools/robots-txt-tester",
      suggested_cta: "Request a Technical Pre-Migration Crawl Audit",
    },
    {
      theme: "Content Strategy & Commercial Intent",
      primary_keyword: "b2b content marketing roi",
      supporting_keywords: "bottom of funnel content, pipeline velocity, case study format",
      search_intent: "Commercial",
      competitor_gap_notes: "Focusing strictly on top-of-funnel traffic instead of sales qualification.",
      suggested_headline: "Beyond Traffic: How to Structure High-Intent Editorial That Books Demos",
      content_format: "Executive Framework",
      target_audience: "Founders, CMOs & Marketing Leaders",
      suggested_internal_links: "/services/content-marketing, /tools/keyword-density-checker",
      suggested_cta: "Partner with HelloShiva for Commercial Content Strategy",
    },
    {
      theme: "Social Distribution & Executive Branding",
      primary_keyword: "b2b linkedin thought leadership strategy",
      supporting_keywords: "content repurposing, carousel design, organic distribution",
      search_intent: "Informational",
      competitor_gap_notes: "Most brands post generic quotes without proprietary perspective.",
      suggested_headline: "The Multi-Channel Distribution Engine: Turning 1 Long-Form Article into 10 Social Assets",
      content_format: "Repurposing Blueprint",
      target_audience: "Founders & Brand Strategists",
      suggested_internal_links: "/services/social-media-marketing, /tools/open-graph-preview",
      suggested_cta: "Explore HelloShiva Executive Social Management",
    },
    {
      theme: "Conversion Rate Optimization (CRO)",
      primary_keyword: "high converting landing page architecture",
      supporting_keywords: "lead capture forms, bounce rate reduction, headline optimization",
      search_intent: "Commercial",
      competitor_gap_notes: "Generic advice like 'change button color' instead of buyer friction reduction.",
      suggested_headline: "The Anatomy of a 12% Converting Agency Landing Page: Real UX Teardowns",
      content_format: "Visual Teardown & Wireframe Guide",
      target_audience: "Growth Marketers & Digital Agency Clients",
      suggested_internal_links: "/services/web-design-development, /contact",
      suggested_cta: "Get a Conversion Rate Audit of Your Primary Landing Page",
    },
  ];

  const entries: CalendarEntry[] = [];
  const insertStmt = db.prepare(`
    INSERT INTO editorial_calendar (
      id, scheduled_date, theme, primary_keyword, supporting_keywords, search_intent,
      competitor_gap_notes, suggested_headline, content_format, target_audience,
      suggested_internal_links, suggested_cta, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'PROPOSED')
  `);

  for (let i = 0; i < calendarTemplates.length; i++) {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() + i + 1);
    const dateStr = d.toISOString().split("T")[0];
    const template = calendarTemplates[i];
    const id = `cal-${Date.now()}-${i}`;

    const entry: CalendarEntry = {
      id,
      scheduled_date: dateStr,
      ...template,
      status: "PROPOSED",
    };

    insertStmt.run(
      entry.id,
      entry.scheduled_date,
      entry.theme,
      entry.primary_keyword,
      entry.supporting_keywords,
      entry.search_intent,
      entry.competitor_gap_notes,
      entry.suggested_headline,
      entry.content_format,
      entry.target_audience,
      entry.suggested_internal_links,
      entry.suggested_cta
    );

    entries.push(entry);
  }

  return entries;
}

export function getCalendarEntries(): CalendarEntry[] {
  return db.prepare("SELECT * FROM editorial_calendar ORDER BY scheduled_date ASC").all() as CalendarEntry[];
}
