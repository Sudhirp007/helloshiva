"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar as CalendarIcon,
  Sparkles,
  Clock,
  Globe,
  FileEdit,
  ExternalLink,
  CheckCircle2,
  Loader2,
  ArrowRight,
  FolderOpen,
} from "lucide-react";

export default function EditorialCalendarPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadArticles = () => {
    setLoading(true);
    fetch("/api/v1/content-engine/articles")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setArticles(data.articles);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const handleUpdateScheduleDate = async (articleId: string, newDate: string) => {
    setUpdatingId(articleId);
    try {
      await fetch(`/api/v1/content-engine/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: articleId,
          status: "SCHEDULED",
          scheduled_date: newDate,
        }),
      });
      loadArticles();
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingId(null);
    }
  };

  const handlePublishNow = async (articleId: string) => {
    setUpdatingId(articleId);
    try {
      await fetch(`/api/v1/content-engine/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: articleId,
          status: "PUBLISHED",
        }),
      });
      loadArticles();
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingId(null);
    }
  };

  // Group into Scheduled, Published, and Drafts awaiting schedule
  const scheduledArticles = articles
    .filter((a) => a.status === "SCHEDULED" || a.scheduled_date)
    .sort((a, b) => (a.scheduled_date || "").localeCompare(b.scheduled_date || ""));

  const publishedArticles = articles.filter((a) => a.status === "PUBLISHED");
  const draftArticles = articles.filter((a) => a.status === "DRAFT_READY" && !a.scheduled_date);

  return (
    <div className="space-y-8 font-sans max-w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E8E7FF] text-[#6366F1] mb-2">
            <CalendarIcon className="w-3.5 h-3.5" />
            Desk 5 • Editorial Calendar & Publication Schedule
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#10183A]">
            Publication Schedule & Release Timeline
          </h1>
          <p className="text-sm text-[#626985]">
            Manage future release dates for completed articles. Schedule publication dates, reschedule timeline slots, or trigger immediate release.
          </p>
        </div>

        <Link
          href="/admin/content-engine/drafting"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#6366F1] to-[#8067FF] hover:opacity-90 shadow-md shadow-indigo-500/20"
        >
          <span>+ Create New Draft</span>
        </Link>
      </div>

      {/* Scheduled Articles Timeline */}
      <div className="bg-white rounded-3xl border border-[#E6E7F0] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-[#E6E7F0] pb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-[#10183A]">
              Upcoming Scheduled Publications ({scheduledArticles.length})
            </h2>
          </div>
          <span className="text-xs text-[#626985]">Target release order</span>
        </div>

        {loading ? (
          <div className="p-10 text-center text-xs text-[#626985] flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-[#6366F1]" />
            <span>Loading schedule...</span>
          </div>
        ) : scheduledArticles.length === 0 ? (
          <div className="p-8 text-center bg-[#F5F4FF] rounded-2xl border border-[#E8E7FF] space-y-2">
            <CalendarIcon className="w-8 h-8 text-[#6366F1] mx-auto" />
            <h3 className="text-xs font-bold text-[#10183A]">No Articles Currently Scheduled</h3>
            <p className="text-xs text-[#626985] max-w-md mx-auto">
              To schedule an article, open any draft in the Studio and click &quot;Schedule Release&quot;, or assign a date below.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#E6E7F0]">
            {scheduledArticles.map((art) => (
              <div
                key={art.id}
                className="py-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200 flex items-center gap-1.5">
                      <CalendarIcon className="w-3.5 h-3.5" />
                      <span>{art.scheduled_date || "Date not set"}</span>
                    </span>
                    <span className="font-bold text-sm text-[#10183A]">{art.title}</span>
                  </div>

                  <div className="text-xs text-[#626985] font-mono flex items-center gap-2">
                    <span>/blog/{art.slug}</span>
                    <span>•</span>
                    <span className="font-sans text-[11px]">{art.category || "Technical SEO"}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Reschedule Date Picker */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-[#626985]">Reschedule:</span>
                    <input
                      type="date"
                      defaultValue={art.scheduled_date || ""}
                      onChange={(e) => handleUpdateScheduleDate(art.id, e.target.value)}
                      className="px-2.5 py-1.5 rounded-lg border border-[#E6E7F0] text-xs font-mono text-[#10183A]"
                    />
                  </div>

                  {/* Edit Post */}
                  <Link
                    href={`/admin/content-engine/articles/${art.id}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-[#10183A] bg-[#F5F4FF] hover:bg-[#E8E7FF]"
                  >
                    <FileEdit className="w-3.5 h-3.5 text-[#6366F1]" />
                    <span>Edit</span>
                  </Link>

                  {/* Publish Now Button */}
                  <button
                    onClick={() => handlePublishNow(art.id)}
                    disabled={updatingId === art.id}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#6366F1] to-[#8067FF] hover:opacity-90 cursor-pointer shadow-xs"
                  >
                    {updatingId === art.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Globe className="w-3.5 h-3.5" />
                    )}
                    <span>Publish Now</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Unscheduled Drafts Ready for Planning */}
      {draftArticles.length > 0 && (
        <div className="bg-white rounded-3xl border border-[#E6E7F0] p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#E6E7F0] pb-3">
            <h2 className="text-sm font-bold text-[#10183A]">
              Draft Articles Ready to Schedule ({draftArticles.length})
            </h2>
            <span className="text-xs text-[#626985]">Assign target release date</span>
          </div>

          <div className="divide-y divide-[#E6E7F0]">
            {draftArticles.map((art) => (
              <div
                key={art.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <h3 className="text-xs font-bold text-[#10183A]">{art.title}</h3>
                  <div className="text-[11px] text-[#626985] font-mono">/blog/{art.slug}</div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-[#626985]">Set Date:</span>
                    <input
                      type="date"
                      onChange={(e) => handleUpdateScheduleDate(art.id, e.target.value)}
                      className="px-2.5 py-1.5 rounded-lg border border-[#E6E7F0] text-xs font-mono text-[#10183A]"
                    />
                  </div>

                  <Link
                    href={`/admin/content-engine/articles/${art.id}`}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold text-[#6366F1] bg-[#F5F4FF] hover:bg-[#E8E7FF]"
                  >
                    Open Editor &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Live Published Articles Section */}
      <div className="bg-white rounded-3xl border border-[#E6E7F0] p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#E6E7F0] pb-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <h2 className="text-sm font-bold text-[#10183A]">
              Published Live on helloshiva.com/blog ({publishedArticles.length})
            </h2>
          </div>
          <a
            href="/blog"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-[#6366F1] hover:underline flex items-center gap-1"
          >
            <span>Visit Public Blog</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="divide-y divide-[#E6E7F0]">
          {publishedArticles.map((art) => (
            <div
              key={art.id}
              className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-0.5">
                <span className="font-bold text-[#10183A]">{art.title}</span>
                <div className="text-[11px] text-[#626985] font-mono">/blog/{art.slug}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  LIVE
                </span>
                <a
                  href={`/blog/${art.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold text-[#6366F1] bg-[#F5F4FF] hover:bg-[#E8E7FF]"
                >
                  View Post ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
