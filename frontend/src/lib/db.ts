import path from "path";
import fs from "fs";

interface TableData {
  enquiries: any[];
  lead_activities: any[];
  lead_followups: any[];
  feature_flags: any[];
  keyword_opportunities: any[];
  topic_clusters: any[];
  content_briefs: any[];
  editorial_calendar: any[];
  articles: any[];
  article_versions: any[];
  article_sources: any[];
  seo_audits: any[];
  social_posts: any[];
  social_campaigns: any[];
  offpage_opportunities: any[];
  content_analytics: any[];
  lead_attributions: any[];
  content_activity_logs: any[];
  integration_settings: any[];
  admin_users: any[];
  client_audits: any[];
}

const dbDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const jsonDbPath = path.join(dbDir, "helloshiva.json");

// In-Memory store with file-sync
class JsonDatabase {
  private data: TableData;

  constructor() {
    this.data = this.loadData();
    this.seedDefaults();
  }

  private loadData(): TableData {
    try {
      if (fs.existsSync(jsonDbPath)) {
        const raw = fs.readFileSync(jsonDbPath, "utf-8");
        const parsed = JSON.parse(raw);
        return {
          enquiries: parsed.enquiries || [],
          lead_activities: parsed.lead_activities || [],
          lead_followups: parsed.lead_followups || [],
          feature_flags: parsed.feature_flags || [],
          keyword_opportunities: parsed.keyword_opportunities || [],
          topic_clusters: parsed.topic_clusters || [],
          content_briefs: parsed.content_briefs || [],
          editorial_calendar: parsed.editorial_calendar || [],
          articles: parsed.articles || [],
          article_versions: parsed.article_versions || [],
          article_sources: parsed.article_sources || [],
          seo_audits: parsed.seo_audits || [],
          social_posts: parsed.social_posts || [],
          social_campaigns: parsed.social_campaigns || [],
          offpage_opportunities: parsed.offpage_opportunities || [],
          content_analytics: parsed.content_analytics || [],
          lead_attributions: parsed.lead_attributions || [],
          content_activity_logs: parsed.content_activity_logs || [],
          integration_settings: parsed.integration_settings || [],
          admin_users: parsed.admin_users || [],
          client_audits: parsed.client_audits || [],
        };
      }
    } catch (e) {
      console.error("Failed to parse jsonDbPath, initializing fresh store:", e);
    }
    return {
      enquiries: [],
      lead_activities: [],
      lead_followups: [],
      feature_flags: [],
      keyword_opportunities: [],
      topic_clusters: [],
      content_briefs: [],
      editorial_calendar: [],
      articles: [],
      article_versions: [],
      article_sources: [],
      seo_audits: [],
      social_posts: [],
      social_campaigns: [],
      offpage_opportunities: [],
      content_analytics: [],
      lead_attributions: [],
      content_activity_logs: [],
      integration_settings: [],
      admin_users: [],
      client_audits: [],
    };
  }

  private save() {
    try {
      const tempPath = `${jsonDbPath}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(this.data, null, 2), "utf-8");
      fs.renameSync(tempPath, jsonDbPath);
    } catch (e) {
      console.error("Failed to persist JSON DB:", e);
    }
  }

  private seedDefaults() {
    let modified = false;

    // 1. Feature flags
    if (!this.data.feature_flags || this.data.feature_flags.length === 0) {
      this.data.feature_flags = [
        { key: "CONTENT_ENGINE_ENABLED", enabled: 1, description: "Master switch for the Content Engine" },
        { key: "SEO_RESEARCH_ENABLED", enabled: 1, description: "Enable keyword research providers" },
        { key: "KEYWORD_SCANNER_ENABLED", enabled: 1, description: "Enable periodic keyword scanner" },
        { key: "EDITORIAL_CALENDAR_ENABLED", enabled: 1, description: "Enable 7-day editorial calendar planning" },
        { key: "GEMINI_DRAFTING_ENABLED", enabled: 1, description: "Enable AI article drafting with Gemini API" },
        { key: "CONTENT_IMPROVEMENT_ENABLED", enabled: 1, description: "Enable existing article improvement analysis" },
        { key: "SEO_OPTIMIZATION_ENABLED", enabled: 1, description: "Enable SEO review checklist" },
        { key: "SOCIAL_DISTRIBUTION_ENABLED", enabled: 1, description: "Enable multi-channel social distribution" },
        { key: "SCHEDULED_RESEARCH_ENABLED", enabled: 0, description: "Enable background scheduled research" },
        { key: "AUTOMATIC_PUBLISHING_ENABLED", enabled: 0, description: "LOCKED: Automatic production publishing" },
      ];
      modified = true;
    }

    // 2. Admin user
    if (!this.data.admin_users || this.data.admin_users.length === 0) {
      this.data.admin_users = [
        {
          id: "admin-1",
          email: "admin@helloshiva.com",
          password: "admin", // simple initial pass
          name: "HelloShiva Lead Administrator",
          role: "SUPER_ADMIN",
          created_at: new Date().toISOString(),
        },
      ];
      modified = true;
    }

    // 3. Seed initial published articles if none exist
    if (!this.data.articles || this.data.articles.length === 0) {
      this.data.articles = [
        {
          id: "art-seed-1",
          calendar_id: null,
          title: "Why Technical SEO is the Non-Negotiable Foundation for Content Success",
          slug: "why-technical-seo-is-the-prerequisite-for-content-success",
          meta_description: "Discover why technical SEO must precede content scaling. Learn how DOM rendering bottlenecks, crawl budget waste, and schema errors derail search rankings.",
          category: "Technical SEO & Web Engineering",
          outline: ["The Cost of Broken Technical Architecture", "DOM Rendering Bottlenecks", "Crawl Budget Optimization", "Actionable Technical Checklist", "Frequently Asked Questions"],
          content_markdown: `# Why Technical SEO is the Non-Negotiable Foundation for Content Success

In modern digital marketing, content strategy is frequently treated in a vacuum. Marketing executives commit significant budgets to editorial calendars, freelance writers, and content generation engines. Yet months later, organic search traffic remains flat.

The diagnosis is almost always identical: **the website has structural, code-level technical SEO bottlenecks that prevent Googlebot from efficiently discovering, rendering, and indexing pages.**

---

## 1. The Rendering Gap: Why Content Quality Means Nothing to an Unrendered DOM

Search engines do not read your website like human visitors. Before an algorithm can evaluate topical depth or keyword relevance, it must complete two computationally expensive stages:
1. **HTTP Fetching & Crawl Budget Allocation**
2. **JavaScript Execution & DOM Tree Construction**

When modern web applications overload the browser with massive JavaScript client bundles, search engine rendering queues get delayed by days or weeks. If your canonical tags, structured data, or primary headings rely on client-side state resolution, search crawlers frequently index an incomplete DOM.

> 💡 **HelloShiva Strategic Tip:** Never rely exclusively on client-side rendering for indexable pages. Implement Server-Side Rendering (SSR) or Static Site Generation (SSG) with incremental static revalidation. You can audit your live headers and status codes using our free [HTTP Headers Checker](/tools/http-headers-checker).

---

## 2. Eliminating Crawl Budget Waste Across Commercial Architectures

For websites with hundreds or thousands of pages, crawl budget allocation directly influences how quickly your revenue-generating content ranks. Common issues include:

* **Infinite URL Parameter Traps:** Dynamic sorting and filtering URLs without canonicalization directives.
* **Orphaned Content Clusters:** Articles published without contextual internal links from authoritative service pages.
* **Malformed Robots Directives:** Accidentally blocking CSS or JavaScript assets that Googlebot requires to determine mobile responsiveness.

Before launching an aggressive content marketing campaign, verify your crawler rules with our [Robots.txt Tester](/tools/robots-txt-tester) and audit URL hierarchies with the [SEO Page Analyzer](/tools/seo-page-analyzer).

---

## 3. The 4-Step Technical SEO Prerequisite Checklist

Before scaling your content output, ensure your engineering team verifies these four benchmarks:

1. **Sub-2.5s Largest Contentful Paint (LCP):** Eliminate render-blocking stylesheets and prioritize critical hero images.
2. **Strict Semantic Heading Hierarchy:** Ensure each document features exactly one authoritative \`<h1>\` tag supported by structured \`<h2>\` and \`<h3>\` sections. Test this using our [Heading Structure Checker](/tools/heading-checker).
3. **Valid JSON-LD Schema Markup:** Explicitly declare Article, Organization, and FAQPage schemas to claim rich Google search snippets.
4. **Contextual Internal Linking Architecture:** Every informative article must connect back to high-intent commercial service offerings, such as [HelloShiva Technical SEO Services](/services/technical-seo) or [Performance Marketing Management](/services/performance-marketing).

---

## Frequently Asked Questions

### Why does technical SEO matter if our content is already top tier?
Even world-class content cannot rank if search engine spiders encounter 5xx server timeouts, conflicting canonical tags, or slow JavaScript execution queues. Technical SEO ensures search engines can effortlessly parse and trust your content.

### How often should an agency audit technical search health?
At HelloShiva, we recommend bi-weekly automated health audits and comprehensive quarterly architecture reviews to identify crawl anomalies before they impact revenue.

### What is the fastest way to get started with an audit?
You can use HelloShiva's suite of [10 Free Marketing Tools](/tools) to analyze individual pages immediately, or contact our engineering team to book a dedicated architecture audit.

---

> 🚀 **Ready to scale your organic search pipeline?**  
> Explore our full [Technical SEO Architecture Services](/services/technical-seo) or [Schedule a Free Strategy Consultation](/contact) with our senior growth engineers today.
`,
          current_version: 1,
          status: "PUBLISHED",
          author: "HelloShiva Strategic Engineering",
          created_at: "2026-10-25T10:00:00.000Z",
          updated_at: "2026-10-31T08:00:00.000Z",
          published_at: "2026-10-25T12:00:00.000Z",
        },
        {
          id: "art-seed-2",
          calendar_id: null,
          title: "The 2026 Core Web Vitals Blueprint: How to Achieve Sub-Second LCP and Flawless INP",
          slug: "the-2026-core-web-vitals-blueprint",
          meta_description: "Master Core Web Vitals in 2026 with HelloShiva's engineering guide. Fix Interaction to Next Paint (INP) latency and optimize Largest Contentful Paint (LCP).",
          category: "Core Web Vitals & Web Engineering",
          outline: ["Understanding the 2026 Metrics", "Diagnosing INP Bottlenecks", "Server Response & LCP", "The Conversion Connection", "FAQ"],
          content_markdown: `# The 2026 Core Web Vitals Blueprint: How to Achieve Sub-Second LCP and Flawless INP

Google's search algorithm prioritizes real-world user experience above vanity design. With Interaction to Next Paint (INP) established as a core ranking signal, enterprise websites can no longer hide behind synthetic Lighthouse scores.

When users tap a checkout button, expand an FAQ accordion, or filter product categories, unresponsive UI threads directly damage both search visibility and conversion rates.

---

## 1. Interaction to Next Paint (INP): Why Milliseconds Equal Millions

Unlike the older First Input Delay (FID) which only measured initial page load, **Interaction to Next Paint (INP) monitors all user interactions throughout the entire lifecycle of a session.**

If your web application runs heavy event handlers, long-running JavaScript loops, or unthrottled DOM mutations on user clicks, INP climbs above Google's 200ms threshold into "Poor" territory.

### Key Strategies to Optimize INP:
* **Yield to the Main Thread:** Break up long tasks using \`requestAnimationFrame()\` or \`scheduler.yield()\`.
* **Offload Heavy Computation:** Utilize Web Workers for client-side data sorting and filtering.
* **Debounce Form Validation:** Never trigger heavy recalculations on every single keystroke.

---

## 2. Achieving Sub-Second Largest Contentful Paint (LCP)

Largest Contentful Paint measures perceived load speed. Google recommends an LCP under 2.5 seconds, but high-performing commercial websites target **under 1.2 seconds**.

To achieve this:
1. **Host Critical Assets on Edge CDNs:** Serve HTML and core assets from nodes geographically closest to your visitor.
2. **Preload Hero Elements:** Use \`<link rel="preload" as="image">\` for top-of-page hero banners.
3. **Eliminate Render-Blocking CSS:** Inline critical above-the-fold CSS and asynchronously load secondary typography.

You can verify your server response headers and cache validation directives using our free [HTTP Headers Checker](/tools/http-headers-checker).

---

## 3. How Core Web Vitals Directly Impact Conversion Rates

A 100ms improvement in page speed typically yields a 1.1% to 8.4% increase in e-commerce checkout completion and lead form submissions. Speed is not simply an engineering metric—it is a core driver of return on advertising spend (ROAS).

When running paid Google or Meta campaigns, high latency inflates bounce rates, effectively burning your acquisition budget. Learn how our team aligns ad traffic with high-speed landing pages through [HelloShiva Performance Marketing](/services/performance-marketing).

---

## Frequently Asked Questions

### What is a good INP score according to Google?
A good INP score is **200 milliseconds or less**. Scores between 200ms and 500ms need improvement, while interactions exceeding 500ms are classified as poor.

### How do Core Web Vitals affect Google Ads Quality Score?
Google Ads landing page experience score directly incorporates load speed and mobile interactivity. Faster landing pages result in lower Cost-Per-Click (CPC) and higher ad placements.

### Can HelloShiva help re-engineer our website for speed?
Yes. Our web engineering team builds custom Next.js architectures that achieve 95+ Core Web Vitals scores by default. Explore our [Web Development Services](/services/web-development).

---

> 💼 **Transform your web performance into revenue.**  
> [Contact HelloShiva Web Engineering](/contact) for a detailed technical audit and speed optimization plan.
`,
          current_version: 1,
          status: "PUBLISHED",
          author: "HelloShiva Strategic Engineering",
          created_at: "2026-10-27T10:00:00.000Z",
          updated_at: "2026-10-31T09:00:00.000Z",
          published_at: "2026-10-27T12:00:00.000Z",
        },
      ];
      modified = true;
    }

    if (!this.data.enquiries || this.data.enquiries.length === 0) {
      this.data.enquiries = [
        {
          id: "enq-101",
          name: "Rohit Verma",
          email: "rohit@edutechgrowth.in",
          phone: "+91 98112 45890",
          company: "EduTech Growth Labs",
          service: "Technical SEO & Core Web Vitals",
          message: "Our JEE test prep portal experiences high INP latency during peak mock tests. We need an end-to-end technical SEO and Core Web Vitals audit.",
          source_page: "/services/technical-seo",
          referrer: "https://google.com",
          utm_source: "google",
          utm_medium: "cpc",
          utm_campaign: "technical-seo-q4",
          status: "WORKING",
          stage: "WORKING",
          qualification_score: "HOT",
          timeline: "Urgent (< 1 week)",
          qualification_notes: "Strong budget. Looking to launch revamped portal before December enrollment cycle.",
          last_contacted_at: "2026-10-31T06:30:00.000Z",
          created_at: "2026-10-30T14:20:00.000Z",
          notes: "Initial consultation call held. Agreed on Next.js hydration optimization roadmap.",
        },
        {
          id: "enq-102",
          name: "Meera Sen",
          email: "meera.sen@finpeak.co",
          phone: "+91 98730 11234",
          company: "FinPeak Wealth Advisory",
          service: "Performance Marketing & PPC",
          message: "Looking for high-intent Google Ads management for ultra-HNW wealth management in Delhi NCR.",
          source_page: "/services/performance-marketing",
          referrer: "https://linkedin.com",
          utm_source: "linkedin",
          utm_medium: "organic",
          utm_campaign: "hnw-growth",
          status: "NEW",
          stage: "NEW",
          qualification_score: "WARM",
          timeline: "1-2 Weeks",
          qualification_notes: "Inbound via LinkedIn case study on ROAS.",
          last_contacted_at: null,
          created_at: "2026-10-31T05:15:00.000Z",
          notes: "",
        },
      ];
      modified = true;
    }

    if (!this.data.lead_activities || this.data.lead_activities.length === 0) {
      this.data.lead_activities = [
        {
          id: "act-1",
          inquiry_id: "enq-101",
          author: "Sudhir (Agency Director)",
          action: "call_logged",
          note: "Phone consultation with Rohit Verma. Reviewed Google Search Console INP issues. Verified that client has engineering team ready to execute SSR fixes.",
          old_stage: "NEW",
          new_stage: "WORKING",
          created_at: "2026-10-30T16:00:00.000Z",
        },
        {
          id: "act-2",
          inquiry_id: "enq-101",
          author: "HelloShiva Lead Strategist",
          action: "whatsapp_sent",
          note: "Shared HelloShiva 2026 Core Web Vitals Benchmark case study via WhatsApp.",
          old_stage: "WORKING",
          new_stage: "WORKING",
          created_at: "2026-10-30T17:30:00.000Z",
        },
      ];
      modified = true;
    }

    if (!this.data.lead_followups || this.data.lead_followups.length === 0) {
      this.data.lead_followups = [
        {
          id: "fol-1",
          inquiry_id: "enq-101",
          type: "meeting",
          title: "Technical SEO Scope & Retainer Presentation",
          notes: "Present sub-second LCP roadmap and monthly advisory fee to EduTech board.",
          due_at: "2026-11-02T11:00:00.000Z",
          priority: "high",
          status: "pending",
          completed_at: null,
          created_at: "2026-10-30T17:35:00.000Z",
        },
      ];
      modified = true;
    }

    if (modified) {
      this.save();
    }
  }

  public pragma(_query: string) {
    return this;
  }

  public exec(_query: string) {
    return this;
  }

  public prepare(query: string) {
    const trimmed = query.trim().replace(/\s+/g, " ");

    return {
      all: (...params: any[]) => this.executeAll(trimmed, params),
      get: (...params: any[]) => this.executeGet(trimmed, params),
      run: (...params: any[]) => this.executeRun(trimmed, params),
    };
  }

  private executeAll(sql: string, params: any[]): any[] {
    const s = sql.toLowerCase();

    // 1. SELECT * FROM enquiries ORDER BY created_at DESC
    if (s.includes("from enquiries")) {
      return [...(this.data.enquiries || [])].sort((a, b) =>
        (b.created_at || "").localeCompare(a.created_at || "")
      );
    }

    // lead_activities
    if (s.includes("from lead_activities")) {
      let list = [...(this.data.lead_activities || [])];
      if (s.includes("where inquiry_id = ?")) {
        const [inqId] = params;
        list = list.filter((a) => a.inquiry_id === inqId);
      }
      return list.sort((a, b) => (b.created_at || "").localeCompare(a.created_at || ""));
    }

    // lead_followups
    if (s.includes("from lead_followups")) {
      let list = [...(this.data.lead_followups || [])];
      if (s.includes("where inquiry_id = ?")) {
        const [inqId] = params;
        list = list.filter((f) => f.inquiry_id === inqId);
      }
      return list.sort((a, b) => (a.due_at || "").localeCompare(b.due_at || ""));
    }

    // 2. SELECT * FROM articles
    if (s.includes("from articles")) {
      let list = [...(this.data.articles || [])];
      if (s.includes("status = 'published'")) {
        list = list.filter((a) => a.status === "PUBLISHED");
      } else if (s.includes("status = 'approved'")) {
        list = list.filter((a) => a.status === "APPROVED");
      } else if (s.includes("status = 'draft_ready'")) {
        list = list.filter((a) => a.status === "DRAFT_READY");
      } else if (s.includes("status = 'scheduled'")) {
        list = list.filter((a) => a.status === "SCHEDULED");
      }
      list.sort((a, b) => (b.updated_at || b.created_at || "").localeCompare(a.updated_at || a.created_at || ""));
      if (s.includes("limit 5")) {
        return list.slice(0, 5);
      }
      if (s.includes("limit 3")) {
        return list.slice(0, 3);
      }
      return list;
    }

    // 3. SELECT * FROM editorial_calendar ORDER BY scheduled_date ASC
    if (s.includes("from editorial_calendar")) {
      const list = [...(this.data.editorial_calendar || [])].sort((a, b) =>
        (a.scheduled_date || "").localeCompare(b.scheduled_date || "")
      );
      if (s.includes("limit 5")) {
        return list.slice(0, 5);
      }
      return list;
    }

    // 4. SELECT * FROM keyword_opportunities
    if (s.includes("from keyword_opportunities")) {
      return [...(this.data.keyword_opportunities || [])]
        .sort((a, b) => (b.created_at || "").localeCompare(a.created_at || ""))
        .slice(0, 50);
    }

    // 5. SELECT * FROM feature_flags
    if (s.includes("from feature_flags")) {
      return [...(this.data.feature_flags || [])];
    }

    // 6. SELECT * FROM integration_settings
    if (s.includes("from integration_settings")) {
      return [...(this.data.integration_settings || [])];
    }

    // 7. SELECT * FROM social_posts
    if (s.includes("from social_posts")) {
      return [...(this.data.social_posts || [])];
    }

    // 8. SELECT * FROM client_audits
    if (s.includes("from client_audits")) {
      return [...(this.data.client_audits || [])].sort((a, b) =>
        (b.timestamp || "").localeCompare(a.timestamp || "")
      );
    }

    return [];
  }

  private executeGet(sql: string, params: any[]): any {
    const s = sql.toLowerCase();

    // Counts: SELECT count(*) as cnt FROM ...
    if (s.includes("count(*) as cnt from")) {
      if (s.includes("from keyword_opportunities")) {
        return { cnt: (this.data.keyword_opportunities || []).length };
      }
      if (s.includes("from editorial_calendar")) {
        return { cnt: (this.data.editorial_calendar || []).length };
      }
      if (s.includes("from articles")) {
        if (s.includes("status = 'approved'")) {
          return { cnt: (this.data.articles || []).filter((a) => a.status === "APPROVED").length };
        }
        if (s.includes("status = 'published'")) {
          return { cnt: (this.data.articles || []).filter((a) => a.status === "PUBLISHED").length };
        }
        return { cnt: (this.data.articles || []).length };
      }
      if (s.includes("from social_posts")) {
        return { cnt: (this.data.social_posts || []).length };
      }
      if (s.includes("from enquiries")) {
        return { cnt: (this.data.enquiries || []).length };
      }
      if (s.includes("from feature_flags")) {
        return { cnt: (this.data.feature_flags || []).length };
      }
      return { cnt: 0 };
    }

    // SELECT * FROM articles WHERE slug = ?
    if (s.includes("from articles where slug =")) {
      const slugVal = params[0] || (sql.match(/slug = '([^']+)'/i)?.[1] ?? "");
      return (this.data.articles || []).find((a) => a.slug === slugVal);
    }

    // SELECT * FROM articles WHERE id = ?
    if (s.includes("from articles where id =")) {
      const idVal = params[0] || (sql.match(/id = '([^']+)'/i)?.[1] ?? "");
      return (this.data.articles || []).find((a) => a.id === idVal);
    }

    // SELECT * FROM admin_users WHERE email = ? AND password = ?
    if (s.includes("from admin_users where email =")) {
      const email = params[0];
      const pass = params[1];
      const user = (this.data.admin_users || []).find((u) => u.email === email);
      if (user && (!pass || user.password === pass)) {
        return user;
      }
      return undefined;
    }

    // SELECT value FROM integration_settings WHERE key = ...
    if (s.includes("from integration_settings where key =")) {
      const keyVal = params[0] || (sql.match(/key = '([^']+)'/i)?.[1] ?? "");
      const setting = (this.data.integration_settings || []).find((s) => s.key === keyVal);
      return setting ? { value: setting.value } : undefined;
    }

    const all = this.executeAll(sql, params);
    return all.length > 0 ? all[0] : undefined;
  }

  private executeRun(sql: string, params: any[]): { changes: number; lastInsertRowid: number } {
    const s = sql.toLowerCase();
    let changes = 0;

    // 1. INSERT INTO enquiries
    if (s.includes("insert into enquiries")) {
      const [
        id, name, email, phone, company, service, message,
        source_page, referrer, utm_source, utm_medium, utm_campaign
      ] = params;
      this.data.enquiries.push({
        id,
        created_at: new Date().toISOString(),
        name, email, phone, company, service, message,
        source_page, referrer, utm_source, utm_medium, utm_campaign,
        status: "NEW",
        stage: "NEW",
        qualification_score: "WARM",
        timeline: "1-2 Weeks",
        qualification_notes: "",
        last_contacted_at: null,
        notes: "",
      });
      changes = 1;
    }

    // INSERT INTO lead_activities
    else if (s.includes("insert into lead_activities")) {
      const [id, inquiry_id, author, action, note, old_stage, new_stage] = params;
      this.data.lead_activities.push({
        id: id || `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        inquiry_id,
        author: author || "Agency Admin",
        action: action || "note_added",
        note,
        old_stage: old_stage || null,
        new_stage: new_stage || null,
        created_at: new Date().toISOString(),
      });
      changes = 1;
    }

    // INSERT INTO lead_followups
    else if (s.includes("insert into lead_followups")) {
      const [id, inquiry_id, type, title, notes, due_at, priority] = params;
      this.data.lead_followups.push({
        id: id || `fol-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        inquiry_id,
        type: type || "phone_call",
        title: title || "Scheduled Follow-up",
        notes: notes || "",
        due_at: due_at || new Date(Date.now() + 86400000).toISOString(),
        priority: priority || "medium",
        status: "pending",
        completed_at: null,
        created_at: new Date().toISOString(),
      });
      changes = 1;
    }

    // UPDATE lead_followups
    else if (s.includes("update lead_followups")) {
      if (s.includes("set status = ?, completed_at = ? where id = ?")) {
        const [status, completed_at, id] = params;
        const fol = this.data.lead_followups.find((f) => f.id === id);
        if (fol) {
          fol.status = status;
          fol.completed_at = completed_at;
          changes = 1;
        }
      }
    }

    // 2. UPDATE enquiries
    else if (s.includes("update enquiries")) {
      if (s.includes("set status = ? where id = ?")) {
        const [status, id] = params;
        const item = this.data.enquiries.find((e) => e.id === id);
        if (item) {
          item.status = status;
          item.stage = status;
          changes = 1;
        }
      } else if (s.includes("set stage = ?")) {
        const [stage, qualification_score, timeline, qualification_notes, last_contacted_at, id] = params;
        const item = this.data.enquiries.find((e) => e.id === id);
        if (item) {
          item.stage = stage;
          item.status = stage;
          if (qualification_score !== undefined) item.qualification_score = qualification_score;
          if (timeline !== undefined) item.timeline = timeline;
          if (qualification_notes !== undefined) item.qualification_notes = qualification_notes;
          item.last_contacted_at = last_contacted_at || new Date().toISOString();
          changes = 1;
        }
      } else if (s.includes("set notes = ? where id = ?")) {
        const [notes, id] = params;
        const item = this.data.enquiries.find((e) => e.id === id);
        if (item) {
          item.notes = notes;
          changes = 1;
        }
      }
    }

    // 3. DELETE FROM editorial_calendar WHERE status = 'PROPOSED'
    else if (s.includes("delete from editorial_calendar where status = 'proposed'")) {
      const before = this.data.editorial_calendar.length;
      this.data.editorial_calendar = this.data.editorial_calendar.filter(
        (e) => e.status !== "PROPOSED"
      );
      changes = before - this.data.editorial_calendar.length;
    }

    // 4. INSERT INTO editorial_calendar
    else if (s.includes("insert into editorial_calendar")) {
      const [
        id, scheduled_date, theme, primary_keyword, supporting_keywords,
        search_intent, competitor_gap_notes, suggested_headline, content_format,
        target_audience, suggested_internal_links, suggested_cta, status
      ] = params;
      this.data.editorial_calendar.push({
        id,
        created_at: new Date().toISOString(),
        scheduled_date, theme, primary_keyword, supporting_keywords,
        search_intent, competitor_gap_notes, suggested_headline, content_format,
        target_audience, suggested_internal_links, suggested_cta,
        status: status || "PROPOSED",
      });
      changes = 1;
    }

    // 5. UPDATE editorial_calendar
    else if (s.includes("update editorial_calendar")) {
      if (s.includes("set status = ? where id = ?")) {
        const [status, id] = params;
        const item = this.data.editorial_calendar.find((c) => c.id === id);
        if (item) {
          item.status = status;
          changes = 1;
        }
      } else if (s.includes("set scheduled_date = ? where id = ?")) {
        const [date, id] = params;
        const item = this.data.editorial_calendar.find((c) => c.id === id);
        if (item) {
          item.scheduled_date = date;
          changes = 1;
        }
      }
    }

    // 6. INSERT INTO articles
    else if (s.includes("insert into articles")) {
      const [id, calendar_id, title, slug, meta_description, outline, content_markdown, current_version, status, author] = params;
      this.data.articles.push({
        id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        calendar_id, title, slug, meta_description, outline, content_markdown,
        current_version: current_version || 1,
        status: status || "DRAFT_READY",
        author: author || "HelloShiva Editorial",
      });
      changes = 1;
    }

    // 7. UPDATE articles (status update / publishing / scheduling)
    else if (s.includes("update articles set status =")) {
      const id = params[params.length - 1];
      const item = this.data.articles.find((a) => a.id === id);
      if (item) {
        item.status = params[0];
        if (params[0] === "PUBLISHED") {
          item.published_at = params[1] && params.length >= 3 ? params[1] : (item.published_at || new Date().toISOString());
        } else if (params[0] === "SCHEDULED") {
          item.scheduled_date = params[1] || item.scheduled_date || new Date().toISOString().split("T")[0];
        }
        item.updated_at = new Date().toISOString();
        changes = 1;
      }
    }

    // 8. UPDATE articles (content edit)
    else if (s.includes("update articles set title =")) {
      // UPDATE articles SET title = ?, slug = ?, meta_description = ?, content_markdown = ?, updated_at = ? WHERE id = ?
      const id = params[params.length - 1];
      const item = this.data.articles.find((a) => a.id === id);
      if (item) {
        item.title = params[0];
        item.slug = params[1];
        item.meta_description = params[2];
        item.content_markdown = params[3];
        if (params.length >= 6 && typeof params[4] === "string") {
          item.scheduled_date = params[4];
        }
        item.updated_at = new Date().toISOString();
        item.current_version = (item.current_version || 1) + 1;
        changes = 1;
      }
    }

    // 9. DELETE FROM articles WHERE id = ?
    else if (s.includes("delete from articles where id = ?")) {
      const [id] = params;
      const initial = this.data.articles.length;
      this.data.articles = this.data.articles.filter((a) => a.id !== id);
      changes = initial - this.data.articles.length;
    }

    // 10. INSERT INTO article_versions
    else if (s.includes("insert into article_versions")) {
      const [id, article_id, version_number, created_by, change_summary, content_markdown] = params;
      this.data.article_versions.push({
        id, article_id, version_number,
        created_at: new Date().toISOString(),
        created_by, change_summary, content_markdown,
      });
      changes = 1;
    }

    // 11. INSERT INTO keyword_opportunities
    else if (s.includes("insert into keyword_opportunities")) {
      const [id, keyword, search_intent, topic_cluster, suggested_title, explanation, comp, src] = params;
      this.data.keyword_opportunities.push({
        id,
        created_at: new Date().toISOString(),
        keyword, search_intent, topic_cluster, suggested_title,
        opportunity_explanation: explanation,
        competition_level: comp || "Medium",
        research_source: src || "OctopusOn Adapter",
        status: "DISCOVERED",
      });
      changes = 1;
    }

    // 12. INSERT INTO seo_audits
    else if (s.includes("insert into seo_audits")) {
      const [id, article_id, checklist_results, recommendations, is_approved] = params;
      this.data.seo_audits.push({
        id, article_id,
        audited_at: new Date().toISOString(),
        checklist_results, recommendations,
        is_approved: is_approved ? 1 : 0,
      });
      changes = 1;
    }

    // 13. INSERT INTO social_posts
    else if (s.includes("insert into social_posts")) {
      const [id, article_id, platform, content_text, hashtags, slide_data] = params;
      this.data.social_posts.push({
        id, article_id, platform, content_text, hashtags, slide_data,
        status: "DRAFT",
      });
      changes = 1;
    }

    // 14. UPDATE feature_flags
    else if (s.includes("update feature_flags set enabled = ? where key = ?")) {
      const [enabled, key] = params;
      const flag = this.data.feature_flags.find((f) => f.key === key);
      if (flag) {
        flag.enabled = enabled ? 1 : 0;
        changes = 1;
      }
    }

    // 15. UPSERT integration_settings
    else if (s.includes("integration_settings")) {
      const [key, value] = params;
      const existing = this.data.integration_settings.find((s) => s.key === key);
      if (existing) {
        existing.value = value;
        existing.updated_at = new Date().toISOString();
      } else {
        this.data.integration_settings.push({
          key,
          value,
          updated_at: new Date().toISOString(),
        });
      }
      changes = 1;
    }

    // 16. INSERT INTO client_audits
    else if (s.includes("insert into client_audits")) {
      const [id, tool_name, target_url, score, summary, user_email] = params;
      this.data.client_audits.push({
        id,
        tool_name,
        target_url,
        score,
        summary,
        user_email: user_email || "guest@client.helloshiva.com",
        timestamp: new Date().toISOString(),
      });
      changes = 1;
    }

    if (changes > 0) {
      this.save();
    }

    return { changes, lastInsertRowid: Date.now() };
  }
}

// Singleton instance
const db = new JsonDatabase();

export function initDb() {
  // Handled automatically by constructor
}

export default db;
