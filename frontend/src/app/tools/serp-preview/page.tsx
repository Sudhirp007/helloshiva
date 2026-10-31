"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Copy, Check, Smartphone, Monitor, Sparkles, HelpCircle } from "lucide-react";

export default function SerpPreviewPage() {
  const [title, setTitle] = useState("HelloShiva — Digital Marketing Agency | SEO, Ads & Web Engineering");
  const [url, setUrl] = useState("https://helloshiva.com/services/seo-services");
  const [description, setDescription] = useState(
    "Data-driven SEO, performance marketing, high-converting web engineering, and content strategies designed to capture high-intent buyers and compound your revenue."
  );
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
  const [copied, setCopied] = useState(false);

  const titleLength = title.length;
  const descLength = description.length;

  const handleCopy = () => {
    navigator.clipboard.writeText(`Title: ${title}\nURL: ${url}\nDescription: ${description}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
            <Sparkles className="w-3.5 h-3.5" /> Free SEO Tool
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#10183A]">
            Google SERP Snippet Preview Tool
          </h1>
          <p className="text-sm text-[#626985] max-w-2xl leading-relaxed">
            Preview how your webpage title, URL path, and meta description render on Google Desktop and Mobile search results. Optimize character lengths to prevent truncation.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
        {/* Editor Inputs */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-[#E6E7F0] p-6 sm:p-8 shadow-sm space-y-6">
          <h2 className="text-base font-bold text-[#10183A] border-b border-[#E6E7F0] pb-3">
            Snippet Inputs
          </h2>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-[#10183A]">Page Title</label>
              <span className={`text-xs font-medium ${titleLength > 60 ? "text-amber-600" : "text-[#626985]"}`}>
                {titleLength} / 60 chars {titleLength > 60 && "(may truncate)"}
              </span>
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter page title..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E7F0] text-sm text-[#10183A] focus:outline-none focus:border-[#6366F1] transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#10183A] mb-1.5">Destination URL</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/page-slug"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E7F0] text-sm text-[#10183A] focus:outline-none focus:border-[#6366F1] transition-all"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-[#10183A]">Meta Description</label>
              <span className={`text-xs font-medium ${descLength > 160 ? "text-amber-600" : "text-[#626985]"}`}>
                {descLength} / 160 chars {descLength > 160 && "(may truncate)"}
              </span>
            </div>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter compelling meta description..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E7F0] text-sm text-[#10183A] focus:outline-none focus:border-[#6366F1] transition-all"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-[#6366F1] bg-[#F5F4FF] hover:bg-[#E8E7FF] border border-[#E8E7FF] transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied Snippet!" : "Copy Snippet"}</span>
            </button>
            <button
              onClick={() => {
                setTitle("");
                setUrl("https://");
                setDescription("");
              }}
              className="text-xs text-[#626985] hover:text-[#10183A]"
            >
              Clear fields
            </button>
          </div>
        </div>

        {/* Live Preview Display */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-3xl border border-[#E6E7F0] p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-[#E6E7F0] pb-3">
              <h2 className="text-base font-bold text-[#10183A]">Google Search Simulation</h2>
              <div className="flex items-center gap-1 bg-[#F5F4FF] p-1 rounded-lg border border-[#E8E7FF]">
                <button
                  onClick={() => setViewMode("desktop")}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1 transition-all ${
                    viewMode === "desktop" ? "bg-white text-[#6366F1] shadow-xs" : "text-[#626985]"
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  Desktop
                </button>
                <button
                  onClick={() => setViewMode("mobile")}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1 transition-all ${
                    viewMode === "mobile" ? "bg-white text-[#6366F1] shadow-xs" : "text-[#626985]"
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  Mobile
                </button>
              </div>
            </div>

            {/* Google Snippet Container */}
            <div
              className={`p-5 rounded-2xl bg-[#FFFFFF] border border-[#E6E7F0] font-sans ${
                viewMode === "mobile" ? "max-w-sm mx-auto shadow-md" : ""
              }`}
            >
              <div className="space-y-1.5">
                {/* URL Breadcrumb */}
                <div className="flex items-center gap-2 text-[12px] text-[#202124] truncate">
                  <div className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center text-[9px] font-bold text-slate-600">
                    G
                  </div>
                  <span className="text-[#202124] font-medium truncate">{url || "https://example.com"}</span>
                </div>

                {/* Title */}
                <h3 className="text-[#1a0dab] hover:underline cursor-pointer text-lg font-normal leading-snug line-clamp-2">
                  {title || "Untitled Page — Example"}
                </h3>

                {/* Description */}
                <p className="text-[13px] text-[#4d5156] leading-relaxed line-clamp-3">
                  {description || "Provide a meta description to preview how your summary appears to searchers."}
                </p>
              </div>
            </div>

            {/* Recommendations */}
            <div className="p-4 rounded-xl bg-[#F5F4FF] border border-[#E8E7FF] space-y-2 text-xs text-[#626985]">
              <div className="font-semibold text-[#10183A] flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-[#6366F1]" />
                Optimization Best Practices:
              </div>
              <ul className="list-disc pl-4 space-y-1 leading-relaxed">
                <li>Keep titles between <strong>50–60 characters</strong> (580 pixels) to avoid desktop & mobile clipping.</li>
                <li>Write unique meta descriptions between <strong>150–160 characters</strong> featuring primary search intent.</li>
                <li>Include a natural call-to-action (e.g., &quot;Discover&quot;, &quot;Learn&quot;, &quot;Explore&quot;) to improve Click-Through Rate (CTR).</li>
              </ul>
            </div>
          </div>

          {/* Agency Cross-Sell CTA */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0B1025] to-[#171F42] text-white border border-[#252B49] flex items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold">Need Higher Organic Click-Through Rates?</h4>
              <p className="text-xs text-[#C6C9DC] mt-0.5">Explore HelloShiva’s full On-Page and Technical SEO services.</p>
            </div>
            <Link
              href="/services/seo-services"
              className="shrink-0 inline-flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#6366F1] to-[#8067FF] hover:opacity-90 transition-opacity"
            >
              <span>Explore SEO</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
