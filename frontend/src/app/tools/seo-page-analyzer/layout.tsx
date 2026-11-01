import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "On-Page SEO Technical Analyzer Tool",
  description: "Analyze any webpage for essential on-page SEO signals: title length, meta description, heading hierarchy (H1-H6), canonical tags, and Open Graph previews.",
  alternates: {
    canonical: "https://helloshiva.com/tools/seo-page-analyzer",
  },
  openGraph: {
    title: "On-Page SEO Technical Analyzer Tool | HelloShiva",
    description: "Analyze any webpage for essential on-page SEO signals: title length, meta description, heading hierarchy (H1-H6), canonical tags, and Open Graph previews.",
    url: "https://helloshiva.com/tools/seo-page-analyzer",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "On-Page SEO Technical Analyzer - HelloShiva",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "On-Page SEO Technical Analyzer Tool | HelloShiva",
    description: "Analyze any webpage for essential on-page SEO signals: title length, meta description, heading hierarchy (H1-H6), canonical tags, and Open Graph previews.",
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
        "@id": "https://helloshiva.com/tools/seo-page-analyzer/#app",
        name: "On-Page SEO Technical Analyzer",
        applicationCategory: "SEOApplication",
        operatingSystem: "All",
        url: "https://helloshiva.com/tools/seo-page-analyzer",
        description: "Analyze any webpage for essential on-page SEO signals: title length, meta description, heading hierarchy (H1-H6), canonical tags, and Open Graph previews.",
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
            name: "On-Page SEO Technical Analyzer",
            item: "https://helloshiva.com/tools/seo-page-analyzer",
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
