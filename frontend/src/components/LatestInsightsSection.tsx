import React from "react";
import Link from "next/link";
import { BookOpen, Calendar, Clock, ArrowRight, Sparkles } from "lucide-react";
import db from "@/lib/db";

export default function LatestInsightsSection() {
  let articles: any[] = [];
  try {
    articles = db
      .prepare("SELECT * FROM articles WHERE status = 'PUBLISHED' ORDER BY updated_at DESC LIMIT 3")
      .all();
  } catch (e) {
    console.error("Failed to fetch homepage articles:", e);
  }

  if (!articles || articles.length === 0) {
    return null;
  }

  return (
    <section className="py-24 bg-white border-t border-[#E6E7F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E8E7FF] text-[#6366F1]">
              <Sparkles className="w-3.5 h-3.5" />
              Topical Authority & Strategy Teardowns
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#10183A] tracking-tight">
              Latest Insights & Technical Blueprints
            </h2>
            <p className="text-sm sm:text-base text-[#626985] leading-relaxed">
              We practice what we preach. Discover our engineering frameworks for technical SEO, Core Web Vitals optimization, and revenue-driven attribution.
            </p>
          </div>

          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#6366F1] hover:text-[#5558E6] group self-start md:self-end"
          >
            <span>Explore All Insights</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 3-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((art) => {
            const words = (art.content_markdown || "").trim().split(/\s+/).filter(Boolean).length;
            const readTime = Math.max(1, Math.ceil(words / 225));
            const dateStr = art.published_at
              ? new Date(art.published_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "October 2026";

            return (
              <article
                key={art.id}
                className="bg-[#F5F4FF]/50 rounded-3xl border border-[#E6E7F0] p-7 flex flex-col justify-between hover:bg-white hover:border-[#6366F1]/50 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-[#626985]">
                    <span className="font-semibold text-[#6366F1] bg-white px-2.5 py-0.5 rounded-full border border-[#E8E7FF]">
                      {art.category || "Technical SEO"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {readTime} min
                    </span>
                  </div>

                  <Link href={`/blog/${art.slug}`}>
                    <h3 className="text-lg font-bold text-[#10183A] group-hover:text-[#6366F1] transition-colors leading-snug">
                      {art.title}
                    </h3>
                  </Link>

                  <p className="text-xs text-[#626985] line-clamp-3 leading-relaxed">
                    {art.meta_description || "Read our technical guide and implementation strategies."}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-[#E6E7F0] flex items-center justify-between">
                  <span className="text-[11px] text-[#626985] font-medium">{dateStr}</span>
                  <Link
                    href={`/blog/${art.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#6366F1] group-hover:translate-x-1 transition-transform"
                  >
                    <span>Read Guide</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
