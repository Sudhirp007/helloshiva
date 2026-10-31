"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  FileEdit,
  ExternalLink,
  Globe,
  Undo,
  Share2,
  Trash2,
  Loader2,
  Sparkles,
  CheckCircle2,
  Clock,
} from "lucide-react";

export default function ArticlesLibraryPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  const loadArticles = () => {
    setLoading(true);
    fetch("/api/v1/content-engine/articles")
      .then((res) => res.json())
      .then((d) => {
        if (d.success) setArticles(d.articles);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const handleTogglePublish = async (art: any) => {
    const nextStatus = art.status === "PUBLISHED" ? "DRAFT_READY" : "PUBLISHED";
    setActionId(art.id);
    try {
      const res = await fetch("/api/v1/content-engine/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: art.id, status: nextStatus }),
      });
      const d = await res.json();
      if (d.success) loadArticles();
    } catch (e) {
      console.error(e);
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    try {
      await fetch(`/api/v1/content-engine/articles/${id}`, { method: "DELETE" });
      loadArticles();
    } catch (e) {
      console.error(e);
    }
  };

  const handleRepurpose = (art: any) => {
    sessionStorage.setItem(
      "article_for_social",
      JSON.stringify({
        title: art.title,
        slug: art.slug,
        summary: art.meta_description || art.title,
        primaryTakeaway: "Optimized organic conversion and technical architecture.",
      })
    );
    window.location.href = "/admin/content-engine/social";
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E8E7FF] text-[#6366F1] mb-2">
            <FileText className="w-3.5 h-3.5" />
            Articles & Commercial Insights Library
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#10183A]">
            Article Management & SEO Editor Desk
          </h1>
          <p className="text-sm text-[#626985]">
            Edit published guides, review AI-generated drafts, update metadata, and control live status.
          </p>
        </div>

        <Link
          href="/admin/content-engine/drafting"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#6366F1] to-[#8067FF] hover:opacity-90 shadow-md shadow-indigo-500/25"
        >
          <span>+ Generate New Article Draft</span>
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-[#E6E7F0] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-[#E6E7F0] pb-4">
          <span className="text-xs font-bold text-[#10183A] uppercase tracking-wider">
            All Articles ({articles.length})
          </span>
          <span className="text-xs text-[#626985]">
            {articles.filter((a) => a.status === "PUBLISHED").length} Published Live
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-[#626985] flex flex-col items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-[#6366F1]" />
            <span>Loading articles...</span>
          </div>
        ) : articles.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#626985]">
            No articles found. Start by generating a draft in Desk 4.
          </div>
        ) : (
          <div className="divide-y divide-[#E6E7F0]">
            {articles.map((art) => {
              const isPub = art.status === "PUBLISHED";
              return (
                <div key={art.id} className="py-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-sm text-[#10183A]">{art.title}</span>
                      <span className="text-[10px] font-mono bg-[#F5F4FF] text-[#6366F1] px-2 py-0.5 rounded border border-[#E8E7FF]">
                        v{art.current_version || 1}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#626985]">
                      <span>ID: {art.id}</span>
                      <span>• Slug: /blog/{art.slug}</span>
                      <span>• Author: {art.author || "HelloShiva Editorial"}</span>
                    </div>

                    {art.meta_description && (
                      <p className="text-xs text-[#626985] line-clamp-1 italic">{art.meta_description}</p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                        isPub
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : "bg-purple-100 text-purple-800 border border-purple-200"
                      }`}
                    >
                      {art.status}
                    </span>

                    {/* View Live Blog */}
                    {isPub && (
                      <a
                        href={`/blog/${art.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-[#6366F1] bg-[#F5F4FF] hover:bg-[#E8E7FF] border border-[#E6E7F0]"
                      >
                        <span>View Live</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}

                    {/* Edit in Rich Editor */}
                    <Link
                      href={`/admin/content-engine/articles/${art.id}`}
                      className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-[#10183A] bg-white hover:bg-[#F5F4FF] border border-[#E6E7F0]"
                    >
                      <FileEdit className="w-3.5 h-3.5 text-[#6366F1]" />
                      <span>Edit Post</span>
                    </Link>

                    {/* Repurpose Social */}
                    <button
                      onClick={() => handleRepurpose(art)}
                      className="p-2 rounded-xl text-xs text-[#626985] hover:text-[#6366F1] hover:bg-[#F5F4FF]"
                      title="Repurpose for Social Media"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>

                    {/* Publish / Unpublish */}
                    <button
                      onClick={() => handleTogglePublish(art)}
                      disabled={actionId === art.id}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all cursor-pointer ${
                        isPub ? "bg-amber-600 hover:bg-amber-700" : "bg-gradient-to-r from-[#6366F1] to-[#8067FF]"
                      }`}
                    >
                      {actionId === art.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : isPub ? (
                        <Undo className="w-3.5 h-3.5" />
                      ) : (
                        <Globe className="w-3.5 h-3.5" />
                      )}
                      <span>{isPub ? "Unpublish" : "Publish"}</span>
                    </button>

                    <button
                      onClick={() => handleDelete(art.id)}
                      className="p-2 rounded-xl text-xs text-red-500 hover:bg-red-50"
                      title="Delete Article"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
