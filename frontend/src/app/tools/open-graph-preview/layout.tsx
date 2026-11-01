import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Open Graph & Social Share Card Previewer",
  description: "Inspect og:title, og:description, and og:image tags to see exactly how your links will render on Facebook, Twitter/X, and LinkedIn.",
  alternates: {
    canonical: "https://helloshiva.com/tools/open-graph-preview",
  },
  openGraph: {
    title: "Open Graph & Social Share Card Previewer | HelloShiva",
    description: "Inspect og:title, og:description, and og:image tags to see exactly how your links will render on Facebook, Twitter/X, and LinkedIn.",
    url: "https://helloshiva.com/tools/open-graph-preview",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Open Graph & Twitter Card Previewer - HelloShiva",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Open Graph & Social Share Card Previewer | HelloShiva",
    description: "Inspect og:title, og:description, and og:image tags to see exactly how your links will render on Facebook, Twitter/X, and LinkedIn.",
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
        "@id": "https://helloshiva.com/tools/open-graph-preview/#app",
        name: "Open Graph & Twitter Card Previewer",
        applicationCategory: "SEOApplication",
        operatingSystem: "All",
        url: "https://helloshiva.com/tools/open-graph-preview",
        description: "Inspect og:title, og:description, and og:image tags to see exactly how your links will render on Facebook, Twitter/X, and LinkedIn.",
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
            name: "Open Graph & Twitter Card Previewer",
            item: "https://helloshiva.com/tools/open-graph-preview",
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
