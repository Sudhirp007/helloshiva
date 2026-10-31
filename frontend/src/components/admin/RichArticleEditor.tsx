"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Play,
  Save,
  Globe,
  Share2,
  Eye,
  Columns,
  FileText,
  Loader2,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  HelpCircle,
  Undo,
} from "lucide-react";
import { defaultOpenSeoAuditAdapter, OpenSeoAuditResult } from "@/lib/research/openSeoAuditAdapter";

interface RichArticleEditorProps {
  articleId: string;
  initialTitle?: string;
  initialSlug?: string;
  initialMetaDescription?: string;
  initialContent?: string;
  initialKeyword?: string;
  initialCategory?: string;
  initialStatus?: string;
  onSaved?: (updatedArticle: any) => void;
}

const HELLOSHIVA_LINK_PRESETS = [
  { label: "Technical SEO Services", url: "/services/technical-seo", text: "HelloShiva Technical SEO Architecture" },
  { label: "Performance Marketing Services", url: "/services/performance-marketing", text: "HelloShiva Performance Marketing" },
  { label: "Web Development Services", url: "/services/web-development", text: "HelloShiva Web Engineering Services" },
  { label: "Content Strategy Services", url: "/services/content-marketing", text: "HelloShiva Commercial Content Strategy" },
  { label: "Free SEO Page Analyzer", url: "/tools/seo-page-analyzer", text: "Free SEO Page Analyzer Tool" },
  { label: "Free UTM Link Builder", url: "/tools/utm-builder", text: "Free UTM Campaign Link Builder" },
  { label: "Free Robots.txt Tester", url: "/tools/robots-txt-tester", text: "Free Robots.txt Testing Tool" },
  { label: "Free HTTP Headers Checker", url: "/tools/http-headers-checker", text: "Free HTTP Headers Checker" },
  { label: "Schedule Agency Consultation", url: "/contact", text: "Schedule a Strategy Consultation with HelloShiva" },
];

export default function RichArticleEditor({
  articleId,
  initialTitle = "",
  initialSlug = "",
  initialMetaDescription = "",
  initialContent = "",
  initialKeyword = "",
  initialCategory = "Technical SEO",
  initialStatus = "DRAFT_READY",
  onSaved,
}: RichArticleEditorProps) {
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Editable Form States
  const [title, setTitle] = useState(initialTitle);
  const [slug, setSlug] = useState(initialSlug);
  const [metaDescription, setMetaDescription] = useState(initialMetaDescription);
  const [contentMarkdown, setContentMarkdown] = useState(initialContent);
  const [focusKeyword, setFocusKeyword] = useState(initialKeyword);
  const [category, setCategory] = useState(initialCategory);
  const [status, setStatus] = useState(initialStatus);

  // UI state
  const [viewMode, setViewMode] = useState<"split" | "editor" | "preview">("split");
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");
  const [showLinkDropdown, setShowLinkDropdown] = useState(false);

  // SEO Audit State
  const [auditResult, setAuditResult] = useState<OpenSeoAuditResult>(() =>
    defaultOpenSeoAuditAdapter.auditContent(initialTitle, initialMetaDescription, initialContent, initialKeyword)
  );

  // Run SEO analysis automatically when content, title, meta, or keyword change
  useEffect(() => {
    const timer = setTimeout(() => {
      const res = defaultOpenSeoAuditAdapter.auditContent(title, metaDescription, contentMarkdown, focusKeyword);
      setAuditResult(res);
    }, 300);
    return () => clearTimeout(timer);
  }, [title, metaDescription, contentMarkdown, focusKeyword]);

  // Insert markdown helper at cursor
  const insertTextAtCursor = (before: string, after: string = "", placeholder: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;

    const selected = text.substring(start, end) || placeholder;
    const replacement = `${before}${selected}${after}`;

    const newContent = text.substring(0, start) + replacement + text.substring(end);
    setContentMarkdown(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selected.length);
    }, 10);
  };

  // Generate slug from title
  const generateSlugFromTitle = () => {
    const s = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setSlug(s);
  };

  // Save draft
  const handleSaveDraft = async () => {
    setIsSaving(true);
    setSaveSuccessMsg("");
    try {
      const res = await fetch(`/api/v1/content-engine/articles/${articleId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          meta_description: metaDescription,
          content_markdown: contentMarkdown,
          status,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSaveSuccessMsg("Draft changes saved successfully.");
        if (onSaved) onSaved(data.article);
        setTimeout(() => setSaveSuccessMsg(""), 3500);
      }
    } catch (e) {
      console.error("Save error:", e);
    } finally {
      setIsSaving(false);
    }
  };

  // Publish / Unpublish Toggle
  const handleTogglePublish = async () => {
    setIsPublishing(true);
    const newStatus = status === "PUBLISHED" ? "DRAFT_READY" : "PUBLISHED";
    try {
      // First save content
      await fetch(`/api/v1/content-engine/articles/${articleId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          meta_description: metaDescription,
          content_markdown: contentMarkdown,
        }),
      });

      // Then trigger release
      const res = await fetch("/api/v1/content-engine/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: articleId,
          status: newStatus,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStatus(newStatus);
        setSaveSuccessMsg(
          newStatus === "PUBLISHED"
            ? `🚀 Article is LIVE on helloshiva.com/blog/${slug}`
            : "Article reverted to draft mode."
        );
        if (onSaved) onSaved(data.article);
        setTimeout(() => setSaveSuccessMsg(""), 4500);
      }
    } catch (e) {
      console.error("Publish error:", e);
    } finally {
      setIsPublishing(false);
    }
  };

  // Transfer to Social Media distribution
  const handleTransferToSocial = () => {
    sessionStorage.setItem(
      "article_for_social",
      JSON.stringify({
        title,
        slug,
        summary: metaDescription,
        primaryTakeaway: "Optimized organic conversion and technical architecture.",
      })
    );
    router.push("/admin/content-engine/social");
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="bg-white rounded-3xl border border-[#E6E7F0] p-5 sm:p-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              status === "PUBLISHED"
                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                : status === "APPROVED"
                ? "bg-amber-100 text-amber-800 border border-amber-300"
                : "bg-purple-100 text-purple-800 border border-purple-300"
            }`}
          >
            ● {status}
          </span>
          <span className="text-xs font-mono text-[#626985] bg-[#F5F4FF] px-2.5 py-1 rounded-lg border border-[#E8E7FF]">
            ID: {articleId}
          </span>
          {status === "PUBLISHED" && (
            <a
              href={`/blog/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6366F1] hover:underline"
            >
              <span>View Live Blog</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {saveSuccessMsg && (
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              {saveSuccessMsg}
            </span>
          )}

          <button
            onClick={handleSaveDraft}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-[#10183A] bg-[#F5F4FF] hover:bg-[#E8E7FF] border border-[#E6E7F0] transition-all cursor-pointer"
          >
            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Save Draft</span>
          </button>

          <button
            onClick={handleTogglePublish}
            disabled={isPublishing}
            className={`inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-md transition-all cursor-pointer ${
              status === "PUBLISHED"
                ? "bg-gradient-to-r from-red-600 to-amber-600 hover:opacity-90"
                : "bg-gradient-to-r from-[#6366F1] to-[#8067FF] hover:opacity-90 shadow-indigo-500/20"
            }`}
          >
            {isPublishing ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : status === "PUBLISHED" ? (
              <Undo className="w-3.5 h-3.5" />
            ) : (
              <Globe className="w-3.5 h-3.5" />
            )}
            <span>{status === "PUBLISHED" ? "Unpublish to Draft" : "Publish to Live Blog 🚀"}</span>
          </button>

          <button
            onClick={handleTransferToSocial}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-[#6366F1] bg-[#E8E7FF] hover:bg-[#dedcfc] transition-all cursor-pointer"
            title="Generate ready-to-share social copy for X, LinkedIn, Facebook, Instagram"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Repurpose for Social</span>
          </button>
        </div>
      </div>

      {/* Editable Metadata Card */}
      <div className="bg-white rounded-3xl border border-[#E6E7F0] p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-[#E6E7F0] pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#6366F1]" />
            <h2 className="text-sm font-bold text-[#10183A]">SEO Metadata & Article Configuration (Editable)</h2>
          </div>
          <span className="text-[11px] text-[#626985]">Updates in real-time</span>
        </div>

        {/* Title Input with character counter */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-[#10183A]">
              Page Title & H1 Headline <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              <span
                className={`text-[11px] font-mono px-2 py-0.5 rounded ${
                  title.length >= 45 && title.length <= 65
                    ? "bg-emerald-100 text-emerald-700 font-bold"
                    : "bg-amber-100 text-amber-700 font-semibold"
                }`}
              >
                {title.length} / 60 chars (Target: 45–65)
              </span>
            </div>
          </div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. The 2026 Core Web Vitals Blueprint: How to Achieve Sub-Second LCP"
            className="w-full px-4 py-3 rounded-xl border border-[#E6E7F0] text-sm text-[#10183A] font-semibold focus:outline-none focus:border-[#6366F1] transition-all"
          />
        </div>

        {/* Slug & Keyword Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Slug */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-[#10183A]">
                URL Slug <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={generateSlugFromTitle}
                className="text-[11px] text-[#6366F1] hover:underline cursor-pointer"
              >
                Auto-generate from Title
              </button>
            </div>
            <div className="flex items-center rounded-xl border border-[#E6E7F0] bg-[#F5F4FF] overflow-hidden focus-within:border-[#6366F1]">
              <span className="px-3 text-xs text-[#626985] font-mono select-none">/blog/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="core-web-vitals-optimization-guide"
                className="w-full py-2.5 pr-3 bg-transparent text-xs text-[#10183A] font-mono focus:outline-none"
              />
            </div>
          </div>

          {/* Focus Keyword */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-[#10183A]">Primary Focus Keyword</label>
              <span className="text-[11px] text-[#626985]">Used for density auditing</span>
            </div>
            <input
              type="text"
              value={focusKeyword}
              onChange={(e) => setFocusKeyword(e.target.value)}
              placeholder="e.g. core web vitals"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E7F0] text-xs text-[#10183A] focus:outline-none focus:border-[#6366F1]"
            />
          </div>
        </div>

        {/* Meta Description with live character counter */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-[#10183A]">
              Google Meta Description <span className="text-red-500">*</span>
            </label>
            <span
              className={`text-[11px] font-mono px-2 py-0.5 rounded ${
                metaDescription.length >= 120 && metaDescription.length <= 165
                  ? "bg-emerald-100 text-emerald-700 font-bold"
                  : "bg-amber-100 text-amber-700 font-semibold"
              }`}
            >
              {metaDescription.length} / 160 chars (Target: 120–165)
            </span>
          </div>
          <textarea
            rows={2}
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            placeholder="Write a compelling 120–165 character summary containing your primary keyword to maximize click-through rate..."
            className="w-full px-4 py-2.5 rounded-xl border border-[#E6E7F0] text-xs text-[#10183A] focus:outline-none focus:border-[#6366F1] transition-all"
          />
        </div>
      </div>

      {/* Editor & SEO Audit Split Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Rich Editor & Formatting Toolbar (7 or 8 columns) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-[#E6E7F0] p-6 sm:p-8 shadow-sm space-y-4">
          {/* View Mode & Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E6E7F0] pb-3">
            {/* Toolbar Buttons */}
            <div className="flex flex-wrap items-center gap-1">
              <button
                type="button"
                onClick={() => insertTextAtCursor("\n\n## ", "\n", "Section Heading")}
                className="p-2 rounded-lg text-[#10183A] hover:bg-[#F5F4FF] hover:text-[#6366F1] transition-colors"
                title="Heading 2 (##)"
              >
                <Heading2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertTextAtCursor("\n\n### ", "\n", "Subsection Heading")}
                className="p-2 rounded-lg text-[#10183A] hover:bg-[#F5F4FF] hover:text-[#6366F1] transition-colors"
                title="Heading 3 (###)"
              >
                <Heading3 className="w-4 h-4" />
              </button>
              <div className="h-4 w-px bg-[#E6E7F0] mx-1" />
              <button
                type="button"
                onClick={() => insertTextAtCursor("**", "**", "bold text")}
                className="p-2 rounded-lg text-[#10183A] hover:bg-[#F5F4FF] hover:text-[#6366F1] transition-colors"
                title="Bold (**text**)"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertTextAtCursor("*", "*", "italic text")}
                className="p-2 rounded-lg text-[#10183A] hover:bg-[#F5F4FF] hover:text-[#6366F1] transition-colors"
                title="Italic (*text*)"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertTextAtCursor("\n- ", "\n", "Bullet point")}
                className="p-2 rounded-lg text-[#10183A] hover:bg-[#F5F4FF] hover:text-[#6366F1] transition-colors"
                title="Bullet List (-)"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertTextAtCursor("\n1. ", "\n", "Numbered point")}
                className="p-2 rounded-lg text-[#10183A] hover:bg-[#F5F4FF] hover:text-[#6366F1] transition-colors"
                title="Numbered List (1.)"
              >
                <ListOrdered className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertTextAtCursor("\n> 💡 **Key Insight:** ", "\n", "Important takeaway message")}
                className="p-2 rounded-lg text-[#10183A] hover:bg-[#F5F4FF] hover:text-[#6366F1] transition-colors"
                title="Callout Quote (>)"
              >
                <Quote className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertTextAtCursor("\n```\n", "\n```\n", "# Code snippet here")}
                className="p-2 rounded-lg text-[#10183A] hover:bg-[#F5F4FF] hover:text-[#6366F1] transition-colors"
                title="Code Block (```)"
              >
                <Code className="w-4 h-4" />
              </button>

              <div className="h-4 w-px bg-[#E6E7F0] mx-1" />

              {/* Internal Link Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowLinkDropdown(!showLinkDropdown)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#6366F1] bg-[#F5F4FF] hover:bg-[#E8E7FF] transition-colors"
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>+ Agency Link</span>
                  <ChevronDown className="w-3 h-3" />
                </button>

                {showLinkDropdown && (
                  <div className="absolute left-0 mt-2 w-72 bg-white rounded-2xl border border-[#E6E7F0] shadow-xl p-2 z-50 space-y-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#626985] px-2 py-1">
                      Insert Internal Link
                    </div>
                    {HELLOSHIVA_LINK_PRESETS.map((preset, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          insertTextAtCursor(`[${preset.text}](${preset.url})`);
                          setShowLinkDropdown(false);
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-xl text-xs hover:bg-[#F5F4FF] text-[#10183A] flex flex-col"
                      >
                        <span className="font-semibold text-[#10183A]">{preset.label}</span>
                        <span className="text-[10px] text-[#6366F1] font-mono">{preset.url}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* FAQ Preset button */}
              <button
                type="button"
                onClick={() =>
                  insertTextAtCursor(
                    `\n\n## Frequently Asked Questions\n\n### Why does this matter for search rankings?\nBecause search engines prioritize verified user experience.\n\n### How does HelloShiva implement this?\nThrough automated audits and code-level refactoring.\n`
                  )
                }
                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#8067FF] bg-[#F5F4FF] hover:bg-[#E8E7FF] transition-colors"
                title="Insert FAQ Section"
              >
                + FAQ Block
              </button>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center gap-1 bg-[#F5F4FF] p-1 rounded-xl border border-[#E6E7F0]">
              <button
                type="button"
                onClick={() => setViewMode("split")}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === "split" ? "bg-white text-[#10183A] shadow-xs" : "text-[#626985]"
                }`}
              >
                Split
              </button>
              <button
                type="button"
                onClick={() => setViewMode("editor")}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === "editor" ? "bg-white text-[#10183A] shadow-xs" : "text-[#626985]"
                }`}
              >
                Editor
              </button>
              <button
                type="button"
                onClick={() => setViewMode("preview")}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === "preview" ? "bg-white text-[#10183A] shadow-xs" : "text-[#626985]"
                }`}
              >
                Preview
              </button>
            </div>
          </div>

          {/* Editor & Preview Area */}
          <div className="space-y-4">
            {/* Split View */}
            {viewMode === "split" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#626985] uppercase mb-1">
                    Markdown Source
                  </label>
                  <textarea
                    ref={textareaRef}
                    rows={22}
                    value={contentMarkdown}
                    onChange={(e) => setContentMarkdown(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-[#0B1025] text-[#C6C9DC] font-mono text-xs leading-relaxed focus:outline-none border border-[#252B49]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#626985] uppercase mb-1">
                    Formatted Rendered Preview
                  </label>
                  <div className="h-[460px] overflow-y-auto px-5 py-4 rounded-2xl border border-[#E6E7F0] bg-[#FAF9FF] text-xs leading-relaxed text-[#10183A] space-y-3 prose prose-sm max-w-none">
                    <h1 className="text-lg font-extrabold text-[#10183A]">{title || "Untitled Article"}</h1>
                    <div className="whitespace-pre-wrap font-sans text-xs text-[#333E63]">
                      {contentMarkdown}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Editor Only */}
            {viewMode === "editor" && (
              <div>
                <textarea
                  ref={textareaRef}
                  rows={26}
                  value={contentMarkdown}
                  onChange={(e) => setContentMarkdown(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl bg-[#0B1025] text-[#C6C9DC] font-mono text-xs leading-relaxed focus:outline-none border border-[#252B49]"
                />
              </div>
            )}

            {/* Preview Only */}
            {viewMode === "preview" && (
              <div className="p-8 rounded-3xl border border-[#E6E7F0] bg-white shadow-xs max-w-3xl mx-auto space-y-6">
                <div className="space-y-2 border-b border-[#E6E7F0] pb-6">
                  <span className="text-xs font-semibold text-[#6366F1] bg-[#F5F4FF] px-3 py-1 rounded-full">
                    {category}
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#10183A] leading-tight">
                    {title}
                  </h1>
                  <p className="text-sm text-[#626985] italic">{metaDescription}</p>
                </div>
                <div className="whitespace-pre-wrap font-sans text-sm text-[#10183A] leading-relaxed">
                  {contentMarkdown}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: In-Place Real-Time SEO Review Checklist (4 columns) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-[#0B1025] text-white rounded-3xl border border-[#252B49] p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#8067FF]" />
                <h3 className="text-sm font-bold text-white">Live OpenSEO Audit</h3>
              </div>
              <span className="text-[10px] text-[#C6C9DC]/60 uppercase tracking-wider">Real-time</span>
            </div>

            {/* Score Display */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#171F42] border border-[#252B49]">
              <div>
                <div className="text-xs text-[#C6C9DC]">Audit Verification Score</div>
                <div className="text-3xl font-black text-white mt-0.5">
                  {auditResult.score} <span className="text-sm font-normal text-[#C6C9DC]">/ 100</span>
                </div>
              </div>
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm ${
                  auditResult.score >= 80
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : auditResult.score >= 50
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                    : "bg-red-500/20 text-red-400 border border-red-500/30"
                }`}
              >
                {auditResult.score >= 80 ? "PASS" : "WARN"}
              </div>
            </div>

            <p className="text-[11px] text-[#C6C9DC]/80 leading-relaxed">
              Real-time quantitative verification of title bounds, meta description, heading structure, word depth, keyword density, and internal links.
            </p>
          </div>

          {/* Quantitative Checks List */}
          <div className="bg-white rounded-3xl border border-[#E6E7F0] p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#626985] border-b border-[#E6E7F0] pb-2">
              Optimization Checklist ({auditResult.checks.filter((c) => c.passed).length}/{auditResult.checks.length} Passed)
            </h4>

            <div className="space-y-3">
              {auditResult.checks.map((chk, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    chk.passed
                      ? "bg-emerald-50/50 border-emerald-200"
                      : "bg-amber-50/60 border-amber-200"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        {chk.passed ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        ) : (
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        )}
                        <span className="font-bold text-xs text-[#10183A]">{chk.title}</span>
                      </div>
                      <div className="text-[11px] text-[#626985]">{chk.detail}</div>
                    </div>

                    {/* Quantitative Metric Badge */}
                    <div className="shrink-0 text-right">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          chk.passed
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {chk.currentMetric}
                      </span>
                    </div>
                  </div>

                  {!chk.passed && (
                    <div className="mt-2 pt-2 border-t border-amber-200/60 text-[10px] text-amber-900 leading-normal">
                      💡 <strong>Fix:</strong> {chk.recommendation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
