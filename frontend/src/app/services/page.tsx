import React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import EnquiryForm from "@/components/EnquiryForm";

export const metadata = {
  title: "Digital Marketing Services",
  description:
    "Explore HelloShiva's full-funnel digital marketing services: Technical SEO, Local SEO, Performance PPC, Social Media, Content Marketing, and Web Engineering.",
  alternates: {
    canonical: `${siteConfig.url}/services`,
  },
  openGraph: {
    title: "Digital Marketing Services | HelloShiva",
    description:
      "Explore HelloShiva's full-funnel digital marketing services: Technical SEO, Local SEO, Performance PPC, Social Media, Content Marketing, and Web Engineering.",
    url: `${siteConfig.url}/services`,
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "HelloShiva Digital Marketing Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Digital Marketing Services | HelloShiva",
    description:
      "Explore HelloShiva's full-funnel digital marketing services: Technical SEO, Local SEO, Performance PPC, Social Media, Content Marketing, and Web Engineering.",
    images: ["/og-image.jpg"],
  },
};

export default function ServicesPage() {
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
            name: "Services",
            item: `${siteConfig.url}/services`,
          },
        ],
      },
      {
        "@type": "ItemList",
        name: "HelloShiva Agency Services",
        itemListElement: siteConfig.services.map((svc, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          name: svc.title,
          url: `${siteConfig.url}/services/${svc.slug}`,
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
      {/* Header Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E8E7FF] text-[#6366F1]">
            <Sparkles className="w-3.5 h-3.5" />
            Agency Capabilities
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#10183A]">
            Digital Marketing Services Engineered for Commercial Impact
          </h1>
          <p className="text-base sm:text-lg text-[#626985] leading-relaxed">
            We don't sell random marketing tactics. We design, deploy, and scale unified growth systems that capture buyer intent, outrank competitors, and compound revenue.
          </p>
        </div>
      </div>

      {/* Services List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 mb-24">
        {siteConfig.services.map((svc, idx) => (
          <div
            key={svc.id}
            id={svc.slug}
            className="bg-white rounded-3xl border border-[#E6E7F0] p-8 sm:p-12 shadow-sm hover:border-[#6366F1]/50 hover:shadow-xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#6366F1]">
                <span>Service 0{idx + 1}</span>
                <span>•</span>
                <span>{svc.tagline}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#10183A]">
                {svc.title}
              </h2>

              <p className="text-base text-[#626985] leading-relaxed">
                {svc.shortDesc}
              </p>

              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#10183A]">
                  Core Deliverables:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {svc.whatsIncluded.slice(0, 4).map((inc, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-[#626985]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#6366F1] flex-shrink-0" />
                      <span className="truncate">{inc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex items-center gap-4">
                <Link
                  href={`/services/${svc.slug}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6366F1] hover:bg-[#8067FF] text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all duration-200"
                >
                  <span>Explore {svc.title}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                {svc.relatedTools && svc.relatedTools.length > 0 && (
                  <Link
                    href={svc.relatedTools[0].href}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#626985] hover:text-[#6366F1] transition-colors"
                  >
                    <span>Try free tool</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
              </div>
            </div>

            <div className="lg:col-span-5 bg-[#F8F9FC] rounded-2xl p-6 sm:p-8 border border-[#EAEBF4] space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#10183A]">
                Common Problems Solved
              </h3>
              <ul className="space-y-2.5">
                {svc.problemsSolved.map((prob, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-[#626985]">
                    <span className="text-[#EF4444] font-bold mt-0.5">•</span>
                    <span>{prob}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Embedded Lead Capture */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <EnquiryForm
          headline="Ready to Architect a Scalable Growth Engine?"
          subheadline="Select your target objectives below. Our growth architects will analyze your competitive footprint and schedule a consultation."
        />
      </div>
    </div>
  );
}
