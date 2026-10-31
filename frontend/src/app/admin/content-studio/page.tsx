"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Wand2,
  Sparkles,
  Calendar,
  Search,
  FileText,
  Share2,
  Copy,
  Check,
  ExternalLink,
  Plus,
  ArrowRight,
  Clock,
  Layers,
  Table as TableIcon,
  Image as ImageIcon,
  Link as LinkIcon,
  HelpCircle,
  RefreshCw,
  Sliders,
  Globe,
  Building,
  CheckCircle2,
  AlertCircle,
  Eye,
  Edit3,
  Flame,
  ArrowUpRight,
  TrendingUp,
  BarChart3,
  Bookmark,
  ChevronDown,
} from "lucide-react";
import MarkdownRenderer from "@/components/MarkdownRenderer";

interface DayPlan {
  day_number: number;
  date: string;
  weekday: string;
  theme: string;
  primary_keyword: string;
  secondary_keywords?: string[];
  search_intent: string;
  competitor_gap: string;
  backlink_target: string;
  proposed_headline: string;
  content_brief: string;
  social_hook: string;
}

interface ContentOpp {
  headline: string;
  angle: string;
  recommended_format?: string;
}

interface ResearchData {
  focus_niche: string;
  market: string;
  primary_keywords: string[];
  long_tail_keywords: string[];
  search_intent: string;
  competitor_gaps: string;
  backlink_opportunities: string[];
  content_opportunities: ContentOpp[];
}

function ContentStudioInner() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"calendar" | "research" | "studio" | "social">("calendar");

  // Global Engine Status
  const [isAiAvailable, setIsAiAvailable] = useState(false);
  const [selectedModel, setSelectedModel] = useState("gemini-2.0-flash");

  // Tab 1: Calendar State
  const [calMarket, setCalMarket] = useState("Global Remote & India B2B");
  const [calFocus, setCalFocus] = useState("Performance Marketing, Technical SEO, Local 3-Pack, SaaS BOFU, CRO");
  const [calDays, setCalDays] = useState<DayPlan[]>([]);
  const [calLoading, setCalLoading] = useState(false);

  // Tab 2: Research Lab State
  const [resNiche, setResNiche] = useState("b2b performance marketing");
  const [resMarket, setResMarket] = useState("Global Remote & India B2B");
  const [researchData, setResearchData] = useState<ResearchData | null>(null);
  const [resLoading, setResLoading] = useState(false);
  const [selectedClusterKey, setSelectedClusterKey] = useState("performance_marketing");

  // Tab 3: Studio & Editor State
  const [studioMode, setStudioMode] = useState<"new" | "improve">("new");
  const [studioEngine, setStudioEngine] = useState<"ai" | "template">("ai");

  // Form Mode A (New)
  const [inKeywords, setInKeywords] = useState("b2b performance marketing, google ads roas scaling");
  const [inTrend, setInTrend] = useState("First-Party Data Attribution & Eliminating Paid Ad Budget Waste in 2026");
  const [inMarket, setInMarket] = useState("Global Remote & India B2B");
  const [inContentType, setInContentType] = useState("article");
  const [inServiceAnchor, setInServiceAnchor] = useState("/services/performance-marketing");
  const [inBrief, setInBrief] = useState("");

  // Form Mode B (Improve)
  const [existingArticles, setExistingArticles] = useState<any[]>([]);
  const [impArticleId, setImpArticleId] = useState("");
  const [impKeywords, setImpKeywords] = useState("");
  const [impGoal, setImpGoal] = useState("Upgrade heading tags for higher CTR, inject structured FAQ schema, and boost focus keyword density.");
  const [impLoading, setImpLoading] = useState(false);

  // Fine-Tuning Editor State
  const [edTitle, setEdTitle] = useState("");
  const [edCategory, setEdCategory] = useState("Market Insights");
  const [edExcerpt, setEdExcerpt] = useState("");
  const [edContent, setEdContent] = useState("");
  const [edArticleId, setEdArticleId] = useState<string | null>(null);
  const [editorMode, setEditorMode] = useState<"visual" | "source" | "preview">("visual");
  const [pipelineLoading, setPipelineLoading] = useState(false);
  const [publishStatus, setPublishStatus] = useState<{ success: boolean; message: string; url?: string } | null>(null);
  const [publishing, setPublishing] = useState(false);

  // Modals for Editor
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [linkNewTab, setLinkNewTab] = useState(true);

  const [showImgModal, setShowImgModal] = useState(false);
  const [imgUrl, setImgUrl] = useState("");
  const [imgAlt, setImgAlt] = useState("");
  const [imgCaption, setImgCaption] = useState("");
  const [imgAlign, setImgAlign] = useState<"center" | "full" | "left" | "right">("center");

  // Tab 4: Social Dispatch State
  const [socialLoading, setSocialLoading] = useState(false);
  const [socialChannels, setSocialChannels] = useState<{
    x_twitter: string;
    linkedin: string;
    facebook: string;
    instagram: string;
    reddit: string;
  }>({
    x_twitter: "",
    linkedin: "",
    facebook: "",
    instagram: "",
    reddit: "",
  });
  const [shareUrls, setShareUrls] = useState<{
    x_twitter?: string;
    linkedin?: string;
    facebook?: string;
    reddit?: string;
  }>({});
  const [copiedChannel, setCopiedChannel] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Initial load
  useEffect(() => {
    // Check settings
    fetch("/api/v1/content-engine/settings")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          const keyRow = d.settings?.find((s: any) => s.key === "GEMINI_API_KEY");
          const modelRow = d.settings?.find((s: any) => s.key === "GEMINI_MODEL");
          if (keyRow?.value && keyRow.value.trim().length > 0) {
            setIsAiAvailable(true);
          }
          if (modelRow?.value) {
            setSelectedModel(modelRow.value);
          }
        }
      })
      .catch(() => {});

    // Fetch existing articles for Mode B
    fetch("/api/v1/content-engine/articles")
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.articles) {
          setExistingArticles(d.articles);
        }
      })
      .catch(() => {});

    // Auto-generate weekly calendar on initial view
    generateCalendarPipeline();
  }, []);

  // Listen to searchParams (e.g. from SEO Research Desk or external links)
  useEffect(() => {
    if (searchParams) {
      const h = searchParams.get("headline");
      const kw = searchParams.get("primaryKeyword") || searchParams.get("keyword");
      const t = searchParams.get("theme");
      if (h || kw) {
        if (h) setEdTitle(h);
        if (kw) setInKeywords(kw);
        if (t) setInTrend(t);
        setActiveTab("studio");
        setStudioMode("new");
      }
    }
  }, [searchParams]);

  // --------------------------------------------------------------------------
  // Tab 1: Weekly Calendar Functions
  // --------------------------------------------------------------------------
  const generateCalendarPipeline = async () => {
    setCalLoading(true);
    try {
      const res = await fetch("/api/v1/content-studio/weekly-calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          market: calMarket,
          focus_niche: calFocus,
          model: selectedModel,
        }),
      });
      const data = await res.json();
      if (data.success && data.data?.days) {
        setCalDays(data.data.days);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCalLoading(false);
    }
  };

  const loadDayIntoStudio = (day: DayPlan) => {
    setInKeywords(day.primary_keyword + (day.secondary_keywords?.length ? ", " + day.secondary_keywords.join(", ") : ""));
    setInTrend(day.theme);
    setInBrief(`Target Headline: ${day.proposed_headline}\nCompetitor Gap to Exploit: ${day.competitor_gap}\nCitation Target: ${day.backlink_target}`);
    setEdTitle(day.proposed_headline);
    setActiveTab("studio");
    setStudioMode("new");
    window.scrollTo({ top: 350, behavior: "smooth" });
  };

  // --------------------------------------------------------------------------
  // Tab 2: Keyword Lab Functions
  // --------------------------------------------------------------------------
  const runKeywordResearch = async (targetNiche?: string) => {
    const nicheToUse = targetNiche || resNiche;
    setResLoading(true);
    try {
      const res = await fetch("/api/v1/content-studio/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          niche: nicheToUse,
          market: resMarket,
          model: selectedModel,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setResearchData(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setResLoading(false);
    }
  };

  const selectPresetCluster = (key: string) => {
    setSelectedClusterKey(key);
    let term = "b2b performance marketing";
    if (key === "technical_seo") term = "technical seo core web vitals";
    if (key === "local_seo") term = "local seo 3 pack google business profile";
    if (key === "b2b_saas_organic") term = "b2b saas content bottom of funnel";
    if (key === "conversion_cro") term = "conversion rate optimization landing page";
    setResNiche(term);
    runKeywordResearch(term);
  };

  const applyKeywordToStudio = (kw: string) => {
    setInKeywords((prev) => (prev ? prev + ", " + kw : kw));
    setActiveTab("studio");
    window.scrollTo({ top: 350, behavior: "smooth" });
  };

  const loadOpportunityIntoStudio = (opp: ContentOpp) => {
    setInTrend(opp.angle);
    setInBrief(`Target Headline: ${opp.headline}\nEditorial Angle: ${opp.angle}\nFormat: ${opp.recommended_format || "Market Authority Guide"}`);
    setEdTitle(opp.headline);
    setActiveTab("studio");
    setStudioMode("new");
    window.scrollTo({ top: 350, behavior: "smooth" });
  };

  // --------------------------------------------------------------------------
  // Tab 3: Studio Generation & Re-Optimization Functions
  // --------------------------------------------------------------------------
  const runContentPipeline = async (e: React.FormEvent) => {
    e.preventDefault();
    setPipelineLoading(true);
    setPublishStatus(null);
    try {
      const res = await fetch("/api/v1/content-studio/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keywords: inKeywords,
          trend: inTrend,
          market: inMarket,
          content_type: inContentType,
          service_anchor: inServiceAnchor,
          brief: inBrief,
          model: selectedModel,
          mode: studioEngine,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setEdTitle(data.data.title);
        setEdCategory(data.data.category || "Market Insights");
        setEdExcerpt(data.data.excerpt);
        setEdContent(data.data.content);
        setEdArticleId(null); // Fresh draft
      }
    } catch (err: any) {
      alert("Pipeline generation error: " + err.message);
    } finally {
      setPipelineLoading(false);
    }
  };

  const runArticleImprovement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!impArticleId) {
      alert("Please select an article to improve.");
      return;
    }
    setImpLoading(true);
    setPublishStatus(null);
    try {
      const res = await fetch("/api/v1/content-studio/improve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          article_id: impArticleId,
          goal: impGoal,
          keywords: impKeywords,
          model: selectedModel,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEdTitle(data.title);
        setEdExcerpt(data.excerpt);
        setEdContent(data.content);
        setEdArticleId(impArticleId);
        alert("Article successfully enhanced! Review improvements in the editor below.");
      }
    } catch (err: any) {
      alert("Improvement error: " + err.message);
    } finally {
      setImpLoading(false);
    }
  };

  // Publishing
  const publishToWebsite = async () => {
    if (!edTitle.trim()) {
      alert("Article headline is required.");
      return;
    }
    setPublishing(true);
    setPublishStatus(null);
    try {
      const res = await fetch("/api/v1/content-studio/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: edArticleId || undefined,
          title: edTitle,
          category: edCategory,
          excerpt: edExcerpt,
          content: edContent,
          status: "PUBLISHED",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPublishStatus({
          success: true,
          message: data.message,
          url: data.url,
        });
        if (data.article_id) setEdArticleId(data.article_id);
      } else {
        setPublishStatus({ success: false, message: data.message || "Failed to publish." });
      }
    } catch (err: any) {
      setPublishStatus({ success: false, message: err.message });
    } finally {
      setPublishing(false);
    }
  };

  // Editor Helpers
  const insertTextAtCursor = (prefix: string, suffix: string = "") => {
    if (!textareaRef.current) return;
    const el = textareaRef.current;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = el.value.substring(start, end);
    const replacement = prefix + selected + suffix;
    const updated = el.value.substring(0, start) + replacement + el.value.substring(end);
    setEdContent(updated);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 50);
  };

  const applyLink = () => {
    if (!linkUrl) return;
    const linkStr = `[${linkText || "HelloShiva Resource"}](${linkUrl})`;
    insertTextAtCursor(linkStr);
    setShowLinkModal(false);
    setLinkUrl("");
    setLinkText("");
  };

  const applyImg = () => {
    if (!imgUrl) return;
    const imgStr = `\n\n![${imgAlt || "Diagram"}](${imgUrl})\n*${imgCaption || imgAlt}*\n\n`;
    insertTextAtCursor(imgStr);
    setShowImgModal(false);
    setImgUrl("");
    setImgAlt("");
    setImgCaption("");
  };

  const insertCallout = () => {
    const callout = `\n\n> 💡 **Executive Agency Takeaway:**  \n> Aligning code-level crawlability with commercial search intent captures qualified buyer demand without recurring pay-per-click costs.\n\n`;
    insertTextAtCursor(callout);
  };

  const insertTable = () => {
    const table = `\n\n| Technical Benchmark Metric | Industry Average | HelloShiva Standard |\n| :--- | :--- | :--- |\n| Largest Contentful Paint (LCP) | 3.4 seconds | Sub-1.2 seconds |\n| Interaction to Next Paint (INP) | 290 milliseconds | Sub-150 milliseconds |\n| High-Intent Search Alignment | 52% | 94%+ Commercial |\n\n`;
    insertTextAtCursor(table);
  };

  const insertFAQ = () => {
    const faq = `\n\n## Frequently Asked Questions\n\n### Why does this strategy drive higher ROI than cold advertising?\nCapturing prospects during active commercial search ensures highest buying intent while compounding organic visibility over time.\n\n### How fast can our team measure technical crawl gains?\nSearch indexing optimizations reflect in 3 to 6 weeks, with qualified sales pipeline maturing within 3 to 6 months.\n\n`;
    insertTextAtCursor(faq);
  };

  // --------------------------------------------------------------------------
  // Real-Time OpenSEO Score Calculator
  // --------------------------------------------------------------------------
  const calculateSeoScore = () => {
    let score = 0;
    const titleLen = edTitle.trim().length;
    const descLen = edExcerpt.trim().length;
    const words = edContent.trim() ? edContent.trim().split(/\s+/).filter(Boolean).length : 0;
    const h2Count = (edContent.match(/^##\s+.+$/gm) || []).length;
    const h3Count = (edContent.match(/^###\s+.+$/gm) || []).length;
    const hasFaq = /##\s*frequently asked questions|##\s*faq/i.test(edContent);
    const linkMatches = (edContent.match(/\[([^\]]+)\]\(([^)]+)\)/g) || []).length;
    const hasCta = /consultation|helloshiva|schedule|free tools/i.test(edContent);

    if (titleLen >= 45 && titleLen <= 65) score += 15;
    else if (titleLen > 20) score += 8;

    if (descLen >= 120 && descLen <= 165) score += 15;
    else if (descLen > 50) score += 8;

    if (words >= 800) score += 20;
    else if (words >= 400) score += 10;

    if (h2Count >= 2 && h3Count >= 1) score += 15;
    else if (h2Count >= 1) score += 8;

    if (hasFaq) score += 15;
    if (linkMatches >= 2) score += 10;
    if (hasCta) score += 10;

    return Math.min(100, score);
  };

  const seoScore = calculateSeoScore();
  const wordCount = edContent.trim() ? edContent.trim().split(/\s+/).filter(Boolean).length : 0;
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 225));

  // --------------------------------------------------------------------------
  // Tab 4: Multi-Channel Social Repurposing (5 Apps)
  // --------------------------------------------------------------------------
  const generateSocialPipeline = async () => {
    if (!edTitle.trim()) {
      alert("Please ensure the article has a headline in Step 3.");
      return;
    }
    setSocialLoading(true);
    try {
      const res = await fetch("/api/v1/content-studio/social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: edTitle,
          url: `https://helloshiva.com/blog/${edTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
          content: edContent,
          keywords: inKeywords,
        }),
      });
      const data = await res.json();
      if (data.success && data.channels) {
        setSocialChannels(data.channels);
        if (data.share_urls) setShareUrls(data.share_urls);
        setActiveTab("social");
        window.scrollTo({ top: 350, behavior: "smooth" });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSocialLoading(false);
    }
  };

  const copyChannelText = (channel: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedChannel(channel);
    setTimeout(() => setCopiedChannel(null), 2000);
  };

  return (
    <div className="space-y-8 font-sans pb-24">
      {/* =========================================================================
          BANNER / EYEBROW HEADER
          ========================================================================= */}
      <div className="bg-[#0B1025] border-b border-[#252B49] -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#6366F1]/15 text-[#8067FF] border border-[#6366F1]/30">
              <Sparkles className="w-3.5 h-3.5 text-[#8067FF]" />
              <span>INSTITUTIONAL CONTENT &amp; SOCIAL DISTRIBUTION STUDIO</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Content Engine &amp; Social Pipeline Studio
            </h1>
            <p className="text-xs sm:text-sm text-[#C6C9DC] max-w-3xl leading-relaxed">
              Plan 7-day SEO editorial calendars, uncover competitor search gaps, draft authoritative agency intelligence with Gemini AI, verify live OpenSEO score, and dispatch across 5 major social channels.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {isAiAvailable ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Gemini 2.0 Flash Active</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#8067FF]/15 text-[#8067FF] border border-[#8067FF]/30">
                <Sliders className="w-3.5 h-3.5" />
                <span>Deterministic Agency Engine</span>
              </span>
            )}
            <Link
              href="/admin/content-engine/articles"
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-[#C6C9DC] hover:text-white bg-[#171F42] hover:bg-[#252B49] border border-[#252B49] transition-colors"
            >
              Articles CRM
            </Link>
            <Link
              href="/admin/enquiries"
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#6366F1] to-[#8067FF] hover:opacity-90 transition-opacity"
            >
              Leads CRM
            </Link>
          </div>
        </div>
      </div>

      {/* =========================================================================
          TOP NAVIGATION TABS (Fluid End-to-End Progression)
          ========================================================================= */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#E6E7F0] pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("calendar")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
            activeTab === "calendar"
              ? "bg-[#0B1025] text-white shadow-md shadow-indigo-500/15"
              : "bg-white text-[#626985] hover:text-[#10183A] border border-[#E6E7F0]"
          }`}
        >
          <Calendar className="w-4 h-4 text-[#6366F1]" />
          <span>1. 7-Day Content Calendar</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("research")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
            activeTab === "research"
              ? "bg-[#0B1025] text-white shadow-md shadow-indigo-500/15"
              : "bg-white text-[#626985] hover:text-[#10183A] border border-[#E6E7F0]"
          }`}
        >
          <Search className="w-4 h-4 text-[#8067FF]" />
          <span>2. Keyword &amp; Competitor Lab</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("studio")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
            activeTab === "studio"
              ? "bg-[#0B1025] text-white shadow-md shadow-indigo-500/15"
              : "bg-white text-[#626985] hover:text-[#10183A] border border-[#E6E7F0]"
          }`}
        >
          <Wand2 className="w-4 h-4 text-[#6366F1]" />
          <span>3. Content Studio &amp; AI Draft</span>
          {edTitle && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("social")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
            activeTab === "social"
              ? "bg-[#0B1025] text-white shadow-md shadow-indigo-500/15"
              : "bg-white text-[#626985] hover:text-[#10183A] border border-[#E6E7F0]"
          }`}
        >
          <Share2 className="w-4 h-4 text-[#8067FF]" />
          <span>4. Social Dispatch (5 Apps)</span>
          {socialChannels.x_twitter && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
        </button>
      </div>

      {/* =========================================================================
          DESK 1: 7-DAY CONTENT PIPELINE & CALENDAR PLANNER
          ========================================================================= */}
      {activeTab === "calendar" && (
        <div className="bg-white rounded-3xl border border-[#E6E7F0] p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6E7F0] pb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-[#E8E7FF] text-[#6366F1]">
                <Calendar className="w-3.5 h-3.5" />
                <span>EDITORIAL RUNWAY AUTOMATION</span>
              </div>
              <h2 className="text-xl font-extrabold text-[#10183A] pt-1">
                7-Day Strategic Content &amp; SEO Calendar
              </h2>
              <p className="text-xs text-[#626985]">
                Map out a cohesive 7-day content runway targeting distinct buyer intents, competitor blindspots, and social hooks.
              </p>
            </div>

            <button
              type="button"
              onClick={generateCalendarPipeline}
              disabled={calLoading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#6366F1] to-[#8067FF] hover:opacity-90 shadow-md shadow-indigo-500/20 disabled:opacity-50 cursor-pointer"
            >
              {calLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Generating Weekly Runway...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate 7-Day Pipeline (Gemini AI)</span>
                </>
              )}
            </button>
          </div>

          {/* Parameters Filter */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#F5F4FF] p-4 rounded-2xl border border-[#E8E7FF]">
            <div>
              <label className="block text-[11px] font-bold text-[#626985] uppercase mb-1">
                Target Market / Industry Corridor
              </label>
              <select
                value={calMarket}
                onChange={(e) => setCalMarket(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#E6E7F0] text-xs text-[#10183A] font-semibold focus:outline-none"
              >
                <option value="Global Remote & India B2B">Global Remote &amp; India B2B</option>
                <option value="B2B SaaS & Tech Enterprise">B2B SaaS &amp; Tech Enterprise</option>
                <option value="D2C & High-Volume E-Commerce">D2C &amp; High-Volume E-Commerce</option>
                <option value="High-Ticket Professional Services">High-Ticket Professional Services</option>
                <option value="Multi-Location Local Brands">Multi-Location Local Brands</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#626985] uppercase mb-1">
                Optional Editorial Focus Themes
              </label>
              <input
                type="text"
                value={calFocus}
                onChange={(e) => setCalFocus(e.target.value)}
                placeholder="e.g. Performance Marketing, Technical SEO, Local 3-Pack, SaaS BOFU"
                className="w-full px-3.5 py-2 rounded-xl bg-white border border-[#E6E7F0] text-xs text-[#10183A] font-semibold focus:outline-none"
              />
            </div>
          </div>

          {/* 7 Days Cards Runway */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {calDays.map((day) => (
              <div
                key={day.day_number}
                className="bg-[#FAF9FF] border border-[#E6E7F0] hover:border-[#8067FF] rounded-2xl p-5 flex flex-col justify-between transition-all hover:shadow-md space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-md bg-[#0B1025] text-white">
                      Day {day.day_number}
                    </span>
                    <span className="text-xs font-bold text-[#626985]">
                      {day.weekday}, {day.date}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-[#10183A] leading-snug">
                    {day.proposed_headline}
                  </h3>

                  <div className="text-[11px] space-y-1 text-[#626985]">
                    <div>
                      <strong className="text-[#10183A]">Theme:</strong> {day.theme}
                    </div>
                    <div>
                      <strong className="text-[#10183A]">Target Query:</strong>{" "}
                      <code className="text-[#6366F1] font-mono">{day.primary_keyword}</code>
                    </div>
                    <div>
                      <strong className="text-[#10183A]">Intent:</strong> {day.search_intent}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border border-[#E6E7F0] text-[11px] text-[#626985] leading-relaxed">
                    <strong className="text-[#8067FF] block mb-0.5">Competitor Blindspot:</strong>
                    {day.competitor_gap}
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E6E7F0]">
                  <button
                    type="button"
                    onClick={() => loadDayIntoStudio(day)}
                    className="w-full py-2 rounded-xl text-xs font-bold text-[#6366F1] bg-[#E8E7FF] hover:bg-[#6366F1] hover:text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Draft in Studio</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          DESK 2: KEYWORD, COMPETITOR & BACKLINK RESEARCH LAB
          ========================================================================= */}
      {activeTab === "research" && (
        <div className="bg-white rounded-3xl border border-[#E6E7F0] p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-[#E6E7F0] pb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-[#E8E7FF] text-[#8067FF]">
              <Search className="w-3.5 h-3.5" />
              <span>MARKET INTELLIGENCE &amp; COMPETITOR LAB</span>
            </div>
            <h2 className="text-xl font-extrabold text-[#10183A] pt-1">
              Keyword, Competitor &amp; Backlink Research
            </h2>
            <p className="text-xs text-[#626985]">
              Analyze real search intent, identify blindspots left by competitor agency blogs, and discover high-authority citations.
            </p>
          </div>

          {/* Curated Strategic Clusters */}
          <div className="p-4 rounded-2xl bg-[#0B1025] text-white space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#8067FF] uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5" />
              <span>Curated Digital Marketing Clusters (Agency Repository):</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => selectPresetCluster("performance_marketing")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedClusterKey === "performance_marketing"
                    ? "bg-[#6366F1] text-white"
                    : "bg-[#171F42] text-[#C6C9DC] hover:text-white border border-[#252B49]"
                }`}
              >
                🏢 B2B Performance &amp; ROAS Scaling
              </button>
              <button
                type="button"
                onClick={() => selectPresetCluster("technical_seo")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedClusterKey === "technical_seo"
                    ? "bg-[#6366F1] text-white"
                    : "bg-[#171F42] text-[#C6C9DC] hover:text-white border border-[#252B49]"
                }`}
              >
                ⚡ Technical SEO &amp; Core Web Vitals
              </button>
              <button
                type="button"
                onClick={() => selectPresetCluster("local_seo")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedClusterKey === "local_seo"
                    ? "bg-[#6366F1] text-white"
                    : "bg-[#171F42] text-[#C6C9DC] hover:text-white border border-[#252B49]"
                }`}
              >
                📍 Local SEO &amp; Multi-Location 3-Pack
              </button>
              <button
                type="button"
                onClick={() => selectPresetCluster("b2b_saas_organic")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedClusterKey === "b2b_saas_organic"
                    ? "bg-[#6366F1] text-white"
                    : "bg-[#171F42] text-[#C6C9DC] hover:text-white border border-[#252B49]"
                }`}
              >
                📈 B2B SaaS BOFU Pipeline
              </button>
              <button
                type="button"
                onClick={() => selectPresetCluster("conversion_cro")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedClusterKey === "conversion_cro"
                    ? "bg-[#6366F1] text-white"
                    : "bg-[#171F42] text-[#C6C9DC] hover:text-white border border-[#252B49]"
                }`}
              >
                🎯 Conversion CRO &amp; Funnel UX
              </button>
            </div>
          </div>

          {/* Search Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-[11px] font-bold text-[#626985] uppercase mb-1">
                Target Topic / Keyword Query
              </label>
              <input
                type="text"
                value={resNiche}
                onChange={(e) => setResNiche(e.target.value)}
                placeholder="e.g. b2b performance marketing, sub second lcp nextjs, local 3-pack"
                className="w-full px-4 py-2.5 rounded-xl border border-[#E6E7F0] text-xs text-[#10183A] font-semibold focus:outline-none"
              />
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={() => runKeywordResearch()}
                disabled={resLoading}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#6366F1] to-[#8067FF] hover:opacity-90 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-indigo-500/20 disabled:opacity-50"
              >
                {resLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Analyzing Opportunities...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Analyze Opportunities (Gemini AI)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Research Results */}
          {researchData && (
            <div className="space-y-6 pt-4 border-t border-[#E6E7F0]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Keywords Left Column */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-extrabold text-[#10183A] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-[#6366F1]" />
                      <span>High-Intent Primary Keywords (Click to add)</span>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {researchData.primary_keywords.map((kw, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => applyKeywordToStudio(kw)}
                          className="px-3 py-1 rounded-xl text-xs font-bold bg-[#E8E7FF] text-[#6366F1] hover:bg-[#6366F1] hover:text-white transition-colors cursor-pointer"
                        >
                          + {kw}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-extrabold text-[#10183A] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-[#8067FF]" />
                      <span>Long-Tail Conversion Queries</span>
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {researchData.long_tail_keywords.map((kw, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => applyKeywordToStudio(kw)}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[#F5F4FF] text-[#626985] hover:text-[#10183A] border border-[#E6E7F0] transition-colors cursor-pointer"
                        >
                          + {kw}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Blindspots & Citations Right Column */}
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-[#0B1025] text-white space-y-1.5">
                    <span className="text-[11px] font-bold text-[#8067FF] uppercase tracking-wider block">
                      Competitor Blindspot &amp; Opportunity Gap:
                    </span>
                    <p className="text-xs text-[#C6C9DC] leading-relaxed">
                      {researchData.competitor_gaps}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#F5F4FF] border border-[#E8E7FF] space-y-1.5">
                    <span className="text-[11px] font-bold text-[#6366F1] uppercase tracking-wider block">
                      High-Authority Citation &amp; Backlink Targets:
                    </span>
                    <ul className="text-xs text-[#10183A] space-y-1 list-disc list-inside">
                      {researchData.backlink_opportunities.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* High-CTR Content Opportunities */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-extrabold text-[#10183A] uppercase tracking-wider">
                  Recommended Content Opportunity Angles (1-Click Draft):
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {researchData.content_opportunities.map((opp, i) => (
                    <div
                      key={i}
                      className="bg-[#FAF9FF] border border-[#E6E7F0] hover:border-[#6366F1] rounded-2xl p-4 flex flex-col justify-between space-y-3 transition-all"
                    >
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#E8E7FF] text-[#6366F1]">
                          {opp.recommended_format || "Market Authority Guide"}
                        </span>
                        <h5 className="text-xs font-bold text-[#10183A] leading-snug">
                          {opp.headline}
                        </h5>
                        <p className="text-[11px] text-[#626985] leading-relaxed">
                          {opp.angle}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => loadOpportunityIntoStudio(opp)}
                        className="w-full py-2 rounded-xl text-xs font-bold text-white bg-[#0B1025] hover:bg-[#171F42] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span>Use in Studio</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          DESK 3: CONTENT STUDIO & AI DRAFT ENGINE + FINE-TUNING EDITOR
          ========================================================================= */}
      {activeTab === "studio" && (
        <div className="space-y-8">
          {/* Top Form Card */}
          <div className="bg-white rounded-3xl border border-[#E6E7F0] p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6E7F0] pb-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-[#E8E7FF] text-[#6366F1]">
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>STEP 3 &bull; AI DRAFT &amp; RE-OPTIMIZATION STUDIO</span>
                </div>
                <h2 className="text-xl font-extrabold text-[#10183A] pt-1">
                  Drafting &amp; Fine-Tuning Studio
                </h2>
              </div>

              {/* Mode Switcher */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setStudioMode("new")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    studioMode === "new"
                      ? "bg-[#6366F1] text-white shadow-sm"
                      : "bg-[#F5F4FF] text-[#626985] hover:text-[#10183A] border border-[#E6E7F0]"
                  }`}
                >
                  Create New Article
                </button>
                <button
                  type="button"
                  onClick={() => setStudioMode("improve")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    studioMode === "improve"
                      ? "bg-[#6366F1] text-white shadow-sm"
                      : "bg-[#F5F4FF] text-[#626985] hover:text-[#10183A] border border-[#E6E7F0]"
                  }`}
                >
                  Improve Existing Article
                </button>
              </div>
            </div>

            {/* Mode A: New Article Form */}
            {studioMode === "new" && (
              <form onSubmit={runContentPipeline} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-[#626985] uppercase mb-1">
                      Target Focus Keywords *
                    </label>
                    <input
                      type="text"
                      required
                      value={inKeywords}
                      onChange={(e) => setInKeywords(e.target.value)}
                      placeholder="e.g. b2b performance marketing, google ads roas"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E7F0] text-xs font-semibold text-[#10183A] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#626985] uppercase mb-1">
                      Target Trend / Commercial Angle *
                    </label>
                    <input
                      type="text"
                      required
                      value={inTrend}
                      onChange={(e) => setInTrend(e.target.value)}
                      placeholder="e.g. First-Party Attribution & Eliminating Paid Ad Budget Waste"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E7F0] text-xs font-semibold text-[#10183A] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-[#626985] uppercase mb-1">
                      Target Market Corridor
                    </label>
                    <select
                      value={inMarket}
                      onChange={(e) => setInMarket(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E7F0] text-xs font-semibold text-[#10183A] focus:outline-none"
                    >
                      <option value="Global Remote & India B2B">Global Remote &amp; India B2B</option>
                      <option value="B2B SaaS & Tech Enterprise">B2B SaaS &amp; Tech Enterprise</option>
                      <option value="D2C & High-Volume E-Commerce">D2C &amp; High-Volume E-Commerce</option>
                      <option value="High-Ticket Professional Services">High-Ticket Professional Services</option>
                      <option value="Multi-Location Local Brands">Multi-Location Local Brands</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#626985] uppercase mb-1">
                      Editorial Format
                    </label>
                    <select
                      value={inContentType}
                      onChange={(e) => setInContentType(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E7F0] text-xs font-semibold text-[#10183A] focus:outline-none"
                    >
                      <option value="article">Market Authority Guide</option>
                      <option value="dossier">Technical Teardown Dossier</option>
                      <option value="checklist">Diagnostic Audit Checklist</option>
                      <option value="case-study">B2B Case Study</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#626985] uppercase mb-1">
                      Agency Service Anchor
                    </label>
                    <select
                      value={inServiceAnchor}
                      onChange={(e) => setInServiceAnchor(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E7F0] text-xs font-semibold text-[#10183A] focus:outline-none"
                    >
                      <option value="/services/performance-marketing">Performance Marketing</option>
                      <option value="/services/technical-seo">Technical SEO Services</option>
                      <option value="/services/seo-services">Comprehensive SEO</option>
                      <option value="/services/local-seo">Local SEO Domination</option>
                      <option value="/services/content-marketing">Content Marketing</option>
                      <option value="/tools/seo-page-analyzer">Free SEO Page Analyzer</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#626985] uppercase mb-1">
                    Custom Brief / Implementation Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={inBrief}
                    onChange={(e) => setInBrief(e.target.value)}
                    placeholder="e.g. Include specific code examples for requestAnimationFrame and server response header directives."
                    className="w-full px-3.5 py-2 rounded-xl border border-[#E6E7F0] text-xs text-[#10183A] focus:outline-none"
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                  <div className="flex items-center gap-4 text-xs font-semibold text-[#626985]">
                    <label className="inline-flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="engine"
                        checked={studioEngine === "ai"}
                        onChange={() => setStudioEngine("ai")}
                        className="accent-[#6366F1]"
                      />
                      <span>Gemini AI Engine ({selectedModel})</span>
                    </label>
                    <label className="inline-flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="engine"
                        checked={studioEngine === "template"}
                        onChange={() => setStudioEngine("template")}
                        className="accent-[#6366F1]"
                      />
                      <span>Deterministic Template</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={pipelineLoading}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#6366F1] to-[#8067FF] hover:opacity-90 shadow-md shadow-indigo-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {pipelineLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Generating High-Authority Draft...</span>
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4" />
                        <span>Generate Article with AI</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Mode B: Improve Existing Form */}
            {studioMode === "improve" && (
              <form onSubmit={runArticleImprovement} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-[#626985] uppercase mb-1">
                      Select Article from Database to Re-Optimize *
                    </label>
                    <select
                      required
                      value={impArticleId}
                      onChange={(e) => setImpArticleId(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E7F0] text-xs font-semibold text-[#10183A] focus:outline-none"
                    >
                      <option value="">-- Choose an article to enhance --</option>
                      {existingArticles.map((art) => (
                        <option key={art.id} value={art.id}>
                          {art.title} ({art.category})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#626985] uppercase mb-1">
                      Additional Keywords to Inject
                    </label>
                    <input
                      type="text"
                      value={impKeywords}
                      onChange={(e) => setImpKeywords(e.target.value)}
                      placeholder="e.g. sub-second lcp, inp optimization, nextjs"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E7F0] text-xs font-semibold text-[#10183A] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#626985] uppercase mb-1">
                    Improvement Goal / Re-Optimization Brief *
                  </label>
                  <input
                    type="text"
                    required
                    value={impGoal}
                    onChange={(e) => setImpGoal(e.target.value)}
                    placeholder="e.g. Inject structured FAQ schema, upgrade subheadings for higher CTR, and boost commercial keyword density."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E7F0] text-xs text-[#10183A] focus:outline-none"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={impLoading || !impArticleId}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#6366F1] to-[#8067FF] hover:opacity-90 shadow-md shadow-indigo-500/25 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {impLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Re-Optimizing Article...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Re-Optimize Article with AI</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* =========================================================================
              FINE-TUNING TEXT EDITOR DESK
              ========================================================================= */}
          <div className="bg-white rounded-3xl border border-[#E6E7F0] p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6E7F0] pb-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-[#E8E7FF] text-[#6366F1]">
                  <FileText className="w-3.5 h-3.5" />
                  <span>STEP 4 &bull; FINE-TUNE, ENRICH &amp; PUBLISH</span>
                </div>
                <h2 className="text-xl font-extrabold text-[#10183A] pt-1">
                  Fine-Tune Generated Article &amp; Live OpenSEO Audit
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-[#626985] bg-[#F5F4FF] px-3 py-1.5 rounded-xl border border-[#E6E7F0]">
                  {wordCount} words &bull; {readTimeMinutes} min read
                </span>
                <div className="flex rounded-xl bg-[#F5F4FF] p-1 border border-[#E6E7F0]">
                  <button
                    type="button"
                    onClick={() => setEditorMode("visual")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      editorMode === "visual" ? "bg-white text-[#10183A] shadow-xs" : "text-[#626985]"
                    }`}
                  >
                    Editor
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditorMode("preview")}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      editorMode === "preview" ? "bg-white text-[#10183A] shadow-xs" : "text-[#626985]"
                    }`}
                  >
                    Formatted Preview
                  </button>
                </div>
              </div>
            </div>

            {/* Title & Category */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-[11px] font-bold text-[#626985] uppercase mb-1">
                  Article Headline / Title *
                </label>
                <input
                  type="text"
                  value={edTitle}
                  onChange={(e) => setEdTitle(e.target.value)}
                  placeholder="Article Headline..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E6E7F0] text-sm font-bold text-[#10183A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#626985] uppercase mb-1">
                  Category
                </label>
                <select
                  value={edCategory}
                  onChange={(e) => setEdCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E7F0] text-xs font-semibold text-[#10183A] focus:outline-none"
                >
                  <option value="Market Insights">Market Insights</option>
                  <option value="Technical SEO & Web Engineering">Technical SEO &amp; Web Engineering</option>
                  <option value="Performance Marketing">Performance Marketing</option>
                  <option value="Local SEO & Growth">Local SEO &amp; Growth</option>
                  <option value="Conversion Optimization">Conversion Optimization</option>
                </select>
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-[11px] font-bold text-[#626985] uppercase mb-1">
                Executive Excerpt (SERP Snippet &amp; Social Lead)
              </label>
              <textarea
                rows={2}
                value={edExcerpt}
                onChange={(e) => setEdExcerpt(e.target.value)}
                placeholder="140-160 character meta description summarizing intent..."
                className="w-full px-4 py-2 rounded-xl border border-[#E6E7F0] text-xs text-[#10183A] focus:outline-none"
              />
            </div>

            {/* Rich Formatting Toolbar */}
            <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-2xl bg-[#0B1025] text-white border border-[#252B49]">
              <button
                type="button"
                onClick={() => insertTextAtCursor("## ")}
                className="px-2.5 py-1 rounded-lg text-xs font-bold text-[#C6C9DC] hover:text-white bg-[#171F42] hover:bg-[#252B49]"
                title="Heading 2"
              >
                H2
              </button>
              <button
                type="button"
                onClick={() => insertTextAtCursor("### ")}
                className="px-2.5 py-1 rounded-lg text-xs font-bold text-[#C6C9DC] hover:text-white bg-[#171F42] hover:bg-[#252B49]"
                title="Heading 3"
              >
                H3
              </button>
              <button
                type="button"
                onClick={() => insertTextAtCursor("**", "**")}
                className="px-2.5 py-1 rounded-lg text-xs font-bold text-[#C6C9DC] hover:text-white bg-[#171F42] hover:bg-[#252B49]"
                title="Bold"
              >
                B
              </button>
              <button
                type="button"
                onClick={() => insertTextAtCursor("*", "*")}
                className="px-2.5 py-1 rounded-lg text-xs font-bold text-[#C6C9DC] hover:text-white bg-[#171F42] hover:bg-[#252B49]"
                title="Italic"
              >
                I
              </button>

              <span className="text-[#252B49] px-1">|</span>

              <button
                type="button"
                onClick={() => setShowLinkModal(true)}
                className="px-2.5 py-1 rounded-lg text-xs font-bold text-[#8067FF] bg-[#171F42] hover:bg-[#252B49] flex items-center gap-1"
                title="Insert Link"
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>+ Agency Link</span>
              </button>

              <button
                type="button"
                onClick={() => setShowImgModal(true)}
                className="px-2.5 py-1 rounded-lg text-xs font-bold text-[#6366F1] bg-[#171F42] hover:bg-[#252B49] flex items-center gap-1"
                title="Insert Image"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>+ SEO Image</span>
              </button>

              <button
                type="button"
                onClick={insertTable}
                className="px-2.5 py-1 rounded-lg text-xs font-bold text-[#C6C9DC] hover:text-white bg-[#171F42] hover:bg-[#252B49] flex items-center gap-1"
                title="Insert Metrics Table"
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span>+ Table</span>
              </button>

              <button
                type="button"
                onClick={insertCallout}
                className="px-2.5 py-1 rounded-lg text-xs font-bold text-amber-300 bg-[#171F42] hover:bg-[#252B49] flex items-center gap-1"
                title="Insert Callout"
              >
                <span>💡 + Callout Box</span>
              </button>

              <button
                type="button"
                onClick={insertFAQ}
                className="px-2.5 py-1 rounded-lg text-xs font-bold text-emerald-400 bg-[#171F42] hover:bg-[#252B49] flex items-center gap-1"
                title="Insert FAQ Section"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>+ FAQ Section</span>
              </button>
            </div>

            {/* Editor Textarea / Preview */}
            {editorMode === "visual" ? (
              <textarea
                ref={textareaRef}
                rows={22}
                value={edContent}
                onChange={(e) => setEdContent(e.target.value)}
                placeholder="Draft or fine-tune your high-authority article in clean markdown..."
                className="w-full px-5 py-4 rounded-2xl bg-[#0B1025] text-[#C6C9DC] font-mono text-xs leading-relaxed border border-[#252B49] focus:outline-none"
              />
            ) : (
              <div className="p-8 rounded-3xl border border-[#E6E7F0] bg-white text-xs leading-relaxed space-y-4">
                <h1 className="text-2xl font-black text-[#10183A]">{edTitle || "Untitled Guide"}</h1>
                <p className="text-xs text-[#626985] italic">{edExcerpt}</p>
                <div className="border-t border-[#E6E7F0] pt-4">
                  <MarkdownRenderer content={edContent} />
                </div>
              </div>
            )}

            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[#E6E7F0]">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={publishToWebsite}
                  disabled={publishing || !edTitle.trim()}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90 shadow-md shadow-emerald-500/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {publishing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Publishing to Website...</span>
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-4 h-4" />
                      <span>Save &amp; Publish to Website</span>
                    </>
                  )}
                </button>

                {publishStatus && (
                  <span
                    className={`text-xs font-bold ${
                      publishStatus.success ? "text-emerald-600" : "text-red-500"
                    }`}
                  >
                    {publishStatus.message}{" "}
                    {publishStatus.url && (
                      <a
                        href={publishStatus.url}
                        target="_blank"
                        rel="noreferrer"
                        className="underline ml-1 text-[#6366F1]"
                      >
                        View Live &rarr;
                      </a>
                    )}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={generateSocialPipeline}
                disabled={socialLoading || !edTitle.trim()}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#6366F1] to-[#8067FF] hover:opacity-90 shadow-md shadow-indigo-500/25 flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {socialLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Formatting 5 Channels...</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4" />
                    <span>Generate Social Media Pipeline (5 Apps) &rarr;</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* =========================================================================
              LIVE OPENSEO AUDIT PANEL (Positioned Below Editor)
              ========================================================================= */}
          <div className="bg-white rounded-3xl border border-[#E6E7F0] p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6E7F0] pb-6">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-[#E8E7FF] text-[#6366F1]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>LIVE OPENSEO QUANTITATIVE AUDIT</span>
                </div>
                <h3 className="text-lg font-bold text-[#10183A]">
                  Real-Time Content Optimization Score &amp; Recommendations
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl text-white shadow-md ${
                    seoScore >= 80 ? "bg-emerald-500" : seoScore >= 60 ? "bg-amber-500" : "bg-red-500"
                  }`}
                >
                  {seoScore}
                </div>
                <div className="text-xs">
                  <div className="font-extrabold text-[#10183A]">
                    {seoScore >= 80 ? "SEO Production Ready" : seoScore >= 60 ? "Needs Polish" : "Sub-Optimal"}
                  </div>
                  <div className="text-[11px] text-[#626985]">Target: 80+ / 100</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-[#FAF9FF] border border-[#E6E7F0] space-y-1">
                <div className="text-[11px] font-bold text-[#626985] uppercase">Title Length</div>
                <div className="text-sm font-black text-[#10183A]">{edTitle.length} chars</div>
                <div className="text-[11px] text-[#626985]">Target: 45–65 characters</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF9FF] border border-[#E6E7F0] space-y-1">
                <div className="text-[11px] font-bold text-[#626985] uppercase">Meta Description</div>
                <div className="text-sm font-black text-[#10183A]">{edExcerpt.length} chars</div>
                <div className="text-[11px] text-[#626985]">Target: 120–165 characters</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF9FF] border border-[#E6E7F0] space-y-1">
                <div className="text-[11px] font-bold text-[#626985] uppercase">Word Depth</div>
                <div className="text-sm font-black text-[#10183A]">{wordCount} words</div>
                <div className="text-[11px] text-[#626985]">Target: ≥ 800 words</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF9FF] border border-[#E6E7F0] space-y-1">
                <div className="text-[11px] font-bold text-[#626985] uppercase">FAQ Schema</div>
                <div className="text-sm font-black text-[#10183A]">
                  {/##\s*frequently asked questions|##\s*faq/i.test(edContent) ? "Detected ✅" : "Missing ❌"}
                </div>
                <div className="text-[11px] text-[#626985]">Rich Snippets Ready</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          DESK 4: SOCIAL MEDIA MULTI-CHANNEL DISTRIBUTION HUB (5 APPS)
          ========================================================================= */}
      {activeTab === "social" && (
        <div className="bg-white rounded-3xl border border-[#E6E7F0] p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6E7F0] pb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-[#E8E7FF] text-[#8067FF]">
                <Share2 className="w-3.5 h-3.5" />
                <span>STEP 5 &bull; MULTI-CHANNEL SOCIAL DISPATCH</span>
              </div>
              <h2 className="text-xl font-extrabold text-[#10183A] pt-1">
                Social Media Campaign Hub (5 Channels)
              </h2>
              <p className="text-xs text-[#626985]">
                Tailored platform-native copy formatted for X, LinkedIn, Facebook, Instagram, and Reddit.
              </p>
            </div>

            <button
              type="button"
              onClick={generateSocialPipeline}
              disabled={socialLoading}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#6366F1] to-[#8067FF] hover:opacity-90 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${socialLoading ? "animate-spin" : ""}`} />
              <span>Regenerate Social Copy</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 1. X / Twitter */}
            <div className="bg-[#FAF9FF] border border-[#E6E7F0] rounded-2xl p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#10183A] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-black" />
                    <span>X.com (Twitter Thread)</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => copyChannelText("twitter", socialChannels.x_twitter)}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-[#6366F1] bg-[#E8E7FF] hover:bg-[#6366F1] hover:text-white transition-colors"
                  >
                    {copiedChannel === "twitter" ? "Copied!" : "Copy"}
                  </button>
                </div>
                <textarea
                  readOnly
                  rows={8}
                  value={socialChannels.x_twitter}
                  className="w-full p-3 rounded-xl bg-white border border-[#E6E7F0] text-xs text-[#10183A] font-mono leading-relaxed focus:outline-none"
                />
              </div>

              {shareUrls.x_twitter && (
                <a
                  href={shareUrls.x_twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-black hover:opacity-90 flex items-center justify-center gap-1.5"
                >
                  <span>Post Directly on X.com</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            {/* 2. LinkedIn */}
            <div className="bg-[#FAF9FF] border border-[#E6E7F0] rounded-2xl p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#0a66c2] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#0a66c2]" />
                    <span>LinkedIn (B2B Executive Post)</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => copyChannelText("linkedin", socialChannels.linkedin)}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-[#6366F1] bg-[#E8E7FF] hover:bg-[#6366F1] hover:text-white transition-colors"
                  >
                    {copiedChannel === "linkedin" ? "Copied!" : "Copy"}
                  </button>
                </div>
                <textarea
                  readOnly
                  rows={8}
                  value={socialChannels.linkedin}
                  className="w-full p-3 rounded-xl bg-white border border-[#E6E7F0] text-xs text-[#10183A] leading-relaxed focus:outline-none"
                />
              </div>

              {shareUrls.linkedin && (
                <a
                  href={shareUrls.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-[#0a66c2] hover:opacity-90 flex items-center justify-center gap-1.5"
                >
                  <span>Share on LinkedIn</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            {/* 3. Facebook */}
            <div className="bg-[#FAF9FF] border border-[#E6E7F0] rounded-2xl p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#1877f2] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#1877f2]" />
                    <span>Facebook (Agency Advisory)</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => copyChannelText("facebook", socialChannels.facebook)}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-[#6366F1] bg-[#E8E7FF] hover:bg-[#6366F1] hover:text-white transition-colors"
                  >
                    {copiedChannel === "facebook" ? "Copied!" : "Copy"}
                  </button>
                </div>
                <textarea
                  readOnly
                  rows={8}
                  value={socialChannels.facebook}
                  className="w-full p-3 rounded-xl bg-white border border-[#E6E7F0] text-xs text-[#10183A] leading-relaxed focus:outline-none"
                />
              </div>

              {shareUrls.facebook && (
                <a
                  href={shareUrls.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-[#1877f2] hover:opacity-90 flex items-center justify-center gap-1.5"
                >
                  <span>Share on Facebook</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            {/* 4. Instagram (Carousel + Caption) */}
            <div className="bg-[#FAF9FF] border border-[#E6E7F0] rounded-2xl p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#e1306c] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#e1306c]" />
                    <span>Instagram (5-Slide Carousel Guide)</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => copyChannelText("instagram", socialChannels.instagram)}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-[#6366F1] bg-[#E8E7FF] hover:bg-[#6366F1] hover:text-white transition-colors"
                  >
                    {copiedChannel === "instagram" ? "Copied!" : "Copy"}
                  </button>
                </div>
                <textarea
                  readOnly
                  rows={8}
                  value={socialChannels.instagram}
                  className="w-full p-3 rounded-xl bg-white border border-[#E6E7F0] text-xs text-[#10183A] leading-relaxed focus:outline-none"
                />
              </div>

              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-90 flex items-center justify-center gap-1.5"
              >
                <span>Open Instagram to Post</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* 5. Reddit */}
            <div className="bg-[#FAF9FF] border border-[#E6E7F0] rounded-2xl p-5 flex flex-col justify-between space-y-4 lg:col-span-2">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#ff4500] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#ff4500]" />
                    <span>Reddit (Deep Dive Technical Breakdown &bull; r/SEO or r/marketing)</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => copyChannelText("reddit", socialChannels.reddit)}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-[#6366F1] bg-[#E8E7FF] hover:bg-[#6366F1] hover:text-white transition-colors"
                  >
                    {copiedChannel === "reddit" ? "Copied!" : "Copy"}
                  </button>
                </div>
                <textarea
                  readOnly
                  rows={8}
                  value={socialChannels.reddit}
                  className="w-full p-3 rounded-xl bg-white border border-[#E6E7F0] text-xs text-[#10183A] font-mono leading-relaxed focus:outline-none"
                />
              </div>

              {shareUrls.reddit && (
                <a
                  href={shareUrls.reddit}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-[#ff4500] hover:opacity-90 flex items-center justify-center gap-1.5"
                >
                  <span>Submit to Reddit</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODALS: LINK & IMAGE
          ========================================================================= */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-[#171F42] border border-[#252B49] rounded-3xl p-6 max-w-md w-full space-y-4 text-white shadow-2xl">
            <h3 className="text-sm font-bold flex items-center gap-2 text-[#8067FF]">
              <LinkIcon className="w-4 h-4" />
              <span>Insert Agency Service / Tool Link</span>
            </h3>

            {/* Quick Chips */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-[#C6C9DC] uppercase">Quick Internal Links:</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { name: "Performance Marketing", url: "/services/performance-marketing" },
                  { name: "Technical SEO", url: "/services/technical-seo" },
                  { name: "Local SEO", url: "/services/local-seo" },
                  { name: "SEO Analyzer", url: "/tools/seo-page-analyzer" },
                  { name: "HTTP Headers", url: "/tools/http-headers-checker" },
                  { name: "Contact Desk", url: "/contact" },
                ].map((c) => (
                  <button
                    key={c.url}
                    type="button"
                    onClick={() => {
                      setLinkUrl(c.url);
                      if (!linkText) setLinkText(`HelloShiva ${c.name}`);
                    }}
                    className="px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-[#0B1025] hover:bg-[#6366F1] text-[#C6C9DC] hover:text-white border border-[#252B49]"
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#C6C9DC] mb-1">Target URL</label>
              <input
                type="text"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="/services/seo-services or https://..."
                className="w-full px-3 py-2 rounded-xl bg-[#0B1025] border border-[#252B49] text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#C6C9DC] mb-1">Anchor Text</label>
              <input
                type="text"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
                placeholder="e.g. HelloShiva Technical SEO Services"
                className="w-full px-3 py-2 rounded-xl bg-[#0B1025] border border-[#252B49] text-xs text-white focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#C6C9DC] hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={applyLink}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#6366F1] to-[#8067FF]"
              >
                Insert Link
              </button>
            </div>
          </div>
        </div>
      )}

      {showImgModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-[#171F42] border border-[#252B49] rounded-3xl p-6 max-w-md w-full space-y-4 text-white shadow-2xl">
            <h3 className="text-sm font-bold flex items-center gap-2 text-[#6366F1]">
              <ImageIcon className="w-4 h-4" />
              <span>Insert Image with SEO Metadata</span>
            </h3>

            <div>
              <label className="block text-[11px] font-semibold text-[#C6C9DC] mb-1">Image URL / Path</label>
              <input
                type="text"
                value={imgUrl}
                onChange={(e) => setImgUrl(e.target.value)}
                placeholder="https://... or /images/..."
                className="w-full px-3 py-2 rounded-xl bg-[#0B1025] border border-[#252B49] text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#C6C9DC] mb-1">Image Alt Text (SEO)</label>
              <input
                type="text"
                value={imgAlt}
                onChange={(e) => setImgAlt(e.target.value)}
                placeholder="e.g. Diagram illustrating Core Web Vitals LCP optimization"
                className="w-full px-3 py-2 rounded-xl bg-[#0B1025] border border-[#252B49] text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#C6C9DC] mb-1">Caption (Optional)</label>
              <input
                type="text"
                value={imgCaption}
                onChange={(e) => setImgCaption(e.target.value)}
                placeholder="e.g. Figure 1: Sub-second Largest Contentful Paint timeline"
                className="w-full px-3 py-2 rounded-xl bg-[#0B1025] border border-[#252B49] text-xs text-white focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowImgModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#C6C9DC] hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={applyImg}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#6366F1] to-[#8067FF]"
              >
                Insert Image
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ContentStudioPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-[#626985]">Loading Content Studio...</div>}>
      <ContentStudioInner />
    </Suspense>
  );
}
