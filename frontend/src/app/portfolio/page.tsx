import React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { CheckCircle2, ArrowRight, Shield, Zap, BarChart3 } from "lucide-react";
import EnquiryForm from "@/components/EnquiryForm";

export const metadata = {
  title: "Case Studies & Technical Demonstrations",
  description:
    "Review HelloShiva's real-world technical benchmarks, Core Web Vitals optimization proofs, and scalable marketing frameworks.",
};

export default function PortfolioPage() {
  return (
    <div className="pt-28 pb-20 bg-light-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E8E7FF] text-[#6366F1]">
            Case Studies & Demonstrations
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#10183A]">
            Technical Rigor & Growth Frameworks in Practice
          </h1>
          <p className="text-base sm:text-lg text-[#626985] leading-relaxed">
            We hold ourselves to strict ethical standards: no fabricated client logos, fake testimonials, or unsubstantiated revenue claims. Below are our documented platform benchmarks, self-audited architecture proofs, and battle-tested methodology.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 mb-24">
        {siteConfig.caseStudies.map((cs, idx) => (
          <div
            key={cs.id}
            className="bg-white rounded-3xl border border-[#E6E7F0] p-8 sm:p-12 shadow-sm space-y-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-[#8067FF]">
              <span>Study 0{idx + 1} • {cs.category}</span>
              <span className="text-[#626985] font-normal">{cs.client}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#10183A]">
              {cs.title}
            </h2>

            <p className="text-sm text-[#626985] leading-relaxed">
              {cs.summary}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-[#F5F4FF] border border-[#E8E7FF]">
              {cs.metrics.map((m, mIdx) => (
                <div key={mIdx} className="text-center sm:text-left">
                  <div className="text-2xl font-black text-[#10183A]">{m.value}</div>
                  <div className="text-xs text-[#626985] font-medium mt-1">{m.label}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#E6E7F0]">
              <div className="flex flex-wrap gap-2">
                {cs.tags.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="text-xs font-medium px-3 py-1 rounded-lg bg-[#E8E7FF] text-[#6366F1]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <Link
                href="/contact"
                className="text-xs font-semibold text-[#6366F1] hover:text-[#8067FF] flex items-center gap-1.5 transition-colors"
              >
                <span>Request Similar Audit Framework</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}

        {/* Inquiry Form */}
        <EnquiryForm
          headline="Want Us to Apply These Frameworks to Your Website?"
          subheadline="Submit your URL and goals. We will perform an initial audit based on these exact methodologies."
          sourcePage="/portfolio"
        />
      </div>
    </div>
  );
}
