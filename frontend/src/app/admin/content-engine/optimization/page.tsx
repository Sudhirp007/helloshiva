"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Loader2,
  Play,
  FileEdit,
  BookmarkCheck,
} from "lucide-react";

export default function SeoOptimizationDeskPage() {
  const router = useRouter();
  const [draft, setDraft] = useState<any>({
    title: "Why Technical SEO is the Non-Negotiable Foundation for Content Success",
    slug: "why-technical-seo-is-the-prerequisite-for-content-success",
    metaDescription:
      "Discover why technical SEO must precede content scaling. Learn how DOM rendering bottlenecks, crawl budget waste, and schema errors derail search rankings.",
    contentMarkdown: `# Why Technical SEO is the Non-Negotiable Foundation for Content Success

In modern digital marketing, content strategy is frequently treated in a vacuum. Marketing executives commit significant budgets to editorial calendars, freelance writers, and content generation engines. Yet months later, organic search traffic remains flat.

The diagnosis is almost always identical: the website has structural, code-level technical SEO bottlenecks that prevent Googlebot from efficiently discovering, rendering, and indexing pages.

## 1. The Rendering Gap: Why Content Quality Means Nothing to an Unrendered DOM
Search engines do not read your website like human visitors. Before an algorithm can evaluate topical depth, it must construct the DOM tree.

### Sub-second LCP Techniques
Pre-connecting fonts and caching HTML edge responses.

## Frequently Asked Questions
### Why does LCP matter?
It directly impacts search engine ranking and user bounce rate.

[Explore HelloShiva Technical SEO](/services/technical-seo)
`,
  });

  const [audit, setAudit] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if draft was passed in session storage from Drafting desk
    const saved = sessionStorage.getItem("draft_for_audit");
    if (saved) {
      try {
        setDraft(JSON.parse(saved));
      } catch {}
    }
  }, []);

  const handleRunAudit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/content-engine/optimization", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: draft.title,
          metaDescription: draft.metaDescription || draft.meta_description,
          contentMarkdown: draft.contentMarkdown || draft.content_markdown,
          primaryKeyword: draft.primaryKeyword || draft.primary_keyword,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAudit(data.audit);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Run audit initially on load
  useEffect(() => {
    handleRunAudit();
  }, []);

  const handleTransferToSocial = () => {
    sessionStorage.setItem("article_for_social", JSON.stringify(draft));
    router.push("/admin/content-engine/social");
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E8E7FF] text-[#6366F1] mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          Desk 5 • Quantitative OpenSEO Heuristics
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#10183A]">
          SEO Review & Quantitative Audit Checklist
        </h1>
        <p className="text-sm text-[#626985]">
          Transparent, code-level pre-publication verification showing exact character counts, word volume, semantic heading counts, and internal link distribution.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-[#E6E7F0] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6E7F0] pb-4">
          <div>
            <span className="text-xs text-[#626985]">Article Under Verification:</span>
            <h2 className="text-base font-bold text-[#10183A]">{draft.title}</h2>
          </div>
          <div className="flex items-center gap-2.5">
            <Link
              href="/admin/content-engine/drafting"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-[#10183A] bg-[#F5F4FF] hover:bg-[#E8E7FF] border border-[#E6E7F0] transition-all"
            >
              <FileEdit className="w-3.5 h-3.5 text-[#6366F1]" />
              <span>Edit in Studio</span>
            </Link>

            <button
              onClick={handleRunAudit}
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#6366F1] to-[#8067FF] hover:opacity-90 shadow-md transition-all cursor-pointer"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
              <span>Re-Run Audit</span>
            </button>
          </div>
        </div>

        {/* Audit Results */}
        {audit && (
          <div className="space-y-6 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#0B1025] text-white border border-[#252B49]">
              <div>
                <span className="text-xs text-[#C6C9DC]">Audit Verification Score:</span>
                <div className="text-3xl font-black text-white mt-1">
                  {audit.score} <span className="text-sm font-normal text-[#C6C9DC]">/ 100</span>
                </div>
                <div className="text-xs text-[#8067FF] mt-1 font-mono">
                  {audit.wordCount.toLocaleString()} total words • ~{audit.readingTimeMinutes} min read
                </div>
              </div>

              <button
                onClick={handleTransferToSocial}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#6366F1] to-[#8067FF] hover:opacity-90 shadow-lg shadow-indigo-500/25 transition-all cursor-pointer"
              >
                <span>Approve & Generate Social Copy</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Checklist items with Quantitative Numbers */}
            <div className="space-y-3">
              {audit.checks.map((chk: any, idx: number) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border transition-all ${
                    chk.passed
                      ? "bg-emerald-50/50 border-emerald-200"
                      : "bg-amber-50/60 border-amber-200"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {chk.passed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                        )}
                        <span className="font-bold text-xs text-[#10183A]">{chk.title}</span>
                        <span className="text-[10px] font-semibold text-[#626985] bg-white px-2 py-0.5 rounded border border-[#E6E7F0]">
                          {chk.category}
                        </span>
                      </div>
                      <p className="text-xs text-[#626985] leading-relaxed pl-6">{chk.detail}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 pl-6 sm:pl-0">
                      <span className="text-[11px] font-mono font-bold bg-white px-2.5 py-1 rounded-lg border border-[#E6E7F0] text-[#10183A]">
                        {chk.currentMetric || (chk.passed ? "Optimal" : "Review")}
                      </span>
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-lg ${
                          chk.passed
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            : "bg-amber-100 text-amber-800 border border-amber-200"
                        }`}
                      >
                        {chk.passed ? "PASSED" : "REVIEW"}
                      </span>
                    </div>
                  </div>

                  {!chk.passed && (
                    <div className="mt-2.5 pt-2.5 border-t border-amber-200/60 pl-6 text-[11px] text-amber-900 leading-normal">
                      💡 <strong>Recommendation:</strong> {chk.recommendation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
