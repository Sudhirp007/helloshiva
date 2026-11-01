import React from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Calendar, Clock, Sparkles, User, Tag } from "lucide-react";
import db from "@/lib/db";
import { siteConfig } from "@/config/site";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Marketing Insights & Technical Strategy Guides",
  description:
    "Actionable technical guides on SEO architecture, Core Web Vitals, attribution tracking, and commercial growth strategy by HelloShiva engineers.",
  alternates: {
    canonical: `${siteConfig.url}/blog`,
  },
  openGraph: {
    title: "Marketing Insights & Technical Strategy Guides | HelloShiva",
    description:
      "Actionable technical guides on SEO architecture, Core Web Vitals, attribution tracking, and commercial growth strategy by HelloShiva engineers.",
    url: `${siteConfig.url}/blog`,
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "HelloShiva Marketing Insights",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Marketing Insights & Technical Strategy Guides | HelloShiva",
    description:
      "Actionable technical guides on SEO architecture, Core Web Vitals, attribution tracking, and commercial growth strategy by HelloShiva engineers.",
    images: ["/og-image.jpg"],
  },
};

export default async function BlogPage() {
  // Fetch published articles from database
  let articles: any[] = [];
  try {
    articles = db.prepare("SELECT * FROM articles WHERE status = 'PUBLISHED' ORDER BY updated_at DESC").all();
  } catch (e) {
    console.error("Failed to fetch articles:", e);
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: siteConfig.url,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Blog",
            item: `${siteConfig.url}/blog`,
          },
        ],
      },
      {
        "@type": "Blog",
        "@id": `${siteConfig.url}/blog/#blog`,
        name: "HelloShiva Marketing Insights",
        description: "Actionable technical guides on SEO architecture, Core Web Vitals, and commercial growth strategy.",
        url: `${siteConfig.url}/blog`,
      },
    ],
  };

  return (
    <div className="pt-28 pb-24 bg-light-section min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6366F1] text-white text-xs font-bold"
            >
              <span>Explore 10 Free Tools</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((art) => (
              <article
                key={art.id}
                className="bg-white rounded-3xl border border-[#E6E7F0] overflow-hidden shadow-sm hover:border-[#6366F1]/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="p-7 space-y-4">
                  <div className="flex items-center justify-between text-xs text-[#8A90A8]">
                    <span className="font-semibold px-2.5 py-1 rounded-md bg-[#F4F5F9] text-[#6366F1] uppercase text-[10px] tracking-wider">
                      {art.pillar_category || "Strategy"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {art.reading_time_minutes || 5} min read
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-[#10183A] group-hover:text-[#6366F1] transition-colors line-clamp-2">
                    <Link href={`/blog/${art.slug}`}>{art.title}</Link>
                  </h2>

                  <p className="text-xs sm:text-sm text-[#626985] leading-relaxed line-clamp-3">
                    {art.meta_description || "Read this comprehensive breakdown by HelloShiva's digital marketing team."}
                  </p>
                </div>

                <div className="p-7 pt-0 border-t border-[#F8F9FC] mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-[#8A90A8]">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {art.published_at ? new Date(art.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Recent"}
                    </span>
                  </div>

                  <Link
                    href={`/blog/${art.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#6366F1] group-hover:translate-x-1 transition-transform"
                  >
                    <span>Read Guide</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
