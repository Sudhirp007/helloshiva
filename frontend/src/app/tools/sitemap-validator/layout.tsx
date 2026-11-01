import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "XML Sitemap Syntax & URL Validator",
  description: "Validate your sitemap.xml against official schemas. Detect broken links, missing canonicals, and duplicate URLs.",
  alternates: {
    canonical: "https://helloshiva.com/tools/sitemap-validator",
  },
  openGraph: {
    title: "XML Sitemap Syntax & URL Validator | HelloShiva",
    description: "Validate your sitemap.xml against official schemas. Detect broken links, missing canonicals, and duplicate URLs.",
    url: "https://helloshiva.com/tools/sitemap-validator",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "XML Sitemap Syntax Validator - HelloShiva",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "XML Sitemap Syntax & URL Validator | HelloShiva",
    description: "Validate your sitemap.xml against official schemas. Detect broken links, missing canonicals, and duplicate URLs.",
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
        "@id": "https://helloshiva.com/tools/sitemap-validator/#app",
        name: "XML Sitemap Syntax Validator",
        applicationCategory: "SEOApplication",
        operatingSystem: "All",
        url: "https://helloshiva.com/tools/sitemap-validator",
        description: "Validate your sitemap.xml against official schemas. Detect broken links, missing canonicals, and duplicate URLs.",
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
            name: "XML Sitemap Syntax Validator",
            item: "https://helloshiva.com/tools/sitemap-validator",
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
