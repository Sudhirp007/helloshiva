"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Share2, Sparkles, Copy, Check, ArrowRight, ShieldCheck, Layers } from "lucide-react";

export default function SocialDistributionDeskPage() {
  const [article, setArticle] = useState<any>({
    title: "The 2026 Core Web Vitals Blueprint: How to Achieve Sub-Second LCP",
    slug: "core-web-vitals-optimization-guide",
    summary: "Mastering Core Web Vitals and technical speed for commercial pipeline growth.",
    primaryTakeaway: "Fix code-level DOM bottlenecks before spending heavily on advertising.",
  });

  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem("article_for_social");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setArticle({
          title: parsed.title,
          slug: parsed.slug || "technical-growth-guide",
          summary: parsed.metaDescription || "Technical SEO Blueprint",
          primaryTakeaway: "Code-level performance determines organic ranking compounding.",
        });
      } catch {}
    }
  }, []);

  const handleGenerateSocial = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/content-engine/social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: article.title,
          slug: article.slug,
          summary: article.summary,
          primaryTakeaway: article.primaryTakeaway,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPosts(data.posts);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E8E7FF] text-[#6366F1] mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          Desk 6 • Multi-Channel Distribution (Copy-Only)
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#10183A]">
          Social Media Content Repurposing Desk
        </h1>
        <p className="text-sm text-[#626985]">
          Generate platform-adapted distribution copy for 5 core channels. Initial release is strictly copy-only—zero automated posting bots or mass-posting.
        </p>
      </div>

      {/* Control Card */}
      <div className="bg-white rounded-3xl border border-[#E6E7F0] p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-[#626985]">Approved Article for Distribution:</span>
          <h2 className="text-base font-bold text-[#10183A]">{article.title}</h2>
          <div className="text-xs text-[#6366F1] font-mono mt-0.5">Target URL: https://helloshiva.com/blog/{article.slug}</div>
        </div>

        <button
          onClick={handleGenerateSocial}
          disabled={loading}
          className="shrink-0 px-6 py-3 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-[#6366F1] to-[#8067FF] hover:opacity-90 shadow-md shadow-indigo-500/20 disabled:opacity-50 flex items-center gap-2 cursor-pointer transition-all"
        >
          <Share2 className="w-4 h-4" />
          <span>{loading ? "Generating Channels..." : "Generate 5-Channel Distribution"}</span>
        </button>
      </div>

      {/* Generated Channels Grid */}
      <div className="space-y-6">
        {posts.map((post, idx) => (
          <div
            key={idx}
            className="bg-white rounded-3xl border border-[#E6E7F0] p-6 sm:p-8 shadow-sm space-y-4 hover:border-[#6366F1]/40 transition-colors"
          >
            <div className="flex items-center justify-between border-b border-[#E6E7F0] pb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-black uppercase tracking-wider text-[#6366F1] bg-[#F5F4FF] px-3 py-1 rounded-lg border border-[#E8E7FF]">
                  {post.platformName}
                </span>
                <span className="text-xs text-[#626985]">Copy-Ready Format</span>
              </div>

              <button
                onClick={() => handleCopy(post.contentText, idx)}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold text-white bg-[#0B1025] hover:bg-[#171F42] transition-colors cursor-pointer"
              >
                {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedIdx === idx ? "Copied to Clipboard!" : "Copy Post"}</span>
              </button>
            </div>

            {/* Post Content */}
            <div className="p-5 rounded-2xl bg-[#0B1025] text-[#C6C9DC] font-sans text-xs whitespace-pre-wrap leading-relaxed">
              {post.contentText}
            </div>

            {/* Carousel Slides for Instagram */}
            {post.carouselSlides && (
              <div className="space-y-3 pt-2">
                <div className="text-xs font-bold text-[#10183A] flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-[#8067FF]" />
                  <span>Instagram 5-Slide Storyboard Visual Plan:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                  {post.carouselSlides.map((slide: any) => (
                    <div key={slide.slideNumber} className="p-3.5 rounded-xl bg-[#F5F4FF] border border-[#E8E7FF] text-xs space-y-1.5">
                      <div className="font-extrabold text-[10px] text-[#6366F1] uppercase">Slide {slide.slideNumber}</div>
                      <div className="font-bold text-[11px] text-[#10183A] leading-tight">{slide.headline}</div>
                      <p className="text-[10px] text-[#626985] line-clamp-3">{slide.body}</p>
                      <div className="text-[9px] text-slate-400 italic pt-1 border-t border-[#E8E7FF]">{slide.visualDirection}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {posts.length > 0 && (
        <div className="flex justify-end pt-4">
          <Link
            href="/admin/content-engine/queue"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#6366F1] to-[#8067FF] hover:opacity-90 shadow-md transition-all"
          >
            <span>Proceed to Publishing Queue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}
