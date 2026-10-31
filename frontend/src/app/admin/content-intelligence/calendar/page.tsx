"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar as CalendarIcon,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileText,
  ArrowRight,
  Plus,
  RefreshCw,
  Sliders,
} from "lucide-react";

interface CalendarEntry {
  id: string;
  brief_id?: string | null;
  article_id?: string | null;
  scheduled_date: string;
  scheduled_time?: string;
  timezone?: string;
  theme: string;
  primary_keyword: string;
  suggested_headline: string;
  search_intent: string;
  content_format: string;
  target_audience: string;
  status: string;
}

interface ContentBrief {
  id: string;
  cluster_id: string;
  title: string;
  slug: string;
  primary_keyword: string;
  search_intent: string;
  target_persona: string;
  status: "PROPOSED" | "APPROVED" | "REJECTED" | "IN_DRAFTING" | "COMPLETED";
  created_at: string;
}

export default function EditorialCalendarPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<CalendarEntry[]>([]);
  const [briefs, setBriefs] = useState<ContentBrief[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"CALENDAR" | "BRIEFS">("CALENDAR");
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    suggested_headline: "",
    scheduled_date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    scheduled_time: "10:00 AM",
    timezone: "IST (UTC+5:30)",
    theme: "Technical SEO & Web Architecture",
    primary_keyword: "",
  });

  const fetchData = async () => {
    try {
      const [calRes, briefsRes] = await Promise.all([
        fetch("/api/v1/content-intelligence/calendar"),
        fetch("/api/v1/content-intelligence/briefs"),
      ]);
      const calData = await calRes.json();
      const briefsData = await briefsRes.json();

      if (calData.success) setEntries(calData.entries);
      if (briefsData.success) setBriefs(briefsData.briefs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateBriefStatus = async (id: string, status: ContentBrief["status"]) => {
    try {
      const res = await fetch("/api/v1/content-intelligence/briefs", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSchedule.suggested_headline || !newSchedule.scheduled_date) return;

    try {
      const res = await fetch("/api/v1/content-intelligence/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSchedule),
      });
      if (res.ok) {
        setShowScheduleModal(false);
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">
            <CalendarIcon className="w-4 h-4" />
            Stage 5 & 6 • Editorial Pipeline & Scheduling Gate
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1025] tracking-tight">
            Editorial Calendar & Briefs
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Human-in-the-loop governance. Every article requires an approved editorial brief before drafting, and a scheduled release time with timezone coordination.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setShowScheduleModal(true)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 text-white font-bold text-sm shadow-md hover:bg-indigo-700 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Publication</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab("CALENDAR")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "CALENDAR"
              ? "bg-white text-indigo-600 shadow-sm border border-slate-200"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <CalendarIcon className="w-4 h-4" />
          <span>Scheduled Releases ({entries.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("BRIEFS")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "BRIEFS"
              ? "bg-white text-indigo-600 shadow-sm border border-slate-200"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Editorial Briefs Gate ({briefs.length})</span>
        </button>
      </div>

      {/* Tab: Calendar Scheduled Releases */}
      {activeTab === "CALENDAR" && (
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12 text-slate-500 text-sm">Loading calendar pipeline...</div>
          ) : entries.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300 text-slate-500 text-sm">
              No articles currently scheduled. Click &quot;Schedule Publication&quot; above to plan your content releases.
            </div>
          ) : (
            entries.map((entry) => (
              <div
                key={entry.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-1.5 font-bold text-xs text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg">
                      <Clock className="w-3.5 h-3.5" />
                      {entry.scheduled_date} • {entry.scheduled_time || "10:00 AM"} ({entry.timezone || "IST"})
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      {entry.theme}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md uppercase">
                      {entry.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-[#0B1025]">
                    {entry.suggested_headline}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <span>
                      Target Keyword: <strong className="font-mono text-slate-700">{entry.primary_keyword || "N/A"}</strong>
                    </span>
                    <span>
                      Audience: <strong className="text-slate-700">{entry.target_audience}</strong>
                    </span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-3">
                  <button
                    onClick={() => {
                      const params = new URLSearchParams({
                        headline: entry.suggested_headline,
                        keyword: entry.primary_keyword,
                      });
                      router.push(`/admin/content-intelligence/editor?${params.toString()}`);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-bold hover:opacity-95 transition-all shadow-sm cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Open in Content Studio</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab: Editorial Briefs Gate */}
      {activeTab === "BRIEFS" && (
        <div className="space-y-4">
          {briefs.map((brief) => (
            <div
              key={brief.id}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md ${
                      brief.status === "APPROVED" || brief.status === "COMPLETED"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : brief.status === "REJECTED"
                        ? "bg-rose-50 text-rose-700 border border-rose-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    Brief Status: {brief.status}
                  </span>
                  <span className="text-xs font-mono text-slate-500">
                    Keyword: {brief.primary_keyword}
                  </span>
                </div>

                <h3 className="font-bold text-base text-[#0B1025]">
                  {brief.title}
                </h3>

                <p className="text-xs text-slate-600">
                  Target Persona: {brief.target_persona} • Intent: {brief.search_intent}
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                {brief.status === "PROPOSED" && (
                  <>
                    <button
                      onClick={() => handleUpdateBriefStatus(brief.id, "APPROVED")}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors cursor-pointer"
                    >
                      Approve Brief
                    </button>
                    <button
                      onClick={() => handleUpdateBriefStatus(brief.id, "REJECTED")}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-semibold hover:bg-slate-200 transition-colors cursor-pointer"
                    >
                      Reject
                    </button>
                  </>
                )}

                <button
                  onClick={() => {
                    const params = new URLSearchParams({
                      brief_id: brief.id,
                      headline: brief.title,
                      keyword: brief.primary_keyword,
                    });
                    router.push(`/admin/content-intelligence/editor?${params.toString()}`);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-bold hover:bg-indigo-100 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Write in Studio</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl">
            <h3 className="font-bold text-lg text-slate-900">
              Schedule Article Release
            </h3>
            <form onSubmit={handleCreateSchedule} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Article Headline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. The 2026 Core Web Vitals Blueprint"
                  value={newSchedule.suggested_headline}
                  onChange={(e) => setNewSchedule({ ...newSchedule, suggested_headline: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Search Keyword</label>
                <input
                  type="text"
                  placeholder="e.g. core web vitals optimization guide"
                  value={newSchedule.primary_keyword}
                  onChange={(e) => setNewSchedule({ ...newSchedule, primary_keyword: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Scheduled Date</label>
                  <input
                    type="date"
                    required
                    value={newSchedule.scheduled_date}
                    onChange={(e) => setNewSchedule({ ...newSchedule, scheduled_date: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Release Time & Timezone</label>
                  <input
                    type="text"
                    required
                    placeholder="10:00 AM IST"
                    value={newSchedule.scheduled_time}
                    onChange={(e) => setNewSchedule({ ...newSchedule, scheduled_time: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors shadow-sm cursor-pointer"
                >
                  Add to Calendar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
