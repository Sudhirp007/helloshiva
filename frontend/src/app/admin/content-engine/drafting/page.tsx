"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FileEdit, Sparkles, Loader2, CheckCircle2, ArrowRight, Wand2, Copy, Eye, HelpCircle } from "lucide-react";

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
  const [origContent, setOrigContent] = useState(`Publishing great articles is useless if search engines face DOM rendering bottlenecks, indexing directives confusion, or crawl budget waste. Here is how to fix code-level SEO first.`);

  // Processing state
  const [loading, setLoading] = useState(false);
  const [draftResult, setDraftResult] = useState<any>(null);
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

  const handleTransferToOptimization = () => {
    if (draftResult) {
      // Store in session storage or navigate to optimization
      sessionStorage.setItem("draft_for_audit", JSON.stringify(draftResult));
      router.push("/admin/content-engine/optimization");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E8E7FF] text-[#6366F1] mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          Desk 3 • AI Editorial Engine (Google Gemini API Adapter)
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#10183A]">
          AI Drafting & Content Improvement Desk
        </h1>
        <p className="text-sm text-[#626985]">
          Generate 1,000–1,500 word technical drafts from approved briefs, or optimize existing articles with side-by-side comparison.
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
          A. Create New Article Draft
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

          {/* Draft Display */}
          {draftResult && (
            <div className="bg-white rounded-3xl border border-[#E6E7F0] p-6 sm:p-10 shadow-sm space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E6E7F0] pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#6366F1]">
                    Draft Ready • Model: {draftResult.modelUsed}
                  </span>
                  <h2 className="text-xl font-extrabold text-[#10183A]">{draftResult.title}</h2>
                  <div className="text-xs text-[#626985] font-mono mt-1">Slug: /blog/{draftResult.slug}</div>
                </div>

                <button
                  onClick={handleTransferToOptimization}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#6366F1] to-[#8067FF] hover:opacity-90 shadow-md transition-all cursor-pointer"
                >
                  <span>Transfer to Desk 5: SEO Review</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Meta Description */}
              <div className="p-4 rounded-xl bg-[#F5F4FF] border border-[#E8E7FF] text-xs space-y-1">
                <span className="font-bold text-[#10183A]">Proposed Meta Description:</span>
                <p className="text-[#626985]">{draftResult.metaDescription}</p>
              </div>

              {/* Markdown Content Area */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#10183A]">Article Markdown (Editable):</label>
                <textarea
                  rows={18}
                  value={draftResult.contentMarkdown}
                  onChange={(e) => setDraftResult({ ...draftResult, contentMarkdown: e.target.value })}
                  className="w-full px-5 py-4 rounded-2xl bg-[#0B1025] text-[#C6C9DC] font-mono text-xs leading-relaxed focus:outline-none"
                />
              </div>
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

              <div className="p-4 rounded-2xl bg-[#F5F4FF] border border-[#E8E7FF] text-xs space-y-2">
                <span className="font-bold text-[#6366F1]">Summary of Key Enhancements:</span>
                <ul className="list-disc pl-5 space-y-1 text-[#626985]">
                  {improvementResult.changeSummary.map((ch: string, idx: number) => (
                    <li key={idx}>{ch}</li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <span className="text-xs font-bold text-[#10183A] block mb-2">Original Content:</span>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700 max-h-80 overflow-y-auto">
                    {origContent}
                  </div>
                </div>

                <div>
                  <span className="text-xs font-bold text-[#6366F1] block mb-2">Proposed Optimized Version:</span>
                  <div className="p-4 rounded-2xl bg-[#0B1025] border border-[#252B49] text-xs font-mono text-[#C6C9DC] max-h-80 overflow-y-auto">
                    {improvementResult.proposedContentMarkdown}
                  </div>
                </div>
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
        <div className="p-8 text-center text-[#626985]">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#6366F1] mb-2" />
          Loading AI Drafting Desk...
        </div>
      }
    >
      <AiDraftingDeskInner />
    </Suspense>
  );
}
