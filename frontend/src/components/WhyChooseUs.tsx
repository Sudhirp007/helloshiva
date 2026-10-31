import React from "react";
import { ShieldCheck, Target, Code2, LineChart, CheckCircle2 } from "lucide-react";

const pillars = [
  {
    icon: <Code2 className="w-6 h-6 text-[#6366F1]" />,
    title: "Technical Engineering Rigor",
    description:
      "Most agencies rely on superficial content tweaks. We diagnose and engineer at the code level—optimizing DOM trees, server response latency, crawl budgets, and structured schemas.",
  },
  {
    icon: <Target className="w-6 h-6 text-[#8067FF]" />,
    title: "Commercial Revenue Alignment",
    description:
      "Vanity traffic that never converts is a waste of capital. Every keyword we target and campaign we launch is mapped directly to buyer intent and pipeline generation.",
  },
  {
    icon: <LineChart className="w-6 h-6 text-[#6366F1]" />,
    title: "Full-Funnel Cohesion",
    description:
      "We eliminate marketing silos. Your organic search strategy feeds customer insight into your paid ads, while your web architecture converts both into qualified sales inquiries.",
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-[#8067FF]" />,
    title: "Radical Attribution Transparency",
    description:
      "No inflated metrics or black-box reports. You get clear tracking connecting clicks to actual conversions, with weekly communication and zero contractual lock-ins.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-24 bg-white border-b border-[#E6E7F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E8E7FF] text-[#6366F1]">
            Why HelloShiva
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#10183A]">
            Why Forward-Thinking Businesses Choose HelloShiva
          </h2>
          <p className="text-base sm:text-lg text-[#626985] leading-relaxed">
            The digital marketing landscape is flooded with superficial promises. We bring engineering discipline, commercial strategy, and ruthless execution to your marketing funnel.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((p, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-[#F5F4FF] border border-[#E8E7FF] hover:border-[#6366F1]/40 hover:bg-white hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-white border border-[#E6E7F0] shadow-sm flex items-center justify-center mb-6">
                {p.icon}
              </div>
              <h3 className="text-lg font-bold text-[#10183A] mb-3">
                {p.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#626985] leading-relaxed">
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
