import React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import EnquiryForm from "@/components/EnquiryForm";

export const metadata = {
  title: "Digital Marketing Services",
  description:
    "Explore HelloShiva's full-funnel digital marketing services: SEO, Technical SEO, Local SEO, Performance PPC, Social Media, Content Marketing, and Web Engineering.",
};

export default function ServicesPage() {
  return (
    <div className="pt-28 pb-20 bg-light-section">
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

              <p className="text-sm text-[#626985] leading-relaxed">
                {svc.shortDesc}
              </p>

              {/* Problems Solved */}
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#10183A]">
                  Primary Bottlenecks Resolved:
                </h4>
                <ul className="space-y-1.5">
                  {svc.problemsSolved.map((p, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-2.5 text-xs text-[#626985]">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0 mt-1.5" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* What's included */}
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#10183A]">
                  Key Deliverables:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {svc.whatsIncluded.slice(0, 4).map((inc, iIdx) => (
                    <div key={iIdx} className="flex items-start gap-2 text-xs text-[#10183A]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E] shrink-0 mt-0.5" />
                      <span>{inc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <Link
                  href={`/services/${svc.slug}`}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#6366F1] to-[#8067FF] hover:from-[#5558E6] hover:to-[#7358F5] shadow-md shadow-indigo-500/20 transition-all"
                >
                  <span>View Full Details & FAQs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                {svc.relatedTools.map((t, tIdx) => (
                  <Link
                    key={tIdx}
                    href={t.href}
                    className="text-xs font-semibold text-[#626985] hover:text-[#6366F1] transition-colors bg-[#F5F4FF] border border-[#E8E7FF] px-3 py-2 rounded-xl"
                  >
                    Try Free: {t.name} ↗
                  </Link>
                ))}
              </div>
            </div>

            {/* Right Card: Ideal Fit */}
            <div className="lg:col-span-5 bg-[#F5F4FF] rounded-2xl p-6 border border-[#E8E7FF] space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#10183A]">
                Who This Service Is Designed For:
              </h4>
              <ul className="space-y-2">
                {svc.suitableFor.map((suit, sIdx) => (
                  <li key={sIdx} className="flex items-start gap-2.5 text-xs text-[#626985]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#6366F1] shrink-0 mt-1.5" />
                    <span>{suit}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-4 border-t border-[#E8E7FF] text-center">
                <Link
                  href={`/contact?service=${svc.slug}`}
                  className="w-full inline-block py-2.5 px-4 rounded-xl text-xs font-semibold text-[#6366F1] bg-white border border-[#E6E7F0] hover:bg-[#E8E7FF] transition-colors"
                >
                  Request Consultation on {svc.title}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Inquiry Form Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <EnquiryForm
          headline="Ready to Accelerate Your Digital Growth?"
          subheadline="Select the service that fits your immediate priorities or request a holistic digital growth roadmap."
          sourcePage="/services"
        />
      </div>
    </div>
  );
}
