"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Sparkles, Search, Loader2, CheckCircle2, XCircle, ShieldAlert, HelpCircle } from "lucide-react";

export default function RobotsTxtTesterPage() {
  const [url, setUrl] = useState("https://helloshiva.com");
  const [path, setPath] = useState("/services/seo-services");
  const [userAgent, setUserAgent] = useState("Googlebot");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/v1/tools/robots-tester", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim(), path: path.trim(), userAgent }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to evaluate robots.txt.");
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
            <Sparkles className="w-3.5 h-3.5" /> Free Crawl & Indexing Tool
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#10183A]">
            Robots.txt Directive & Path Tester
          </h1>
          <p className="text-sm text-[#626985] max-w-2xl leading-relaxed">
            Test whether specific URL paths are allowed or blocked for search engine crawlers (Googlebot, Bingbot). Inspect live robots.txt directives and avoid accidental de-indexing.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 mb-16">
        {/* Test Inputs */}
        <div className="bg-white rounded-3xl border border-[#E6E7F0] p-6 sm:p-8 shadow-sm">
          <form onSubmit={handleTest} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-6">
                <label className="block text-xs font-semibold text-[#10183A] mb-1">Website Domain / URL</label>
                <input
                  type="url"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E7F0] text-sm text-[#10183A] focus:outline-none focus:border-[#6366F1] transition-all"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-semibold text-[#10183A] mb-1">Target Path</label>
                <input
                  type="text"
                  required
                  value={path}
                  onChange={(e) => setPath(e.target.value)}
                  placeholder="/blog/my-post"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E7F0] text-sm text-[#10183A] focus:outline-none focus:border-[#6366F1] transition-all"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-semibold text-[#10183A] mb-1">User-Agent</label>
                <select
                  value={userAgent}
                  onChange={(e) => setUserAgent(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#E6E7F0] text-sm text-[#10183A] bg-white focus:outline-none focus:border-[#6366F1] transition-all"
                >
                  <option value="Googlebot">Googlebot (Google)</option>
                  <option value="*">* (All User-Agents)</option>
                  <option value="Bingbot">Bingbot (Bing)</option>
                  <option value="Applebot">Applebot (Apple)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-[#6366F1] to-[#8067FF] hover:from-[#5558E6] hover:to-[#7358F5] shadow-md shadow-indigo-500/20 disabled:opacity-50 flex items-center gap-2 cursor-pointer transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Evaluating...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>Test Robots.txt Directive</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
              {error}
            </div>
          )}
        </div>

        {/* Results Box */}
        {result && (
          <div className="bg-white rounded-3xl border border-[#E6E7F0] p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-[#E6E7F0] pb-4">
              <div>
                <span className="text-xs text-[#626985]">Evaluated File:</span>
                <div className="text-sm font-mono text-[#10183A] break-all">{result.robotsUrl}</div>
              </div>
              <div
                className={`px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                  result.allowed
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                    : "bg-red-100 text-red-800 border border-red-300"
                }`}
              >
                {result.allowed ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                <span>{result.allowed ? "Crawl Allowed" : "Crawl Disallowed"}</span>
              </div>
            </div>

            {/* Explanation */}
            <div className="p-4 rounded-2xl bg-[#F5F4FF] border border-[#E8E7FF] text-xs text-[#10183A] space-y-1">
              <span className="font-bold text-[#6366F1]">Matching Evaluation:</span>
              <p className="font-mono text-xs text-[#626985]">{result.matchingRule}</p>
            </div>

            {/* Raw robots.txt view */}
            {result.robotsContent && (
              <div className="space-y-2">
                <span className="text-xs font-semibold text-[#10183A]">Retrieved robots.txt:</span>
                <pre className="p-4 rounded-2xl bg-[#0B1025] text-[#C6C9DC] font-mono text-xs overflow-x-auto max-h-60 leading-relaxed">
                  {result.robotsContent}
                </pre>
              </div>
            )}

            {/* Caution Banner */}
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs text-amber-800">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                <strong>Important:</strong> robots.txt is NOT an access control mechanism. Disallowing a path prevents search bot crawling, but does not prevent users or malicious bots from visiting the URL directly. Use server authentication or noindex tags for access security.
              </span>
            </div>
          </div>
        )}

        {/* Agency Cross-Sell CTA */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-[#0B1025] to-[#171F42] text-white border border-[#252B49] shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <span className="text-xs font-semibold text-[#8067FF] uppercase tracking-wider">
              Crawl Budget & Architecture Auditing
            </span>
            <h3 className="text-xl sm:text-2xl font-bold">
              Are search bots wasting your crawl budget?
            </h3>
            <p className="text-xs sm:text-sm text-[#C6C9DC] max-w-xl">
              HelloShiva restructures complex enterprise website architectures, faceted navigation, and canonical hierarchies for maximum crawl efficiency.
            </p>
          </div>
          <Link
            href="/services/technical-seo"
            className="shrink-0 inline-flex items-center gap-1.5 px-6 py-3.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#6366F1] to-[#8067FF] hover:opacity-90 transition-opacity"
          >
            <span>Technical SEO Services</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
