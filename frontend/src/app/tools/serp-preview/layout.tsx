import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Google SERP Snippet Preview Tool",
  description: "Preview how your page title, URL slug, and meta description will appear in desktop and mobile Google Search results before publishing.",
  alternates: {
    canonical: "https://helloshiva.com/tools/serp-preview",
  },
  openGraph: {
    title: "Google SERP Snippet Preview Tool | HelloShiva",
    description: "Preview how your page title, URL slug, and meta description will appear in desktop and mobile Google Search results before publishing.",
    url: "https://helloshiva.com/tools/serp-preview",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Google SERP Snippet Preview Tool - HelloShiva",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Google SERP Snippet Preview Tool | HelloShiva",
    description: "Preview how your page title, URL slug, and meta description will appear in desktop and mobile Google Search results before publishing.",
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
        "@id": "https://helloshiva.com/tools/serp-preview/#app",
        name: "Google SERP Snippet Preview Tool",
        applicationCategory: "SEOApplication",
        operatingSystem: "All",
        url: "https://helloshiva.com/tools/serp-preview",
        description: "Preview how your page title, URL slug, and meta description will appear in desktop and mobile Google Search results before publishing.",
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
            name: "Google SERP Snippet Preview Tool",
            item: "https://helloshiva.com/tools/serp-preview",
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
