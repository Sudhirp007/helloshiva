"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileText,
  Search,
  Plus,
  ExternalLink,
  Edit3,
  Trash2,
  Share2,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  FolderGit2,
} from "lucide-react";

interface ArticleItem {
  id: string;
  title: string;
  slug: string;
  meta_description: string;
  category: string;
  status: "DRAFT" | "DRAFT_READY" | "APPROVED" | "SCHEDULED" | "PUBLISHED";
  author: string;
  current_version: number;
  scheduled_date?: string | null;
  published_at?: string | null;
  created_at: string;
  updated_at: string;
}

export default function ArticleLibraryPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchArticles = async () => {
    try {
      const res = await fetch("/api/v1/content-intelligence/articles");
      const data = await res.json();
      if (data.success && data.articles) {
        setArticles(data.articles);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleTogglePublish = async (art: ArticleItem) => {
    const nextStatus = art.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    try {
      const res = await fetch("/api/v1/content-intelligence/articles", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: art.id, status: nextStatus }),
      });
      if (res.ok) {
        fetchArticles();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article? This action cannot be undone.")) return;
    try {
      const res = await fetch(`/api/v1/content-intelligence/articles?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchArticles();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredArticles = articles.filter((art) => {
    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "DRAFT" && (art.status === "DRAFT" || art.status === "DRAFT_READY")) ||
      art.status === statusFilter;

    const matchesQuery =
      searchQuery === "" ||
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesQuery;
  });

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">
            <FileText className="w-4 h-4" />
            Stage 11 & 12 • Central Articles Library & Master Catalog
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1025] tracking-tight">
            Article Management & Content Catalog
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Complete directory of all drafts, scheduled publications, and live published guides. Manage versioning, authorization releases, and direct social repurposing.
          </p>
        </div>

        <Link
          href="/admin/content-intelligence/editor"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-sm shadow-md hover:opacity-95 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Generate New Article</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-2 border-b sm:border-b-0 pb-2 sm:pb-0 w-full sm:w-auto overflow-x-auto">
          {[
            { label: `All Articles (${articles.length})`, val: "ALL" },
            {
              label: `Drafts (${articles.filter((a) => a.status === "DRAFT" || a.status === "DRAFT_READY").length})`,
              val: "DRAFT",
            },
            {
              label: `Scheduled (${articles.filter((a) => a.status === "SCHEDULED").length})`,
              val: "SCHEDULED",
            },
            {
              label: `Published Live (${articles.filter((a) => a.status === "PUBLISHED").length})`,
              val: "PUBLISHED",
            },
          ].map((tab) => (
            <button
              key={tab.val}
              onClick={() => setStatusFilter(tab.val)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                statusFilter === tab.val
                  ? "bg-[#0B1025] text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search articles or slugs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
          />
        </div>
      </div>

      {/* Articles List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-slate-500 text-sm">Loading articles catalog...</div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300 text-slate-500 text-sm">
            No articles found matching your criteria. Click &quot;Generate New Article&quot; to begin drafting!
          </div>
        ) : (
          filteredArticles.map((art) => (
            <div
              key={art.id}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-slate-400">
                    v{art.current_version || 1}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                      art.status === "PUBLISHED"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : art.status === "SCHEDULED"
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "bg-indigo-50 text-indigo-700 border border-indigo-200"
                    }`}
                  >
                    {art.status}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    /blog/{art.slug}
                  </span>
                </div>

                <h3 className="font-bold text-base text-[#0B1025]">
                  {art.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-1">
                  {art.meta_description}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                  <span>Category: <strong className="text-slate-600">{art.category}</strong></span>
                  <span>Author: <strong className="text-slate-600">{art.author}</strong></span>
                  {art.scheduled_date && (
                    <span className="text-amber-600 font-semibold">
                      Release: {art.scheduled_date}
                    </span>
                  )}
                  {art.published_at && (
                    <span className="text-emerald-600 font-semibold">
                      Published: {new Date(art.published_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="shrink-0 flex flex-wrap items-center gap-2">
                <button
                  onClick={() => router.push(`/admin/content-intelligence/editor?article_id=${art.id}`)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() =>
                    router.push(
                      `/admin/content-intelligence/social?article_id=${art.id}&title=${encodeURIComponent(
                        art.title
                      )}&slug=${encodeURIComponent(art.slug)}`
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-violet-50 text-violet-700 text-xs font-bold hover:bg-violet-100 transition-colors cursor-pointer"
                  title="Repurpose to Social"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Repurpose</span>
                </button>

                {art.status === "PUBLISHED" ? (
                  <>
                    <Link
                      href={`/blog/${art.slug}`}
                      target="_blank"
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-bold hover:bg-indigo-100 transition-colors"
                    >
                      <span>View Live</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>

                    <button
                      onClick={() => handleTogglePublish(art)}
                      className="px-3 py-2 rounded-xl bg-amber-50 text-amber-700 text-xs font-bold hover:bg-amber-100 transition-colors cursor-pointer"
                    >
                      Unpublish
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleTogglePublish(art)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-sm cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Publish Now</span>
                  </button>
                )}

                <button
                  onClick={() => handleDelete(art.id)}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Delete Article"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
