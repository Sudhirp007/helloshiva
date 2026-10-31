import React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import {
  Search,
  Cpu,
  MapPin,
  TrendingUp,
  Share2,
  FileText,
  Layout,
  Compass,
  ArrowRight,
  Sparkles,
} from "lucide-react";

// Map service slug to modern Lucide icon
const iconMap: Record<string, React.ReactNode> = {
  "seo-services": <Search className="w-5 h-5 text-[#6366F1]" />,
  "technical-seo": <Cpu className="w-5 h-5 text-[#8067FF]" />,
  "local-seo": <MapPin className="w-5 h-5 text-[#6366F1]" />,
  "performance-marketing": <TrendingUp className="w-5 h-5 text-[#8067FF]" />,
  "social-media-marketing": <Share2 className="w-5 h-5 text-[#6366F1]" />,
  "content-marketing": <FileText className="w-5 h-5 text-[#8067FF]" />,
  "web-design-development": <Layout className="w-5 h-5 text-[#6366F1]" />,
  "digital-strategy": <Compass className="w-5 h-5 text-[#8067FF]" />,
};

export default function ServicesOverview() {
  return (
    <section className="py-24 bg-light-section border-b border-[#E6E7F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E8E7FF] text-[#6366F1]">
            <Sparkles className="w-3.5 h-3.5" />
            Our Digital Marketing Services
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#10183A]">
            Comprehensive Growth Capabilities Engineered for Modern Brands
          </h2>
          <p className="text-base sm:text-lg text-[#626985] leading-relaxed">
            We reject cookie-cutter marketing packages. Every engagement is a customized, data-backed execution designed to capture customer intent and build durable revenue.
          </p>
        </div>

        {/* Services Grid (8 Services) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {siteConfig.services.map((svc) => (
            <div
              key={svc.id}
              className="bg-white rounded-2xl border border-[#E6E7F0] p-6 hover:border-[#6366F1]/50 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#F5F4FF] border border-[#E8E7FF] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-200">
                  {iconMap[svc.slug]}
                </div>
                <h3 className="text-lg font-bold text-[#10183A] mb-2 group-hover:text-[#6366F1] transition-colors">
                  {svc.title}
                </h3>
                <p className="text-xs text-[#626985] leading-relaxed mb-4">
                  {svc.shortDesc}
                </p>

                {/* Key Deliverable Snapshot */}
                <div className="border-t border-[#E6E7F0] pt-3 mb-4 space-y-1.5">
                  <div className="text-[11px] font-semibold text-[#10183A] uppercase tracking-wider">
                    Core Focus:
                  </div>
                  <p className="text-[11px] text-[#626985] line-clamp-2">
                    {svc.tagline}
                  </p>
                </div>
              </div>

              {/* Action Link */}
              <div className="pt-3 border-t border-[#E6E7F0]/60 flex items-center justify-between text-xs font-semibold">
                <Link
                  href={`/services/${svc.slug}`}
                  className="text-[#6366F1] group-hover:text-[#8067FF] flex items-center gap-1.5 transition-colors"
                >
                  <span>Explore Service</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
                {svc.relatedTools.length > 0 && (
                  <Link
                    href={svc.relatedTools[0].href}
                    className="text-[10px] text-[#626985] hover:text-[#10183A] transition-colors bg-[#F5F4FF] px-2 py-0.5 rounded-md"
                    title={`Free Tool: ${svc.relatedTools[0].name}`}
                  >
                    Tool ↗
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-white border border-[#E6E7F0] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-base font-bold text-[#10183A]">
              Need a multi-channel growth engagement?
            </h4>
            <p className="text-xs text-[#626985]">
              We integrate SEO, performance ads, and web engineering into a singular growth engine for your brand.
            </p>
          </div>
          <Link
            href="/contact"
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#6366F1] to-[#8067FF] hover:from-[#5558E6] hover:to-[#7358F5] shadow-md shadow-indigo-500/20 transition-all"
          >
            <span>Request Full Growth Consultation</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
