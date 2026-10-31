import React from "react";
import { siteConfig } from "@/config/site";
import { Mail, Phone, MapPin, Clock, ShieldCheck, Sparkles } from "lucide-react";
import EnquiryForm from "@/components/EnquiryForm";

export const metadata = {
  title: "Contact Us & Book Growth Consultation",
  description:
    "Schedule a digital marketing consultation with HelloShiva. Contact us via email, WhatsApp, or our secure project enquiry form.",
};

export default function ContactPage({
  searchParams,
}: {
  searchParams?: { service?: string };
}) {
  const selectedService = searchParams?.service || "seo-services";

  return (
    <div className="pt-28 pb-20 bg-light-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E8E7FF] text-[#6366F1]">
            <Sparkles className="w-3.5 h-3.5" />
            Direct Agency Partnership
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#10183A]">
            Let’s Discuss Your Next Stage of Digital Growth
          </h1>
          <p className="text-base sm:text-lg text-[#626985] leading-relaxed">
            Whether you need a full technical audit, performance marketing scaling, or an enterprise SEO roadmap, our senior strategy team is ready to review your project.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-24">
        {/* Contact Info Card */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-white rounded-3xl border border-[#E6E7F0] p-8 sm:p-10 shadow-sm space-y-8">
            <h2 className="text-2xl font-bold text-[#10183A]">Agency Contact Details</h2>
            <div className="space-y-6 text-sm">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#F5F4FF] border border-[#E8E7FF] flex items-center justify-center text-[#6366F1] shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#626985] uppercase tracking-wider">Direct Email</div>
                  <a
                    href={`mailto:${siteConfig.contact.email}`}
                    className="font-bold text-[#10183A] hover:text-[#6366F1] transition-colors"
                  >
                    {siteConfig.contact.email}
                  </a>
                  <div className="text-xs text-[#626985] mt-0.5">Average response under 2 hours</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#F5F4FF] border border-[#E8E7FF] flex items-center justify-center text-[#8067FF] shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#626985] uppercase tracking-wider">Phone & WhatsApp</div>
                  <a
                    href={`tel:${siteConfig.contact.phone}`}
                    className="font-bold text-[#10183A] hover:text-[#6366F1] transition-colors"
                  >
                    {siteConfig.contact.phone}
                  </a>
                  <div className="text-xs text-[#626985] mt-0.5">Direct line to client strategy</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#F5F4FF] border border-[#E8E7FF] flex items-center justify-center text-[#6366F1] shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#626985] uppercase tracking-wider">Office Location</div>
                  <div className="font-bold text-[#10183A]">{siteConfig.contact.address}</div>
                  <div className="text-xs text-[#626985] mt-0.5">{siteConfig.contact.coverage}</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#F5F4FF] border border-[#E8E7FF] flex items-center justify-center text-[#8067FF] shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#626985] uppercase tracking-wider">Working Hours</div>
                  <div className="font-bold text-[#10183A]">{siteConfig.contact.workingHours}</div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#F5F4FF] border border-[#E8E7FF] flex items-center gap-3 text-xs text-[#10183A]">
              <ShieldCheck className="w-5 h-5 text-[#22C55E] shrink-0" />
              <span>We never sell data or disclose project details. Strict NDAs honored upon request.</span>
            </div>
          </div>
        </div>

        {/* Form Column */}
        <div className="lg:col-span-7">
          <EnquiryForm
            defaultService={selectedService}
            sourcePage="/contact"
            headline="Send Us Your Project Details"
            subheadline="Fill out the form below. We will review your current website, analyze competitors, and propose actionable growth milestones."
          />
        </div>
      </div>
    </div>
  );
}
