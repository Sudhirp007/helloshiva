"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Share2,
  Sparkles,
  Copy,
  Check,
  ArrowRight,
  ShieldCheck,
  Layers,
  FolderOpen,
  Loader2,
  FileEdit,
  Send,
  ExternalLink,
} from "lucide-react";

export default function SocialDistributionDeskPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [selectedArticleId, setSelectedArticleId] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [loadingArticles, setLoadingArticles] = useState(true);

  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [savedStatus, setSavedStatus] = useState<string>("");

  // Load articles on mount
  useEffect(() => {
    fetch("/api/v1/content-engine/articles")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.articles.length > 0) {
          setArticles(data.articles);

          // Check if session storage passed a specific article
          const savedInSession = sessionStorage.getItem("article_for_social");
          if (savedInSession) {
            try {
              const parsed = JSON.parse(savedInSession);
              const match = data.articles.find((a: any) => a.slug === parsed.slug || a.title === parsed.title);
              if (match) {
                setSelectedArticleId(match.id);
                setSelectedArticle(match);
                return;
              }
            } catch {}
          }

          // Otherwise default to first article
          setSelectedArticleId(data.articles[0].id);
          setSelectedArticle(data.articles[0]);
        }
      })
      .finally(() => setLoadingArticles(false));
  }, []);

  const handleSelectArticle = (id: string) => {
    setSelectedArticleId(id);
    const found = articles.find((a) => a.id === id);
    if (found) {
      setSelectedArticle(found);
      setPosts([]); // Reset generated posts for new article
    }
  };

  const handleGenerateSocial = async () => {
    if (!selectedArticle) return;
    setLoading(true);
    try {
      const res = await fetch("/api/v1/content-engine/social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: selectedArticle.title,
          slug: selectedArticle.slug,
          summary: selectedArticle.meta_description || selectedArticle.title,
          primaryTakeaway: "Optimized organic conversion and technical architecture.",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPosts(data.posts);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2500);
  };

  const handlePostTextChange = (idx: number, newText: string) => {
    const updated = [...posts];
    updated[idx].contentText = newText;
    setPosts(updated);
  };

  return (
    <div className="space-y-8 font-sans max-w-full">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E8E7FF] text-[#6366F1] mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          Desk 4 • Multi-Channel Social Repurposing
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#10183A]">
          Social Media Content Repurposing Desk
        </h1>
        <p className="text-sm text-[#626985]">
          Select any article from your library, generate platform-adapted distribution copy for 5 core channels, edit the text freely, and copy or schedule for distribution.
        </p>
      </div>

      {/* Article Selector & Generation Card */}
      <div className="bg-white rounded-3xl border border-[#E6E7F0] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-2 border-b border-[#E6E7F0] pb-3">
          <FolderOpen className="w-4 h-4 text-[#6366F1]" />
          <h2 className="text-sm font-bold text-[#10183A]">
            1. Select Article from Library to Repurpose
          </h2>
        </div>

        {loadingArticles ? (
          <div className="p-4 text-xs text-[#626985] flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-[#6366F1]" />
            <span>Loading articles from library...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            <div className="md:col-span-8 space-y-1.5">
              <label className="block text-xs font-semibold text-[#10183A]">
                Choose Source Article:
              </label>
              <select
                value={selectedArticleId}
                onChange={(e) => handleSelectArticle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#E6E7F0] text-xs font-semibold text-[#10183A] bg-white focus:outline-none focus:border-[#6366F1]"
              >
                {articles.map((art) => (
                  <option key={art.id} value={art.id}>
                    [{art.status}] {art.title} (/blog/{art.slug})
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-4">
              <button
                onClick={handleGenerateSocial}
                disabled={loading || !selectedArticle}
                className="w-full py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-[#6366F1] to-[#8067FF] hover:opacity-90 shadow-md shadow-indigo-500/20 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Generating 5 Channels...</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4" />
                    <span>Generate 5-Channel Distribution</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {selectedArticle && (
          <div className="p-4 rounded-2xl bg-[#F5F4FF] border border-[#E8E7FF] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <span className="font-bold text-[#10183A]">Active Target: {selectedArticle.title}</span>
              <div className="text-[#626985] font-mono text-[11px]">
                https://helloshiva.com/blog/{selectedArticle.slug}
              </div>
            </div>
            <Link
              href={`/admin/content-engine/articles/${selectedArticle.id}`}
              className="inline-flex items-center gap-1 font-semibold text-[#6366F1] hover:underline"
            >
              <span>Edit Article</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>

      {/* Generated Channels Grid */}
      {posts.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#E6E7F0] pb-2">
            <h2 className="text-sm font-bold text-[#10183A]">
              2. Review & Edit Platform-Adapted Content (5 Channels)
            </h2>
            <span className="text-xs text-[#626985]">Copy-ready or edit directly below</span>
          </div>

          <div className="space-y-6">
            {posts.map((post, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl border border-[#E6E7F0] p-6 sm:p-8 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E6E7F0] pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-[#0B1025] text-white flex items-center justify-center font-bold text-xs">
                      {post.platform === "TWITTER" ? "X" : post.platform[0]}
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-[#10183A]">{post.platformName}</h3>
                      <span className="text-[10px] text-[#626985] font-mono">Format: {post.platform}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCopy(post.contentText, idx)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#0B1025] hover:bg-[#171F42] transition-all cursor-pointer shadow-xs"
                  >
                    {copiedIdx === idx ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Post</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Editable Text Area for each post */}
                <div>
                  <label className="block text-[11px] font-bold text-[#626985] uppercase mb-1">
                    Editable Post Copy:
                  </label>
                  <textarea
                    rows={7}
                    value={post.contentText}
                    onChange={(e) => handlePostTextChange(idx, e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-[#0B1025] text-[#C6C9DC] font-sans text-xs leading-relaxed focus:outline-none border border-[#252B49]"
                  />
                </div>

                {/* Hashtags pill */}
                {post.hashtags && post.hashtags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] font-bold text-[#626985]">Tags:</span>
                    {post.hashtags.map((tag: string, tIdx: number) => (
                      <span
                        key={tIdx}
                        className="text-[10px] text-[#6366F1] bg-[#F5F4FF] px-2 py-0.5 rounded-md border border-[#E8E7FF]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
