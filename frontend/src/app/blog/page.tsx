import React from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Calendar, Clock, Sparkles, User, Tag } from "lucide-react";
import db from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Marketing Insights & Technical Strategy Guides",
  description:
    "Actionable technical guides on SEO architecture, Core Web Vitals, attribution tracking, and commercial growth strategy by HelloShiva engineers.",
};

export default async function BlogPage() {
  // Fetch published articles from database
  let articles: any[] = [];
  try {
    articles = db.prepare("SELECT * FROM articles WHERE status = 'PUBLISHED' ORDER BY updated_at DESC").all();
  } catch (e) {
    console.error("Failed to fetch articles:", e);
  }

  return (
    <div className="pt-28 pb-24 bg-light-section min-h-screen">
      {/* Hero Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E8E7FF] text-[#6366F1]">
            <BookOpen className="w-3.5 h-3.5" />
            Knowledge & Strategy Hub
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#10183A]">
            Actionable Marketing Insights & Engineering Guides
          </h1>
          <p className="text-base sm:text-lg text-[#626985] leading-relaxed">
            In-depth architectural teardowns, search engine mechanics, and high-converting performance frameworks published by HelloShiva&apos;s senior growth engineers.
          </p>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {articles.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#E6E7F0] p-12 text-center space-y-4">
            <Sparkles className="w-8 h-8 text-[#6366F1] mx-auto" />
            <h2 className="text-lg font-bold text-[#10183A]">New Insights In Progress</h2>
            <p className="text-sm text-[#626985] max-w-md mx-auto">
              Our engineering team is finalizing technical breakdowns. Check back shortly or explore our free marketing tools.
            </p>
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#6366F1] to-[#8067FF]"
            >
              <span>Explore 10 Free Marketing Tools</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                  className="bg-white rounded-3xl border border-[#E6E7F0] p-8 shadow-sm hover:border-[#6366F1]/50 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs text-[#626985]">
                      <span className="font-semibold text-[#6366F1] bg-[#F5F4FF] px-3 py-1 rounded-full border border-[#E8E7FF]">
                        {art.category || "Technical SEO"}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" /> {dateStr}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {readTime} min read
                        </span>
                      </div>
                    </div>

                    <Link href={`/blog/${art.slug}`}>
                      <h2 className="text-xl sm:text-2xl font-bold text-[#10183A] leading-snug group-hover:text-[#6366F1] transition-colors">
                        {art.title}
                      </h2>
                    </Link>

                    <p className="text-xs sm:text-sm text-[#626985] leading-relaxed line-clamp-3">
                      {art.meta_description || "Read our full technical breakdown and actionable frameworks."}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-[#E6E7F0] flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-[#626985]">
                      <div className="w-6 h-6 rounded-full bg-[#E8E7FF] text-[#6366F1] flex items-center justify-center font-bold text-[10px]">
                        H
                      </div>
                      <span>{art.author || "HelloShiva Editorial"}</span>
                    </div>

                    <Link
                      href={`/blog/${art.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6366F1] group-hover:translate-x-1 transition-transform"
                    >
                      <span>Read Technical Guide</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom CTA Banner */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="bg-[#0B1025] rounded-3xl p-8 sm:p-12 text-white border border-[#252B49] text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#171F42] text-[#8067FF] border border-[#252B49]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>HelloShiva Growth Engineering</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold max-w-2xl mx-auto">
            Ready to Build a Search Engine Pipeline That Outranks Your Competitors?
          </h2>
          <p className="text-sm text-[#C6C9DC] max-w-xl mx-auto leading-relaxed">
            Stop relying on surface-level keyword guessing. Our senior web engineers and SEO architects audit code, fix Core Web Vitals, and build compounding organic traffic.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/contact"
              className="px-6 py-3.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-[#6366F1] to-[#8067FF] hover:opacity-90 shadow-lg shadow-indigo-500/25 transition-all"
            >
              Schedule Strategy Consultation &rarr;
            </Link>
            <Link
              href="/tools"
              className="px-6 py-3.5 rounded-xl font-bold text-xs text-[#C6C9DC] bg-[#171F42] hover:bg-[#252B49] border border-[#252B49] transition-all"
            >
              Test Our 10 Free Tools
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
