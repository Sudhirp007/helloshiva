import React from "react";
import { siteConfig } from "@/config/site";

export const metadata = {
  title: "Privacy Policy | HelloShiva",
  description: "Privacy policy and data governance practices at HelloShiva Digital Agency.",
  alternates: {
    canonical: `${siteConfig.url}/privacy-policy`,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="pt-28 pb-20 bg-light-section">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white rounded-3xl border border-[#E6E7F0] p-8 sm:p-14 shadow-sm space-y-6 text-sm text-[#626985] leading-relaxed">
        <h1 className="text-3xl font-extrabold text-[#10183A]">Privacy Policy</h1>
        <p className="text-xs text-[#626985]">Last updated: October 2026</p>

        <section className="space-y-3 pt-4 border-t border-[#E6E7F0]">
          <h2 className="text-lg font-bold text-[#10183A]">1. Overview</h2>
          <p>
            {siteConfig.legalName} (&quot;HelloShiva&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is committed to protecting the privacy of our website visitors and clients. This Privacy Policy describes how we collect, use, and handle information submitted through {siteConfig.domain} and our suite of free marketing tools.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#10183A]">2. Information We Collect</h2>
          <p>
            When you submit a consultation request through our enquiry form, we collect your name, email address, phone number (optional), company name (optional), and project details. We do not require registration or personal data to use our 10 free marketing tools.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#10183A]">3. How We Use Your Information</h2>
          <p>
            We use submitted contact information strictly to respond to your inquiry, prepare marketing proposals, and conduct authorized business communications. We do not sell, rent, or trade client information to any third parties for advertising or commercial list building.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#10183A]">4. Free Tool Data & Server Security</h2>
          <p>
            Our server-side tools (such as the SEO Page Analyzer and HTTP Headers Checker) fetch public HTML and headers solely to generate instant diagnostic reports for the user. We do not store, index, or distribute user-analyzed webpages.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#10183A]">5. Contact Us</h2>
          <p>
            If you have questions regarding our privacy practices, please contact our data team at{" "}
            <a href={`mailto:${siteConfig.contact.email}`} className="text-[#6366F1] font-semibold hover:underline">
              {siteConfig.contact.email}
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
