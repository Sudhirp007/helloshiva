"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "What makes HelloShiva different from traditional digital marketing agencies?",
    answer:
      "We operate at the intersection of technical web engineering and commercial intent. Instead of superficial marketing tactics, we fix code-level crawl bottlenecks, eliminate paid ad waste, build fast web platforms, and optimize for pipeline revenue rather than vanity metrics.",
  },
  {
    question: "Why are your 10 marketing tools completely free with no signup?",
    answer:
      "Our tools serve as proof of technical capability and lead magnets. By providing high-utility tools without paywalls, we attract high-intent site owners and developers, establish domain authority, and earn opportunities to partner on complex, high-value agency engagements.",
  },
  {
    question: "What is your engagement structure and pricing?",
    answer:
      "We offer two primary models: focused 30-to-60 day sprints (such as comprehensive technical audits or conversion overhauls) and dedicated monthly growth retainers across SEO, performance ads, and content. We believe in transparent scope and zero forced multi-year locks.",
  },
  {
    question: "How soon can we expect tangible results from an SEO engagement?",
    answer:
      "Technical remediation (fixing crawl errors, site speed, and index coverage) often yields positive movement within 30 to 60 days. Substantial organic traffic growth and compounding qualified inquiries typically manifest between 3 and 6 months.",
  },
  {
    question: "Do we retain 100% ownership of our ad accounts, creative, and code?",
    answer:
      "Yes, absolutely. All Google Ads accounts, Meta pixels, GitHub repositories, and creative collateral remain 100% owned by your company. You grant us partner access, and everything we build belongs to you forever.",
  },
];

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="py-24 bg-white border-b border-[#E6E7F0]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E8E7FF] text-[#6366F1]">
            <HelpCircle className="w-3.5 h-3.5" />
            Frequently Asked Questions
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#10183A]">
            Everything You Need to Know Before Partnering With Us
          </h2>
          <p className="text-base text-[#626985]">
            Have additional questions about our process, tools, or delivery? Reach out directly.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-[#E6E7F0] overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full text-left p-6 flex items-center justify-between gap-4 bg-white hover:bg-[#F5F4FF]/50 transition-colors"
                >
                  <span className="text-base font-bold text-[#10183A]">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#6366F1] shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="p-6 pt-0 text-sm text-[#626985] leading-relaxed border-t border-[#E6E7F0]/40 bg-[#F5F4FF]/30">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
