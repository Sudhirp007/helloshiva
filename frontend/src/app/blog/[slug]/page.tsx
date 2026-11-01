import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  Calendar,
  Clock,
  ArrowLeft,
  Share2,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Send,
} from "lucide-react";
import db from "@/lib/db";
import MarkdownRenderer from "@/components/MarkdownRenderer";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = db.prepare("SELECT * FROM articles WHERE slug = ?").get(slug);

  if (!article) {
    return {
      title: "Article Not Found | HelloShiva",
    };
  }

  const title = `${article.title} | HelloShiva Insights`;
  const description = article.meta_description || "Actionable digital marketing and technical SEO guide by HelloShiva.";

  return {
    title,
    description,
    alternates: {
      canonical: `https://helloshiva.com/blog/${slug}`,
    },
    openGraph: {
      title,
      description,
      type: "article",
      url: `https://helloshiva.com/blog/${slug}`,
      publishedTime: article.published_at || article.created_at,
      authors: [article.author || "HelloShiva Strategic Engineering"],
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@helloshiva",
      images: ["/og-image.jpg"],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const article = db.prepare("SELECT * FROM articles WHERE slug = ?").get(slug);

  if (!article) {
    notFound();
  }

  const words = (article.content_markdown || "").trim().split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.ceil(words / 225));
  const dateStr = article.published_at
    ? new Date(article.published_at).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "October 2026";

  const articleUrl = `https://helloshiva.com/blog/${article.slug}`;

  // Structured Data (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${articleUrl}/#article`,
        headline: article.title,
        description: article.meta_description,
        image: "https://helloshiva.com/og-image.jpg",
        author: {
          "@type": "Organization",
          name: "HelloShiva Digital Marketing Agency",
          url: "https://helloshiva.com",
        },
        publisher: {
          "@type": "Organization",
          name: "HelloShiva",
          url: "https://helloshiva.com",
          logo: {
            "@type": "ImageObject",
            url: "https://helloshiva.com/logo.png",
          },
        },
        datePublished: article.published_at || article.created_at,
        dateModified: article.updated_at || article.created_at,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": articleUrl,
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
            name: "Insights & Guides",
            item: "https://helloshiva.com/blog",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: article.title,
            item: articleUrl,
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

      <article className="pt-28 pb-24 bg-white min-h-screen">
        {/* Top Breadcrumb & Category Bar */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <nav className="flex items-center gap-2 text-xs text-[#626985] mb-6">
            <Link href="/" className="hover:text-[#6366F1] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/blog" className="hover:text-[#6366F1] transition-colors">
              Insights & Engineering
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#10183A] font-medium truncate max-w-xs">{article.title}</span>
          </nav>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6366F1] bg-[#F5F4FF] px-3 py-1 rounded-full border border-[#E8E7FF]">
                {article.category || "Technical SEO Strategy"}
              </span>
              <div className="flex items-center gap-3 text-xs text-[#626985]">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> {dateStr}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {readTime} min read
                </span>
                <span>•</span>
                <span>{words.toLocaleString()} words</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#10183A] tracking-tight leading-tight">
              {article.title}
            </h1>

            {article.meta_description && (
              <p className="text-base sm:text-lg text-[#626985] leading-relaxed font-normal pt-1">
                {article.meta_description}
              </p>
            )}

            {/* Author bar & Share links */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#E6E7F0]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#6366F1] to-[#8067FF] text-white flex items-center justify-center font-extrabold text-sm shadow-sm">
                  H
                </div>
                <div>
                  <div className="font-bold text-xs text-[#10183A]">{article.author || "HelloShiva Strategic Engineering"}</div>
                  <div className="text-[11px] text-[#626985]">Digital Marketing & Web Performance Team</div>
                </div>
              </div>

              {/* Social Share Buttons */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-[#626985] mr-1 flex items-center gap-1">
                  <Share2 className="w-3.5 h-3.5" /> Share:
                </span>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(articleUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 rounded-lg bg-[#F5F4FF] hover:bg-[#E8E7FF] text-[#10183A] font-semibold text-xs transition-colors"
                >
                  X (Twitter)
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 rounded-lg bg-[#F5F4FF] hover:bg-[#E8E7FF] text-[#10183A] font-semibold text-xs transition-colors"
                >
                  LinkedIn
                </a>
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(article.title + " " + articleUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 rounded-lg bg-[#F5F4FF] hover:bg-[#E8E7FF] text-[#10183A] font-semibold text-xs transition-colors"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Article Body Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 border-t border-[#E6E7F0]">
          <MarkdownRenderer content={article.content_markdown} />
        </div>

        {/* Bottom Conversion Box */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <div className="bg-[#0B1025] rounded-3xl p-8 sm:p-10 text-white border border-[#252B49] space-y-5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#8067FF]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#8067FF]">
                HelloShiva Strategic Growth Consultation
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              Want HelloShiva to engineer your search architecture and performance marketing?
            </h3>

            <p className="text-xs sm:text-sm text-[#C6C9DC] leading-relaxed">
              We don&apos;t just publish guides—we build compounding organic search equity, high-speed Core Web Vitals infrastructures, and revenue-driven ad funnels for ambitious brands.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#6366F1] to-[#8067FF] hover:opacity-90 shadow-md transition-all"
              >
                <span>Discuss Your Project With Us</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/tools"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-semibold text-[#C6C9DC] bg-[#171F42] hover:bg-[#252B49] border border-[#252B49] transition-all"
              >
                <span>Use Free Marketing Tools</span>
              </Link>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
