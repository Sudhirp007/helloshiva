import React from "react";
import { ClipboardList, Compass, Rocket, TrendingUp } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: <ClipboardList className="w-5 h-5 text-[#6366F1]" />,
    title: "Diagnostic Audit & Benchmark",
    description:
      "We begin by tearing down your current digital presence: inspecting technical crawl errors, keyword gaps, ad performance waste, and user journey bottlenecks.",
  },
  {
    step: "02",
    icon: <Compass className="w-5 h-5 text-[#8067FF]" />,
    title: "Custom Strategic Blueprint",
    description:
      "We design a prioritized 90-day execution roadmap tailored to your margins, competitors, and growth objectives—eliminating low-ROI distractions.",
  },
  {
    step: "03",
    icon: <Rocket className="w-5 h-5 text-[#6366F1]" />,
    title: "Agile Technical & Creative Execution",
    description:
      "Our specialists implement code optimizations, publish authoritative search content, and deploy laser-targeted performance campaigns with rigorous tracking.",
  },
  {
    step: "04",
    icon: <TrendingUp className="w-5 h-5 text-[#8067FF]" />,
    title: "Attribution, Compounding & Scale",
    description:
      "We review weekly pipeline metrics, test conversion rate improvements, prune underperforming ad sets, and reinvest in your highest-converting growth channels.",
  },
];

export default function ProcessSection() {
  return (
    <section className="py-24 bg-[#F5F4FF] border-b border-[#E6E7F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E8E7FF] text-[#6366F1]">
            Our Methodology
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#10183A]">
            How We Partner With You to Drive Measurable Growth
          </h2>
          <p className="text-base sm:text-lg text-[#626985] leading-relaxed">
            A disciplined, four-stage framework designed to transform chaotic marketing experiments into a reliable customer acquisition machine.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((st, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-7 border border-[#E6E7F0] shadow-sm relative group hover:border-[#6366F1]/50 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="w-10 h-10 rounded-xl bg-[#F5F4FF] border border-[#E8E7FF] flex items-center justify-center">
                  {st.icon}
                </div>
                <span className="text-2xl font-black text-[#E8E7FF] group-hover:text-[#8067FF]/30 transition-colors">
                  {st.step}
                </span>
              </div>
              <h3 className="text-base font-bold text-[#10183A] mb-2.5">
                {st.title}
              </h3>
              <p className="text-xs text-[#626985] leading-relaxed">
                {st.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
