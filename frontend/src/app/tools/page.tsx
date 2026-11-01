import React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Sparkles, ArrowRight, ShieldCheck, Zap } from "lucide-react";

export const metadata = {
  title: "10 Free Marketing & SEO Diagnostic Tools",
  description:
    "Free, fast, search-friendly marketing tools by HelloShiva: SEO page analyzer, SERP previewer, keyword density checker, robots.txt tester, and more. No login required.",
  alternates: {
    canonical: `${siteConfig.url}/tools`,
  },
  openGraph: {
    title: "10 Free Marketing & SEO Diagnostic Tools | HelloShiva",
    description:
      "Free, fast, search-friendly marketing tools by HelloShiva: SEO page analyzer, SERP previewer, keyword density checker, robots.txt tester, and more. No login required.",
    url: `${siteConfig.url}/tools`,
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "HelloShiva Free Marketing Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "10 Free Marketing & SEO Diagnostic Tools | HelloShiva",
    description:
      "Free, fast, search-friendly marketing tools by HelloShiva: SEO page analyzer, SERP previewer, keyword density checker, robots.txt tester, and more. No login required.",
    images: ["/og-image.jpg"],
  },
};

export default function ToolsDirectoryPage() {
  const categories = Array.from(new Set(siteConfig.tools.map((t) => t.category)));

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
            name: "Tools",
            item: `${siteConfig.url}/tools`,
          },
        ],
      },
      {
        "@type": "ItemList",
        name: "Free SEO & Marketing Tools",
        itemListElement: siteConfig.tools.map((tool, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          name: tool.name,
          description: tool.description,
          url: `${siteConfig.url}/tools/${tool.slug}`,
        })),
      },
    ],
  };

  return (
    <div className="pt-28 pb-20 bg-light-section">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E8E7FF] text-[#6366F1]">
            <Sparkles className="w-3.5 h-3.5" />
            100% Free • No Mandatory Login • Zero Paywalls
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#10183A]">
            Free Digital Marketing & Technical SEO Tools
          </h1>
          <p className="text-base sm:text-lg text-[#626985] leading-relaxed">
            Inspect metadata, test robots rules, validate sitemaps, build campaign tracking links, and diagnose code-level SEO elements. Created by HelloShiva to support marketers and engineers.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 mb-24">
        {categories.map((cat) => {
          const categoryTools = siteConfig.tools.filter((t) => t.category === cat);
          return (
            <div key={cat} className="space-y-6">
              <div className="flex items-center gap-3 border-b border-[#E6E7F0] pb-3">
                <h2 className="text-xl font-bold text-[#10183A]">{cat}</h2>
                <span className="text-xs font-semibold text-[#6366F1] bg-[#E8E7FF] px-2.5 py-0.5 rounded-full">
                  {categoryTools.length} {categoryTools.length === 1 ? "tool" : "tools"}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryTools.map((tool) => (
                  <div
                    key={tool.id}
                    className="bg-white rounded-2xl border border-[#E6E7F0] p-6 shadow-sm hover:border-[#6366F1]/50 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#6366F1] bg-[#E8E7FF] px-2.5 py-1 rounded-md">
                          {tool.category}
                        </span>
                        {tool.isClientSide && (
                          <span className="text-[10px] font-semibold text-[#10B981] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 flex items-center gap-1">
                            <Zap className="w-2.5 h-2.5" /> Instant
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-bold text-[#10183A] mb-2 group-hover:text-[#6366F1] transition-colors">
                        {tool.name}
                      </h3>

                      <p className="text-xs sm:text-sm text-[#626985] leading-relaxed mb-6">
                        {tool.description}
                      </p>
                    </div>

                    <Link
                      href={`/tools/${tool.slug}`}
                      className="inline-flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-[#F8F9FC] group-hover:bg-[#6366F1] text-xs font-bold text-[#10183A] group-hover:text-white transition-all duration-200"
                    >
                      <span>Launch Tool</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
