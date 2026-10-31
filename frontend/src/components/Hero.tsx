import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, TrendingUp, CheckCircle, ShieldCheck, Zap } from "lucide-react";
import { siteConfig } from "@/config/site";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-dark-hero overflow-hidden text-white border-b border-[#252B49]">
      {/* Background Glow Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#6366F1]/20 to-[#8067FF]/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#8067FF]/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#171F42] border border-[#252B49] text-[#C6C9DC] shadow-inner">
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
            <span>Digital Marketing Agency & High-Performance Growth</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12]">
            Grow your business with{" "}
            <span className="text-gradient">smarter digital marketing.</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-[#C6C9DC] leading-relaxed max-w-2xl mx-auto font-normal">
            SEO, performance marketing, content, and high-converting web engineering designed to capture high-intent buyers and scale your revenue.
          </p>

          {/* CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-[#6366F1] to-[#8067FF] hover:from-[#5558E6] hover:to-[#7358F5] shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/35 transition-all duration-200 group cursor-pointer"
            >
              <span>Discuss Your Project</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/tools"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl text-base font-semibold text-[#C6C9DC] hover:text-white bg-[#171F42]/80 hover:bg-[#171F42] border border-[#252B49] hover:border-[#6366F1]/50 transition-all duration-200"
            >
              <Sparkles className="w-4 h-4 text-[#8067FF]" />
              <span>Explore Free Tools</span>
            </Link>
          </div>

          {/* Proof Badges */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-[#C6C9DC]/75 border-t border-[#252B49]/60 max-w-xl mx-auto">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#22C55E]" />
              <span>Zero Black-Box Reporting</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#8067FF]" />
              <span>Sub-Second Web Engineering</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#6366F1]" />
              <span>Attribution & ROI Focus</span>
            </div>
          </div>
        </div>

        {/* Agency Capabilities Preview Card */}
        <div className="mt-14 max-w-4xl mx-auto rounded-2xl bg-[#171F42]/60 border border-[#252B49] p-6 sm:p-8 backdrop-blur-md shadow-2xl shadow-black/40">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
            <div className="p-4 rounded-xl bg-[#0B1025]/50 border border-[#252B49]">
              <div className="flex items-center justify-between text-xs text-[#C6C9DC] mb-1">
                <span>Organic Search Engine</span>
                <span className="text-[#22C55E] font-semibold">+240%</span>
              </div>
              <div className="text-xl font-bold text-white">Commercial Intent</div>
              <p className="text-[11px] text-[#C6C9DC]/70 mt-1">Ranking for transactional keywords that book demos.</p>
            </div>

            <div className="p-4 rounded-xl bg-[#0B1025]/50 border border-[#252B49]">
              <div className="flex items-center justify-between text-xs text-[#C6C9DC] mb-1">
                <span>Performance Media</span>
                <span className="text-[#8067FF] font-semibold">Lower CAC</span>
              </div>
              <div className="text-xl font-bold text-white">Profitable Ad Spend</div>
              <p className="text-[11px] text-[#C6C9DC]/70 mt-1">Full-funnel Google & Meta tracking to real pipeline revenue.</p>
            </div>

            <div className="p-4 rounded-xl bg-[#0B1025]/50 border border-[#252B49]">
              <div className="flex items-center justify-between text-xs text-[#C6C9DC] mb-1">
                <span>Free Utilities</span>
                <span className="text-[#6366F1] font-semibold">10 Live Tools</span>
              </div>
              <div className="text-xl font-bold text-white">Proven Authority</div>
              <p className="text-[11px] text-[#C6C9DC]/70 mt-1">Real technical tools serving the marketing community.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
