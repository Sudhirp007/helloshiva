import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { siteConfig, ServiceItem } from "@/config/site";
import { CheckCircle2, AlertCircle, ArrowRight, Sparkles, HelpCircle, ChevronRight } from "lucide-react";
import EnquiryForm from "@/components/EnquiryForm";

interface ServicePageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return siteConfig.services.map((svc) => ({
    slug: svc.slug,
  }));
}

export function generateMetadata({ params }: ServicePageProps) {
  const service = siteConfig.services.find((s) => s.slug === params.slug);
  if (!service) return {};

  return {
    title: `${service.title} | Digital Marketing Services`,
    description: `${service.shortDesc} ${service.tagline}`,
    alternates: {
      canonical: `${siteConfig.url}/services/${service.slug}`,
    },
    openGraph: {
      title: `${service.title} | ${siteConfig.name}`,
      description: `${service.shortDesc} ${service.tagline}`,
      url: `${siteConfig.url}/services/${service.slug}`,
      type: "website",
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: `${service.title} - HelloShiva`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${service.title} | ${siteConfig.name}`,
      description: `${service.shortDesc} ${service.tagline}`,
      images: ["/og-image.jpg"],
    },
  };
}

export default function ServiceDetailPage({ params }: ServicePageProps) {
  const service = siteConfig.services.find((s) => s.slug === params.slug);

  if (!service) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${siteConfig.url}/services/${service.slug}/#service`,
        name: service.title,
        description: service.shortDesc,
        provider: {
          "@type": "Organization",
          name: siteConfig.name,
          url: siteConfig.url,
          logo: `${siteConfig.url}/logo.png`,
        },
        serviceType: service.title,
        url: `${siteConfig.url}/services/${service.slug}`,
        offers: {
          "@type": "Offer",
          availability: "https://schema.org/InStock",
        },
      },
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
          {
            "@type": "ListItem",
            position: 3,
            name: service.title,
            item: `${siteConfig.url}/services/${service.slug}`,
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
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <nav className="flex items-center gap-2 text-xs text-[#626985]">
          <Link href="/" className="hover:text-[#10183A]">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/services" className="hover:text-[#10183A]">Services</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#10183A] font-semibold">{service.title}</span>
        </nav>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E8E7FF] text-[#6366F1]">
            <Sparkles className="w-3.5 h-3.5" />
            Specialized Agency Practice
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#10183A] leading-tight">
            {service.heroHeadline}
          </h1>
          <p className="text-lg sm:text-xl text-[#626985] leading-relaxed">
            {service.shortDesc} {service.tagline}
          </p>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Deep Breakdown */}
        <div className="lg:col-span-7 space-y-12">
          {/* Problems Solved */}
          <div className="bg-white rounded-3xl border border-[#E6E7F0] p-8 sm:p-10 space-y-6 shadow-sm">
            <div className="flex items-center gap-2.5 text-[#EF4444]">
              <AlertCircle className="w-5 h-5" />
              <h2 className="text-xl sm:text-2xl font-bold text-[#10183A]">
                Challenges This Service Eliminates
              </h2>
            </div>
            <ul className="space-y-4">
              {service.problemsSolved.map((prob, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-red-600 text-xs font-bold">✕</span>
                  </div>
                  <span className="text-sm sm:text-base text-[#626985] leading-relaxed">
                    {prob}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* What's Included */}
          <div className="bg-white rounded-3xl border border-[#E6E7F0] p-8 sm:p-10 space-y-6 shadow-sm">
            <div className="flex items-center gap-2.5 text-[#10B981]">
              <CheckCircle2 className="w-5 h-5 text-[#6366F1]" />
              <h2 className="text-xl sm:text-2xl font-bold text-[#10183A]">
                Comprehensive Deliverables & Framework
              </h2>
            </div>
            <div className="space-y-4">
              {service.whatsIncluded.map((inc, idx) => (
                <div key={idx} className="flex items-start gap-3 pb-3 border-b border-[#F0F1F6] last:border-0 last:pb-0">
                  <div className="w-5 h-5 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[#6366F1] text-xs font-bold">✓</span>
                  </div>
                  <span className="text-sm sm:text-base font-medium text-[#10183A]">
                    {inc}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Who It Is Suitable For */}
          <div className="bg-white rounded-3xl border border-[#E6E7F0] p-8 sm:p-10 space-y-6 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-bold text-[#10183A]">
              Ideal For Businesses Facing
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {service.suitableFor.map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-[#F8F9FC] border border-[#EAEBF4] text-xs sm:text-sm font-semibold text-[#10183A]">
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Related Tools Callout */}
          {service.relatedTools && service.relatedTools.length > 0 && (
            <div className="bg-gradient-to-br from-[#10183A] to-[#1E2750] rounded-3xl p-8 sm:p-10 text-white space-y-6 shadow-xl">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#A5B4FC]">
                  Free Diagnostic Software
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold">
                  Explore Complementary Free SEO Tools
                </h3>
                <p className="text-sm text-[#C6C9DC]">
                  Audit your on-page elements, preview SERP snippets, and test your infrastructure before engaging our retainers.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {service.relatedTools.map((tool, idx) => (
                  <Link
                    key={idx}
                    href={tool.href}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-semibold transition-colors"
                  >
                    <span>{tool.name}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#8067FF]" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* FAQs */}
          {service.faqs && service.faqs.length > 0 && (
            <div className="bg-white rounded-3xl border border-[#E6E7F0] p-8 sm:p-10 space-y-6 shadow-sm">
              <div className="flex items-center gap-2.5">
                <HelpCircle className="w-5 h-5 text-[#6366F1]" />
                <h2 className="text-xl sm:text-2xl font-bold text-[#10183A]">
                  Frequently Asked Questions
                </h2>
              </div>
              <div className="space-y-4">
                {service.faqs.map((faq, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-[#F5F4FF] border border-[#E8E7FF] space-y-2">
                    <h4 className="text-sm font-bold text-[#10183A]">{faq.question}</h4>
                    <p className="text-xs sm:text-sm text-[#626985] leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Sticky Inquiry Form */}
        <div className="lg:col-span-5 sticky top-28">
          <EnquiryForm
            defaultService={service.slug}
            sourcePage={`/services/${service.slug}`}
            headline={`Discuss ${service.title}`}
            subheadline="Tell us about your current challenges. We'll review your website and prepare a custom proposal."
          />
        </div>
      </div>
    </div>
  );
}
