"use client";

import React, { useState, useEffect, Suspense } from "react";
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
        <div className="space-y-8">
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
