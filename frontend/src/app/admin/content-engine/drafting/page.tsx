"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FileEdit, Sparkles, Loader2, Wand2, Copy, Check, ArrowRight, BookOpen } from "lucide-react";
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

  // Improve Form State
  const [origTitle, setOrigTitle] = useState("Why Technical SEO is the Prerequisite for Content Success");
  const [origContent, setOrigContent] = useState(
    `Publishing great articles is useless if search engines face DOM rendering bottlenecks, indexing directives confusion, or crawl budget waste. Here is how to fix code-level SEO first.`
  );

  // Processing state
  const [loading, setLoading] = useState(false);
  const [draftResult, setDraftResult] = useState<any>(null);
  const [draftArticleId, setDraftArticleId] = useState<string>("");
  const [improvementResult, setImprovementResult] = useState<any>(null);
  const [error, setError] = useState("");

  // Prefill from calendar if passed
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
          targetAudience: targetAudience.trim() || "Digital Marketers and Founders",
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

  const handleImproveContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!origTitle.trim() || !origContent.trim()) return;

    setLoading(true);
    setError("");
    setImprovementResult(null);

    try {
      const res = await fetch("/api/v1/content-engine/drafting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "improve",
          originalTitle: origTitle.trim(),
          originalContent: origContent.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to improve content.");
      }

      setImprovementResult(data.improvement);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E8E7FF] text-[#6366F1] mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          Desk 4 • AI Editorial Engine & Professional SEO Editor
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#10183A]">
          AI Drafting & Rich SEO Content Studio
        </h1>
        <p className="text-sm text-[#626985]">
          Generate 1,000–1,500 word commercial drafts from approved calendar briefs, edit with rich SEO formatting, and verify quantitative metrics live before publishing.
        </p>
      </div>

      {/* Workflow Tabs */}
      <div className="flex gap-2 border-b border-[#E6E7F0] pb-3">
        <button
          onClick={() => setActiveTab("create")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "create"
              ? "bg-[#0B1025] text-white shadow-sm"
              : "text-[#626985] hover:bg-white"
          }`}
        >
          A. Create & Generate New Draft
        </button>
        <button
          onClick={() => setActiveTab("improve")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "improve"
              ? "bg-[#0B1025] text-white shadow-sm"
              : "text-[#626985] hover:bg-white"
          }`}
        >
          B. Improve Existing Content
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
              <span>Draft Brief Parameters</span>
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
                  className="px-7 py-3 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-[#6366F1] to-[#8067FF] hover:from-[#5558E6] hover:to-[#7358F5] shadow-md shadow-indigo-500/20 disabled:opacity-50 flex items-center gap-2 cursor-pointer transition-all"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Generating 1,200-Word Draft...</span>
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

          {/* Mount the Rich SEO Article Editor once draft is ready! */}
          {draftResult && (
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#6366F1] uppercase tracking-wider">
                    Draft Generated Successfully
                  </span>
                  <h3 className="text-lg font-extrabold text-[#10183A]">
                    Live Interactive SEO Workspace
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

      {/* Tab B: Improve Content */}
      {activeTab === "improve" && (
        <div className="space-y-8">
          <div className="bg-white rounded-3xl border border-[#E6E7F0] p-6 sm:p-8 shadow-sm">
            <form onSubmit={handleImproveContent} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-[#10183A] mb-1">Original Article Title</label>
                <input
                  type="text"
                  required
                  value={origTitle}
                  onChange={(e) => setOrigTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E6E7F0] text-sm text-[#10183A] focus:outline-none focus:border-[#6366F1]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#10183A] mb-1">Existing Article Markdown Content</label>
                <textarea
                  rows={6}
                  required
                  value={origContent}
                  onChange={(e) => setOrigContent(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#E6E7F0] text-xs font-mono text-[#10183A] focus:outline-none focus:border-[#6366F1]"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-[#6366F1] to-[#8067FF] flex items-center gap-2 cursor-pointer"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                  <span>Generate Proposed Improvements</span>
                </button>
              </div>
            </form>
          </div>

          {improvementResult && (
            <div className="bg-white rounded-3xl border border-[#E6E7F0] p-6 sm:p-8 shadow-sm space-y-6">
              <h2 className="text-base font-bold text-[#10183A] border-b border-[#E6E7F0] pb-3">
                Proposed Improvements & Side-by-Side Review
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <span className="text-xs font-bold text-[#626985] block mb-2">Original Version:</span>
                  <div className="p-4 rounded-2xl bg-[#F5F4FF] border border-[#E6E7F0] text-xs font-mono text-[#10183A] whitespace-pre-wrap h-80 overflow-y-auto">
                    {origContent}
                  </div>
                </div>

                <div>
                  <span className="text-xs font-bold text-[#6366F1] block mb-2">Enhanced & Optimized Version:</span>
                  <div className="p-4 rounded-2xl bg-[#0B1025] border border-[#252B49] text-xs font-mono text-[#C6C9DC] whitespace-pre-wrap h-80 overflow-y-auto">
                    {improvementResult.improvedMarkdown}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#F5F4FF] border border-[#E8E7FF] space-y-2">
                <span className="text-xs font-bold text-[#10183A]">Specific SEO Upgrades Applied:</span>
                <ul className="list-disc list-inside text-xs text-[#626985] space-y-1">
                  {improvementResult.changesMade?.map((c: string, idx: number) => (
                    <li key={idx}>{c}</li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setHeadline(origTitle);
                    setDraftResult({
                      title: origTitle,
                      slug: origTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                      metaDescription: `Improved guide on ${origTitle}`,
                      contentMarkdown: improvementResult.improvedMarkdown,
                      modelUsed: "Gemini Optimization",
                    });
                    setDraftArticleId(`art-${Date.now()}`);
                    setActiveTab("create");
                  }}
                  className="px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#6366F1] to-[#8067FF] cursor-pointer"
                >
                  Load into Rich SEO Editor &rarr;
                </button>
              </div>
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
          <span>Loading Drafting Workspace...</span>
        </div>
      }
    >
      <AiDraftingDeskInner />
    </Suspense>
  );
}
