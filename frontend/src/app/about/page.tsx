import React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { CheckCircle2, ShieldCheck, Target, Code2, Users, ArrowRight } from "lucide-react";
import EnquiryForm from "@/components/EnquiryForm";

export const metadata = {
  title: "About HelloShiva — Digital Marketing Agency",
  description:
    "Learn about HelloShiva's philosophy, engineering-first marketing approach, and commitment to transparent commercial growth.",
};

export default function AboutPage() {
  return (
    <div className="pt-28 pb-20 bg-light-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E8E7FF] text-[#6366F1]">
            About HelloShiva
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#10183A]">
            Engineering-Driven Marketing for the Modern Digital Economy
          </h1>
          <p className="text-base sm:text-lg text-[#626985] leading-relaxed">
            We founded HelloShiva on a simple conviction: marketing should be as technically disciplined and measurable as software engineering.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 mb-24">
        {/* Story Section */}
        <div className="bg-white rounded-3xl border border-[#E6E7F0] p-8 sm:p-12 shadow-sm space-y-6">
          <h2 className="text-2xl font-bold text-[#10183A]">Our Philosophy & Story</h2>
          <div className="space-y-4 text-sm text-[#626985] leading-relaxed">
            <p>
              In a digital marketing industry saturated with buzzwords, vanity screenshots, and black-box reporting, HelloShiva was built to offer something fundamentally different: **ruthless technical competence, radical transparency, and alignment with commercial revenue.**
            </p>
            <p>
              We treat your website not as a digital brochure, but as an active, high-velocity sales engine. From our headquarters in {siteConfig.contact.address} and serving clients worldwide, we combine deep search science, high-performance web architecture, and full-funnel paid media to create compounding inbound pipelines.
            </p>
            <p>
              To prove our technical capability before asking for your business, we build and maintain a public suite of 10 free, search-friendly marketing and SEO utilities. We believe that true agency authority is demonstrated through utility, not sales rhetoric.
            </p>
          </div>
        </div>

        {/* Agency Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-[#E6E7F0] p-7 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#F5F4FF] flex items-center justify-center text-[#6366F1]">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#10183A]">Commercial Focus</h3>
            <p className="text-xs text-[#626985] leading-relaxed">
              We reject vanity impressions. We optimize for pipeline revenue, qualified demo bookings, and customer lifetime value.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#E6E7F0] p-7 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#F5F4FF] flex items-center justify-center text-[#8067FF]">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#10183A]">Code-Level Depth</h3>
            <p className="text-xs text-[#626985] leading-relaxed">
              We analyze JavaScript rendering budgets, Core Web Vitals, and server response headers to eliminate code bottlenecks.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#E6E7F0] p-7 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#F5F4FF] flex items-center justify-center text-[#6366F1]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#10183A]">Zero Black-Boxes</h3>
            <p className="text-xs text-[#626985] leading-relaxed">
              Full data ownership. You own your code, your ad accounts, and your analytics. Weekly plain-English communication.
            </p>
          </div>
        </div>

        {/* Consultation Form */}
        <EnquiryForm
          headline="Let's Build Your Growth Engine"
          subheadline="Reach out directly to discuss how our digital marketing team can elevate your brand."
          sourcePage="/about"
        />
      </div>
    </div>
  );
}
