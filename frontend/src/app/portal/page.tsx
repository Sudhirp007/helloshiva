"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Download,
  BookmarkCheck,
  FileSpreadsheet,
  Clock,
  ExternalLink,
  ArrowRight,
  PhoneCall,
  User,
  LogOut,
  Search,
  CheckCircle2,
  Share2,
} from "lucide-react";

interface AuditRecord {
  id: string;
  url: string;
  tool: string;
  score: string;
  date: string;
  status: "OPTIMAL" | "NEEDS_ATTENTION";
}

const INITIAL_SAVED_AUDITS: AuditRecord[] = [
  {
    id: "aud-1",
    url: "https://helloshiva.com/services/technical-seo",
    tool: "SEO Page Analyzer",
    score: "96 / 100",
    date: "Oct 30, 2026",
    status: "OPTIMAL",
  },
  {
    id: "aud-2",
    url: "https://helloshiva.com/robots.txt",
    tool: "Robots.txt Tester",
    score: "Valid Directives",
    date: "Oct 29, 2026",
    status: "OPTIMAL",
  },
  {
    id: "aud-3",
    url: "https://helloshiva.com",
    tool: "HTTP Headers & Security Checker",
    score: "HSTS & Cache Ready",
    date: "Oct 28, 2026",
    status: "OPTIMAL",
  },
];

const UTM_PRESETS = [
  {
    title: "Google Search Ads Core Funnel",
    params: "utm_source=google&utm_medium=cpc&utm_campaign=core_search_leads&utm_term=technical_seo_agency",
    toolUrl: "/tools/utm-builder?source=google&medium=cpc&campaign=core_search_leads",
  },
  {
    title: "LinkedIn B2B Executive Thought Leadership",
    params: "utm_source=linkedin&utm_medium=paid_social&utm_campaign=b2b_executive_guide",
    toolUrl: "/tools/utm-builder?source=linkedin&medium=paid_social&campaign=b2b_executive_guide",
  },
  {
    title: "Monthly Strategy Newsletter Email",
    params: "utm_source=newsletter&utm_medium=email&utm_campaign=monthly_tech_breakdown",
    toolUrl: "/tools/utm-builder?source=newsletter&medium=email&campaign=monthly_tech_breakdown",
  },
];

export default function ClientPortalPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>({
    name: "Growth Marketer",
    email: "client@example.com",
    company: "Partner Enterprise",
  });
  const [audits, setAudits] = useState<AuditRecord[]>(INITIAL_SAVED_AUDITS);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("helloshiva_client_user");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {}
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("helloshiva_client_user");
    router.push("/login");
  };

  // Export CSV function
  const handleExportCsv = () => {
    const headers = "ID,Target URL,Tool,Score / Status,Audit Date\n";
    const rows = audits.map((a) => `"${a.id}","${a.url}","${a.tool}","${a.score}","${a.date}"`).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `helloshiva_audit_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="pt-28 pb-24 bg-light-section min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* User Welcome Banner */}
        <div className="bg-[#0B1025] rounded-3xl border border-[#252B49] p-6 sm:p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#171F42] text-[#8067FF] border border-[#252B49]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>HelloShiva Client Workspace</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Welcome back, {user.name}
            </h1>
            <p className="text-xs sm:text-sm text-[#C6C9DC]">
              Company: <span className="font-semibold text-white">{user.company}</span> • Account:{" "}
              <span className="font-mono text-[#8067FF]">{user.email}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/tools"
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#6366F1] to-[#8067FF] hover:opacity-90 shadow-md shadow-indigo-500/25 transition-all"
            >
              + Launch Free SEO Tool
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#C6C9DC] hover:text-white bg-[#171F42] hover:bg-[#252B49] border border-[#252B49] flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Saved Audits Section */}
        <div className="bg-white rounded-3xl border border-[#E6E7F0] p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E6E7F0] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <BookmarkCheck className="w-4 h-4 text-[#6366F1]" />
                <h2 className="text-base font-bold text-[#10183A]">Saved Technical Tool Audits</h2>
              </div>
              <p className="text-xs text-[#626985] mt-0.5">
                Saved historical crawls from SEO Page Analyzer, Robots.txt, and HTTP Headers.
              </p>
            </div>

            <button
              onClick={handleExportCsv}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-[#6366F1] bg-[#F5F4FF] hover:bg-[#E8E7FF] border border-[#E8E7FF] transition-all cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>{downloadSuccess ? "Report Downloaded!" : "Export All to CSV"}</span>
            </button>
          </div>

          <div className="divide-y divide-[#E6E7F0]">
            {audits.map((aud) => (
              <div key={aud.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#10183A]">{aud.tool}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {aud.score}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-[#626985] flex items-center gap-2">
                    <span>{aud.url}</span>
                    <span>•</span>
                    <span className="font-sans text-[11px]">{aud.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/tools/seo-page-analyzer?url=${encodeURIComponent(aud.url)}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#10183A] hover:bg-[#F5F4FF] border border-[#E6E7F0]"
                  >
                    <span>Re-Audit</span>
                    <ExternalLink className="w-3 h-3 text-[#6366F1]" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Saved UTM Presets Section */}
        <div className="bg-white rounded-3xl border border-[#E6E7F0] p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-[#E6E7F0] pb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#8067FF]" />
              <h2 className="text-base font-bold text-[#10183A]">Saved UTM Campaign Presets</h2>
            </div>
            <p className="text-xs text-[#626985] mt-0.5">
              Standardized attribution templates to eliminate messy tracking links across ad platforms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {UTM_PRESETS.map((preset, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#F5F4FF] border border-[#E8E7FF] flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-[#10183A]">{preset.title}</h3>
                  <code className="block p-2 rounded-lg bg-white border border-[#E6E7F0] text-[10px] font-mono text-[#626985] break-all">
                    {preset.params}
                  </code>
                </div>

                <Link
                  href={preset.toolUrl}
                  className="inline-flex items-center justify-between text-xs font-bold text-[#6366F1] hover:underline pt-2 border-t border-[#E8E7FF]"
                >
                  <span>Open in UTM Builder</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Consultation Banner */}
        <div className="bg-[#0B1025] rounded-3xl p-8 sm:p-10 text-white border border-[#252B49] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
              <PhoneCall className="w-4 h-4" />
              <span>HelloShiva Priority Client Line</span>
            </div>
            <h3 className="text-xl font-extrabold text-white">
              Need custom technical SEO engineering or PPC management?
            </h3>
            <p className="text-xs sm:text-sm text-[#C6C9DC] max-w-xl">
              As a registered portal member, your inquiries skip the standard intake queue and route directly to senior growth strategists.
            </p>
          </div>

          <Link
            href="/contact"
            className="shrink-0 px-6 py-3.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-[#6366F1] to-[#8067FF] hover:opacity-90 shadow-lg shadow-indigo-500/25 transition-all"
          >
            Request Strategic Proposal &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
