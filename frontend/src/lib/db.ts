import path from "path";
import fs from "fs";

export interface TopicCluster {
  id: string;
  pillar_id: string;
  title: string;
  slug: string;
  pillar_page_headline: string;
  target_service_slug: string;
  related_free_tool_slug: string;
  subtopics: { title: string; keyword: string; intent: string; article_id?: string; status: "PLANNED" | "DRAFTED" | "PUBLISHED" }[];
  completeness_score: number; // 0-100
  created_at: string;
  updated_at: string;
}

export interface ContentBrief {
  id: string;
  cluster_id: string;
  title: string;
  slug: string;
  primary_keyword: string;
  secondary_keywords: string[];
  search_intent: "Informational" | "Commercial" | "Transactional" | "Navigational";
  target_persona: string;
  target_service_slug: string;
  related_free_tool_slug: string;
  core_problem: string;
  key_questions: string[];
  outline: string[];
  status: "PROPOSED" | "APPROVED" | "REJECTED" | "IN_DRAFTING" | "COMPLETED";
  created_at: string;
  updated_at: string;
}

export interface ArticleItem {
  id: string;
  brief_id?: string | null;
  calendar_id?: string | null;
  cluster_id?: string | null;
  title: string;
  slug: string;
  meta_description: string;
  category?: string;
  target_service_slug?: string;
  related_free_tool_slug?: string;
  primary_keyword?: string;
  secondary_keywords?: string[];
  outline: string[];
  content_markdown: string;
  current_version: number;
  status: "DRAFT" | "DRAFT_READY" | "APPROVED" | "SCHEDULED" | "PUBLISHED";
  author: string;
  scheduled_date?: string | null;
  scheduled_time?: string | null;
  timezone?: string | null;
  published_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CalendarEntry {
  id: string;
  brief_id?: string | null;
  article_id?: string | null;
  scheduled_date: string;
  scheduled_time?: string;
  timezone?: string;
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
  status: "PROPOSED" | "APPROVED" | "REJECTED" | "IN_DRAFTING" | "SCHEDULED" | "PUBLISHED";
  created_at: string;
}

export interface SocialPostItem {
  id: string;
  article_id: string;
  platform: "LINKEDIN" | "TWITTER" | "FACEBOOK" | "INSTAGRAM" | "REDDIT";
  content_text: string;
  hashtags: string[];
  slide_data?: any;
  cta_url?: string;
  status: "DRAFT" | "COPIED" | "PUBLISHED";
  created_at: string;
}

export interface KeywordOpportunity {
  id: string;
  keyword: string;
  search_intent: string;
  topic_cluster: string;
  suggested_title: string;
  opportunity_explanation: string;
  competition_level: "Low" | "Medium" | "High";
  estimated_volume?: string;
  research_source: string;
  status: "DISCOVERED" | "PROMOTED_TO_BRIEF" | "DISMISSED";
  created_at: string;
}

interface TableData {
  enquiries: any[];
  lead_activities: any[];
  lead_followups: any[];
  feature_flags: any[];
  keyword_opportunities: KeywordOpportunity[];
  topic_clusters: TopicCluster[];
  content_briefs: ContentBrief[];
  editorial_calendar: CalendarEntry[];
  articles: ArticleItem[];
  article_versions: any[];
  article_sources: any[];
  seo_audits: any[];
  social_posts: SocialPostItem[];
  social_campaigns: any[];
  offpage_opportunities: any[];
  content_analytics: any[];
  lead_attributions: any[];
  content_activity_logs: any[];
  integration_settings: { key: string; value: string; updated_at?: string }[];
  admin_users: any[];
  client_audits: any[];
}

const dbDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const jsonDbPath = path.join(dbDir, "helloshiva.json");

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

  public save() {
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

    // 2. Integration settings
    const defaultSettings: { key: string; value: string }[] = [
      { key: "GEMINI_API_KEY", value: process.env.GEMINI_API_KEY || "" },
      { key: "GEMINI_MODEL", value: "gemini-3.5-flash" },
      { key: "EDITORIAL_BRAND_NAME", value: "HelloShiva Digital Agency" },
      { key: "ANTI_AI_FLUFF_ENABLED", value: "1" },
    ];
    if (!this.data.integration_settings) this.data.integration_settings = [];
    for (const ds of defaultSettings) {
      if (!this.data.integration_settings.some(s => s.key === ds.key)) {
        this.data.integration_settings.push({ ...ds, updated_at: new Date().toISOString() });
        modified = true;
      }
    }

    // 3. Admin user
    if (!this.data.admin_users || this.data.admin_users.length === 0) {
      this.data.admin_users = [
        {
          id: "admin-1",
          email: "admin@helloshiva.com",
          password: "admin",
          name: "HelloShiva Lead Administrator",
          role: "SUPER_ADMIN",
          created_at: new Date().toISOString(),
        },
      ];
      modified = true;
    }

    // 4. Topic Clusters (The 5 Pillars)
    if (!this.data.topic_clusters || this.data.topic_clusters.length === 0) {
      this.data.topic_clusters = [
        {
          id: "cluster-technical-seo",
          pillar_id: "pillar-1",
          title: "Technical SEO & Web Architecture",
          slug: "technical-seo-web-architecture",
          pillar_page_headline: "The Enterprise Technical SEO Blueprint: Code-Level Architecture That Dominates Organic Search",
          target_service_slug: "technical-seo",
          related_free_tool_slug: "seo-page-analyzer",
          subtopics: [
            { title: "Core Web Vitals (INP, LCP, CLS)", keyword: "core web vitals optimization guide", intent: "Informational", article_id: "art-seed-2", status: "PUBLISHED" },
            { title: "DOM Rendering & SSR Crawl Budgets", keyword: "technical seo crawl budget rendering", intent: "Informational", article_id: "art-seed-1", status: "PUBLISHED" },
            { title: "Robots.txt & Staging Indexing Disasters", keyword: "robots txt crawling indexing mistakes", intent: "Commercial", status: "PLANNED" },
            { title: "Next.js Schema Markup & Rich Snippets", keyword: "nextjs json ld structured data", intent: "Informational", status: "PLANNED" },
            { title: "Log File Analysis for Enterprise Sites", keyword: "enterprise seo log file analysis", intent: "Commercial", status: "PLANNED" },
          ],
          completeness_score: 40,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "cluster-content-marketing",
          pillar_id: "pillar-2",
          title: "Content Marketing, E-E-A-T & Search Intent",
          slug: "content-marketing-eeat-intent",
          pillar_page_headline: "High-Intent B2B Content Marketing: How to Build Authority and Turn Search Queries into Qualified Pipeline",
          target_service_slug: "content-marketing",
          related_free_tool_slug: "keyword-density-checker",
          subtopics: [
            { title: "B2B Content ROI: Booking Demos from Search", keyword: "b2b content marketing roi", intent: "Commercial", status: "PLANNED" },
            { title: "Google Helpful Content & Information Gain", keyword: "helpful content information gain seo", intent: "Informational", status: "PLANNED" },
            { title: "Search Generative Experience (SGE) Strategy", keyword: "ai overviews optimization sge", intent: "Informational", status: "PLANNED" },
            { title: "Content Decay Prevention & 90-Day Audits", keyword: "content refresh decay audit strategy", intent: "Commercial", status: "PLANNED" },
          ],
          completeness_score: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "cluster-performance-marketing",
          pillar_id: "pillar-3",
          title: "Performance Marketing, PPC & Conversion Rate Optimization",
          slug: "performance-marketing-ppc-cro",
          pillar_page_headline: "Full-Funnel Performance Marketing: Lowering CAC and Scaling Paid Conversions with Data-Driven CRO",
          target_service_slug: "performance-marketing",
          related_free_tool_slug: "utm-builder",
          subtopics: [
            { title: "UTM Campaign Architecture & GA4 Attribution", keyword: "utm campaign tracking architecture", intent: "Informational", status: "PLANNED" },
            { title: "Google Ads Quality Score & Speed Alignment", keyword: "google ads quality score landing page speed", intent: "Commercial", status: "PLANNED" },
            { title: "High-Converting B2B Landing Page Framework", keyword: "b2b landing page conversion optimization", intent: "Commercial", status: "PLANNED" },
            { title: "Meta Conversions API (CAPI) Server Setup", keyword: "meta conversions api nextjs tracking", intent: "Informational", status: "PLANNED" },
          ],
          completeness_score: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "cluster-social-brand",
          pillar_id: "pillar-4",
          title: "Social Media Marketing & Executive Brand Growth",
          slug: "social-media-executive-branding",
          pillar_page_headline: "The Multi-Channel Distribution Engine: Turning 1 Long-Form Article into 10 High-Engagement Social Assets",
          target_service_slug: "social-media-marketing",
          related_free_tool_slug: "open-graph-preview",
          subtopics: [
            { title: "LinkedIn B2B Thought Leadership Playbook", keyword: "b2b linkedin thought leadership strategy", intent: "Informational", status: "PLANNED" },
            { title: "Multi-Channel Content Repurposing Engine", keyword: "content repurposing framework for agencies", intent: "Commercial", status: "PLANNED" },
            { title: "High-Converting Instagram Carousel Storyboards", keyword: "b2b carousel content strategy instagram", intent: "Informational", status: "PLANNED" },
          ],
          completeness_score: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: "cluster-web-engineering",
          pillar_id: "pillar-5",
          title: "Website Engineering & Digital Growth Infrastructure",
          slug: "web-engineering-growth-infrastructure",
          pillar_page_headline: "Modern Web Engineering for Growth: Building Ultra-Fast, Server-Rendered Next.js Websites That Convert",
          target_service_slug: "web-development",
          related_free_tool_slug: "http-headers-checker",
          subtopics: [
            { title: "Next.js App Router SEO & Performance", keyword: "nextjs app router seo optimization", intent: "Informational", status: "PLANNED" },
            { title: "Headless CMS vs Traditional CMS for Marketing", keyword: "headless cms for digital marketing agency", intent: "Commercial", status: "PLANNED" },
            { title: "Sub-Second Response Times with Edge Caching", keyword: "cloudflare edge caching nextjs speed", intent: "Informational", status: "PLANNED" },
          ],
          completeness_score: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];
      modified = true;
    }

    // 5. Seed Content Briefs
    if (!this.data.content_briefs || this.data.content_briefs.length === 0) {
      this.data.content_briefs = [
        {
          id: "brief-1",
          cluster_id: "cluster-technical-seo",
          title: "The 2026 Core Web Vitals Blueprint: How to Achieve Sub-Second LCP and Flawless INP",
          slug: "the-2026-core-web-vitals-blueprint",
          primary_keyword: "core web vitals optimization guide",
          secondary_keywords: ["INP", "LCP", "CLS", "Next.js performance", "web speed audit"],
          search_intent: "Informational",
          target_persona: "CTOs, VP of Engineering, Head of Growth",
          target_service_slug: "technical-seo",
          related_free_tool_slug: "http-headers-checker",
          core_problem: "Websites failing Google Interaction to Next Paint (INP) thresholds, causing search drops and PPC budget waste.",
          key_questions: [
            "What is a good INP score according to Google?",
            "How do Core Web Vitals affect Google Ads Quality Score?",
            "Can HelloShiva help re-engineer our website for speed?"
          ],
          outline: [
            "Understanding the 2026 Metrics",
            "Diagnosing INP Bottlenecks",
            "Server Response & LCP",
            "The Conversion Connection",
            "Frequently Asked Questions"
          ],
          status: "COMPLETED",
          created_at: "2026-10-27T10:00:00.000Z",
          updated_at: "2026-10-27T12:00:00.000Z",
        },
        {
          id: "brief-2",
          cluster_id: "cluster-technical-seo",
          title: "Why Technical SEO is the Non-Negotiable Foundation for Content Success",
          slug: "why-technical-seo-is-the-prerequisite-for-content-success",
          primary_keyword: "technical seo crawl budget rendering",
          secondary_keywords: ["DOM rendering", "crawl budget waste", "JavaScript SEO", "schema errors"],
          search_intent: "Informational",
          target_persona: "Marketing Directors, Founders, Inbound Strategists",
          target_service_slug: "technical-seo",
          related_free_tool_slug: "seo-page-analyzer",
          core_problem: "Companies publishing high-volume content that fails to rank because Googlebot cannot crawl or execute the DOM properly.",
          key_questions: [
            "Why does technical SEO matter if our content is already top tier?",
            "How often should an agency audit technical search health?",
            "What is the fastest way to get started with an audit?"
          ],
          outline: [
            "The Rendering Gap: Unrendered DOM vs Content Quality",
            "Eliminating Crawl Budget Waste",
            "The 4-Step Technical SEO Prerequisite Checklist",
            "Frequently Asked Questions"
          ],
          status: "COMPLETED",
          created_at: "2026-10-25T10:00:00.000Z",
          updated_at: "2026-10-25T12:00:00.000Z",
        },
        {
          id: "brief-3",
          cluster_id: "cluster-content-marketing",
          title: "B2B Content Marketing ROI: Beyond Vanity Traffic to Booked Sales Pipeline",
          slug: "b2b-content-marketing-roi-pipeline-guide",
          primary_keyword: "b2b content marketing roi",
          secondary_keywords: ["bottom of funnel content", "commercial search intent", "content conversion rate"],
          search_intent: "Commercial",
          target_persona: "B2B Founders, CMOs, Demand Generation Heads",
          target_service_slug: "content-marketing",
          related_free_tool_slug: "keyword-density-checker",
          core_problem: "B2B marketing teams spend money on articles that produce traffic spikes but zero qualified sales demos.",
          key_questions: [
            "How do you calculate B2B content marketing ROI?",
            "What is the difference between informational and commercial search intent?",
            "How does HelloShiva structure high-converting B2B content?"
          ],
          outline: [
            "The Vanity Traffic Trap in B2B Marketing",
            "Commercial Search Intent: Capturing Buyers at the Moment of Need",
            "The HelloShiva Content-to-Pipeline Architecture",
            "Frequently Asked Questions"
          ],
          status: "APPROVED",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];
      modified = true;
    }

    // 6. Seed Keyword Opportunities
    if (!this.data.keyword_opportunities || this.data.keyword_opportunities.length === 0) {
      this.data.keyword_opportunities = [
        {
          id: "kw-1",
          keyword: "b2b content marketing roi",
          search_intent: "Commercial",
          topic_cluster: "Content Marketing & AI SEO",
          suggested_title: "B2B Content Marketing ROI: Beyond Vanity Traffic to Booked Sales Pipeline",
          opportunity_explanation: "High commercial intent from founders and marketing executives seeking revenue attribution from content investments.",
          competition_level: "Medium",
          estimated_volume: "2,400/mo",
          research_source: "Google Search Central & Trends Radar",
          status: "PROMOTED_TO_BRIEF",
          created_at: new Date().toISOString(),
        },
        {
          id: "kw-2",
          keyword: "nextjs app router seo optimization",
          search_intent: "Informational",
          topic_cluster: "Web Engineering & Digital Growth",
          suggested_title: "Next.js App Router SEO: Complete Technical Guide to Metadata, SSG, and Crawlability",
          opportunity_explanation: "Surging technical query among developers and CTOs encountering indexing issues with client vs server components.",
          competition_level: "Low",
          estimated_volume: "4,100/mo",
          research_source: "Developer Search Radar",
          status: "DISCOVERED",
          created_at: new Date().toISOString(),
        },
        {
          id: "kw-3",
          keyword: "utm campaign tracking architecture",
          search_intent: "Informational",
          topic_cluster: "Performance Marketing & CRO",
          suggested_title: "Mastering Campaign Attribution: How to Build a Fail-Safe UTM Architecture for GA4",
          opportunity_explanation: "Direct match for HelloShiva's free UTM Builder tool; bridges educational readers to full-funnel performance marketing services.",
          competition_level: "Low",
          estimated_volume: "1,900/mo",
          research_source: "Free Tools Ecosystem",
          status: "DISCOVERED",
          created_at: new Date().toISOString(),
        },
        {
          id: "kw-4",
          keyword: "b2b linkedin thought leadership strategy",
          search_intent: "Commercial",
          topic_cluster: "Social Media & Brand Building",
          suggested_title: "The Founder's Playbook: How to Build B2B Authority on LinkedIn Without Generic Content",
          opportunity_explanation: "High-ticket founders seeking executive ghostwriting and organic social media agency retainers.",
          competition_level: "Medium",
          estimated_volume: "3,200/mo",
          research_source: "Executive Search Trends",
          status: "DISCOVERED",
          created_at: new Date().toISOString(),
        },
      ];
      modified = true;
    }

    if (modified) {
      this.save();
    }
  }

  // Typed API Helpers
  public getTopicClusters(): TopicCluster[] {
    const articles = this.data.articles || [];
    return (this.data.topic_clusters || []).map(cluster => {
      let completedCount = 0;
      const subtopics = (cluster.subtopics || []).map(st => {
        const found = articles.find(a => 
          (a.cluster_id === cluster.id || a.category?.toLowerCase().includes(cluster.title.toLowerCase().slice(0, 10))) &&
          (a.title.toLowerCase().includes(st.keyword.toLowerCase().slice(0, 15)) || st.article_id === a.id)
        );
        if (found) {
          completedCount++;
          return { ...st, article_id: found.id, status: (found.status === "PUBLISHED" ? "PUBLISHED" : "DRAFTED") as any };
        }
        return st;
      });
      const completeness_score = subtopics.length > 0 ? Math.round((completedCount / subtopics.length) * 100) : 0;
      return { ...cluster, subtopics, completeness_score };
    });
  }

  public saveTopicCluster(cluster: TopicCluster) {
    const idx = (this.data.topic_clusters || []).findIndex(c => c.id === cluster.id);
    if (idx >= 0) {
      this.data.topic_clusters[idx] = { ...cluster, updated_at: new Date().toISOString() };
    } else {
      this.data.topic_clusters.push({ ...cluster, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
    }
    this.save();
  }

  public getContentBriefs(): ContentBrief[] {
    return [...(this.data.content_briefs || [])].sort((a, b) => (b.created_at || "").localeCompare(a.created_at || ""));
  }

  public getContentBriefById(id: string): ContentBrief | undefined {
    return (this.data.content_briefs || []).find(b => b.id === id);
  }

  public saveContentBrief(brief: ContentBrief) {
    if (!this.data.content_briefs) this.data.content_briefs = [];
    const idx = this.data.content_briefs.findIndex(b => b.id === brief.id);
    if (idx >= 0) {
      this.data.content_briefs[idx] = { ...brief, updated_at: new Date().toISOString() };
    } else {
      this.data.content_briefs.push({ ...brief, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
    }
    this.save();
  }

  public updateContentBriefStatus(id: string, status: ContentBrief["status"]) {
    const brief = (this.data.content_briefs || []).find(b => b.id === id);
    if (brief) {
      brief.status = status;
      brief.updated_at = new Date().toISOString();
      this.save();
    }
  }

  public getKeywordOpportunities(): KeywordOpportunity[] {
    return [...(this.data.keyword_opportunities || [])].sort((a, b) => (b.created_at || "").localeCompare(a.created_at || ""));
  }

  public saveKeywordOpportunity(item: KeywordOpportunity) {
    if (!this.data.keyword_opportunities) this.data.keyword_opportunities = [];
    const idx = this.data.keyword_opportunities.findIndex(k => k.id === item.id);
    if (idx >= 0) {
      this.data.keyword_opportunities[idx] = item;
    } else {
      this.data.keyword_opportunities.unshift(item);
    }
    this.save();
  }

  public checkScheduledReleases() {
    let changed = false;
    const now = new Date();
    for (const a of this.data.articles || []) {
      if (a.status === "SCHEDULED" && a.scheduled_date) {
        let timeStr = "00:00:00";
        if (a.scheduled_time) {
          const match = a.scheduled_time.match(/(\d+):(\d+)\s*(AM|PM)?/i);
          if (match) {
            let h = parseInt(match[1], 10);
            const m = match[2];
            const ampm = match[3]?.toUpperCase();
            if (ampm === "PM" && h < 12) h += 12;
            if (ampm === "AM" && h === 12) h = 0;
            timeStr = `${String(h).padStart(2, "0")}:${m}:00`;
          }
        }
        const scheduledDateTime = new Date(`${a.scheduled_date}T${timeStr}`);
        if (!isNaN(scheduledDateTime.getTime()) && scheduledDateTime <= now) {
          a.status = "PUBLISHED";
          a.published_at = a.published_at || new Date().toISOString();
          a.updated_at = new Date().toISOString();
          changed = true;
        }
      }
    }
    if (changed) {
      this.save();
    }
  }

  public getArticles(statusFilter?: string): ArticleItem[] {
    this.checkScheduledReleases();
    let list = [...(this.data.articles || [])];
    if (statusFilter && statusFilter !== "ALL") {
      list = list.filter(a => a.status === statusFilter);
    }
    return list.sort((a, b) => (b.updated_at || b.created_at || "").localeCompare(a.updated_at || a.created_at || ""));
  }

  public getArticleById(id: string): ArticleItem | undefined {
    return (this.data.articles || []).find(a => a.id === id);
  }

  public getArticleBySlug(slug: string): ArticleItem | undefined {
    return (this.data.articles || []).find(a => a.slug === slug);
  }

  public saveArticle(article: ArticleItem) {
    if (!this.data.articles) this.data.articles = [];
    const idx = this.data.articles.findIndex(a => a.id === article.id);
    if (idx >= 0) {
      this.data.articles[idx] = { ...article, updated_at: new Date().toISOString() };
    } else {
      this.data.articles.unshift({ ...article, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
    }
    this.save();
  }

  public deleteArticle(id: string) {
    this.data.articles = (this.data.articles || []).filter(a => a.id !== id);
    this.save();
  }

  public getEditorialCalendar(): CalendarEntry[] {
    return [...(this.data.editorial_calendar || [])].sort((a, b) => (a.scheduled_date || "").localeCompare(b.scheduled_date || ""));
  }

  public saveCalendarEntry(entry: CalendarEntry) {
    if (!this.data.editorial_calendar) this.data.editorial_calendar = [];
    const idx = this.data.editorial_calendar.findIndex(e => e.id === entry.id);
    if (idx >= 0) {
      this.data.editorial_calendar[idx] = entry;
    } else {
      this.data.editorial_calendar.push(entry);
    }
    this.save();
  }

  public getSocialPosts(articleId?: string): SocialPostItem[] {
    let list = [...(this.data.social_posts || [])];
    if (articleId) {
      list = list.filter(p => p.article_id === articleId);
    }
    return list;
  }

  public saveSocialPost(post: SocialPostItem) {
    if (!this.data.social_posts) this.data.social_posts = [];
    const idx = this.data.social_posts.findIndex(p => p.id === post.id);
    if (idx >= 0) {
      this.data.social_posts[idx] = post;
    } else {
      this.data.social_posts.push(post);
    }
    this.save();
  }

  public getSetting(key: string, defaultVal = ""): string {
    const s = (this.data.integration_settings || []).find(item => item.key === key);
    return s?.value ?? defaultVal;
  }

  public setSetting(key: string, value: string) {
    if (!this.data.integration_settings) this.data.integration_settings = [];
    const s = this.data.integration_settings.find(item => item.key === key);
    if (s) {
      s.value = value;
      s.updated_at = new Date().toISOString();
    } else {
      this.data.integration_settings.push({ key, value, updated_at: new Date().toISOString() });
    }
    this.save();
  }

  // SQLite-compatible interface
  public pragma(_query: string) { return this; }
  public exec(_query: string) { return this; }

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

    if (s.includes("from enquiries")) {
      return [...(this.data.enquiries || [])].sort((a, b) =>
        (b.created_at || "").localeCompare(a.created_at || "")
      );
    }

    if (s.includes("from lead_activities")) {
      let list = [...(this.data.lead_activities || [])];
      if (s.includes("where inquiry_id = ?")) {
        const [inqId] = params;
        list = list.filter((a) => a.inquiry_id === inqId);
      }
      return list.sort((a, b) => (b.created_at || "").localeCompare(a.created_at || ""));
    }

    if (s.includes("from lead_followups")) {
      let list = [...(this.data.lead_followups || [])];
      if (s.includes("where inquiry_id = ?")) {
        const [inqId] = params;
        list = list.filter((f) => f.inquiry_id === inqId);
      }
      return list.sort((a, b) => (a.due_at || "").localeCompare(b.due_at || ""));
    }

    if (s.includes("from articles")) {
      this.checkScheduledReleases();
      let list = [...(this.data.articles || [])];
      if (s.includes("status = 'published'")) {
        list = list.filter((a) => a.status === "PUBLISHED");
      } else if (s.includes("status = 'approved'")) {
        list = list.filter((a) => a.status === "APPROVED");
      } else if (s.includes("status = 'draft_ready'") || s.includes("status = 'draft'")) {
        list = list.filter((a) => a.status === "DRAFT_READY" || a.status === "DRAFT");
      } else if (s.includes("status = 'scheduled'")) {
        list = list.filter((a) => a.status === "SCHEDULED");
      }
      list.sort((a, b) => (b.updated_at || b.created_at || "").localeCompare(a.updated_at || a.created_at || ""));
      if (s.includes("limit 5")) return list.slice(0, 5);
      if (s.includes("limit 3")) return list.slice(0, 3);
      return list;
    }

    if (s.includes("from topic_clusters")) {
      return this.getTopicClusters();
    }

    if (s.includes("from content_briefs")) {
      return this.getContentBriefs();
    }

    if (s.includes("from editorial_calendar")) {
      const list = [...(this.data.editorial_calendar || [])].sort((a, b) =>
        (a.scheduled_date || "").localeCompare(b.scheduled_date || "")
      );
      if (s.includes("limit 5")) return list.slice(0, 5);
      return list;
    }

    if (s.includes("from keyword_opportunities")) {
      return this.getKeywordOpportunities().slice(0, 50);
    }

    if (s.includes("from feature_flags")) {
      return [...(this.data.feature_flags || [])];
    }

    if (s.includes("from integration_settings")) {
      return [...(this.data.integration_settings || [])];
    }

    if (s.includes("from social_posts")) {
      return [...(this.data.social_posts || [])];
    }

    if (s.includes("from client_audits")) {
      return [...(this.data.client_audits || [])].sort((a, b) =>
        (b.timestamp || "").localeCompare(a.timestamp || "")
      );
    }

    return [];
  }

  private executeGet(sql: string, params: any[]): any {
    const s = sql.toLowerCase();

    if (s.includes("count(*) as cnt from")) {
      if (s.includes("from keyword_opportunities")) return { cnt: (this.data.keyword_opportunities || []).length };
      if (s.includes("from editorial_calendar")) return { cnt: (this.data.editorial_calendar || []).length };
      if (s.includes("from articles")) {
        if (s.includes("status = 'approved'")) return { cnt: (this.data.articles || []).filter(a => a.status === "APPROVED").length };
        if (s.includes("status = 'published'")) return { cnt: (this.data.articles || []).filter(a => a.status === "PUBLISHED").length };
        return { cnt: (this.data.articles || []).length };
      }
      if (s.includes("from topic_clusters")) return { cnt: (this.data.topic_clusters || []).length };
      if (s.includes("from content_briefs")) return { cnt: (this.data.content_briefs || []).length };
      if (s.includes("from social_posts")) return { cnt: (this.data.social_posts || []).length };
      if (s.includes("from enquiries")) return { cnt: (this.data.enquiries || []).length };
      if (s.includes("from feature_flags")) return { cnt: (this.data.feature_flags || []).length };
      return { cnt: 0 };
    }

    if (s.includes("from articles where slug =")) {
      const slugVal = params[0] || (sql.match(/slug = '([^']+)'/i)?.[1] ?? "");
      return (this.data.articles || []).find((a) => a.slug === slugVal);
    }

    if (s.includes("from articles where id =")) {
      const idVal = params[0] || (sql.match(/id = '([^']+)'/i)?.[1] ?? "");
      return (this.data.articles || []).find((a) => a.id === idVal);
    }

    if (s.includes("from content_briefs where id =")) {
      const idVal = params[0] || (sql.match(/id = '([^']+)'/i)?.[1] ?? "");
      return (this.data.content_briefs || []).find((b) => b.id === idVal);
    }

    if (s.includes("from admin_users where email =")) {
      const email = params[0];
      const pass = params[1];
      const user = (this.data.admin_users || []).find((u) => u.email === email);
      if (user && (!pass || user.password === pass)) {
        return user;
      }
      return undefined;
    }

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

    if (s.includes("insert into enquiries")) {
      const [id, name, email, phone, company, service, message, source_page, referrer, utm_source, utm_medium, utm_campaign] = params;
      this.data.enquiries.push({
        id, created_at: new Date().toISOString(),
        name, email, phone, company, service, message, source_page, referrer, utm_source, utm_medium, utm_campaign,
        status: "NEW", stage: "NEW", qualification_score: "WARM", timeline: "1-2 Weeks",
        qualification_notes: "", last_contacted_at: null, notes: "",
      });
      changes = 1;
    } else if (s.includes("insert into lead_activities")) {
      const [id, inquiry_id, author, action, note, old_stage, new_stage] = params;
      this.data.lead_activities.push({
        id: id || `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        inquiry_id, author: author || "Agency Admin", action: action || "note_added",
        note, old_stage: old_stage || null, new_stage: new_stage || null, created_at: new Date().toISOString(),
      });
      changes = 1;
    } else if (s.includes("insert into lead_followups")) {
      const [id, inquiry_id, type, title, notes, due_at, priority] = params;
      this.data.lead_followups.push({
        id: id || `fol-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        inquiry_id, type: type || "phone_call", title: title || "Scheduled Follow-up",
        notes: notes || "", due_at: due_at || new Date(Date.now() + 86400000).toISOString(),
        priority: priority || "medium", status: "pending", completed_at: null, created_at: new Date().toISOString(),
      });
      changes = 1;
    } else if (s.includes("update lead_followups")) {
      if (s.includes("set status = ?, completed_at = ? where id = ?")) {
        const [status, completed_at, id] = params;
        const fol = this.data.lead_followups.find((f) => f.id === id);
        if (fol) { fol.status = status; fol.completed_at = completed_at; changes = 1; }
      }
    } else if (s.includes("update enquiries")) {
      if (s.includes("set status = ? where id = ?")) {
        const [status, id] = params;
        const item = this.data.enquiries.find((e) => e.id === id);
        if (item) { item.status = status; item.stage = status; changes = 1; }
      } else if (s.includes("set stage = ?")) {
        const [stage, qualification_score, timeline, qualification_notes, last_contacted_at, id] = params;
        const item = this.data.enquiries.find((e) => e.id === id);
        if (item) {
          item.stage = stage; item.status = stage;
          if (qualification_score !== undefined) item.qualification_score = qualification_score;
          if (timeline !== undefined) item.timeline = timeline;
          if (qualification_notes !== undefined) item.qualification_notes = qualification_notes;
          item.last_contacted_at = last_contacted_at || new Date().toISOString();
          changes = 1;
        }
      } else if (s.includes("set notes = ? where id = ?")) {
        const [notes, id] = params;
        const item = this.data.enquiries.find((e) => e.id === id);
        if (item) { item.notes = notes; changes = 1; }
      }
    } else if (s.includes("insert into articles")) {
      const [id, calendar_id, title, slug, meta_description, outline, content_markdown, current_version, status, author] = params;
      this.data.articles.push({
        id, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
        calendar_id, title, slug, meta_description, outline, content_markdown,
        current_version: current_version || 1, status: status || "DRAFT_READY", author: author || "HelloShiva Editorial",
        category: "Technical SEO & Web Architecture",
      });
      changes = 1;
    } else if (s.includes("update articles set status =")) {
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
    } else if (s.includes("update articles set title =")) {
      const id = params[params.length - 1];
      const item = this.data.articles.find((a) => a.id === id);
      if (item) {
        item.title = params[0]; item.slug = params[1]; item.meta_description = params[2]; item.content_markdown = params[3];
        if (params.length >= 6 && typeof params[4] === "string") { item.scheduled_date = params[4]; }
        item.updated_at = new Date().toISOString();
        item.current_version = (item.current_version || 1) + 1;
        changes = 1;
      }
    } else if (s.includes("delete from articles where id = ?")) {
      const [id] = params;
      const initial = this.data.articles.length;
      this.data.articles = this.data.articles.filter((a) => a.id !== id);
      changes = initial - this.data.articles.length;
    } else if (s.includes("insert into keyword_opportunities")) {
      const [id, keyword, search_intent, topic_cluster, suggested_title, explanation, comp, src] = params;
      this.data.keyword_opportunities.push({
        id, created_at: new Date().toISOString(), keyword, search_intent, topic_cluster,
        suggested_title, opportunity_explanation: explanation, competition_level: comp || "Medium",
        research_source: src || "Trend Radar", status: "DISCOVERED",
      });
      changes = 1;
    } else if (s.includes("insert into social_posts")) {
      const [id, article_id, platform, content_text, hashtags, slide_data] = params;
      this.data.social_posts.push({
        id, article_id, platform, content_text, hashtags, slide_data, status: "DRAFT", created_at: new Date().toISOString()
      });
      changes = 1;
    } else if (s.includes("update feature_flags set enabled = ? where key = ?")) {
      const [enabled, key] = params;
      const flag = this.data.feature_flags.find((f) => f.key === key);
      if (flag) { flag.enabled = enabled ? 1 : 0; changes = 1; }
    } else if (s.includes("integration_settings")) {
      const [key, value] = params;
      const existing = this.data.integration_settings.find((s) => s.key === key);
      if (existing) { existing.value = value; existing.updated_at = new Date().toISOString(); }
      else { this.data.integration_settings.push({ key, value, updated_at: new Date().toISOString() }); }
      changes = 1;
    }

    if (changes > 0) this.save();
    return { changes, lastInsertRowid: Date.now() };
  }
}

const db = new JsonDatabase();

export function initDb() {}
export default db;
