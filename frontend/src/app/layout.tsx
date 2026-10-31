import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { siteConfig } from "@/config/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — Digital Marketing Agency | SEO, Ads & Web Engineering`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.subheadline,
  keywords: [
    "digital marketing agency",
    "SEO services",
    "technical SEO",
    "local SEO",
    "performance marketing",
    "content marketing",
    "web design and development",
    "digital marketing tools",
    "Core Web Vitals optimization",
    "conversion rate optimization",
  ],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: `${siteConfig.name} — Digital Marketing Agency`,
    description: siteConfig.subheadline,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — Digital Marketing Agency`,
    description: siteConfig.subheadline,
    creator: "@helloshiva",
    site: "@helloshiva",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "ProfessionalService"],
        "@id": `${siteConfig.url}/#organization`,
        name: siteConfig.name,
        legalName: siteConfig.legalName,
        url: siteConfig.url,
        logo: `${siteConfig.url}/favicon.ico`,
        description: siteConfig.subheadline,
        telephone: siteConfig.contact.phone,
        email: siteConfig.contact.email,
        address: {
          "@type": "PostalAddress",
          streetAddress: siteConfig.contact.address,
          addressCountry: "IN",
        },
        sameAs: [
          siteConfig.socials.linkedin,
          siteConfig.socials.twitter,
          siteConfig.socials.github,
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Digital Marketing Services",
          itemListElement: (siteConfig.services || []).map((s, idx) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: s.title,
              description: s.shortDesc,
              url: `${siteConfig.url}/services/${s.slug}`,
            },
            position: idx + 1,
          })),
        },
      },
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        url: siteConfig.url,
        name: siteConfig.name,
        description: siteConfig.subheadline,
        publisher: {
          "@id": `${siteConfig.url}/#organization`,
        },
      },
    ],
  };

  return (
    <html lang="en" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
