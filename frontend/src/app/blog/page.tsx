import React from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Calendar, Clock, Sparkles } from "lucide-react";

export const metadata = {
  title: "Marketing Insights & Technical Guides",
  description:
    "In-depth guides on SEO architecture, Core Web Vitals, attribution tracking, and commercial digital marketing strategy by HelloShiva.",
};

const articles = [
  {
    slug: "technical-seo-prerequisite",
    title: "Why Technical SEO is the Non-Negotiable Foundation for Content Success",
    excerpt:
      "Publishing great articles is useless if search engines face DOM rendering bottlenecks, indexing directives confusion, or crawl budget waste. Here is how to fix code-level SEO first.",
    date: "October 2026",
    readTime: "6 min read",
    category: "Technical SEO",
    toolLink: { name: "SEO Page Analyzer", href: "/tools/seo-page-analyzer" },
  },
  {
    slug: "utm-parameters-pipeline-attribution",
    title: "Mastering UTM Parameters: How to Connect Ad Clicks to Real Revenue",
    excerpt:
      "Most marketing teams use messy, unstandardized tracking links that break Google Analytics attribution. Learn how to build a unified campaign naming architecture.",
    date: "October 2026",
    readTime: "5 min read",
    category: "Attribution & Ads",
    toolLink: { name: "UTM Link Builder", href: "/tools/utm-builder" },
  },
  {
    slug: "core-web-vitals-inp-guide",
    title: "Core Web Vitals & INP: Why Page Responsiveness Directly Affects Conversions",
    excerpt:
      "Google's Interaction to Next Paint (INP) metric penalizes websites with bloated main-thread JavaScript execution. Discover how to optimize interaction latency.",
    date: "October 2026",
    readTime: "7 min read",
    category: "Web Engineering",
    toolLink: { name: "Heading Structure Checker", href: "/tools/heading-checker" },
  },
  {
    slug: "robots-txt-common-disasters",
    title: "Robots.txt vs. Access Control: How Accidental Disallows Destroy Organic Rankings",
    excerpt:
      "Robots.txt is not an access control mechanism. We unpack common staging-to-production mistakes and how to test user-agent directives properly.",
    date: "October 2026",
    readTime: "4 min read",
    category: "Crawl Architecture",
    toolLink: { name: "Robots.txt Tester", href: "/tools/robots-txt-tester" },
  },
];

export default function BlogPage() {
  return (
    <div className="pt-28 pb-20 bg-light-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E8E7FF] text-[#6366F1]">
            <BookOpen className="w-3.5 h-3.5" />
            Knowledge & Strategy
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#10183A]">
            Actionable Marketing Insights & Engineering Guides
          </h1>
          <p className="text-base sm:text-lg text-[#626985] leading-relaxed">
            Deep technical teardowns, attribution frameworks, and search engine mechanics published by our strategy team.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {articles.map((art, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-[#E6E7F0] p-8 shadow-sm hover:border-[#6366F1]/50 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-[#626985] mb-4">
                  <span className="font-semibold text-[#6366F1] bg-[#F5F4FF] px-2.5 py-1 rounded-md border border-[#E8E7FF]">
                    {art.category}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {art.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {art.readTime}
                    </span>
                  </div>
                </div>

                <h2 className="text-xl font-bold text-[#10183A] mb-3 leading-snug hover:text-[#6366F1] transition-colors">
                  {art.title}
                </h2>

                <p className="text-xs sm:text-sm text-[#626985] leading-relaxed mb-6">
                  {art.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-[#E6E7F0] flex items-center justify-between text-xs font-semibold">
                <Link
                  href={art.toolLink.href}
                  className="text-[#8067FF] hover:underline"
                >
                  Try: {art.toolLink.name} ↗
                </Link>
                <Link
                  href="/contact"
                  className="text-[#6366F1] hover:text-[#8067FF] flex items-center gap-1"
                >
                  <span>Discuss Strategy</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
