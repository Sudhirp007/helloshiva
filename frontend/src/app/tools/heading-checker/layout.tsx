import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Heading Structure & H1-H6 Hierarchy Checker",
  description: "Verify your page's semantic HTML outline. Catch missing H1 tags, out-of-order heading levels, and empty heading containers.",
  alternates: {
    canonical: "https://helloshiva.com/tools/heading-checker",
  },
  openGraph: {
    title: "Heading Structure & H1-H6 Hierarchy Checker | HelloShiva",
    description: "Verify your page's semantic HTML outline. Catch missing H1 tags, out-of-order heading levels, and empty heading containers.",
    url: "https://helloshiva.com/tools/heading-checker",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Heading Structure Checker - HelloShiva",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Heading Structure & H1-H6 Hierarchy Checker | HelloShiva",
    description: "Verify your page's semantic HTML outline. Catch missing H1 tags, out-of-order heading levels, and empty heading containers.",
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
        "@id": "https://helloshiva.com/tools/heading-checker/#app",
        name: "Heading Structure Checker",
        applicationCategory: "SEOApplication",
        operatingSystem: "All",
        url: "https://helloshiva.com/tools/heading-checker",
        description: "Verify your page's semantic HTML outline. Catch missing H1 tags, out-of-order heading levels, and empty heading containers.",
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
            name: "Heading Structure Checker",
            item: "https://helloshiva.com/tools/heading-checker",
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
