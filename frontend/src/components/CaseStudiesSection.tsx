import React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { ArrowRight, BarChart3, CheckCircle2, Shield } from "lucide-react";

export default function CaseStudiesSection() {
  return (
    <section className="py-24 bg-[#F5F4FF] border-b border-[#E6E7F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E8E7FF] text-[#6366F1]">
            Proven Frameworks & Demonstrations
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#10183A]">
            Engineering Proof: Our Demonstrations & Technical Benchmarks
          </h2>
          <p className="text-base sm:text-lg text-[#626985] leading-relaxed">
            We practice radical honesty. Instead of fabricated vanity screenshots, we showcase our documented architectural frameworks, self-audited platform benchmarks, and repeatable methodologies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {siteConfig.caseStudies.map((cs) => (
            <div
              key={cs.id}
              className="bg-white rounded-2xl border border-[#E6E7F0] p-7 shadow-sm hover:border-[#6366F1]/50 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-[#8067FF] mb-3">
                  <span>{cs.category}</span>
                </div>
                <h3 className="text-lg font-bold text-[#10183A] mb-3 leading-snug">
                  {cs.title}
                </h3>
                <p className="text-xs text-[#626985] leading-relaxed mb-6">
                  {cs.summary}
                </p>

                {/* Metrics Box */}
                <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-[#F5F4FF] border border-[#E8E7FF] mb-6">
                  {cs.metrics.map((m, idx) => (
                    <div key={idx} className="text-center">
                      <div className="text-sm font-extrabold text-[#10183A]">{m.value}</div>
                      <div className="text-[10px] text-[#626985] mt-0.5">{m.label}</div>
                    </div>
                  ))}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {cs.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-medium px-2.5 py-1 rounded-md bg-[#E8E7FF] text-[#6366F1]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#E6E7F0] flex items-center justify-between text-xs font-semibold">
                <span className="text-[11px] text-[#626985] font-medium">{cs.client}</span>
                <Link
                  href="/portfolio"
                  className="text-[#6366F1] hover:text-[#8067FF] flex items-center gap-1 transition-colors"
                >
                  <span>Review Study</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
