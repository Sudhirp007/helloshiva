"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Search,
  Calendar,
  FileEdit,
  CheckCircle,
  Share2,
  Clock,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Zap,
} from "lucide-react";

export default function ContentEngineOverviewPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/content-engine/overview")
      .then((res) => res.json())
      .then((d) => {
        if (d.success) setData(d);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-12 text-center text-sm text-[#626985]">Loading Content Engine Overview...</div>;
  }

  const stats = data?.stats || {};
  const integrations = data?.integrations || {};

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E8E7FF] text-[#6366F1]">
          <Sparkles className="w-3.5 h-3.5" />
          Internal Content Marketing Command Center
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#10183A]">
          Autopilot SEO & Social Distribution Engine
        </h1>
        <p className="text-sm text-[#626985]">
          Autonomous research, weekly calendar planning, AI drafting, and copy-only social distribution.
        </p>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E6E7F0] shadow-sm">
          <div className="text-2xl font-black text-[#10183A]">{stats.keywordsResearched}</div>
          <div className="text-xs font-semibold text-[#626985] mt-1">Keywords Researched</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#E6E7F0] shadow-sm">
          <div className="text-2xl font-black text-[#6366F1]">{stats.articlesPlanned}</div>
          <div className="text-xs font-semibold text-[#626985] mt-1">Articles in Calendar</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#E6E7F0] shadow-sm">
          <div className="text-2xl font-black text-[#8067FF]">{stats.draftsGenerated}</div>
          <div className="text-xs font-semibold text-[#626985] mt-1">AI Drafts Generated</div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-[#E6E7F0] shadow-sm">
          <div className="text-2xl font-black text-[#22C55E]">{stats.socialPostsPrepared}</div>
          <div className="text-xs font-semibold text-[#626985] mt-1">Social Posts Prepared</div>
        </div>
      </div>

      {/* Integration & Health Status */}
      <div className="bg-white rounded-3xl border border-[#E6E7F0] p-6 sm:p-8 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-[#10183A] border-b border-[#E6E7F0] pb-3">
          Integration Health & Security Status
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#F5F4FF] border border-[#E8E7FF] space-y-1">
            <span className="text-[11px] font-bold uppercase text-[#626985]">OctopusOn Research</span>
            <div className="text-xs font-bold text-emerald-700">{integrations.octopusOnStatus}</div>
            <p className="text-[10px] text-[#626985]">Local keyword modifiers & intent clustering</p>
          </div>

          <div className="p-4 rounded-xl bg-[#F5F4FF] border border-[#E8E7FF] space-y-1">
            <span className="text-[11px] font-bold uppercase text-[#626985]">OpenSEO Audit</span>
            <div className="text-xs font-bold text-emerald-700">{integrations.openSeoStatus}</div>
            <p className="text-[10px] text-[#626985]">Standalone code & heading rules (0 MB Redis)</p>
          </div>

          <div className="p-4 rounded-xl bg-[#F5F4FF] border border-[#E8E7FF] space-y-1">
            <span className="text-[11px] font-bold uppercase text-[#626985]">Gemini AI Engine</span>
            <div className="text-xs font-bold text-[#6366F1]">{integrations.geminiStatus}</div>
            <p className="text-[10px] text-[#626985]">Configurable in Settings</p>
          </div>

          <div className="p-4 rounded-xl bg-[#F5F4FF] border border-[#E8E7FF] space-y-1">
            <span className="text-[11px] font-bold uppercase text-[#626985]">Production Publishing</span>
            <div className="text-xs font-bold text-amber-700">{integrations.publishingMode}</div>
            <p className="text-[10px] text-[#626985]">Hard lock preventing unintended deploys</p>
          </div>
        </div>
      </div>

      {/* Quick Launchpad to Desks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/admin/content-engine/research"
          className="bg-white rounded-2xl border border-[#E6E7F0] p-6 shadow-sm hover:border-[#6366F1]/50 hover:shadow-md transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-[#6366F1]">Desk 1</span>
            <ArrowRight className="w-4 h-4 text-[#6366F1] group-hover:translate-x-1 transition-transform" />
          </div>
          <h3 className="text-base font-bold text-[#10183A]">SEO Research Desk</h3>
          <p className="text-xs text-[#626985] leading-relaxed">
            Discover related keywords, search intent classifications, and topic cluster opportunities.
          </p>
        </Link>

        <Link
          href="/admin/content-engine/calendar"
          className="bg-white rounded-2xl border border-[#E6E7F0] p-6 shadow-sm hover:border-[#6366F1]/50 hover:shadow-md transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-[#8067FF]">Desk 2</span>
            <ArrowRight className="w-4 h-4 text-[#8067FF] group-hover:translate-x-1 transition-transform" />
          </div>
          <h3 className="text-base font-bold text-[#10183A]">7-Day Editorial Calendar</h3>
          <p className="text-xs text-[#626985] leading-relaxed">
            Manage upcoming planned articles, review briefs, and load them into the drafting pipeline.
          </p>
        </Link>

        <Link
          href="/admin/content-engine/drafting"
          className="bg-white rounded-2xl border border-[#E6E7F0] p-6 shadow-sm hover:border-[#6366F1]/50 hover:shadow-md transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-[#6366F1]">Desk 3</span>
            <ArrowRight className="w-4 h-4 text-[#6366F1] group-hover:translate-x-1 transition-transform" />
          </div>
          <h3 className="text-base font-bold text-[#10183A]">AI Drafting Desk</h3>
          <p className="text-xs text-[#626985] leading-relaxed">
            Generate 1,000–1,500 word articles with Gemini, or improve existing content with side-by-side diffs.
          </p>
        </Link>
      </div>
    </div>
  );
}
