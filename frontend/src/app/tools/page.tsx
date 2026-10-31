import React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Sparkles, ArrowRight, ShieldCheck, Zap } from "lucide-react";

export const metadata = {
  title: "10 Free Marketing & SEO Tools",
  description:
    "Free, fast, search-friendly marketing tools by HelloShiva: SEO page analyzer, SERP previewer, keyword density checker, robots.txt tester, and more. No login required.",
};

export default function ToolsDirectoryPage() {
  const categories = Array.from(new Set(siteConfig.tools.map((t) => t.category)));

  return (
    <div className="pt-28 pb-20 bg-light-section">
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
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#6366F1] bg-[#F5F4FF] px-2.5 py-0.5 rounded-md border border-[#E8E7FF]">
                          {tool.isClientSide ? "Instant Browser" : "Server Verified"}
                        </span>
                        {tool.badge && (
                          <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#E8E7FF] text-[#8067FF]">
                            {tool.badge}
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-[#10183A] mb-2 group-hover:text-[#6366F1] transition-colors">
                        {tool.name}
                      </h3>

                      <p className="text-xs text-[#626985] leading-relaxed mb-6">
                        {tool.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[#E6E7F0] flex items-center justify-between text-xs font-semibold">
                      <Link
                        href={`/tools/${tool.slug}`}
                        className="text-[#6366F1] group-hover:text-[#8067FF] flex items-center gap-1.5 transition-colors"
                      >
                        <span>{tool.ctaText}</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Agency Lead Banner */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#0B1025] to-[#171F42] text-white border border-[#252B49] shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center lg:text-left max-w-2xl">
            <span className="text-xs font-semibold text-[#8067FF] uppercase tracking-wider">
              Need End-to-End Growth Execution?
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold">
              Free tools diagnose problems. HelloShiva solves them.
            </h3>
            <p className="text-sm text-[#C6C9DC] leading-relaxed">
              If our free tools helped you identify broken tags, slow headers, or crawl disallows, let our agency specialists perform a complete technical and commercial audit of your domain.
            </p>
          </div>
          <Link
            href="/contact"
            className="shrink-0 inline-flex items-center gap-2 px-8 py-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#6366F1] to-[#8067FF] hover:from-[#5558E6] hover:to-[#7358F5] shadow-lg shadow-indigo-500/25 transition-all"
          >
            <span>Book Professional Consultation</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
