"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Sparkles, Search, Loader2, ShieldCheck, AlertCircle, CheckCircle2, Server, HelpCircle } from "lucide-react";

export default function HttpHeadersCheckerPage() {
  const [url, setUrl] = useState("https://helloshiva.com");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleInspect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/v1/tools/http-headers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to inspect HTTP headers.");
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
            <Sparkles className="w-3.5 h-3.5" /> Free Network & Security Tool
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#10183A]">
            HTTP Response Headers & Security Checker
          </h1>
          <p className="text-sm text-[#626985] max-w-2xl leading-relaxed">
            Inspect HTTP status codes, server headers, caching policies, and recommended security directives (HSTS, CSP, X-Frame-Options, X-Content-Type-Options).
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 mb-16">
        <div className="bg-white rounded-3xl border border-[#E6E7F0] p-6 sm:p-8 shadow-sm">
          <form onSubmit={handleInspect} className="flex flex-col sm:flex-row gap-3">
            <input
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
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
                  <span>Inspecting...</span>
                </>
              ) : (
                <>
                  <Server className="w-4 h-4" />
                  <span>Inspect Headers</span>
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

        {/* Results Box */}
        {result && (
          <div className="space-y-8">
            <div className="bg-white rounded-3xl border border-[#E6E7F0] p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E6E7F0] pb-4">
                <div>
                  <span className="text-xs text-[#626985]">Endpoint Target:</span>
                  <div className="text-base font-bold text-[#10183A] break-all">{result.url}</div>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                    HTTP {result.statusCode} {result.statusText}
                  </span>
                  <span className="text-[#626985] font-mono">{result.responseTimeMs}ms</span>
                </div>
              </div>

              {/* Security & Recommended Headers Checklist */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-[#10183A] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#6366F1]" />
                  Key Security & Caching Directives
                </h3>

                <div className="divide-y divide-[#E6E7F0] border border-[#E6E7F0] rounded-2xl overflow-hidden bg-white">
                  {result.securityHeaders.map((h: any, idx: number) => (
                    <div key={idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {h.present ? (
                            <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-[#626985]/60 shrink-0" />
                          )}
                          <span className="font-bold text-[#10183A]">{h.header}</span>
                          <span className="text-[10px] font-semibold text-[#8067FF] bg-[#F5F4FF] px-2 py-0.5 rounded">
                            {h.type}
                          </span>
                        </div>
                        <p className="text-[#626985] text-[11px] pl-6">{h.description}</p>
                      </div>

                      <div className="pl-6 sm:pl-0 shrink-0">
                        <span
                          className={`font-mono text-[11px] px-2.5 py-1 rounded-md ${
                            h.present
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {h.present ? "Declared" : "Missing / Optional"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Note */}
              <div className="p-4 rounded-xl bg-[#F5F4FF] border border-[#E8E7FF] text-xs text-[#626985]">
                <strong>Technical Context:</strong> Missing recommended headers do not necessarily mean your website has a critical vulnerability. However, implementing headers like HSTS and CSP hardens your site against MITM and cross-site scripting risks.
              </div>

              {/* Raw Headers Table */}
              <div className="space-y-2 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#10183A]">
                  Raw Response Headers
                </h3>
                <div className="p-4 rounded-2xl bg-[#0B1025] text-[#C6C9DC] font-mono text-xs overflow-x-auto max-h-72 space-y-1 leading-relaxed">
                  {Object.entries(result.rawHeaders).map(([key, val]: any, idx) => (
                    <div key={idx} className="flex">
                      <span className="text-[#8067FF] font-semibold shrink-0">{key}:</span>
                      <span className="ml-2 text-white/90 break-all">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Agency Cross-Sell CTA */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-[#0B1025] to-[#171F42] text-white border border-[#252B49] shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <span className="text-xs font-semibold text-[#8067FF] uppercase tracking-wider">
              Secure Web Infrastructure
            </span>
            <h3 className="text-xl sm:text-2xl font-bold">
              Looking for enterprise-grade web engineering?
            </h3>
            <p className="text-xs sm:text-sm text-[#C6C9DC] max-w-xl">
              HelloShiva builds high-performance, edge-cached web platforms with strict SSL, HSTS, and sub-second response times.
            </p>
          </div>
          <Link
            href="/services/web-design-development"
            className="shrink-0 inline-flex items-center gap-1.5 px-6 py-3.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#6366F1] to-[#8067FF] hover:opacity-90 transition-opacity"
          >
            <span>Web Engineering</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
