import React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { CheckCircle2, ShieldCheck, Target, Code2, Users, ArrowRight } from "lucide-react";
import EnquiryForm from "@/components/EnquiryForm";

export const metadata = {
  title: "About Our Agency & Technical Approach",
  description:
    "Learn about HelloShiva's philosophy, engineering-first marketing approach, and commitment to transparent commercial growth.",
  alternates: {
    canonical: `${siteConfig.url}/about`,
  },
  openGraph: {
    title: "About HelloShiva | Digital Marketing & Growth Agency",
    description:
      "Learn about HelloShiva's philosophy, engineering-first marketing approach, and commitment to transparent commercial growth.",
    url: `${siteConfig.url}/about`,
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "About HelloShiva Digital Marketing Agency",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About HelloShiva | Digital Marketing & Growth Agency",
    description:
      "Learn about HelloShiva's philosophy, engineering-first marketing approach, and commitment to transparent commercial growth.",
    images: ["/og-image.jpg"],
  },
};

export default function AboutPage() {
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
            name: "About Us",
            item: `${siteConfig.url}/about`,
          },
        ],
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
              In a digital marketing industry saturated with buzzwords, vanity screenshots, and black-box reporting, HelloShiva was built to offer something fundamentally different: <strong>ruthless technical competence, radical transparency, and alignment with commercial revenue.</strong>
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
            <h3 className="text-base font-bold text-[#10183A]">Commercial Intent First</h3>
            <p className="text-xs text-[#626985] leading-relaxed">
              We prioritize keywords, channels, and campaigns that reach actual buyers ready to spend, not vanity impressions that inflate reports.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#E6E7F0] p-7 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#F5F4FF] flex items-center justify-center text-[#6366F1]">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#10183A]">Technical Excellence</h3>
            <p className="text-xs text-[#626985] leading-relaxed">
              Clean DOM trees, sub-second TTFB, verified schema markups, and spotless Core Web Vitals form the foundation of every growth engine we build.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#E6E7F0] p-7 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#F5F4FF] flex items-center justify-center text-[#6366F1]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#10183A]">Zero Black-Hat Shortcuts</h3>
            <p className="text-xs text-[#626985] leading-relaxed">
              We strictly build white-hat, algorithm-resilient digital properties designed to survive search engine core updates and compound over years.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <EnquiryForm
          headline="Let's Build Something That Compounds"
          subheadline="Get in touch with our team to discuss your current growth roadblocks and evaluate a strategic retainer."
        />
      </div>
    </div>
  );
}
