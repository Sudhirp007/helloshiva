"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Sparkles, Search, Loader2, Share2, AlertCircle, CheckCircle2, Globe } from "lucide-react";

export default function OpenGraphPreviewPage() {
  const [url, setUrl] = useState("https://helloshiva.com");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/v1/tools/og-preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch Open Graph tags.");
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
            <Sparkles className="w-3.5 h-3.5" /> Free Social & Media Utility
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#10183A]">
            Open Graph & Social Share Previewer
          </h1>
          <p className="text-sm text-[#626985] max-w-2xl leading-relaxed">
            Preview how your webpage displays when shared across LinkedIn, Twitter/X, and Facebook. Verify og:title, og:description, and og:image tags.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 mb-16">
        <div className="bg-white rounded-3xl border border-[#E6E7F0] p-6 sm:p-8 shadow-sm">
          <form onSubmit={handleFetch} className="flex flex-col sm:flex-row gap-3">
            <input
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://yourwebsite.com/article"
              className="flex-1 px-4 py-3 rounded-xl border border-[#E6E7F0] text-sm text-[#10183A] focus:outline-none focus:border-[#6366F1] transition-all"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-[#6366F1] to-[#8067FF] hover:from-[#5558E6] hover:to-[#7358F5] shadow-md shadow-indigo-500/20 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Inspecting Tags...</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span>Preview Social Card</span>
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

        {/* Results */}
        {result && (
          <div className="space-y-8">
            {/* Missing tags alert */}
            {result.missingTags && result.missingTags.length > 0 && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-1.5 text-xs text-amber-900">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  Missing Recommended Open Graph Tags:
                </div>
                <ul className="list-disc pl-5 space-y-1">
                  {result.missingTags.map((tag: string, idx: number) => (
                    <li key={idx}>{tag}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Social Card Simulation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Facebook / LinkedIn Card */}
              <div className="bg-white rounded-3xl border border-[#E6E7F0] p-6 shadow-sm space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6366F1]">
                  Facebook & LinkedIn Feed Preview
                </span>

                <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-xs">
                  {result.meta.image ? (
                    <img
                      src={result.meta.image}
                      alt={result.meta.title || "Social Card Image"}
                      className="w-full h-48 object-cover bg-slate-100"
                    />
                  ) : (
                    <div className="w-full h-48 bg-slate-100 flex items-center justify-center text-xs text-slate-400">
                      No og:image declared
                    </div>
                  )}
                  <div className="p-4 space-y-1.5 bg-[#F8F9FA]">
                    <div className="text-[11px] font-semibold uppercase text-slate-500 truncate">
                      {result.meta.site_name || "website.com"}
                    </div>
                    <div className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                      {result.meta.title || "No og:title found"}
                    </div>
                    <div className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {result.meta.description || "No og:description found."}
                    </div>
                  </div>
                </div>
              </div>

              {/* Twitter / X Card */}
              <div className="bg-white rounded-3xl border border-[#E6E7F0] p-6 shadow-sm space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#8067FF]">
                  Twitter / X Large Image Card Preview
                </span>

                <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-xs">
                  {result.meta.image ? (
                    <img
                      src={result.meta.image}
                      alt={result.meta.title || "Twitter Card Image"}
                      className="w-full h-48 object-cover bg-slate-100"
                    />
                  ) : (
                    <div className="w-full h-48 bg-slate-100 flex items-center justify-center text-xs text-slate-400">
                      No twitter:image declared
                    </div>
                  )}
                  <div className="p-4 space-y-1 bg-white">
                    <div className="text-sm font-bold text-slate-900 line-clamp-1">
                      {result.meta.title || "No Twitter Title"}
                    </div>
                    <div className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {result.meta.description || "No Twitter Description"}
                    </div>
                    <div className="text-[11px] text-slate-400 pt-1 flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      <span>{new URL(result.meta.url || "https://example.com").hostname}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Agency Cross-Sell CTA */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-[#0B1025] to-[#171F42] text-white border border-[#252B49] shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <span className="text-xs font-semibold text-[#8067FF] uppercase tracking-wider">
              Social Brand Distribution
            </span>
            <h3 className="text-xl sm:text-2xl font-bold">
              Looking to build authority across LinkedIn and X?
            </h3>
            <p className="text-xs sm:text-sm text-[#C6C9DC] max-w-xl">
              HelloShiva engineers organic B2B social content strategies and executive ghostwriting that converts followers into pipeline.
            </p>
          </div>
          <Link
            href="/services/social-media-marketing"
            className="shrink-0 inline-flex items-center gap-1.5 px-6 py-3.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#6366F1] to-[#8067FF] hover:opacity-90 transition-opacity"
          >
            <span>Social Marketing</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
