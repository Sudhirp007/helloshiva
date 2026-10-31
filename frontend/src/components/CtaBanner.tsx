import React from "react";
import EnquiryForm from "./EnquiryForm";

export default function CtaBanner() {
  return (
    <section className="py-24 bg-dark-hero relative overflow-hidden text-white border-b border-[#252B49]">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-[#6366F1]/15 to-[#8067FF]/15 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Value Prop */}
          <div className="lg:col-span-5 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#171F42] border border-[#252B49] text-[#C6C9DC]">
              <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
              Direct Partner Consultation
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
              Ready to turn your website into a{" "}
              <span className="text-gradient">high-velocity growth engine?</span>
            </h2>

            <p className="text-base text-[#C6C9DC] leading-relaxed">
              Tell us about your target audience, current performance bottlenecks, and 12-month revenue goals. We will perform a preliminary diagnostic and respond with clear strategic recommendations.
            </p>

            <div className="pt-4 border-t border-[#252B49] space-y-3 text-xs text-[#C6C9DC]/80">
              <div className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8067FF]" />
                <span>Response guaranteed within 24 business hours</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8067FF]" />
                <span>NDA & strict data confidentiality on all inquiries</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8067FF]" />
                <span>Zero sales pressure or generic sales pitches</span>
              </div>
            </div>
          </div>

          {/* Right Column: Embedded Conversion Form */}
          <div className="lg:col-span-7">
            <EnquiryForm
              defaultService="seo-services"
              sourcePage="homepage-cta-banner"
              headline="Discuss Your Project"
              subheadline="Submit your details below to schedule a free 30-minute growth diagnostic session with our senior strategy team."
            />
          </div>
        </div>
      </div>
    </section>
  );
}
