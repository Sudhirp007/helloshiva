"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, AlertTriangle, XCircle, Sparkles, ArrowRight, Loader2, Play } from "lucide-react";

export default function SeoOptimizationDeskPage() {
  const router = useRouter();
  const [draft, setDraft] = useState<any>({
    title: "The 2026 Core Web Vitals Blueprint: How to Achieve Sub-Second LCP",
    metaDescription: "Master Core Web Vitals with HelloShiva's comprehensive guide. Discover actionable frameworks, technical optimizations, and strategic best practices.",
    contentMarkdown: `# The 2026 Core Web Vitals Blueprint

Sustainable growth requires mastering technical SEO.

## 1. Largest Contentful Paint (LCP)
Optimizing server headers and image formats.

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
          metaDescription: draft.metaDescription,
          contentMarkdown: draft.contentMarkdown,
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

  const handleTransferToSocial = () => {
    sessionStorage.setItem("article_for_social", JSON.stringify(draft));
    router.push("/admin/content-engine/social");
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E8E7FF] text-[#6366F1] mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          Desk 5 • OpenSEO Audit Heuristics Adapter
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#10183A]">
          SEO Review & Optimization Checklist
        </h1>
        <p className="text-sm text-[#626985]">
          Transparent, code-level pre-publication checklist verifying semantic headings, meta lengths, FAQ readiness, and internal links without black-box scores.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-[#E6E7F0] p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E6E7F0] pb-3">
          <div>
            <span className="text-xs text-[#626985]">Article Under Review:</span>
            <h2 className="text-base font-bold text-[#10183A]">{draft.title}</h2>
          </div>
          <button
            onClick={handleRunAudit}
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#6366F1] to-[#8067FF] hover:opacity-90 shadow-md transition-all cursor-pointer"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
            <span>Run OpenSEO Verification</span>
          </button>
        </div>

        {/* Audit Results */}
        {audit && (
          <div className="space-y-6 pt-2">
            <div className="flex items-center justify-between p-5 rounded-2xl bg-[#0B1025] text-white">
              <div>
                <span className="text-xs text-[#C6C9DC]">Audit Verification Score:</span>
                <div className="text-3xl font-black text-white">{audit.score} / 100</div>
              </div>
              <button
                onClick={handleTransferToSocial}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#6366F1] to-[#8067FF] hover:opacity-90 shadow-lg shadow-indigo-500/25 transition-all cursor-pointer"
              >
                <span>Approve & Generate Social Copy</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {audit.checks.map((chk: any, idx: number) => (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border flex items-start justify-between gap-4 ${
                    chk.passed
                      ? "bg-emerald-50/50 border-emerald-200"
                      : "bg-amber-50/50 border-amber-200"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {chk.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                      )}
                      <span className="font-bold text-xs text-[#10183A]">{chk.title}</span>
                      <span className="text-[10px] font-semibold text-[#626985] bg-white px-2 py-0.5 rounded border border-[#E6E7F0]">
                        {chk.category}
                      </span>
                    </div>
                    <p className="text-xs text-[#626985] leading-relaxed pl-6">{chk.recommendation}</p>
                  </div>
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                      chk.passed ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {chk.passed ? "PASSED" : "REVIEW"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
