"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  Save,
  Send,
  Eye,
  Edit3,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Plus,
  RefreshCw,
  ArrowLeft,
  Calendar,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Tag,
  Wrench,
  Layers,
  Heading2,
  Heading3,
  Bold,
  Italic,
  List,
  Code,
  Quote,
  Clock,
  X,
} from "lucide-react";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { siteConfig } from "@/config/site";

interface AuditResult {
  score: number;
  words: number;
  readTimeMinutes: number;
  titleLength: number;
  metaLength: number;
  checklist: { item: string; current: string; benchmark: string; passed: boolean; tip: string }[];
  links: { totalInternal: number; serviceLinks: number; toolLinks: number; externalLinks: number };
  keywordDensity: number;
  faqCount: number;
}

function detectPillarCategoryFromTitle(title: string) {
  const text = title.toLowerCase();
  if (/content|copywrit|editorial|blog|storytelling|niche|attract.*customer|brand.*voice/i.test(text)) {
    return { service: "content-marketing", tool: "keyword-density-checker", category: "Content Marketing" };
  }
  if (/ppc|adwords|google ads|meta ads|facebook ads|paid|cpc|roas|cac|conversion rate|cro|landing page/i.test(text)) {
    return { service: "performance-marketing", tool: "utm-builder", category: "Performance Marketing" };
  }
  if (/social|linkedin|instagram|twitter|thread|carousel|community|personal brand|executive/i.test(text)) {
    return { service: "social-media-marketing", tool: "open-graph-preview", category: "Social Media" };
  }
  if (/web|nextjs|react|headless|wordpress|speed|infrastructure|design|develop|frontend/i.test(text)) {
    return { service: "web-development", tool: "http-headers-checker", category: "Web Engineering" };
  }
  if (/local|google business|gmb|citation|near me|maps/i.test(text)) {
    return { service: "local-seo", tool: "serp-preview", category: "Local SEO" };
  }
  return { service: "technical-seo", tool: "seo-page-analyzer", category: "Technical SEO" };
}

function deriveKeywordFromTitle(title: string) {
  const clean = title
    .replace(/^(the|how to|why|what is|a guide to|mastering|unlocking)\s+/i, "")
    .split(/[:\-|–—]/)[0]
    .trim();
  return clean || title;
}

function EditorComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL Params prefill
  const paramHeadline = searchParams.get("headline") || searchParams.get("title") || "";
  const paramKeyword = searchParams.get("keyword") || "";
  const paramIntent = searchParams.get("intent") || "Commercial";
  const paramArticleId = searchParams.get("article_id") || "";
  const paramServiceSlug = searchParams.get("target_service_slug") || "";
  const paramToolSlug = searchParams.get("related_free_tool_slug") || "";

  // Initial smart defaults
  const initialTitle = paramHeadline || "Niche Content Marketing: Developing a Strategy That Attracts High-LTV Customers";
  const detected = detectPillarCategoryFromTitle(initialTitle);

  // Form State
  const [articleId, setArticleId] = useState<string>(paramArticleId || "");
  const [title, setTitle] = useState(initialTitle);
  const [slug, setSlug] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [primaryKeyword, setPrimaryKeyword] = useState(paramKeyword || deriveKeywordFromTitle(initialTitle));
  const [targetService, setTargetService] = useState(paramServiceSlug || detected.service);
  const [relatedTool, setRelatedTool] = useState(paramToolSlug || detected.tool);
  const [category, setCategory] = useState(detected.category);
  const [contentMarkdown, setContentMarkdown] = useState("");
  const [status, setStatus] = useState<"DRAFT" | "SCHEDULED" | "PUBLISHED">("DRAFT");

  // Scheduling State & Modal
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split("T")[0];
  const [scheduledDate, setScheduledDate] = useState(tomorrowStr);
  const [scheduledTime, setScheduledTime] = useState("10:00 AM");
  const [timezone, setTimezone] = useState("IST (UTC+5:30)");
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  // View & Status State
  const [viewMode, setViewMode] = useState<"EDIT" | "PREVIEW">("EDIT");
  const [isDrafting, setIsDrafting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // SEO Audit State
  const [audit, setAudit] = useState<AuditResult | null>(null);
  const [editorialValidation, setEditorialValidation] = useState<any>(null);
  const [contentBrief, setContentBrief] = useState<any>(null);

  // Sync Slug & Category when Title changes
  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    setHasUnsavedChanges(true);

    // Auto-update slug if empty or standard
    const generatedSlug = newTitle
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .slice(0, 75);
    setSlug(generatedSlug);

    // Smart detect category & tools if not manually overridden
    const smart = detectPillarCategoryFromTitle(newTitle);
    setCategory(smart.category);
    setTargetService(smart.service);
    setRelatedTool(smart.tool);

    // Auto update keyword if empty or generic
    if (!primaryKeyword || primaryKeyword === "technical seo crawl budget rendering") {
      setPrimaryKeyword(deriveKeywordFromTitle(newTitle));
    }
  };

  // Initial slug generation
  useEffect(() => {
    if (!slug && title) {
      setSlug(
        title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .trim()
          .replace(/\s+/g, "-")
          .slice(0, 75)
      );
    }
  }, [title, slug]);

  // Load existing article if paramArticleId is present
  useEffect(() => {
    if (paramArticleId) {
      fetch(`/api/v1/content-intelligence/articles?id=${paramArticleId}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.success && data.article) {
            const a = data.article;
            setArticleId(a.id);
            setTitle(a.title);
            setSlug(a.slug);
            setMetaDescription(a.meta_description || "");
            setContentMarkdown(a.content_markdown || "");
            setStatus(a.status || "DRAFT");
            setPrimaryKeyword(a.primary_keyword || deriveKeywordFromTitle(a.title));
            if (a.target_service_slug) setTargetService(a.target_service_slug);
            if (a.related_free_tool_slug) setRelatedTool(a.related_free_tool_slug);
            if (a.category) setCategory(a.category);
            if (a.scheduled_date) setScheduledDate(a.scheduled_date);
            if (a.scheduled_time) setScheduledTime(a.scheduled_time);
            if (a.timezone) setTimezone(a.timezone);
          }
        });
    }
  }, [paramArticleId]);

  // Trigger SEO Audit on change
  const runSeoAudit = async () => {
    setIsAuditing(true);
    try {
      const res = await fetch("/api/v1/content-intelligence/seo-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          metaDescription,
          markdown: contentMarkdown,
          primaryKeyword,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAudit(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAuditing(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (contentMarkdown || title) {
        runSeoAudit();
      }
    }, 700);
    return () => clearTimeout(timer);
  }, [contentMarkdown, title, metaDescription, primaryKeyword]);

  // Extract Outline from Markdown (Headings)
  const outline = useMemo(() => {
    const lines = contentMarkdown.split("\n");
    return lines
      .filter((l) => /^#{2,3}\s+/.test(l))
      .map((l) => ({
        level: l.startsWith("###") ? 3 : 2,
        text: l.replace(/^#{2,3}\s+/, "").trim(),
      }));
  }, [contentMarkdown]);

  // AI Drafting Trigger
  const handleGenerateDraft = async () => {
    setIsDrafting(true);
    setMessage(null);
    try {
      const res = await fetch("/api/v1/content-intelligence/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          primaryKeyword,
          targetServiceSlug: targetService,
          relatedFreeToolSlug: relatedTool,
          searchIntent: paramIntent,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setContentMarkdown(data.markdown);
        if (data.metaDescription) {
          setMetaDescription(data.metaDescription);
        }
        if (data.primaryKeyword) {
          setPrimaryKeyword(data.primaryKeyword);
        }
        if (data.targetServiceSlug) {
          setTargetService(data.targetServiceSlug);
        }
        if (data.relatedFreeToolSlug) {
          setRelatedTool(data.relatedFreeToolSlug);
        }
        if (data.brief) setContentBrief(data.brief);
        if (data.validation) setEditorialValidation(data.validation);
        setHasUnsavedChanges(true);
        setMessage({
          text: `AI Draft successfully generated for "${title}" with HelloShiva branding & ${data.modelUsed}!`,
          type: "success",
        });
      } else {
        setMessage({ text: data.error || "Failed to generate draft", type: "error" });
      }
    } catch (err: any) {
      setMessage({ text: err.message, type: "error" });
    } finally {
      setIsDrafting(false);
    }
  };

  // Save / Publish
  const handleSave = async (
    targetStatus: "DRAFT" | "SCHEDULED" | "PUBLISHED",
    customDate?: string,
    customTime?: string,
    customTz?: string
  ) => {
    setIsSaving(true);
    setMessage(null);
    try {
      const finalDate = customDate || scheduledDate;
      const finalTime = customTime || scheduledTime;
      const finalTz = customTz || timezone;

      const payload = {
        id: articleId || undefined,
        title,
        slug,
        meta_description: metaDescription,
        content_markdown: contentMarkdown,
        primary_keyword: primaryKeyword,
        target_service_slug: targetService,
        related_free_tool_slug: relatedTool,
        category,
        status: targetStatus,
        scheduled_date: targetStatus === "SCHEDULED" ? finalDate : null,
        scheduled_time: targetStatus === "SCHEDULED" ? finalTime : null,
        timezone: targetStatus === "SCHEDULED" ? finalTz : null,
      };

      const url = "/api/v1/content-intelligence/articles";
      const method = articleId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.article) {
        setArticleId(data.article.id);
        setStatus(targetStatus);
        setHasUnsavedChanges(false);

        if (targetStatus === "SCHEDULED") {
          setMessage({
            text: `Article successfully scheduled for automated publication on ${finalDate} at ${finalTime} (${finalTz})!`,
            type: "success",
          });
        } else if (targetStatus === "PUBLISHED") {
          setMessage({
            text: "Article AUTHORIZED & PUBLISHED LIVE on /blog!",
            type: "success",
          });
        } else {
          setMessage({
            text: "Article draft saved successfully!",
            type: "success",
          });
        }
      } else {
        setMessage({ text: data.error || "Save failed", type: "error" });
      }
    } catch (err: any) {
      setMessage({ text: err.message, type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    setShowScheduleModal(false);
    handleSave("SCHEDULED", scheduledDate, scheduledTime, timezone);
  };

  // Formatting Toolbar Helper
  const insertText = (snippet: string) => {
    setContentMarkdown((prev) => prev + "\n\n" + snippet);
    setHasUnsavedChanges(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/content-intelligence/articles"
            className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                Stage 7 & 8 • Content Studio & Editor
              </span>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                  status === "PUBLISHED"
                    ? "bg-emerald-50 text-emerald-700"
                    : status === "SCHEDULED"
                    ? "bg-amber-50 text-amber-700"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                {status}
              </span>
              {hasUnsavedChanges && (
                <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                  Unsaved Edits
                </span>
              )}
            </div>
            <h1 className="text-xl font-bold text-[#0B1025] mt-1 truncate max-w-xl">
              {title || "Untitled Article"}
            </h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleGenerateDraft}
            disabled={isDrafting}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-50 text-violet-700 hover:bg-violet-100 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
          >
            {isDrafting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>{isDrafting ? "Writing with Gemini..." : "Generate / Refresh AI Draft"}</span>
          </button>

          <button
            onClick={() => handleSave("DRAFT")}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold transition-all cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Draft</span>
          </button>

          <button
            onClick={() => setShowScheduleModal(true)}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-100 text-xs font-bold transition-all cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Schedule</span>
          </button>

          <button
            onClick={() => handleSave("PUBLISHED")}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-extrabold shadow-md shadow-emerald-500/20 hover:opacity-95 transition-all cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Authorize Release (Publish Live)</span>
          </button>
        </div>
      </div>

      {/* Alert Notifications */}
      {message && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold flex items-center justify-between ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-rose-50 text-rose-800 border border-rose-200"
          }`}
        >
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="text-slate-400 hover:text-slate-600">
            ×
          </button>
        </div>
      )}

      {/* 3-Panel Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Panel: Document Outline (Col 1-2) */}
        <div className="lg:col-span-3 bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-4 sticky top-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              Document Outline
            </span>
            <span className="text-[11px] font-semibold text-slate-400">
              {outline.length} Sections
            </span>
          </div>

          <div className="space-y-1.5 max-h-[60vh] overflow-y-auto pr-1">
            {outline.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No headings yet. Click &quot;Generate / Refresh AI Draft&quot; or write H2/H3 headings.</p>
            ) : (
              outline.map((item, idx) => (
                <div
                  key={idx}
                  className={`text-xs truncate transition-colors py-1 px-2 rounded-lg ${
                    item.level === 3 ? "pl-5 text-slate-500 text-[11px]" : "font-semibold text-slate-800 hover:bg-slate-50"
                  }`}
                >
                  {item.text}
                </div>
              ))
            )}
          </div>

          {/* Golden Loop Integration Card */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
              The Golden Loop Targets
            </span>
            <div className="space-y-2 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Assigned Agency Service</label>
                <select
                  value={targetService}
                  onChange={(e) => {
                    setTargetService(e.target.value);
                    setHasUnsavedChanges(true);
                  }}
                  className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                >
                  {siteConfig.services.map((s) => (
                    <option key={s.slug} value={s.slug}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Embedded Free Tool CTA</label>
                <select
                  value={relatedTool}
                  onChange={(e) => {
                    setRelatedTool(e.target.value);
                    setHasUnsavedChanges(true);
                  }}
                  className="w-full text-xs p-2 rounded-xl border border-slate-200 bg-slate-50 font-medium"
                >
                  <option value="keyword-density-checker">Keyword Density Checker</option>
                  <option value="seo-page-analyzer">SEO Page Analyzer</option>
                  <option value="serp-preview">SERP Preview Tool</option>
                  <option value="heading-checker">Heading Structure Checker</option>
                  <option value="robots-txt-tester">Robots.txt Tester</option>
                  <option value="sitemap-validator">Sitemap Validator</option>
                  <option value="utm-builder">UTM Campaign Builder</option>
                  <option value="url-encoder-decoder">URL Encoder/Decoder</option>
                  <option value="open-graph-preview">Open Graph Preview</option>
                  <option value="http-headers-checker">HTTP Headers Checker</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Center Panel: Full Editor & Metadata (Col 4-8) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Metadata Card (Editable Title, Slug, Meta Description) */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">Article Title (H1)</label>
                <span
                  className={`text-[10px] font-bold ${
                    title.length >= 45 && title.length <= 65 ? "text-emerald-600" : "text-amber-600"
                  }`}
                >
                  {title.length} / 60 chars (Optimal: 45-65)
                </span>
              </div>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Enter compelling, intent-matched article title"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-base text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">URL Slug</label>
                <div className="flex items-center rounded-xl border border-slate-200 px-3 py-1.5 bg-slate-50">
                  <span className="text-xs text-slate-400 font-mono">/blog/</span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => {
                      setSlug(e.target.value);
                      setHasUnsavedChanges(true);
                    }}
                    className="w-full text-xs font-mono bg-transparent focus:outline-none text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Primary Search Keyword</label>
                <input
                  type="text"
                  value={primaryKeyword}
                  onChange={(e) => {
                    setPrimaryKeyword(e.target.value);
                    setHasUnsavedChanges(true);
                  }}
                  placeholder="e.g. niche content marketing"
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Editable Meta Description */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">Meta Description</label>
                <span
                  className={`text-[10px] font-bold ${
                    metaDescription.length >= 135 && metaDescription.length <= 165
                      ? "text-emerald-600"
                      : "text-amber-600"
                  }`}
                >
                  {metaDescription.length} / 155 chars (Optimal: 135-165)
                </span>
              </div>
              <textarea
                rows={2}
                value={metaDescription}
                onChange={(e) => {
                  setMetaDescription(e.target.value);
                  setHasUnsavedChanges(true);
                }}
                placeholder="Write an enticing summary containing your primary keyword for Google SERPs"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Rich Editor Workspace */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
            {/* Formatting Toolbar */}
            <div className="bg-slate-50 border-b border-slate-200 p-2.5 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1">
                <button
                  type="button"
                  onClick={() => insertText("## New Section Heading")}
                  className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                  title="Insert H2"
                >
                  <Heading2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertText("### Sub-topic Heading")}
                  className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                  title="Insert H3"
                >
                  <Heading3 className="w-4 h-4" />
                </button>
                <div className="h-4 w-[1px] bg-slate-300 mx-1" />
                <button
                  type="button"
                  onClick={() => insertText("**bold text**")}
                  className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 cursor-pointer"
                  title="Bold"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertText("*italic text*")}
                  className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 cursor-pointer"
                  title="Italic"
                >
                  <Italic className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertText("* Bullet point item\n* Second item")}
                  className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 cursor-pointer"
                  title="Bullet List"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => insertText("```javascript\n// Implementation example\nconst speed = 99;\n```")}
                  className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 cursor-pointer"
                  title="Code Block"
                >
                  <Code className="w-4 h-4" />
                </button>
                <div className="h-4 w-[1px] bg-slate-300 mx-1" />

                {/* Custom Block Inserters */}
                <button
                  type="button"
                  onClick={() =>
                    insertText(
                      "> 💡 **HelloShiva Strategic Principle:**\n> Never publish generic top-of-funnel fluff. High-LTV customers convert on actionable frameworks and proprietary case study benchmarks."
                    )
                  }
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold hover:bg-indigo-100 cursor-pointer"
                  title="Callout Box"
                >
                  <Quote className="w-3.5 h-3.5" />
                  <span>Callout Box</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    insertText(
                      `## Frequently Asked Questions\n\n### Why does ${primaryKeyword} outperform generic broad content?\nNiche content targets buyers who are actively searching for acute problem-solving methodologies, yielding significantly higher conversion rates.\n\n### How does HelloShiva measure content marketing ROI?\nWe connect inbound traffic through to qualified consultation requests, demo bookings, and closed client retainers.`
                    )
                  }
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold hover:bg-emerald-100 cursor-pointer"
                  title="FAQ Block"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>+ FAQ Block</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    insertText(
                      `Partner with [HelloShiva ${targetService.replace(/-/g, " ").toUpperCase()}](/services/${targetService}) to build an inbound customer acquisition engine.`
                    )
                  }
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-violet-50 text-violet-700 text-xs font-bold hover:bg-violet-100 cursor-pointer"
                  title="Agency Link"
                >
                  <span>+ Agency Link</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    insertText(
                      `Analyze your keyword placement and content structure for free with HelloShiva's [${relatedTool.replace(/-/g, " ").toUpperCase()}](/tools/${relatedTool}).`
                    )
                  }
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold hover:bg-blue-100 cursor-pointer"
                  title="Free Tool Link"
                >
                  <span>+ Free Tool CTA</span>
                </button>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center rounded-xl bg-slate-200 p-0.5 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setViewMode("EDIT")}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    viewMode === "EDIT" ? "bg-white text-indigo-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Editor
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("PREVIEW")}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    viewMode === "PREVIEW" ? "bg-white text-indigo-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Live Preview
                </button>
              </div>
            </div>

            {/* Editor Textarea or Live Rendered Preview */}
            {viewMode === "EDIT" ? (
              <textarea
                rows={24}
                value={contentMarkdown}
                onChange={(e) => {
                  setContentMarkdown(e.target.value);
                  setHasUnsavedChanges(true);
                }}
                placeholder="Draft your guide here in GitHub-flavored Markdown..."
                className="w-full p-6 text-sm font-mono leading-relaxed bg-[#0B1025] text-slate-100 focus:outline-none min-h-[500px]"
              />
            ) : (
              <div className="p-6 sm:p-8 bg-white min-h-[500px]">
                <MarkdownRenderer content={contentMarkdown || "*No content drafted yet.*"} />
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Live Quantitative SEO & E-E-A-T Score (Col 9-12) */}
        <div className="lg:col-span-3 bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-5 sticky top-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Stage 10 Audit
              </div>
              <span className="text-xs font-extrabold text-[#0B1025]">
                Content Optimization Score
              </span>
            </div>
            <button
              onClick={runSeoAudit}
              disabled={isAuditing}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              title="Re-run SEO Audit"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isAuditing ? "animate-spin text-indigo-600" : ""}`} />
            </button>
          </div>

          {/* Score Meter */}
          <div className="p-4 rounded-2xl bg-gradient-to-tr from-slate-900 to-[#171F42] text-white space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Live SEO Health</span>
              <span
                className={`text-2xl font-black ${
                  (audit?.score || 0) >= 80
                    ? "text-emerald-400"
                    : (audit?.score || 0) >= 50
                    ? "text-amber-400"
                    : "text-rose-400"
                }`}
              >
                {audit?.score ?? 0}
                <span className="text-xs text-slate-400 font-normal"> / 100</span>
              </span>
            </div>

            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  (audit?.score || 0) >= 80
                    ? "bg-emerald-400"
                    : (audit?.score || 0) >= 50
                    ? "bg-amber-400"
                    : "bg-rose-400"
                }`}
                style={{ width: `${audit?.score ?? 0}%` }}
              />
            </div>
          </div>

          {/* Editorial Relevance & Brief Alignment Card */}
          {editorialValidation && (
            <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-indigo-950">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  Editorial Relevance Alignment
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${editorialValidation.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                  {editorialValidation.passed ? 'PASSED' : 'REVIEW'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-indigo-900 font-mono">
                <div>Title Delivery: <strong>{editorialValidation.titleAlignment}%</strong></div>
                <div>Topic Breadth: <strong>{editorialValidation.topicCompleteness}%</strong></div>
                <div>Audience Match: <strong>{editorialValidation.audienceAlignment}%</strong></div>
                <div>Factual Risk: <strong className={editorialValidation.factualRisk === 'low' ? 'text-emerald-700' : 'text-amber-700'}>{editorialValidation.factualRisk.toUpperCase()}</strong></div>
              </div>
              {editorialValidation.warnings && editorialValidation.warnings.length > 0 && (
                <div className="pt-2 border-t border-indigo-200/60 space-y-1">
                  {editorialValidation.warnings.map((w: string, i: number) => (
                    <p key={i} className="text-[10px] text-amber-800 font-medium leading-tight">⚠️ {w}</p>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Quantitative Metrics Checklist */}
          <div className="space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Quantitative Breakdown
            </span>

            {audit?.checklist.map((item, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    {item.passed ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    )}
                    {item.item}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      item.passed ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {item.passed ? "Passed" : "Review"}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>Current: <strong>{item.current}</strong></span>
                  <span className="text-[10px] text-slate-400">Target: {item.benchmark}</span>
                </div>

                <p className="text-[11px] text-slate-600 leading-snug pt-0.5">{item.tip}</p>
              </div>
            ))}
          </div>

          {/* Link Attribution Stats */}
          <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-2 text-xs">
            <div className="font-bold text-indigo-950 flex items-center gap-1">
              <ExternalLink className="w-3.5 h-3.5 text-indigo-600" />
              <span>Link Equity Health</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-indigo-900">
              <div>Service Links: <strong>{audit?.links.serviceLinks ?? 0}</strong></div>
              <div>Free Tool Links: <strong>{audit?.links.toolLinks ?? 0}</strong></div>
              <div>Internal Links: <strong>{audit?.links.totalInternal ?? 0}</strong></div>
              <div>External Links: <strong>{audit?.links.externalLinks ?? 0}</strong></div>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Release Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-lg text-slate-900">
                  Schedule Article Publication
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowScheduleModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Configure the exact date and time when this article will be automatically released live to the public blog.
            </p>

            <form onSubmit={handleConfirmSchedule} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Article Title</label>
                <div className="text-xs font-semibold text-slate-900 bg-slate-50 p-2.5 rounded-xl border border-slate-200 truncate">
                  {title}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Publication Date</label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split("T")[0]}
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Publication Time</label>
                  <input
                    type="text"
                    required
                    placeholder="10:00 AM"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>
              </div>

              {/* Quick Time Presets */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-semibold text-slate-400 mr-1">Quick Presets:</span>
                {["09:00 AM", "11:00 AM", "02:00 PM", "06:00 PM"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setScheduledTime(t)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                      scheduledTime === t
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Timezone</label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                >
                  <option value="IST (UTC+5:30)">IST - Indian Standard Time (UTC+5:30)</option>
                  <option value="UTC (GMT)">UTC - Coordinated Universal Time (GMT)</option>
                  <option value="EST (UTC-5)">EST - Eastern Standard Time (UTC-5)</option>
                  <option value="PST (UTC-8)">PST - Pacific Standard Time (UTC-8)</option>
                </select>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Automated Release Scheduled</span>
                </div>
                <p className="text-[11px] text-amber-800 leading-snug">
                  This article will automatically publish live on <strong>{scheduledDate}</strong> at <strong>{scheduledTime}</strong> ({timezone}). It will appear immediately in the Editorial Calendar.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 text-white text-xs font-bold hover:opacity-95 transition-all shadow-md cursor-pointer"
                >
                  Confirm & Schedule Release
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ContentEditorStudioPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-slate-500">Loading Content Studio...</div>}>
      <EditorComponent />
    </Suspense>
  );
}
