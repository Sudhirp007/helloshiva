import React from "react";
import { siteConfig } from "@/config/site";

export const metadata = {
  title: "Terms and Conditions | HelloShiva",
  description: "Terms of service and usage conditions for HelloShiva Agency and free tools.",
  alternates: {
    canonical: `${siteConfig.url}/terms`,
  },
};

export default function TermsPage() {
  return (
    <div className="pt-28 pb-20 bg-light-section">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white rounded-3xl border border-[#E6E7F0] p-8 sm:p-14 shadow-sm space-y-6 text-sm text-[#626985] leading-relaxed">
        <h1 className="text-3xl font-extrabold text-[#10183A]">Terms and Conditions</h1>
        <p className="text-xs text-[#626985]">Last updated: October 2026</p>

        <section className="space-y-3 pt-4 border-t border-[#E6E7F0]">
          <h2 className="text-lg font-bold text-[#10183A]">1. Agreement to Terms</h2>
          <p>
            By accessing {siteConfig.domain} or using our free marketing tools, you agree to comply with and be bound by these Terms and Conditions. If you do not agree, please do not use our services or tools.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#10183A]">2. Use of Free Marketing Tools</h2>
          <p>
            HelloShiva provides 10 free marketing tools as automated utilities for exploratory analysis. While we aim for rigorous accuracy, the tool outputs are provided &quot;as is&quot; without warranty of search engine ranking guarantees or indexing outcomes. You agree not to abuse or attempt denial-of-service against our tool endpoints.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#10183A]">3. Agency Services & Retainers</h2>
          <p>
            Formal digital marketing engagements, audits, and performance marketing retainers are governed by explicit Statements of Work (SOW) executed between HelloShiva and the client.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#10183A]">4. Intellectual Property</h2>
          <p>
            The content, design, branding, and proprietary algorithms on {siteConfig.domain} are the intellectual property of {siteConfig.legalName}. Clients retain 100% ownership of their customized deliverables as stipulated in their client agreement.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#10183A]">5. Governing Law</h2>
          <p>
            These terms are governed in accordance with the laws of India, with jurisdiction in Delhi.
          </p>
        </section>
      </div>
    </div>
  );
}
