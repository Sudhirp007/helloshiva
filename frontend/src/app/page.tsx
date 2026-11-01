import React from "react";
import type { Metadata } from "next";
import Hero from "@/components/Hero";
import ServicesOverview from "@/components/ServicesOverview";
import WhyChooseUs from "@/components/WhyChooseUs";
import ProcessSection from "@/components/ProcessSection";
import FeaturedTools from "@/components/FeaturedTools";
import CaseStudiesSection from "@/components/CaseStudiesSection";
import LatestInsightsSection from "@/components/LatestInsightsSection";
import FaqSection from "@/components/FaqSection";
import CtaBanner from "@/components/CtaBanner";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "HelloShiva | Digital Marketing, SEO & Growth Agency",
  description:
    "Grow your online presence with HelloShiva. Explore SEO, digital marketing, social media, PPC and website solutions designed to help businesses grow.",
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    title: "HelloShiva | Digital Marketing, SEO & Growth Agency",
    description:
      "Grow your online presence with HelloShiva. Explore SEO, digital marketing, social media, PPC and website solutions designed to help businesses grow.",
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "HelloShiva | Digital Marketing, SEO & Growth Agency",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HelloShiva | Digital Marketing, SEO & Growth Agency",
    description:
      "Grow your online presence with HelloShiva. Explore SEO, digital marketing, social media, PPC and website solutions designed to help businesses grow.",
    images: ["/og-image.jpg"],
  },
};

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "ProfessionalService"],
        "@id": `${siteConfig.url}/#organization`,
        name: siteConfig.name,
        legalName: siteConfig.legalName,
        url: siteConfig.url,
        logo: `${siteConfig.url}/logo.png`,
        image: `${siteConfig.url}/og-image.jpg`,
        description: siteConfig.subheadline,
        telephone: siteConfig.contact.phone,
        email: siteConfig.contact.email,
        address: {
          "@type": "PostalAddress",
          streetAddress: siteConfig.contact.address,
          addressCountry: "IN",
        },
        sameAs: [
          siteConfig.socials.linkedin,
          siteConfig.socials.twitter,
          siteConfig.socials.github,
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        url: siteConfig.url,
        name: siteConfig.name,
        description:
          "Grow your online presence with HelloShiva. Explore SEO, digital marketing, social media, PPC and website solutions designed to help businesses grow.",
        publisher: {
          "@id": `${siteConfig.url}/#organization`,
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteConfig.url}/tools?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <ServicesOverview />
      <WhyChooseUs />
      <ProcessSection />
      <FeaturedTools />
      <LatestInsightsSection />
      <CaseStudiesSection />
      <FaqSection />
      <CtaBanner />
    </>
  );
}
