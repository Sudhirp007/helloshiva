"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Sparkles, Search, Loader2, CheckCircle2, AlertTriangle, XCircle, Shield } from "lucide-react";

export default function SeoPageAnalyzerPage() {
  const [url, setUrl] = useState("https://helloshiva.com");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/v1/tools/seo-analyzer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to analyze webpage.");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-28 pb-20 bg-light-section min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <Link
          href="/tools"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6366F1] hover:text-[#8067FF] mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to all 10 free tools
        </Link>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E8E7FF] text-[#6366F1]">
            <Sparkles className="w-3.5 h-3.5" /> Free SEO Diagnostic Tool
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#10183A]">
            On-Page SEO Technical Analyzer
          </h1>
          <p className="text-sm text-[#626985] max-w-2xl leading-relaxed">
            Audit any public webpage in seconds. Inspect titles, meta descriptions, canonical URLs, robots directives, mobile viewport tags, and heading hierarchy.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 mb-16">
        {/* Input Bar */}
        <div className="bg-white rounded-3xl border border-[#E6E7F0] p-6 sm:p-8 shadow-sm">
          <form onSubmit={handleAnalyze} className="flex flex-col sm:flex-row gap-3">
            <input
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/page-to-analyze"
              className="flex-1 px-4 py-3 rounded-xl border border-[#E6E7F0] text-sm text-[#10183A] focus:outline-none focus:border-[#6366F1] transition-all"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-7 py-3 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-[#6366F1] to-[#8067FF] hover:from-[#5558E6] hover:to-[#7358F5] shadow-md shadow-indigo-500/20 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Auditing...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Analyze Webpage</span>
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
              {error}
            </div>
          )}
        </div>

        {/* Results Section */}
        {result && (
          <div className="bg-white rounded-3xl border border-[#E6E7F0] p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E6E7F0] pb-4">
              <div>
                <span className="text-xs text-[#626985]">Analyzed Target:</span>
                <div className="text-base font-bold text-[#10183A] break-all">{result.url}</div>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                  HTTP {result.statusCode}
                </span>
                <span className="text-[#626985]">{result.responseTimeMs}ms response</span>
              </div>
            </div>

            {/* Checks Checklist */}
            <div className="space-y-3">
              {result.checks.map((c: any, idx: number) => {
                const isPass = c.status === "PASS";
                const isWarn = c.status === "WARN";
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-[#F5F4FF] border border-[#E8E7FF] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {isPass ? (
                          <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0" />
                        ) : isWarn ? (
                          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                        )}
                        <span className="text-sm font-bold text-[#10183A]">{c.name}</span>
                        <span
                          className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                            isPass
                              ? "bg-emerald-100 text-emerald-800"
                              : isWarn
                              ? "bg-amber-100 text-amber-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {c.status}
                        </span>
                      </div>
                      <p className="text-xs text-[#626985] leading-relaxed pl-6">
                        {c.recommendation}
                      </p>
                    </div>
                    <div className="text-xs font-mono text-[#10183A] bg-white px-3 py-1.5 rounded-lg border border-[#E6E7F0] max-w-xs truncate sm:text-right shrink-0">
                      {c.value}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Disclaimer */}
            <p className="text-[11px] text-[#626985] italic pt-2">
              Note: This tool inspects on-page technical factors. It does not evaluate backlinks, algorithmic search intent nuances, or represent a complete Google ranking guarantee.
            </p>
          </div>
        )}

        {/* Agency Cross-Sell CTA */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-[#0B1025] to-[#171F42] text-white border border-[#252B49] shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <span className="text-xs font-semibold text-[#8067FF] uppercase tracking-wider">
              Need Professional Remediation?
            </span>
            <h3 className="text-xl sm:text-2xl font-bold">
              Found critical on-page issues on your website?
            </h3>
            <p className="text-xs sm:text-sm text-[#C6C9DC] max-w-xl">
              HelloShiva engineers comprehensive, revenue-aligned organic search growth and resolves technical debt for ambitious businesses.
            </p>
          </div>
          <Link
            href="/services/seo-services"
            className="shrink-0 inline-flex items-center gap-1.5 px-6 py-3.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#6366F1] to-[#8067FF] hover:opacity-90 transition-opacity"
          >
            <span>Explore Agency SEO</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
