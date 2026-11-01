import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HTTP Response Headers & Security Audit Tool",
  description: "Inspect live server status codes (200, 301, 302, 404), HSTS configuration, X-Frame-Options, CSP, and caching directives.",
  alternates: {
    canonical: "https://helloshiva.com/tools/http-headers-checker",
  },
  openGraph: {
    title: "HTTP Response Headers & Security Audit Tool | HelloShiva",
    description: "Inspect live server status codes (200, 301, 302, 404), HSTS configuration, X-Frame-Options, CSP, and caching directives.",
    url: "https://helloshiva.com/tools/http-headers-checker",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "HTTP Response Headers & Security Checker - HelloShiva",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HTTP Response Headers & Security Audit Tool | HelloShiva",
    description: "Inspect live server status codes (200, 301, 302, 404), HSTS configuration, X-Frame-Options, CSP, and caching directives.",
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
        "@id": "https://helloshiva.com/tools/http-headers-checker/#app",
        name: "HTTP Response Headers & Security Checker",
        applicationCategory: "SEOApplication",
        operatingSystem: "All",
        url: "https://helloshiva.com/tools/http-headers-checker",
        description: "Inspect live server status codes (200, 301, 302, 404), HSTS configuration, X-Frame-Options, CSP, and caching directives.",
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
            name: "HTTP Response Headers & Security Checker",
            item: "https://helloshiva.com/tools/http-headers-checker",
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
