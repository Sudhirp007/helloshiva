import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Keyword Density & Frequency Checker Tool",
  description: "Calculate exact single and two-word keyword frequencies across your content to prevent over-optimization and keyword stuffing.",
  alternates: {
    canonical: "https://helloshiva.com/tools/keyword-density-checker",
  },
  openGraph: {
    title: "Keyword Density & Frequency Checker Tool | HelloShiva",
    description: "Calculate exact single and two-word keyword frequencies across your content to prevent over-optimization and keyword stuffing.",
    url: "https://helloshiva.com/tools/keyword-density-checker",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Keyword Density & Frequency Checker - HelloShiva",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Keyword Density & Frequency Checker Tool | HelloShiva",
    description: "Calculate exact single and two-word keyword frequencies across your content to prevent over-optimization and keyword stuffing.",
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
        "@id": "https://helloshiva.com/tools/keyword-density-checker/#app",
        name: "Keyword Density & Frequency Checker",
        applicationCategory: "SEOApplication",
        operatingSystem: "All",
        url: "https://helloshiva.com/tools/keyword-density-checker",
        description: "Calculate exact single and two-word keyword frequencies across your content to prevent over-optimization and keyword stuffing.",
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
            name: "Keyword Density & Frequency Checker",
            item: "https://helloshiva.com/tools/keyword-density-checker",
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
