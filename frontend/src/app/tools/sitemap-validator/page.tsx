"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Sparkles, CheckCircle2, AlertTriangle, FileCode, Search, Loader2 } from "lucide-react";

export default function SitemapValidatorPage() {
  const [sitemapUrl, setSitemapUrl] = useState("https://helloshiva.com/sitemap.xml");
  const [xmlContent, setXmlContent] = useState("");
  const [activeTab, setActiveTab] = useState<"url" | "xml">("url");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleValidate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const payload = activeTab === "url" ? { url: sitemapUrl.trim() } : { xmlContent: xmlContent.trim() };
      const res = await fetch("/api/v1/tools/sitemap-validator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to validate sitemap.");
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
            <Sparkles className="w-3.5 h-3.5" /> Free Technical SEO Tool
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#10183A]">
            XML Sitemap Validator & Inspector
          </h1>
          <p className="text-sm text-[#626985] max-w-2xl leading-relaxed">
            Validate XML syntax, sitemap index hierarchies, URL counts, and ensure adherence to Google and Bing sitemap specifications.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 mb-16">
        <div className="bg-white rounded-3xl border border-[#E6E7F0] p-6 sm:p-8 shadow-sm space-y-4">
          {/* Mode Switcher */}
          <div className="flex gap-2 border-b border-[#E6E7F0] pb-3">
            <button
              onClick={() => setActiveTab("url")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "url" ? "bg-[#6366F1] text-white" : "text-[#626985] hover:bg-[#F5F4FF]"
              }`}
            >
              Validate by Public URL
            </button>
            <button
              onClick={() => setActiveTab("xml")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "xml" ? "bg-[#6366F1] text-white" : "text-[#626985] hover:bg-[#F5F4FF]"
              }`}
            >
              Paste Raw XML Code
            </button>
          </div>

          <form onSubmit={handleValidate} className="space-y-4">
            {activeTab === "url" ? (
              <div>
                <label className="block text-xs font-semibold text-[#10183A] mb-1">Sitemap URL</label>
                <input
                  type="url"
                  required
                  value={sitemapUrl}
                  onChange={(e) => setSitemapUrl(e.target.value)}
                  placeholder="https://example.com/sitemap.xml"
                  className="w-full px-4 py-3 rounded-xl border border-[#E6E7F0] text-sm text-[#10183A] focus:outline-none focus:border-[#6366F1] transition-all"
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-[#10183A] mb-1">Paste Raw XML</label>
                <textarea
                  rows={6}
                  required
                  value={xmlContent}
                  onChange={(e) => setXmlContent(e.target.value)}
                  placeholder='<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">...'
                  className="w-full px-4 py-3 rounded-xl border border-[#E6E7F0] text-xs font-mono text-[#10183A] focus:outline-none focus:border-[#6366F1] transition-all"
                />
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-[#6366F1] to-[#8067FF] hover:from-[#5558E6] hover:to-[#7358F5] shadow-md shadow-indigo-500/20 disabled:opacity-50 flex items-center gap-2 cursor-pointer transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Validating XML...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Validate Sitemap</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
              {error}
            </div>
          )}
        </div>

        {/* Results */}
        {result && (
          <div className="bg-white rounded-3xl border border-[#E6E7F0] p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E6E7F0] pb-4">
              <div className="flex items-center gap-3">
                <FileCode className="w-6 h-6 text-[#6366F1]" />
                <div>
                  <h3 className="text-base font-bold text-[#10183A]">{result.format}</h3>
                  <span className="text-xs text-[#626985]">
                    {result.totalEntries.toLocaleString()} total entries detected
                  </span>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-xl text-xs font-bold uppercase ${
                  result.isValid ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                }`}
              >
                {result.isValid ? "Valid XML Schema" : "Warnings Found"}
              </span>
            </div>

            {/* Warnings */}
            {result.warnings.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700">Warnings:</h4>
                {result.warnings.map((w: string, idx: number) => (
                  <div key={idx} className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{w}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Sample URLs */}
            {result.sampleUrls && result.sampleUrls.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-[#10183A]">First {result.sampleUrls.length} Discovered URLs:</h4>
                <div className="p-4 rounded-2xl bg-[#F5F4FF] border border-[#E8E7FF] font-mono text-xs space-y-1.5 overflow-x-auto text-[#10183A]">
                  {result.sampleUrls.map((u: string, idx: number) => (
                    <div key={idx} className="truncate">
                      <span className="text-[#626985] w-6 inline-block">{idx + 1}.</span>
                      <span>{u}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Agency Cross-Sell CTA */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-[#0B1025] to-[#171F42] text-white border border-[#252B49] shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <span className="text-xs font-semibold text-[#8067FF] uppercase tracking-wider">
              Search Indexing Strategy
            </span>
            <h3 className="text-xl sm:text-2xl font-bold">
              Need comprehensive technical SEO architecture?
            </h3>
            <p className="text-xs sm:text-sm text-[#C6C9DC] max-w-xl">
              From sitemap index splitting to international hreflang schemas, HelloShiva builds flawless web foundations.
            </p>
          </div>
          <Link
            href="/services/technical-seo"
            className="shrink-0 inline-flex items-center gap-1.5 px-6 py-3.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#6366F1] to-[#8067FF] hover:opacity-90 transition-opacity"
          >
            <span>Technical SEO</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
