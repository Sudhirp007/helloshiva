"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Sparkles, Copy, Check, RotateCcw, Link2, HelpCircle } from "lucide-react";

export default function UtmBuilderPage() {
  const [destinationUrl, setDestinationUrl] = useState("https://helloshiva.com/services/seo-services");
  const [source, setSource] = useState("google");
  const [medium, setMedium] = useState("cpc");
  const [campaign, setCampaign] = useState("q4_growth");
  const [term, setTerm] = useState("enterprise_seo");
  const [content, setContent] = useState("banner_blue_v1");
  const [copied, setCopied] = useState(false);

  const generatedUrl = useMemo(() => {
    if (!destinationUrl.trim()) return "";
    try {
      const url = new URL(destinationUrl.trim());
      if (source.trim()) url.searchParams.set("utm_source", source.trim());
      if (medium.trim()) url.searchParams.set("utm_medium", medium.trim());
      if (campaign.trim()) url.searchParams.set("utm_campaign", campaign.trim());
      if (term.trim()) url.searchParams.set("utm_term", term.trim());
      if (content.trim()) url.searchParams.set("utm_content", content.trim());
      return url.toString();
    } catch {
      return "Please enter a valid destination URL (including https://)";
    }
  }, [destinationUrl, source, medium, campaign, term, content]);

  const handleCopy = () => {
    if (generatedUrl && !generatedUrl.startsWith("Please")) {
      navigator.clipboard.writeText(generatedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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
            <Sparkles className="w-3.5 h-3.5" /> Free Campaign Tracking Tool
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#10183A]">
            UTM Campaign Link Builder
          </h1>
          <p className="text-sm text-[#626985] max-w-2xl leading-relaxed">
            Construct standardized campaign tracking URLs for Google Analytics 4, Meta Ads, and email marketing. Attribute clicks directly to real pipeline revenue.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
        {/* Left Column: Form Inputs */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E6E7F0] p-6 sm:p-8 shadow-sm space-y-5">
          <h2 className="text-base font-bold text-[#10183A] border-b border-[#E6E7F0] pb-3">
            Campaign Parameters
          </h2>

          <div>
            <label className="block text-xs font-semibold text-[#10183A] mb-1">
              Website Destination URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              required
              value={destinationUrl}
              onChange={(e) => setDestinationUrl(e.target.value)}
              placeholder="https://yourwebsite.com/landing-page"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E7F0] text-sm text-[#10183A] focus:outline-none focus:border-[#6366F1] transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#10183A] mb-1">
                Campaign Source (`utm_source`) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="e.g. google, linkedin, newsletter"
                className="w-full px-3.5 py-2 rounded-xl border border-[#E6E7F0] text-sm text-[#10183A] focus:outline-none focus:border-[#6366F1] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#10183A] mb-1">
                Campaign Medium (`utm_medium`) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={medium}
                onChange={(e) => setMedium(e.target.value)}
                placeholder="e.g. cpc, email, social"
                className="w-full px-3.5 py-2 rounded-xl border border-[#E6E7F0] text-sm text-[#10183A] focus:outline-none focus:border-[#6366F1] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#10183A] mb-1">
              Campaign Name (`utm_campaign`) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={campaign}
              onChange={(e) => setCampaign(e.target.value)}
              placeholder="e.g. q4_lead_gen, promo_2026"
              className="w-full px-3.5 py-2 rounded-xl border border-[#E6E7F0] text-sm text-[#10183A] focus:outline-none focus:border-[#6366F1] transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#10183A] mb-1">
                Campaign Term (`utm_term`) <span className="text-xs text-[#626985] font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="e.g. target_keyword"
                className="w-full px-3.5 py-2 rounded-xl border border-[#E6E7F0] text-sm text-[#10183A] focus:outline-none focus:border-[#6366F1] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#10183A] mb-1">
                Campaign Content (`utm_content`) <span className="text-xs text-[#626985] font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="e.g. variant_a, hero_cta"
                className="w-full px-3.5 py-2 rounded-xl border border-[#E6E7F0] text-sm text-[#10183A] focus:outline-none focus:border-[#6366F1] transition-all"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Output & Best Practices */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-[#E6E7F0] p-6 sm:p-8 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-[#10183A] border-b border-[#E6E7F0] pb-3 flex items-center justify-between">
              <span>Generated Tracking URL</span>
              <Link2 className="w-4 h-4 text-[#6366F1]" />
            </h2>

            <div className="p-4 rounded-2xl bg-[#F5F4FF] border border-[#E8E7FF] font-mono text-xs break-all text-[#10183A] leading-relaxed">
              {generatedUrl}
            </div>

            <button
              onClick={handleCopy}
              className="w-full py-3 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#6366F1] to-[#8067FF] hover:from-[#5558E6] hover:to-[#7358F5] shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Tracking Link Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Tracking URL</span>
                </>
              )}
            </button>
          </div>

          {/* Tips Card */}
          <div className="p-6 rounded-2xl bg-[#F5F4FF] border border-[#E8E7FF] space-y-2 text-xs text-[#626985]">
            <div className="font-semibold text-[#10183A] flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-[#6366F1]" />
              UTM Naming Conventions:
            </div>
            <ul className="list-disc pl-4 space-y-1 leading-relaxed">
              <li>Always use <strong>lowercase characters</strong> (e.g., `google` instead of `Google`) to prevent fragmented reporting in GA4.</li>
              <li>Separate words with underscores (`_`) or dashes (`-`), never spaces.</li>
              <li>Never use UTM tags on internal website links—this overwrites original external referral attribution.</li>
            </ul>
          </div>

          {/* Agency Cross-Sell CTA */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0B1025] to-[#171F42] text-white border border-[#252B49] flex items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold">Scaling Paid Ad Campaigns?</h4>
              <p className="text-xs text-[#C6C9DC] mt-0.5">HelloShiva builds high-ROI Google & Meta ads with server-side conversion tracking.</p>
            </div>
            <Link
              href="/services/performance-marketing"
              className="shrink-0 inline-flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#6366F1] to-[#8067FF] hover:opacity-90 transition-opacity"
            >
              <span>Performance PPC</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
