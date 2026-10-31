"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Users,
  Target,
  Sparkles,
  ArrowRight,
  RefreshCw,
  FolderSync,
} from "lucide-react";

interface AnalyticsData {
  metrics: {
    totalArticles: number;
    publishedArticles: number;
    scheduledArticles: number;
    draftArticles: number;
    totalClusters: number;
    avgCompleteness: number;
    totalClientAudits: number;
    totalLeadsGenerated: number;
  };
  decayingArticles: {
    id: string;
    title: string;
    slug: string;
    status: string;
    ageDays: number;
    needsRefresh: boolean;
    urgency: "HIGH" | "MEDIUM" | "FRESH";
  }[];
  leadAttributions: {
    id: string;
    leadName: string;
    company: string;
    service: string;
    sourcePage: string;
    utmSource: string;
    utmCampaign: string;
    createdAt: string;
  }[];
}

export default function ContentAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/content-intelligence/analytics")
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setData(res);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-12 text-center text-sm text-slate-500">Loading Analytics & Lead Attribution...</div>;
  }

  const metrics = data?.metrics;

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">
            <TrendingUp className="w-4 h-4" />
            Stage 17, 18 & 19 • Performance, Decay Alerts & Lead Attribution
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1025] tracking-tight">
            Content Intelligence Analytics
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Monitor topic cluster completeness, detect decaying content before search rankings drop, and attribute booked agency leads back to original articles.
          </p>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Published Guides</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#0B1025]">{metrics?.publishedArticles ?? 0}</div>
          <div className="text-[11px] text-slate-500">{metrics?.totalArticles ?? 0} total created</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Pillar Completeness</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600">{metrics?.avgCompleteness ?? 0}%</div>
          <div className="text-[11px] text-slate-500">Across 5 Core Pillars</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Free Tool Audits Run</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-violet-600">{metrics?.totalClientAudits ?? 0}</div>
          <div className="text-[11px] text-slate-500">Via 10 Interactive Tools</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-1">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Attributed CRM Leads</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">{metrics?.totalLeadsGenerated ?? 0}</div>
          <div className="text-[11px] text-slate-500">Qualified Service Enquiries</div>
        </div>
      </div>

      {/* Stage 18: Content Decay & Refresh Alerts */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-1">
              Stage 18 • Content Decay Radar
            </div>
            <h2 className="text-xl font-bold text-[#0B1025]">
              Decay Prevention & 90/180-Day Refresh Queue
            </h2>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-xl">
            {data?.decayingArticles.filter((a) => a.needsRefresh).length ?? 0} Need Refresh
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="pb-3 px-2">Article Title</th>
                <th className="pb-3 px-2">Publication Age</th>
                <th className="pb-3 px-2">Decay Urgency</th>
                <th className="pb-3 px-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data?.decayingArticles.map((art) => (
                <tr key={art.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-2">
                    <div className="font-bold text-slate-900">{art.title}</div>
                    <div className="text-xs text-slate-400 font-mono">/blog/{art.slug}</div>
                  </td>
                  <td className="py-4 px-2 text-xs font-semibold text-slate-700">
                    {art.ageDays} days active
                  </td>
                  <td className="py-4 px-2">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-lg ${
                        art.urgency === "HIGH"
                          ? "bg-rose-50 text-rose-700 border border-rose-200"
                          : art.urgency === "MEDIUM"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      }`}
                    >
                      {art.urgency === "HIGH"
                        ? "High (180+ Days)"
                        : art.urgency === "MEDIUM"
                        ? "Review (90+ Days)"
                        : "Fresh (< 90 Days)"}
                    </span>
                  </td>
                  <td className="py-4 px-2 text-right">
                    <Link
                      href={`/admin/content-intelligence/editor?article_id=${art.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-bold hover:bg-indigo-100 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Refresh in Studio</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stage 19: Content-to-Lead Conversion Attribution */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">
              Stage 19 • Revenue Attribution
            </div>
            <h2 className="text-xl font-bold text-[#0B1025]">
              Lead Attribution & Content Source Connection
            </h2>
          </div>
          <Link
            href="/admin/enquiries"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>Open Inquiries CRM</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="pb-3 px-2">Client / Company</th>
                <th className="pb-3 px-2">Requested Service</th>
                <th className="pb-3 px-2">Originating Source Page</th>
                <th className="pb-3 px-2">UTM Campaign</th>
                <th className="pb-3 px-2 text-right">Received Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data?.leadAttributions.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-2">
                    <div className="font-bold text-slate-900">{lead.leadName}</div>
                    <div className="text-xs text-slate-500">{lead.company}</div>
                  </td>
                  <td className="py-4 px-2 font-semibold text-indigo-700 text-xs">
                    {lead.service}
                  </td>
                  <td className="py-4 px-2 font-mono text-xs text-slate-600">
                    {lead.sourcePage || "/"}
                  </td>
                  <td className="py-4 px-2">
                    <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {lead.utmCampaign || "direct_organic"}
                    </span>
                  </td>
                  <td className="py-4 px-2 text-right text-xs text-slate-500">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
