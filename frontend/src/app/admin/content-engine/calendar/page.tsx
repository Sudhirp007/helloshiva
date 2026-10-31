"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Calendar, Sparkles, RefreshCw, CheckCircle2, XCircle, ArrowRight, Loader2, FileEdit } from "lucide-react";

export default function EditorialCalendarPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);

  const fetchCalendar = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/content-engine/calendar");
      const data = await res.json();
      if (data.success) {
        setEntries(data.entries);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendar();
  }, []);

  const handleRegenerate = async () => {
    setRegenerating(true);
    try {
      const res = await fetch("/api/v1/content-engine/calendar", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setEntries(data.entries);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRegenerating(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await fetch("/api/v1/content-engine/calendar", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      fetchCalendar();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLoadBriefAndDraft = (item: any) => {
    // Navigate to drafting desk with prefilled brief parameters
    const query = new URLSearchParams({
      headline: item.suggested_headline,
      primaryKeyword: item.primary_keyword,
      theme: item.theme,
      targetAudience: item.target_audience,
      suggestedCta: item.suggested_cta,
      calendarId: item.id,
    }).toString();

    router.push(`/admin/content-engine/drafting?${query}`);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E8E7FF] text-[#6366F1] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Desk 2 • Strategic Planning
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#10183A]">
            7-Day Editorial Content Calendar
          </h1>
          <p className="text-sm text-[#626985]">
            Review planned content themes, verify competitive gap notes, and transfer approved briefs to the AI Drafting Desk.
          </p>
        </div>

        <button
          onClick={handleRegenerate}
          disabled={regenerating}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#6366F1] to-[#8067FF] hover:opacity-90 shadow-md shadow-indigo-500/20 disabled:opacity-50 transition-all cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${regenerating ? "animate-spin" : ""}`} />
          <span>Regenerate 7-Day Proposals</span>
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-[#626985] flex flex-col items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-[#6366F1]" />
          <span>Loading editorial calendar...</span>
        </div>
      ) : (
        <div className="space-y-6">
          {entries.map((item, idx) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl border border-[#E6E7F0] p-6 sm:p-8 shadow-sm space-y-5 hover:border-[#6366F1]/40 transition-colors"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E6E7F0] pb-4">
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1 rounded-xl bg-[#0B1025] text-white font-mono text-xs font-bold">
                    Day 0{idx + 1}
                  </div>
                  <span className="text-sm font-semibold text-[#10183A]">{item.scheduled_date}</span>
                  <span className="text-xs font-medium text-[#626985]">• {item.theme}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                      item.status === "APPROVED"
                        ? "bg-emerald-100 text-emerald-800"
                        : item.status === "REJECTED"
                        ? "bg-red-100 text-red-800"
                        : item.status === "IN_DRAFTING"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {item.status}
                  </span>

                  {item.status === "PROPOSED" && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(item.id, "APPROVED")}
                        className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 border border-emerald-200"
                        title="Approve Brief"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(item.id, "REJECTED")}
                        className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 border border-red-200"
                        title="Reject Proposal"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Title & Core Details */}
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-[#10183A]">
                  {item.suggested_headline}
                </h3>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="font-mono bg-[#F5F4FF] text-[#6366F1] px-2.5 py-1 rounded-md font-semibold">
                    Target: {item.primary_keyword}
                  </span>
                  <span className="bg-[#E8E7FF] text-[#8067FF] px-2.5 py-1 rounded-md font-medium">
                    Intent: {item.search_intent}
                  </span>
                  <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md">
                    Format: {item.content_format}
                  </span>
                </div>
              </div>

              {/* Competitor Gap Notes & Audience */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#F5F4FF] text-xs">
                <div>
                  <span className="font-bold text-[#10183A] block mb-1">Competitor Gap Analysis:</span>
                  <p className="text-[#626985] leading-relaxed">{item.competitor_gap_notes}</p>
                </div>
                <div>
                  <span className="font-bold text-[#10183A] block mb-1">Audience & Internal Links:</span>
                  <p className="text-[#626985] leading-relaxed">
                    Audience: {item.target_audience} <br />
                    Links to: {item.suggested_internal_links}
                  </p>
                </div>
              </div>

              {/* CTA Action */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => handleLoadBriefAndDraft(item)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#0B1025] hover:bg-[#171F42] border border-[#252B49] transition-all cursor-pointer"
                >
                  <FileEdit className="w-3.5 h-3.5 text-[#8067FF]" />
                  <span>Load Brief & Transfer to AI Drafting Desk</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
