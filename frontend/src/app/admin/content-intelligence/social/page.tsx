"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Share2,
  Copy,
  Check,
  Sparkles,
  RefreshCw,
  ExternalLink,
  MessageSquare,
  Twitter,
  Linkedin,
  Facebook,
  Instagram,
  Layers,
} from "lucide-react";

interface SocialPostItem {
  id: string;
  article_id: string;
  platform: "LINKEDIN" | "TWITTER" | "FACEBOOK" | "INSTAGRAM" | "REDDIT";
  content_text: string;
  hashtags: string[];
  slide_data?: any;
  cta_url?: string;
}

interface ArticleOption {
  id: string;
  title: string;
  slug: string;
}

function SocialStudioComponent() {
  const searchParams = useSearchParams();
  const paramArticleId = searchParams.get("article_id") || "";
  const paramTitle = searchParams.get("title") || "";
  const paramSlug = searchParams.get("slug") || "";

  const [articles, setArticles] = useState<ArticleOption[]>([]);
  const [selectedArticleId, setSelectedArticleId] = useState(paramArticleId);
  const [selectedTitle, setSelectedTitle] = useState(paramTitle);
  const [selectedSlug, setSelectedSlug] = useState(paramSlug);
  const [posts, setPosts] = useState<SocialPostItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Load articles for dropdown
  useEffect(() => {
    fetch("/api/v1/content-intelligence/articles")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.articles) {
          setArticles(data.articles);
          if (!selectedArticleId && data.articles.length > 0) {
            setSelectedArticleId(data.articles[0].id);
            setSelectedTitle(data.articles[0].title);
            setSelectedSlug(data.articles[0].slug);
          }
        }
      });
  }, []);

  const handleGenerate = async () => {
    if (!selectedTitle || !selectedSlug) return;
    setLoading(true);
    try {
      const res = await fetch("/api/v1/content-intelligence/social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          articleId: selectedArticleId,
          title: selectedTitle,
          slug: selectedSlug,
        }),
      });
      const data = await res.json();
      if (data.success && data.posts) {
        setPosts(data.posts);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedTitle && selectedSlug) {
      handleGenerate();
    }
  }, [selectedArticleId]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "LINKEDIN":
        return <Linkedin className="w-4 h-4 text-sky-600" />;
      case "TWITTER":
        return <Twitter className="w-4 h-4 text-blue-400" />;
      case "FACEBOOK":
        return <Facebook className="w-4 h-4 text-blue-600" />;
      case "INSTAGRAM":
        return <Instagram className="w-4 h-4 text-pink-600" />;
      case "REDDIT":
        return <MessageSquare className="w-4 h-4 text-orange-600" />;
      default:
        return <Share2 className="w-4 h-4 text-indigo-600" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">
            <Share2 className="w-4 h-4" />
            Stage 14 & 15 • Multi-Channel Social Repurposing Studio
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1025] tracking-tight">
            Social Distribution & Repurposing
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Turn 1 approved article into 5 tailored social distribution assets across LinkedIn, X/Twitter, Facebook, Instagram, and Reddit with trackable UTM campaign tags.
          </p>
        </div>

        {/* Article Selector Dropdown */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <select
            value={selectedArticleId}
            onChange={(e) => {
              const art = articles.find((a) => a.id === e.target.value);
              if (art) {
                setSelectedArticleId(art.id);
                setSelectedTitle(art.title);
                setSelectedSlug(art.slug);
              }
            }}
            className="text-xs font-semibold p-3 rounded-2xl border border-slate-300 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 max-w-xs truncate"
          >
            {articles.map((art) => (
              <option key={art.id} value={art.id}>
                {art.title}
              </option>
            ))}
          </select>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-xs shadow-md hover:opacity-95 transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>Regenerate Posts</span>
          </button>
        </div>
      </div>

      {/* Social Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="flex items-center gap-2 font-bold text-sm text-[#0B1025]">
                  {getPlatformIcon(post.platform)}
                  {post.platform === "TWITTER"
                    ? "X (Twitter) Thread"
                    : post.platform === "LINKEDIN"
                    ? "LinkedIn B2B Thought Leadership"
                    : post.platform === "INSTAGRAM"
                    ? "Instagram Carousel Script"
                    : post.platform === "REDDIT"
                    ? "Reddit Value Teardown"
                    : "Facebook Community Post"}
                </span>

                <button
                  onClick={() => handleCopy(post.id, post.content_text)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                >
                  {copiedId === post.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Editable Text Area */}
              <textarea
                rows={10}
                value={post.content_text}
                onChange={(e) => {
                  const val = e.target.value;
                  setPosts((prev) =>
                    prev.map((p) => (p.id === post.id ? { ...p, content_text: val } : p))
                  );
                }}
                className="w-full text-xs font-mono p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
              />

              {/* Instagram Carousel Breakdown if present */}
              {post.slide_data && (
                <div className="p-3 rounded-xl bg-pink-50/50 border border-pink-100 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-pink-700 flex items-center gap-1">
                    <Layers className="w-3 h-3" />
                    Carousel Slide Storyboard ({post.slide_data.length} Slides)
                  </span>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {post.slide_data.map((slide: any) => (
                      <div key={slide.slideNumber} className="text-[11px] text-slate-700 bg-white p-2 rounded-lg border border-pink-100">
                        <strong>Slide {slide.slideNumber}: {slide.headline}</strong>
                        <p className="text-[10px] text-slate-500">{slide.body}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono text-[10px] truncate max-w-xs">{post.cta_url}</span>
              <span className="text-emerald-600 font-semibold">UTM Tagged</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SocialStudioPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-sm text-slate-500">Loading Social Studio...</div>}>
      <SocialStudioComponent />
    </Suspense>
  );
}
