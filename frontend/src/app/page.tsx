import React from "react";
import Hero from "@/components/Hero";
import ServicesOverview from "@/components/ServicesOverview";
import WhyChooseUs from "@/components/WhyChooseUs";
import ProcessSection from "@/components/ProcessSection";
import FeaturedTools from "@/components/FeaturedTools";
import CaseStudiesSection from "@/components/CaseStudiesSection";
import FaqSection from "@/components/FaqSection";
import CtaBanner from "@/components/CtaBanner";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesOverview />
      <WhyChooseUs />
      <ProcessSection />
      <FeaturedTools />
      <CaseStudiesSection />
      <FaqSection />
      <CtaBanner />
    </>
  );
}
