import React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Sparkles, ArrowRight, CheckCircle2, Shield } from "lucide-react";

export default function FeaturedTools() {
  return (
    <section className="py-24 bg-white border-b border-[#E6E7F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E8E7FF] text-[#6366F1]">
            <Sparkles className="w-3.5 h-3.5" />
            Demonstrated Technical Expertise
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#10183A]">
            10 Free Marketing Tools Built for Marketers & Engineers
          </h2>
          <p className="text-base sm:text-lg text-[#626985] leading-relaxed">
            We believe in demonstrating competence before asking for business. Use our suite of free, search-friendly marketing and technical SEO tools with zero paywalls or mandatory account signups.
          </p>
        </div>

        {/* 10 Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
          {siteConfig.tools.map((tool) => (
            <Link
              key={tool.id}
              href={`/tools/${tool.slug}`}
              className="bg-[#F5F4FF] hover:bg-white rounded-2xl p-5 border border-[#E8E7FF] hover:border-[#6366F1]/50 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#6366F1] bg-white px-2 py-0.5 rounded-md border border-[#E6E7F0]">
                    {tool.category}
                  </span>
                  {tool.badge && (
                    <span className="text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#E8E7FF] text-[#8067FF]">
                      {tool.badge}
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-bold text-[#10183A] mb-2 group-hover:text-[#6366F1] transition-colors">
                  {tool.name}
                </h3>
                <p className="text-xs text-[#626985] leading-relaxed line-clamp-3">
                  {tool.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-[#E8E7FF]/60 flex items-center justify-between text-xs font-semibold text-[#6366F1] group-hover:text-[#8067FF]">
                <span>{tool.ctaText}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        {/* Lead Magnet Callout */}
        <div className="mt-14 p-8 rounded-2xl bg-gradient-to-r from-[#0B1025] to-[#171F42] text-white border border-[#252B49] shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center lg:text-left">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8067FF]">
              Need Full-Site Optimization?
            </span>
            <h4 className="text-xl sm:text-2xl font-bold">
              Uncovered critical issues during your self-analysis?
            </h4>
            <p className="text-xs sm:text-sm text-[#C6C9DC] max-w-xl">
              Free tools can highlight symptoms, but fixing underlying technical debt and scaling organic traffic requires strategic engineering. Let our agency team audit and resolve them for you.
            </p>
          </div>
          <Link
            href="/contact"
            className="shrink-0 inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#6366F1] to-[#8067FF] hover:from-[#5558E6] hover:to-[#7358F5] shadow-lg shadow-indigo-500/25 transition-all"
          >
            <span>Book Professional SEO Audit</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
