import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Robots.txt Validator & User-Agent Tester",
  description: "Test and validate your robots.txt syntax. Check user-agent crawl access rules and confirm your XML sitemap directive.",
  alternates: {
    canonical: "https://helloshiva.com/tools/robots-txt-tester",
  },
  openGraph: {
    title: "Robots.txt Validator & User-Agent Tester | HelloShiva",
    description: "Test and validate your robots.txt syntax. Check user-agent crawl access rules and confirm your XML sitemap directive.",
    url: "https://helloshiva.com/tools/robots-txt-tester",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Robots.txt Validator & Directive Tester - HelloShiva",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Robots.txt Validator & User-Agent Tester | HelloShiva",
    description: "Test and validate your robots.txt syntax. Check user-agent crawl access rules and confirm your XML sitemap directive.",
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
        "@id": "https://helloshiva.com/tools/robots-txt-tester/#app",
        name: "Robots.txt Validator & Directive Tester",
        applicationCategory: "SEOApplication",
        operatingSystem: "All",
        url: "https://helloshiva.com/tools/robots-txt-tester",
        description: "Test and validate your robots.txt syntax. Check user-agent crawl access rules and confirm your XML sitemap directive.",
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
            name: "Robots.txt Validator & Directive Tester",
            item: "https://helloshiva.com/tools/robots-txt-tester",
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
