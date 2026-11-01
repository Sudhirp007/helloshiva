import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "UTM Campaign URL Builder & Tracker",
  description: "Generate clean, standardized Google Analytics campaign links with source, medium, campaign, term, and content parameters.",
  alternates: {
    canonical: "https://helloshiva.com/tools/utm-builder",
  },
  openGraph: {
    title: "UTM Campaign URL Builder & Tracker | HelloShiva",
    description: "Generate clean, standardized Google Analytics campaign links with source, medium, campaign, term, and content parameters.",
    url: "https://helloshiva.com/tools/utm-builder",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "UTM Campaign URL Builder - HelloShiva",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "UTM Campaign URL Builder & Tracker | HelloShiva",
    description: "Generate clean, standardized Google Analytics campaign links with source, medium, campaign, term, and content parameters.",
    images: ["/og-image.jpg"],
  },
};

export default function ToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": "https://helloshiva.com/tools/utm-builder/#app",
        name: "UTM Campaign URL Builder",
        applicationCategory: "SEOApplication",
        operatingSystem: "All",
        url: "https://helloshiva.com/tools/utm-builder",
        description: "Generate clean, standardized Google Analytics campaign links with source, medium, campaign, term, and content parameters.",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        provider: {
          "@type": "Organization",
          name: "HelloShiva",
          url: "https://helloshiva.com",
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://helloshiva.com",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Free Tools",
            item: "https://helloshiva.com/tools",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "UTM Campaign URL Builder",
            item: "https://helloshiva.com/tools/utm-builder",
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
