import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "URL Percent-Encoder & Decoder Tool",
  description: "Encode or decode special characters in URLs, query strings, and tracking parameters according to RFC 3986.",
  alternates: {
    canonical: "https://helloshiva.com/tools/url-encoder-decoder",
  },
  openGraph: {
    title: "URL Percent-Encoder & Decoder Tool | HelloShiva",
    description: "Encode or decode special characters in URLs, query strings, and tracking parameters according to RFC 3986.",
    url: "https://helloshiva.com/tools/url-encoder-decoder",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "URL Percent-Encoder & Decoder - HelloShiva",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "URL Percent-Encoder & Decoder Tool | HelloShiva",
    description: "Encode or decode special characters in URLs, query strings, and tracking parameters according to RFC 3986.",
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
        "@id": "https://helloshiva.com/tools/url-encoder-decoder/#app",
        name: "URL Percent-Encoder & Decoder",
        applicationCategory: "SEOApplication",
        operatingSystem: "All",
        url: "https://helloshiva.com/tools/url-encoder-decoder",
        description: "Encode or decode special characters in URLs, query strings, and tracking parameters according to RFC 3986.",
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
            name: "URL Percent-Encoder & Decoder",
            item: "https://helloshiva.com/tools/url-encoder-decoder",
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
