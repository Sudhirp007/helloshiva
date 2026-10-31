"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Clock,
  Lock,
  Globe,
  FileEdit,
  ExternalLink,
  Share2,
  CheckCircle2,
  Loader2,
  Undo,
  Trash2,
  ArrowRight,
} from "lucide-react";

export default function PublishingQueuePage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"ALL" | "DRAFTS" | "PUBLISHED">("ALL");
  const [notification, setNotification] = useState<string>("");

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

  const handlePublishToggle = async (art: any) => {
    const nextStatus = art.status === "PUBLISHED" ? "DRAFT_READY" : "PUBLISHED";
    setActionLoadingId(art.id);
    try {
      const res = await fetch("/api/v1/content-engine/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: art.id, status: nextStatus }),
      });
      const d = await res.json();
      if (d.success) {
        setNotification(
          nextStatus === "PUBLISHED"
            ? `🚀 "${art.title}" is now LIVE on helloshiva.com/blog/${art.slug}`
            : `"${art.title}" reverted to draft.`
        );
        loadArticles();
        setTimeout(() => setNotification(""), 5000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoadingId(null);
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

  const filteredArticles = articles.filter((a) => {
    if (filter === "DRAFTS") return a.status !== "PUBLISHED";
    if (filter === "PUBLISHED") return a.status === "PUBLISHED";
    return true;
  });

  return (
    <div className="space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E8E7FF] text-[#6366F1] mb-2">
          <Clock className="w-3.5 h-3.5" />
          Desk 7 • Release Governance & Production Publishing Gate
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#10183A]">
          Central Publishing Queue & Release Management
        </h1>
        <p className="text-sm text-[#626985]">
          Manage content stages from initial draft to final release. Click &quot;Authorize Release&quot; to publish articles live to the public blog at <code className="bg-[#F5F4FF] px-1.5 py-0.5 rounded text-[#6366F1]">/blog/[slug]</code>.
        </p>
      </div>

      {notification && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification("")} className="text-emerald-700 hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Safety Notice */}
      <div className="p-5 rounded-2xl bg-[#0B1025] text-white flex items-start gap-3.5 border border-[#252B49]">
        <Lock className="w-5 h-5 text-[#8067FF] shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-[#C6C9DC]">
          <span className="font-bold text-white text-sm">Two-Factor Owner Release Gate</span>
          <p className="leading-relaxed">
            AI content generation never writes directly to public search indexes. Production deployment requires explicit manual owner authorization. Once authorized, articles immediately render on <code className="text-[#8067FF]">helloshiva.com/blog</code> and homepage featured insights.
          </p>
        </div>
      </div>

      {/* Queue Table */}
      <div className="bg-white rounded-3xl border border-[#E6E7F0] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6E7F0] pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter("ALL")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filter === "ALL" ? "bg-[#0B1025] text-white" : "text-[#626985] hover:bg-[#F5F4FF]"
              }`}
            >
              All Articles ({articles.length})
            </button>
            <button
              onClick={() => setFilter("DRAFTS")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filter === "DRAFTS" ? "bg-[#0B1025] text-white" : "text-[#626985] hover:bg-[#F5F4FF]"
              }`}
            >
              Drafts ({articles.filter((a) => a.status !== "PUBLISHED").length})
            </button>
            <button
              onClick={() => setFilter("PUBLISHED")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filter === "PUBLISHED" ? "bg-emerald-600 text-white" : "text-[#626985] hover:bg-[#F5F4FF]"
              }`}
            >
              Live on Blog ({articles.filter((a) => a.status === "PUBLISHED").length})
            </button>
          </div>

          <Link
            href="/admin/content-engine/drafting"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#6366F1] to-[#8067FF] hover:opacity-90"
          >
            <span>+ Create New Draft</span>
          </Link>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-[#626985] flex flex-col items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-[#6366F1]" />
            <span>Loading publishing queue...</span>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="p-10 text-center text-xs text-[#626985]">
            No articles match the current filter. Create a draft or adjust filter above.
          </div>
        ) : (
          <div className="divide-y divide-[#E6E7F0]">
            {filteredArticles.map((art) => {
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
                      <span>• Author: {art.author || "HelloShiva Editorial"}</span>
                      <span>
                        • Path:{" "}
                        <code className="text-[#6366F1] font-mono">/blog/{art.slug}</code>
                      </span>
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

                    {/* View Live Blog Link */}
                    {isPub && (
                      <a
                        href={`/blog/${art.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-[#6366F1] bg-[#F5F4FF] hover:bg-[#E8E7FF] border border-[#E6E7F0] transition-all"
                        title="Open live post"
                      >
                        <span>View Live</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}

                    {/* Edit in Rich Editor */}
                    <Link
                      href={`/admin/content-engine/articles/${art.id}`}
                      className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-[#10183A] bg-white hover:bg-[#F5F4FF] border border-[#E6E7F0] transition-all"
                    >
                      <FileEdit className="w-3.5 h-3.5 text-[#6366F1]" />
                      <span>Edit Post</span>
                    </Link>

                    {/* Repurpose Social */}
                    <button
                      onClick={() => handleRepurpose(art)}
                      className="p-2 rounded-xl text-xs text-[#626985] hover:text-[#6366F1] hover:bg-[#F5F4FF] transition-all"
                      title="Repurpose for Social Media"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>

                    {/* Authorize Release / Unpublish Button */}
                    <button
                      onClick={() => handlePublishToggle(art)}
                      disabled={actionLoadingId === art.id}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all cursor-pointer ${
                        isPub
                          ? "bg-amber-600 hover:bg-amber-700"
                          : "bg-gradient-to-r from-[#6366F1] to-[#8067FF] hover:opacity-90 shadow-md shadow-indigo-500/20"
                      }`}
                    >
                      {actionLoadingId === art.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : isPub ? (
                        <Undo className="w-3.5 h-3.5" />
                      ) : (
                        <Globe className="w-3.5 h-3.5" />
                      )}
                      <span>{isPub ? "Revert to Draft" : "Authorize Release"}</span>
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
