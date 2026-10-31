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
    title: `${service.title} — Digital Marketing Services`,
    description: service.shortDesc,
    openGraph: {
      title: `${service.title} | ${siteConfig.name}`,
      description: service.shortDesc,
    },
  };
}

export default function ServiceDetailPage({ params }: ServicePageProps) {
  const service = siteConfig.services.find((s) => s.slug === params.slug);

  if (!service) {
    notFound();
  }

  return (
    <div className="pt-28 pb-20 bg-light-section">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-24">
        {/* Left Column: Details, Scope & Problems */}
        <div className="lg:col-span-7 space-y-12">
          {/* Problems Solved */}
          <div className="bg-white rounded-3xl border border-[#E6E7F0] p-8 sm:p-10 shadow-sm space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-[#10183A]">
              The Core Challenges This Service Resolves
            </h2>
            <div className="space-y-4">
              {service.problemsSolved.map((prob, idx) => (
                <div key={idx} className="flex items-start gap-3.5 p-4 rounded-xl bg-red-50/50 border border-red-100">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm text-[#10183A] leading-relaxed">{prob}</p>
                </div>
              ))}
            </div>
          </div>

          {/* What's Included */}
          <div className="bg-white rounded-3xl border border-[#E6E7F0] p-8 sm:p-10 shadow-sm space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-[#10183A]">
              What Is Included in Our Engagement
            </h2>
            <div className="space-y-3.5">
              {service.whatsIncluded.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-[#F5F4FF] border border-[#E8E7FF]">
                  <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-[#10183A] font-medium leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Suitable For */}
          <div className="bg-white rounded-3xl border border-[#E6E7F0] p-8 sm:p-10 shadow-sm space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-[#10183A]">
              Who This Service Is Ideal For
            </h2>
            <ul className="space-y-3">
              {service.suitableFor.map((suit, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-[#626985]">
                  <div className="w-2 h-2 rounded-full bg-[#6366F1] shrink-0 mt-2" />
                  <span className="leading-relaxed">{suit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Related Free Tools Callout */}
          {service.relatedTools.length > 0 && (
            <div className="p-8 rounded-3xl bg-gradient-to-r from-[#0B1025] to-[#171F42] text-white border border-[#252B49] space-y-4">
              <span className="text-xs font-semibold text-[#8067FF] uppercase tracking-wider">
                Hands-On Diagnostic Tools
              </span>
              <h3 className="text-xl font-bold">
                Test Your Website Right Now With Our Free Utilities
              </h3>
              <p className="text-xs text-[#C6C9DC] leading-relaxed">
                Before booking a consultation, feel free to run quick diagnostics with our free companion tools:
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                {service.relatedTools.map((t, idx) => (
                  <Link
                    key={idx}
                    href={t.href}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#171F42] border border-[#252B49] hover:border-[#6366F1] transition-colors"
                  >
                    <span>{t.name}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* FAQs */}
          {service.faqs.length > 0 && (
            <div className="bg-white rounded-3xl border border-[#E6E7F0] p-8 sm:p-10 shadow-sm space-y-6">
              <div className="flex items-center gap-2">
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
