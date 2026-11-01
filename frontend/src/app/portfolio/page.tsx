import React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { CheckCircle2, ArrowRight, Shield, Zap, BarChart3 } from "lucide-react";
import EnquiryForm from "@/components/EnquiryForm";

export const metadata = {
  title: "Case Studies & Technical Demonstrations",
  description:
    "Review HelloShiva's real-world technical benchmarks, Core Web Vitals optimization proofs, and scalable marketing frameworks.",
  alternates: {
    canonical: `${siteConfig.url}/portfolio`,
  },
  openGraph: {
    title: "Case Studies & Technical Demonstrations | HelloShiva",
    description:
      "Review HelloShiva's real-world technical benchmarks, Core Web Vitals optimization proofs, and scalable marketing frameworks.",
    url: `${siteConfig.url}/portfolio`,
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "HelloShiva Portfolio & Case Studies",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Case Studies & Technical Demonstrations | HelloShiva",
    description:
      "Review HelloShiva's real-world technical benchmarks, Core Web Vitals optimization proofs, and scalable marketing frameworks.",
    images: ["/og-image.jpg"],
  },
};

export default function PortfolioPage() {
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
            name: "Portfolio",
            item: `${siteConfig.url}/portfolio`,
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
                <div key={mIdx} className="space-y-1">
                  <div className="text-xl font-extrabold text-[#6366F1]">{m.value}</div>
                  <div className="text-xs font-medium text-[#626985]">{m.label}</div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs font-semibold text-[#10183A]">
              <span>Tags:</span>
              {cs.tags.map((tag, tIdx) => (
                <span key={tIdx} className="px-2.5 py-0.5 rounded-md bg-[#F4F5F9] text-[#6366F1] text-[11px] font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <EnquiryForm
          headline="Achieve Similar Benchmarks for Your Business"
          subheadline="Let our engineering team audit your digital marketing footprint and identify your highest-leverage growth opportunities."
        />
      </div>
    </div>
  );
}
