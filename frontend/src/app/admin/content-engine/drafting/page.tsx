"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FileEdit,
  Sparkles,
  Loader2,
  Wand2,
  Copy,
  Check,
  ArrowRight,
  BookOpen,
  FolderOpen,
  Calendar,
  Layers,
} from "lucide-react";
import RichArticleEditor from "@/components/admin/RichArticleEditor";

function AiDraftingDeskInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState<"create" | "improve">("create");

  // AI Configuration State
  const [selectedModel, setSelectedModel] = useState("gemini-2.0-flash");
  const [apiKeyConfigured, setApiKeyConfigured] = useState(false);
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [inputKey, setInputKey] = useState("");
  const [savingKey, setSavingKey] = useState(false);
  const [showPromptPreview, setShowPromptPreview] = useState(false);

  // Create Form State
  const [headline, setHeadline] = useState("");
  const [primaryKeyword, setPrimaryKeyword] = useState("");
  const [theme, setTheme] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [suggestedCta, setSuggestedCta] = useState("");
  const [calendarId, setCalendarId] = useState("");

  // Improve Form State (Connected to real articles!)
  const [existingArticles, setExistingArticles] = useState<any[]>([]);
  const [selectedArticleId, setSelectedArticleId] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [loadingArticles, setLoadingArticles] = useState(false);

  // Processing state
  const [loading, setLoading] = useState(false);
  const [draftResult, setDraftResult] = useState<any>(null);
  const [draftArticleId, setDraftArticleId] = useState<string>("");
  const [error, setError] = useState("");

  // Check integration settings on mount
  useEffect(() => {
    fetch("/api/v1/content-engine/settings")
      .then((res) => res.json())
      .then((d) => {
        if (d.success) {
          const keyRow = d.settings?.find((s: any) => s.key === "GEMINI_API_KEY");
          const modelRow = d.settings?.find((s: any) => s.key === "GEMINI_MODEL");
          if (keyRow?.value && keyRow.value.trim().length > 0) {
            setApiKeyConfigured(true);
            setInputKey(keyRow.value);
          }
          if (modelRow?.value) {
            setSelectedModel(modelRow.value);
          }
        }
      })
      .catch((e) => console.error(e));
  }, []);

  const handleSaveApiKey = async () => {
    if (!inputKey.trim()) return;
    setSavingKey(true);
    try {
      await fetch("/api/v1/content-engine/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          settings: {
            GEMINI_API_KEY: inputKey.trim(),
            GEMINI_MODEL: selectedModel,
          },
        }),
      });
      setApiKeyConfigured(true);
      setShowKeyInput(false);
    } catch (e) {
      console.error(e);
    } finally {
      setSavingKey(false);
    }
  };

  // Prefill from URL query params (e.g. from SEO Research Desk!)
  useEffect(() => {
    if (searchParams) {
      const h = searchParams.get("headline");
      const k = searchParams.get("primaryKeyword");
      const t = searchParams.get("theme");
      const a = searchParams.get("targetAudience");
      const c = searchParams.get("suggestedCta");
      const calId = searchParams.get("calendarId");

      if (h) setHeadline(h);
      if (k) setPrimaryKeyword(k);
      if (t) setTheme(t);
      if (a) setTargetAudience(a);
      if (c) setSuggestedCta(c);
      if (calId) setCalendarId(calId);
    }
  }, [searchParams]);

  // Load existing articles when switching to Tab B
  useEffect(() => {
    if (activeTab === "improve") {
      setLoadingArticles(true);
      fetch("/api/v1/content-engine/articles")
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setExistingArticles(data.articles);
            if (data.articles.length > 0 && !selectedArticleId) {
              setSelectedArticleId(data.articles[0].id);
              setSelectedArticle(data.articles[0]);
            }
          }
        })
        .finally(() => setLoadingArticles(false));
    }
  }, [activeTab, selectedArticleId]);

  const handleSelectExistingArticle = (id: string) => {
    setSelectedArticleId(id);
    const found = existingArticles.find((a) => a.id === id);
    if (found) {
      setSelectedArticle(found);
    }
  };

  const handleGenerateDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!headline.trim() || !primaryKeyword.trim()) return;

    setLoading(true);
    setError("");
    setDraftResult(null);

    try {
      const res = await fetch("/api/v1/content-engine/drafting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create",
          headline: headline.trim(),
          primaryKeyword: primaryKeyword.trim(),
          theme: theme.trim() || "Technical SEO Strategy",
          targetAudience: targetAudience.trim() || "Digital Marketers, Founders, and CTOs",
          suggestedCta: suggestedCta.trim(),
          calendarId,
          modelOverride: selectedModel,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to generate draft.");
      }

      setDraftResult(data.draft);
      setDraftArticleId(data.articleId || `art-${Date.now()}`);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-full font-sans">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E8E7FF] text-[#6366F1] mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          Desk 3 • AI Editorial Engine & Professional SEO Studio
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#10183A]">
          AI Drafting & Rich SEO Content Studio
        </h1>
        <p className="text-sm text-[#626985]">
          Generate 1,000–1,500 word commercial drafts from SEO research, edit with full formatting and callouts, and verify quantitative metrics live before publishing or scheduling.
        </p>
      </div>

      {/* Flagship Content Studio Shortcut Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0B1025] to-[#171F42] border border-[#252B49] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6366F1] to-[#8067FF] flex items-center justify-center text-white shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">
              ROI-On-Property Inspired Content Studio Available
            </h4>
            <p className="text-xs text-[#C6C9DC]">
              Unified 4-stage pipeline: 7-Day Calendar &rarr; Keyword &amp; Competitor Lab &rarr; AI Studio &amp; Live OpenSEO Scoring &rarr; 5-Channel Social Dispatch.
            </p>
          </div>
        </div>
        <Link
          href="/admin/content-studio"
          className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#6366F1] to-[#8067FF] hover:opacity-90 transition-opacity shrink-0 flex items-center gap-1.5 shadow-md shadow-indigo-500/25"
        >
          <span>Open Full Content Studio</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Workflow Tabs */}
      <div className="flex gap-2 border-b border-[#E6E7F0] pb-3">
        <button
          onClick={() => setActiveTab("create")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "create" ? "bg-[#0B1025] text-white shadow-sm" : "text-[#626985] hover:bg-white"
          }`}
        >
          A. Create & Generate New Draft
        </button>
        <button
          onClick={() => setActiveTab("improve")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "improve" ? "bg-[#0B1025] text-white shadow-sm" : "text-[#626985] hover:bg-white"
          }`}
        >
          B. Edit & Improve Existing Articles ({existingArticles.length})
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
          {error}
        </div>
      )}

      {/* Tab A: Create Draft */}
      {activeTab === "create" && (
        <div className="space-y-6">
          {/* AI Intelligence & Transparency Bar */}
          <div className="bg-[#171F42] text-white rounded-3xl p-6 sm:p-7 border border-[#252B49] shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#252B49] pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#8067FF]">
                    AI Drafting Engine & Model Configuration
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white">
                  Google Gemini Strategic Intelligence Layer
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {apiKeyConfigured ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <Check className="w-3.5 h-3.5" />
                    <span>Live Gemini API Key Active</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    <span>⚠️ Offline Mode (Agency Strategy Fallback)</span>
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => setShowKeyInput(!showKeyInput)}
                  className="px-3 py-1 rounded-xl text-xs font-semibold text-white bg-[#0B1025] hover:bg-[#252B49] border border-[#252B49] transition-colors"
                >
                  {showKeyInput ? "Close Key Settings" : "Configure API Key"}
                </button>
              </div>
            </div>

            {/* Inline API Key Setting Input */}
            {showKeyInput && (
              <div className="p-4 rounded-2xl bg-[#0B1025] border border-[#252B49] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#C6C9DC]">Enter Google Gemini API Key:</span>
                  <span className="text-[11px] text-[#626985]">Get key from Google AI Studio</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={inputKey}
                    onChange={(e) => setInputKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="flex-1 px-3.5 py-2 rounded-xl bg-[#171F42] border border-[#252B49] text-xs text-white focus:outline-none focus:border-[#6366F1] font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleSaveApiKey}
                    disabled={savingKey || !inputKey.trim()}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#6366F1] to-[#8067FF] disabled:opacity-50"
                  >
                    {savingKey ? "Saving..." : "Save Key"}
                  </button>
                </div>
              </div>
            )}

            {/* Model Selector & Prompt Inspector */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs font-semibold text-[#C6C9DC] mb-1.5">
                  Select AI Generation Model:
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B1025] border border-[#252B49] text-xs text-white focus:outline-none focus:border-[#6366F1]"
                >
                  <option value="gemini-2.0-flash">Google Gemini 2.0 Flash (Recommended — Flagship Speed & Reasoning)</option>
                  <option value="gemini-1.5-pro">Google Gemini 1.5 Pro (Deep Topical Reasoning & Architectural Depth)</option>
                  <option value="gemini-1.5-flash">Google Gemini 1.5 Flash (Lightweight & Rapid)</option>
                </select>
              </div>

              <div className="flex flex-col justify-end">
                <button
                  type="button"
                  onClick={() => setShowPromptPreview(!showPromptPreview)}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-[#C6C9DC] hover:text-white bg-[#0B1025] hover:bg-[#252B49] border border-[#252B49] flex items-center justify-between transition-colors"
                >
                  <span>🔍 View Prompt & Instructions sent to LLM</span>
                  <span>{showPromptPreview ? "▲ Hide" : "▼ Inspect"}</span>
                </button>
              </div>
            </div>

            {/* Expandable Prompt Inspection Drawer */}
            {showPromptPreview && (
              <div className="p-4 rounded-2xl bg-[#0B1025] border border-[#252B49] space-y-2 text-xs">
                <div className="font-bold text-[#8067FF] text-[11px] uppercase tracking-wider">
                  System Prompt & Quality Directives
                </div>
                <div className="text-[#C6C9DC] font-mono text-[11px] leading-relaxed bg-[#171F42] p-3 rounded-xl border border-[#252B49] whitespace-pre-wrap">
{`You are a Principal Technical SEO Director at HelloShiva (helloshiva.com).
Generate an authoritative, human-written, commercial guide based on:
- Target Headline: \${headline}
- Focus Keyword: \${primaryKeyword}
- Theme: \${theme}
- Target Audience: \${targetAudience}

CRITICAL RULES:
1. Tone: Authoritative, strategic, direct. No robotic filler or generic bullet dumps.
2. Formatting: No top-level H1 # hashtag. No divider lines (---). Natural bolding only.
3. Architecture: 3-4 structured ## Section Headings with ### Subsections.
4. Internal Links: Connect to HelloShiva service pages and free diagnostic tools.
5. FAQ: Include a dedicated "## Frequently Asked Questions" with 3 distinct Q&A pairs.`}
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-3xl border border-[#E6E7F0] p-6 sm:p-8 shadow-sm">
            <h2 className="text-sm font-bold text-[#10183A] mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#6366F1]" />
              <span>Draft Brief Parameters (Prefilled from Research or Custom)</span>
            </h2>

            <form onSubmit={handleGenerateDraft} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-[#10183A] mb-1">
                  Target Headline <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. The 2026 Core Web Vitals Blueprint: How to Achieve Sub-Second LCP"
                  className="w-full px-4 py-3 rounded-xl border border-[#E6E7F0] text-sm text-[#10183A] focus:outline-none focus:border-[#6366F1] transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#10183A] mb-1">
                    Primary Keyword <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={primaryKeyword}
                    onChange={(e) => setPrimaryKeyword(e.target.value)}
                    placeholder="e.g. core web vitals optimization guide"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E7F0] text-sm text-[#10183A] focus:outline-none focus:border-[#6366F1] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#10183A] mb-1">Theme / Category</label>
                  <input
                    type="text"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    placeholder="e.g. Technical SEO & Web Engineering"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E7F0] text-sm text-[#10183A] focus:outline-none focus:border-[#6366F1] transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#10183A] mb-1">Target Audience</label>
                  <input
                    type="text"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="e.g. CTOs, Marketers, Web Developers"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E7F0] text-sm text-[#10183A] focus:outline-none focus:border-[#6366F1] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#10183A] mb-1">Suggested Agency CTA</label>
                  <input
                    type="text"
                    value={suggestedCta}
                    onChange={(e) => setSuggestedCta(e.target.value)}
                    placeholder="e.g. Book a Technical Web Audit with HelloShiva"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E7F0] text-sm text-[#10183A] focus:outline-none focus:border-[#6366F1] transition-all"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-7 py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-[#6366F1] to-[#8067FF] hover:from-[#5558E6] hover:to-[#7358F5] shadow-md shadow-indigo-500/20 disabled:opacity-50 flex items-center gap-2 cursor-pointer transition-all"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Generating Humanized Technical Draft...</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4" />
                      <span>Generate Article Draft</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Mount the Rich Full-Width Editor once draft is ready! */}
          {draftResult && (
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#6366F1] uppercase tracking-wider">
                    Draft Ready • Model: {draftResult.modelUsed || "Gemini Editorial"}
                  </span>
                  <h3 className="text-lg font-extrabold text-[#10183A]">
                    Live Interactive Studio Workspace
                  </h3>
                </div>
              </div>

              <RichArticleEditor
                articleId={draftArticleId}
                initialTitle={draftResult.title}
                initialSlug={draftResult.slug}
                initialMetaDescription={draftResult.metaDescription}
                initialContent={draftResult.contentMarkdown}
                initialKeyword={primaryKeyword}
                initialCategory={theme || "Technical SEO"}
                initialStatus="DRAFT_READY"
              />
            </div>
          )}
        </div>
      )}

      {/* Tab B: Edit & Improve Existing Articles */}
      {activeTab === "improve" && (
        <div className="space-y-8">
          <div className="bg-white rounded-3xl border border-[#E6E7F0] p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-[#6366F1]" />
              <h2 className="text-sm font-bold text-[#10183A]">
                Select an Article to Edit, Refine, or Re-Optimize
              </h2>
            </div>
            <p className="text-xs text-[#626985]">
              Load any existing drafted, scheduled, or published article directly into the studio to make content changes, add images, and recalculate SEO scores.
            </p>

            {loadingArticles ? (
              <div className="p-8 text-center text-xs text-[#626985] flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#6366F1]" />
                <span>Loading existing articles...</span>
              </div>
            ) : existingArticles.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#626985]">
                No articles found in database. Create a new draft in Tab A first.
              </div>
            ) : (
              <div className="space-y-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-[#10183A] mb-1.5">
                    Choose Article:
                  </label>
                  <select
                    value={selectedArticleId}
                    onChange={(e) => handleSelectExistingArticle(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#E6E7F0] text-xs font-semibold text-[#10183A] bg-white focus:outline-none focus:border-[#6366F1]"
                  >
                    {existingArticles.map((art) => (
                      <option key={art.id} value={art.id}>
                        [{art.status}] {art.title} (/blog/{art.slug})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Mount the Rich Editor populated with the selected article! */}
          {selectedArticle && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#E6E7F0] pb-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#6366F1]">
                    Editing Active Article • {selectedArticle.id}
                  </span>
                  <h3 className="text-lg font-bold text-[#10183A]">{selectedArticle.title}</h3>
                </div>
              </div>

              <RichArticleEditor
                key={selectedArticle.id}
                articleId={selectedArticle.id}
                initialTitle={selectedArticle.title}
                initialSlug={selectedArticle.slug}
                initialMetaDescription={selectedArticle.meta_description}
                initialContent={selectedArticle.content_markdown}
                initialKeyword={selectedArticle.primary_keyword || ""}
                initialCategory={selectedArticle.category || "Technical SEO"}
                initialStatus={selectedArticle.status}
                initialScheduledDate={selectedArticle.scheduled_date || ""}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AiDraftingDeskPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-sm text-[#626985] flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-[#6366F1]" />
          <span>Loading Studio Workspace...</span>
        </div>
      }
    >
      <AiDraftingDeskInner />
    </Suspense>
  );
}
