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
  ExternalLink,
  ChevronDown,
  HelpCircle,
  Undo,
  Calendar,
  Image as ImageIcon,
  Clock,
  Layers,
  RotateCcw,
  X,
  FileText,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { defaultOpenSeoAuditAdapter, OpenSeoAuditResult } from "@/lib/research/openSeoAuditAdapter";
import MarkdownRenderer from "@/components/MarkdownRenderer";

interface RichArticleEditorProps {
  articleId: string;
  initialTitle?: string;
  initialSlug?: string;
  initialMetaDescription?: string;
  initialContent?: string;
  initialKeyword?: string;
  initialCategory?: string;
  initialStatus?: string;
  initialScheduledDate?: string;
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
  initialScheduledDate = "",
  onSaved,
}: RichArticleEditorProps) {
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const cursorPositionRef = useRef<{ start: number; end: number }>({ start: 0, end: 0 });

  // Form States
  const [title, setTitle] = useState(initialTitle);
  const [slug, setSlug] = useState(initialSlug);
  const [metaDescription, setMetaDescription] = useState(initialMetaDescription);
  const [contentMarkdown, setContentMarkdown] = useState(initialContent);
  const [focusKeyword, setFocusKeyword] = useState(initialKeyword);
  const [category, setCategory] = useState(initialCategory);
  const [status, setStatus] = useState(initialStatus);
  const [scheduledDate, setScheduledDate] = useState(initialScheduledDate || "");

  // Unsaved changes tracking
  const [isDirty, setIsDirty] = useState(false);
  const [showExitConfirmModal, setShowExitConfirmModal] = useState(false);
  const [pendingNavigationUrl, setPendingNavigationUrl] = useState<string | null>(null);

  // UI state
  const [viewMode, setViewMode] = useState<"split" | "editor" | "preview">("split");
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);
  const [statusFeedback, setStatusFeedback] = useState("");
  const [showLinkDropdown, setShowLinkDropdown] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  // Image insertion state
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");
  const [imageCaption, setImageCaption] = useState("");

  // SEO Audit State
  const [auditResult, setAuditResult] = useState<OpenSeoAuditResult>(() =>
    defaultOpenSeoAuditAdapter.auditContent(initialTitle, initialMetaDescription, initialContent, initialKeyword)
  );

  // Track cursor position whenever user interacts with textarea
  const updateCursorPosition = () => {
    if (textareaRef.current) {
      cursorPositionRef.current = {
        start: textareaRef.current.selectionStart || 0,
        end: textareaRef.current.selectionEnd || 0,
      };
    }
  };

  // Mark form as dirty when edits occur
  const markDirty = () => {
    if (!isDirty) setIsDirty(true);
  };

  // Warn on browser tab close if dirty
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  // Insert markdown at cursor (or append if none)
  const insertTextAtCursor = (before: string, after: string = "", placeholder: string = "") => {
    markDirty();
    const textarea = textareaRef.current;
    const text = contentMarkdown;

    let start = cursorPositionRef.current.start;
    let end = cursorPositionRef.current.end;

    // Safety bounds
    if (start < 0 || start > text.length) start = text.length;
    if (end < start || end > text.length) end = start;

    const selected = text.substring(start, end) || placeholder;
    const replacement = `${before}${selected}${after}`;

    const newContent = text.substring(0, start) + replacement + text.substring(end);
    setContentMarkdown(newContent);

    // Update cursor position ref
    const newPos = start + before.length + selected.length;
    cursorPositionRef.current = { start: newPos, end: newPos };

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(start + before.length, start + before.length + selected.length);
      }
    }, 20);
  };

  // Recalculate SEO Audit Score on demand
  const handleCheckSeoScore = () => {
    setIsAuditing(true);
    setTimeout(() => {
      const res = defaultOpenSeoAuditAdapter.auditContent(title, metaDescription, contentMarkdown, focusKeyword);
      setAuditResult(res);
      setIsAuditing(false);
      setStatusFeedback(`⚡ SEO verification complete: ${res.score}/100 score`);
      setTimeout(() => setStatusFeedback(""), 4000);
    }, 250);
  };

  // Generate slug from title
  const generateSlugFromTitle = () => {
    markDirty();
    const s = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setSlug(s);
  };

  // Save draft
  const handleSaveDraft = async (): Promise<boolean> => {
    setIsSaving(true);
    setStatusFeedback("");
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
          scheduled_date: scheduledDate,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsDirty(false);
        setStatusFeedback("✅ Draft saved successfully.");
        if (onSaved) onSaved(data.article);
        setTimeout(() => setStatusFeedback(""), 3500);
        return true;
      }
    } catch (e) {
      console.error("Save error:", e);
    } finally {
      setIsSaving(false);
    }
    return false;
  };

  // Publish immediately
  const handlePublishNow = async () => {
    setIsPublishing(true);
    try {
      await handleSaveDraft();
      const res = await fetch("/api/v1/content-engine/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: articleId, status: "PUBLISHED" }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("PUBLISHED");
        setIsDirty(false);
        setStatusFeedback(`🚀 Live on helloshiva.com/blog/${slug}`);
        if (onSaved) onSaved(data.article);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsPublishing(false);
    }
  };

  // Schedule for specific date
  const handleScheduleForDate = async () => {
    if (!scheduledDate) {
      alert("Please select a target publication date.");
      return;
    }
    setIsPublishing(true);
    try {
      await handleSaveDraft();
      const res = await fetch("/api/v1/content-engine/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: articleId,
          status: "SCHEDULED",
          scheduled_date: scheduledDate,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("SCHEDULED");
        setIsDirty(false);
        setShowScheduleModal(false);
        setStatusFeedback(`📅 Article scheduled for release on ${scheduledDate}`);
        if (onSaved) onSaved(data.article);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsPublishing(false);
    }
  };

  // Unpublish back to draft
  const handleUnpublish = async () => {
    if (!confirm("Revert this live article back to draft status?")) return;
    setIsPublishing(true);
    try {
      const res = await fetch("/api/v1/content-engine/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: articleId, status: "DRAFT_READY" }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("DRAFT_READY");
        setIsDirty(false);
        setStatusFeedback("Article reverted to draft mode.");
        if (onSaved) onSaved(data.article);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsPublishing(false);
    }
  };

  // Image insertion confirm
  const handleInsertImage = () => {
    if (!imageUrl.trim()) return;
    const alt = imageAlt.trim() || "Illustration for " + title;
    const caption = imageCaption.trim();
    const md = caption
      ? `\n\n![${alt}](${imageUrl.trim()} "${caption}")\n\n`
      : `\n\n![${alt}](${imageUrl.trim()})\n\n`;
    insertTextAtCursor(md);
    setImageUrl("");
    setImageAlt("");
    setImageCaption("");
    setShowImageModal(false);
  };

  // Unsaved changes navigation handler
  const handleNavigateAway = (url: string) => {
    if (isDirty) {
      setPendingNavigationUrl(url);
      setShowExitConfirmModal(true);
    } else {
      router.push(url);
    }
  };

  return (
    <div className="space-y-6 max-w-full font-sans">
      {/* Top Action & Navigation Bar */}
      <div className="bg-white rounded-3xl border border-[#E6E7F0] p-5 sm:p-6 shadow-sm flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              status === "PUBLISHED"
                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                : status === "SCHEDULED"
                ? "bg-blue-100 text-blue-800 border border-blue-300"
                : "bg-purple-100 text-purple-800 border border-purple-300"
            }`}
          >
            ● {status}
          </span>

          {scheduledDate && status === "SCHEDULED" && (
            <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Target Date: {scheduledDate}</span>
            </span>
          )}

          {isDirty && (
            <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
              ● Unsaved changes
            </span>
          )}

          {status === "PUBLISHED" && (
            <a
              href={`/blog/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6366F1] hover:underline"
            >
              <span>View Live Post</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {statusFeedback && (
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              {statusFeedback}
            </span>
          )}

          {/* Explicit SEO Score Check Button */}
          <button
            type="button"
            onClick={handleCheckSeoScore}
            disabled={isAuditing}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-[#6366F1] bg-[#F5F4FF] hover:bg-[#E8E7FF] border border-[#E8E7FF] transition-all cursor-pointer"
            title="Click to recalculate SEO score and quantitative metrics based on current edits"
          >
            {isAuditing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
            <span>⚡ Check SEO Score</span>
          </button>

          {/* Save Draft */}
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-[#10183A] bg-white hover:bg-[#F5F4FF] border border-[#E6E7F0] transition-all cursor-pointer"
          >
            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5 text-[#6366F1]" />}
            <span>Save Draft</span>
          </button>

          {/* Schedule for Date */}
          <button
            type="button"
            onClick={() => setShowScheduleModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-[#10183A] bg-white hover:bg-[#F5F4FF] border border-[#E6E7F0] transition-all cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span>Schedule Release</span>
          </button>

          {/* Publish Immediately / Revert */}
          {status === "PUBLISHED" ? (
            <button
              type="button"
              onClick={handleUnpublish}
              disabled={isPublishing}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 transition-all cursor-pointer"
            >
              <Undo className="w-3.5 h-3.5" />
              <span>Revert to Draft</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePublishNow}
              disabled={isPublishing}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#6366F1] to-[#8067FF] hover:opacity-90 shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
            >
              {isPublishing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Globe className="w-3.5 h-3.5" />}
              <span>Publish to Live Blog 🚀</span>
            </button>
          )}

          {/* Repurpose Social */}
          <button
            type="button"
            onClick={() => {
              sessionStorage.setItem(
                "article_for_social",
                JSON.stringify({
                  title,
                  slug,
                  summary: metaDescription,
                  primaryTakeaway: "Optimized organic conversion and technical architecture.",
                })
              );
              handleNavigateAway("/admin/content-engine/social");
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#6366F1] bg-[#E8E7FF] hover:bg-[#dedcfc] transition-all cursor-pointer"
            title="Generate ready-to-share social copy"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Social Posts</span>
          </button>
        </div>
      </div>

      {/* Editable Metadata Card (Full Width) */}
      <div className="bg-white rounded-3xl border border-[#E6E7F0] p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-[#E6E7F0] pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#6366F1]" />
            <h2 className="text-sm font-bold text-[#10183A]">Article Metadata & SEO Search Directives (Editable)</h2>
          </div>
          <span className="text-[11px] text-[#626985]">Configurable & stored directly with article</span>
        </div>

        {/* Title Input with live char counter */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-[#10183A]">
              Page Title & H1 Headline <span className="text-red-500">*</span>
            </label>
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
          <input
            type="text"
            value={title}
            onChange={(e) => {
              markDirty();
              setTitle(e.target.value);
            }}
            placeholder="e.g. The 2026 Core Web Vitals Blueprint: How to Achieve Sub-Second LCP"
            className="w-full px-4 py-3 rounded-xl border border-[#E6E7F0] text-sm text-[#10183A] font-semibold focus:outline-none focus:border-[#6366F1] transition-all"
          />
        </div>

        {/* Slug, Focus Keyword, and Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                Auto-generate
              </button>
            </div>
            <div className="flex items-center rounded-xl border border-[#E6E7F0] bg-[#F5F4FF] overflow-hidden focus-within:border-[#6366F1]">
              <span className="px-2.5 text-xs text-[#626985] font-mono select-none">/blog/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => {
                  markDirty();
                  setSlug(e.target.value);
                }}
                placeholder="core-web-vitals-guide"
                className="w-full py-2.5 pr-3 bg-transparent text-xs text-[#10183A] font-mono focus:outline-none"
              />
            </div>
          </div>

          {/* Primary Focus Keyword */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-[#10183A]">Primary Focus Keyword</label>
              <span className="text-[11px] text-[#626985]">Density audit</span>
            </div>
            <input
              type="text"
              value={focusKeyword}
              onChange={(e) => {
                markDirty();
                setFocusKeyword(e.target.value);
              }}
              placeholder="e.g. core web vitals"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E7F0] text-xs text-[#10183A] focus:outline-none focus:border-[#6366F1]"
            />
          </div>

          {/* Category / Theme */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-[#10183A]">Category / Topic</label>
              <span className="text-[11px] text-[#626985]">Public tag</span>
            </div>
            <input
              type="text"
              value={category}
              onChange={(e) => {
                markDirty();
                setCategory(e.target.value);
              }}
              placeholder="e.g. Technical SEO & Web Engineering"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E7F0] text-xs text-[#10183A] focus:outline-none focus:border-[#6366F1]"
            />
          </div>
        </div>

        {/* Google Meta Description with live character counter */}
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
            onChange={(e) => {
              markDirty();
              setMetaDescription(e.target.value);
            }}
            placeholder="Write a concise 120–165 character summary containing primary keywords to maximize Google SERP click-through rate..."
            className="w-full px-4 py-2.5 rounded-xl border border-[#E6E7F0] text-xs text-[#10183A] focus:outline-none focus:border-[#6366F1] transition-all"
          />
        </div>
      </div>

      {/* FULL-WIDTH Professional Text Editor */}
      <div className="bg-white rounded-3xl border border-[#E6E7F0] p-6 sm:p-8 shadow-sm space-y-4">
        {/* Editor Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E6E7F0] pb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {/* Headings */}
            <button
              type="button"
              onClick={() => insertTextAtCursor("\n\n## ", "\n", "Main Section Heading")}
              className="p-2 rounded-lg text-[#10183A] hover:bg-[#F5F4FF] hover:text-[#6366F1] transition-colors"
              title="Heading 2 (## Section)"
            >
              <Heading2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertTextAtCursor("\n\n### ", "\n", "Subsection Heading")}
              className="p-2 rounded-lg text-[#10183A] hover:bg-[#F5F4FF] hover:text-[#6366F1] transition-colors"
              title="Heading 3 (### Subheading)"
            >
              <Heading3 className="w-4 h-4" />
            </button>

            <div className="h-4 w-px bg-[#E6E7F0] mx-1" />

            {/* Formatting */}
            <button
              type="button"
              onClick={() => insertTextAtCursor("**", "**", "important keyword")}
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
              onClick={() => insertTextAtCursor("\n- ", "\n", "Actionable point")}
              className="p-2 rounded-lg text-[#10183A] hover:bg-[#F5F4FF] hover:text-[#6366F1] transition-colors"
              title="Bullet List (-)"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertTextAtCursor("\n1. ", "\n", "Step item")}
              className="p-2 rounded-lg text-[#10183A] hover:bg-[#F5F4FF] hover:text-[#6366F1] transition-colors"
              title="Numbered List (1.)"
            >
              <ListOrdered className="w-4 h-4" />
            </button>

            <div className="h-4 w-px bg-[#E6E7F0] mx-1" />

            {/* Strategic Callout Box */}
            <button
              type="button"
              onClick={() =>
                insertTextAtCursor(
                  "\n\n> 💡 **Strategic HelloShiva Insight:**\n> Sustainable organic growth requires fixing code-level DOM bottlenecks before spending heavily on advertising.\n\n"
                )
              }
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#10183A] bg-[#F5F4FF] hover:bg-[#E8E7FF] transition-colors"
              title="Insert HelloShiva Strategic Callout Box"
            >
              <Quote className="w-3.5 h-3.5 text-[#6366F1]" />
              <span>Callout Box</span>
            </button>

            {/* Image Inserter Button */}
            <button
              type="button"
              onClick={() => setShowImageModal(true)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#10183A] bg-[#F5F4FF] hover:bg-[#E8E7FF] transition-colors"
              title="Insert Image with Alt Text & Caption"
            >
              <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
              <span>+ Image</span>
            </button>

            {/* Internal Link Dropdown Picker */}
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
                <div className="absolute left-0 mt-2 w-72 bg-white rounded-2xl border border-[#E6E7F0] shadow-2xl p-2 z-50 space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#626985] px-2 py-1">
                    Select HelloShiva Internal Link
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

            {/* FAQ Block Inserter (Guaranteed to work and format questions/answers distinctly) */}
            <button
              type="button"
              onClick={() =>
                insertTextAtCursor(
                  `\n\n## Frequently Asked Questions\n\n### Why is this strategy essential for organic ranking?\nSearch engines prioritize technical crawlability and verified user intent over superficial keyword volume.\n\n### How does HelloShiva support clients in this implementation?\nHelloShiva provides dedicated technical SEO architecture and web performance engineering.\n\n`
                )
              }
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#8067FF] bg-[#F5F4FF] hover:bg-[#E8E7FF] transition-colors"
              title="Insert Frequently Asked Questions section with distinct Q&A separation"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>+ FAQ Block</span>
            </button>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 bg-[#F5F4FF] p-1 rounded-xl border border-[#E6E7F0]">
            <button
              type="button"
              onClick={() => setViewMode("split")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                viewMode === "split" ? "bg-white text-[#10183A] shadow-xs" : "text-[#626985]"
              }`}
            >
              Split View
            </button>
            <button
              type="button"
              onClick={() => setViewMode("editor")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                viewMode === "editor" ? "bg-white text-[#10183A] shadow-xs" : "text-[#626985]"
              }`}
            >
              Full Editor
            </button>
            <button
              type="button"
              onClick={() => setViewMode("preview")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                viewMode === "preview" ? "bg-white text-[#10183A] shadow-xs" : "text-[#626985]"
              }`}
            >
              Live Rendered Preview
            </button>
          </div>
        </div>

        {/* Textarea & Preview Display */}
        <div className="space-y-4">
          {viewMode === "split" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-[#626985] uppercase mb-1">
                  Markdown Source (Full Width & Unconstrained)
                </label>
                <textarea
                  ref={textareaRef}
                  rows={24}
                  value={contentMarkdown}
                  onKeyUp={updateCursorPosition}
                  onMouseUp={updateCursorPosition}
                  onSelect={updateCursorPosition}
                  onChange={(e) => {
                    markDirty();
                    setContentMarkdown(e.target.value);
                  }}
                  placeholder="Draft your article in markdown..."
                  className="w-full px-5 py-4 rounded-2xl bg-[#0B1025] text-[#C6C9DC] font-mono text-xs leading-relaxed focus:outline-none border border-[#252B49]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#626985] uppercase mb-1">
                  Live Formatted Preview
                </label>
                <div className="h-[490px] overflow-y-auto px-6 py-5 rounded-2xl border border-[#E6E7F0] bg-[#FAF9FF] text-xs leading-relaxed text-[#10183A] space-y-4">
                  <h1 className="text-xl font-extrabold text-[#10183A]">{title || "Untitled Article"}</h1>
                  <MarkdownRenderer content={contentMarkdown} />
                </div>
              </div>
            </div>
          )}

          {viewMode === "editor" && (
            <div>
              <textarea
                ref={textareaRef}
                rows={28}
                value={contentMarkdown}
                onKeyUp={updateCursorPosition}
                onMouseUp={updateCursorPosition}
                onSelect={updateCursorPosition}
                onChange={(e) => {
                  markDirty();
                  setContentMarkdown(e.target.value);
                }}
                className="w-full px-6 py-5 rounded-2xl bg-[#0B1025] text-[#C6C9DC] font-mono text-xs leading-relaxed focus:outline-none border border-[#252B49]"
              />
            </div>
          )}

          {viewMode === "preview" && (
            <div className="p-8 sm:p-12 rounded-3xl border border-[#E6E7F0] bg-white shadow-xs max-w-4xl mx-auto space-y-6">
              <div className="space-y-2 border-b border-[#E6E7F0] pb-6">
                <span className="text-xs font-semibold text-[#6366F1] bg-[#F5F4FF] px-3 py-1 rounded-full">
                  {category}
                </span>
                <h1 className="text-3xl font-black text-[#10183A] leading-tight">{title}</h1>
                <p className="text-sm text-[#626985] italic">{metaDescription}</p>
              </div>
              <div className="space-y-6">
                <MarkdownRenderer content={contentMarkdown} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* POSITIONED BELOW THE EDITOR: Live OpenSEO Audit & Quantitative Optimization Checklist */}
      <div className="bg-white rounded-3xl border border-[#E6E7F0] p-6 sm:p-8 shadow-sm space-y-6">
        {/* Audit Header Banner */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#E6E7F0] pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-[#E8E7FF] text-[#6366F1]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full-Width Live OpenSEO Audit Panel</span>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-[#10183A]">
              Quantitative Content Optimization Score & Recommendations
            </h3>
            <p className="text-xs text-[#626985]">
              Verify your exact word volume, heading count, keyword density, and schema readiness without leaving the studio.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#0B1025] text-white border border-[#252B49]">
              <div className="text-right">
                <div className="text-[10px] text-[#C6C9DC] uppercase font-bold">Audit Score</div>
                <div className="text-2xl font-black text-white">{auditResult.score} / 100</div>
              </div>
              <div
                className={`px-3 py-1.5 rounded-xl font-extrabold text-xs uppercase ${
                  auditResult.score >= 80
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : auditResult.score >= 50
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                    : "bg-red-500/20 text-red-400 border border-red-500/30"
                }`}
              >
                {auditResult.score >= 80 ? "PASSED" : "NEEDS REVIEW"}
              </div>
            </div>

            <button
              type="button"
              onClick={handleCheckSeoScore}
              disabled={isAuditing}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-[#6366F1] to-[#8067FF] hover:opacity-90 shadow-md cursor-pointer transition-all"
            >
              {isAuditing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              <span>Re-Calculate Score</span>
            </button>
          </div>
        </div>

        {/* 7 Quantitative Heuristics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {auditResult.checks.map((chk, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border flex flex-col justify-between space-y-2 transition-all ${
                chk.passed ? "bg-emerald-50/50 border-emerald-200" : "bg-amber-50/60 border-amber-200"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    {chk.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    )}
                    <span className="font-bold text-xs text-[#10183A]">{chk.title}</span>
                  </div>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      chk.passed ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {chk.currentMetric}
                  </span>
                </div>

                <p className="text-xs text-[#626985] leading-relaxed">{chk.detail}</p>
              </div>

              {!chk.passed && (
                <div className="pt-2 border-t border-amber-200 text-[10px] text-amber-900 leading-normal">
                  💡 <strong>Action:</strong> {chk.recommendation}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Insert Image */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl border border-[#E6E7F0] p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E6E7F0] pb-3">
              <h3 className="text-sm font-bold text-[#10183A] flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#6366F1]" />
                <span>Insert Image in Article</span>
              </h3>
              <button
                onClick={() => setShowImageModal(false)}
                className="p-1 rounded-lg text-[#626985] hover:bg-[#F5F4FF]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#10183A] mb-1">Image URL / Path</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/... or /images/..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E7F0] text-xs text-[#10183A] focus:outline-none focus:border-[#6366F1]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#10183A] mb-1">Alt Text (for SEO & Accessibility)</label>
                <input
                  type="text"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  placeholder="e.g. Core Web Vitals diagnostic waterfall diagram"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E7F0] text-xs text-[#10183A] focus:outline-none focus:border-[#6366F1]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#10183A] mb-1">Optional Caption</label>
                <input
                  type="text"
                  value={imageCaption}
                  onChange={(e) => setImageCaption(e.target.value)}
                  placeholder="e.g. Figure 1: Sub-second LCP optimization workflow"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E7F0] text-xs text-[#10183A] focus:outline-none focus:border-[#6366F1]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowImageModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#626985] hover:bg-[#F5F4FF]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleInsertImage}
                disabled={!imageUrl.trim()}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#6366F1] to-[#8067FF] disabled:opacity-50"
              >
                Insert Image
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Schedule Publication Date */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl border border-[#E6E7F0] p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E6E7F0] pb-3">
              <h3 className="text-sm font-bold text-[#10183A] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>Schedule Publication Date</span>
              </h3>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="p-1 rounded-lg text-[#626985] hover:bg-[#F5F4FF]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-[#626985]">
                Choose the target release date for this article. It will appear on your Editorial Calendar schedule.
              </p>

              <div>
                <label className="block text-xs font-semibold text-[#10183A] mb-1">Target Release Date</label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => {
                    markDirty();
                    setScheduledDate(e.target.value);
                  }}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E6E7F0] text-xs text-[#10183A] focus:outline-none focus:border-[#6366F1]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowScheduleModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#626985] hover:bg-[#F5F4FF]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleScheduleForDate}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-[#6366F1]"
              >
                Save Schedule Date
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Safety Modal: Unsaved Changes Navigation Confirmation */}
      {showExitConfirmModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl border border-[#E6E7F0] p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-amber-600">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <h3 className="text-sm font-bold text-[#10183A]">You Have Unsaved Article Changes</h3>
            </div>
            <p className="text-xs text-[#626985] leading-relaxed">
              Leaving without saving will lose your recent edits. What would you like to do before navigating to another section?
            </p>
            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={async () => {
                  await handleSaveDraft();
                  setShowExitConfirmModal(false);
                  if (pendingNavigationUrl) router.push(pendingNavigationUrl);
                }}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#6366F1] to-[#8067FF]"
              >
                Save Draft & Proceed &rarr;
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsDirty(false);
                  setShowExitConfirmModal(false);
                  if (pendingNavigationUrl) router.push(pendingNavigationUrl);
                }}
                className="w-full py-2.5 rounded-xl text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100"
              >
                Discard Changes & Leave
              </button>
              <button
                type="button"
                onClick={() => setShowExitConfirmModal(false)}
                className="w-full py-2 rounded-xl text-xs font-semibold text-[#626985] hover:bg-[#F5F4FF]"
              >
                Stay on Editor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
