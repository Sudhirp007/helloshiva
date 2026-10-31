"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Sparkles,
  TrendingUp,
  Filter,
  ArrowRight,
  Plus,
  RefreshCw,
  Target,
  BarChart2,
  CheckCircle,
} from "lucide-react";

interface KeywordOpportunity {
  id: string;
  keyword: string;
  search_intent: string;
  topic_cluster: string;
  suggested_title: string;
  opportunity_explanation: string;
  competition_level: "Low" | "Medium" | "High";
  estimated_volume?: string;
  research_source: string;
  status: "DISCOVERED" | "PROMOTED_TO_BRIEF" | "DISMISSED";
  created_at: string;
}

export default function ResearchDiscoveryDesk() {
  const router = useRouter();
  const [opportunities, setOpportunities] = useState<KeywordOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [seedKeyword, setSeedKeyword] = useState("");
  const [intentFilter, setIntentFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchOpportunities = async () => {
    try {
      const res = await fetch("/api/v1/content-intelligence/research");
      const data = await res.json();
      if (data.success && data.opportunities) {
        setOpportunities(data.opportunities);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    setScanning(true);
    try {
      const res = await fetch("/api/v1/content-intelligence/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "EXPAND_SEED",
          seedKeyword: seedKeyword || "digital marketing for b2b",
        }),
      });
      const data = await res.json();
      if (data.success) {
        fetchOpportunities();
        setSeedKeyword("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setScanning(false);
    }
  };

  const handlePromoteToBrief = (opp: KeywordOpportunity) => {
    const params = new URLSearchParams({
      keyword: opp.keyword,
      title: opp.suggested_title,
      intent: opp.search_intent,
      pillar: opp.topic_cluster,
    });
    router.push(`/admin/content-intelligence/editor?${params.toString()}`);
  };

  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesIntent = intentFilter === "ALL" || opp.search_intent.toLowerCase() === intentFilter.toLowerCase();
    const matchesQuery =
      searchQuery === "" ||
      opp.keyword.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.suggested_title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesIntent && matchesQuery;
  });

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">
            <Search className="w-4 h-4" />
            Stage 1 & 2 • Research Discovery & Search Intent Radar
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1025] tracking-tight">
            Keyword Intelligence Desk
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Discover search queries with verified commercial intent. Analyze competition difficulty and promote winning keywords directly into structured editorial briefs.
          </p>
        </div>

        <form onSubmit={handleScan} className="flex items-center gap-2 max-w-md w-full">
          <input
            type="text"
            placeholder="Enter seed topic (e.g. Next.js SEO)"
            value={seedKeyword}
            onChange={(e) => setSeedKeyword(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
          />
          <button
            type="submit"
            disabled={scanning}
            className="px-5 py-2.5 rounded-2xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors shadow-sm cursor-pointer shrink-0 disabled:opacity-50 flex items-center gap-2"
          >
            {scanning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>Expand Intent</span>
          </button>
        </form>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search keywords or titles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-sm bg-transparent border-none focus:outline-none w-full sm:w-64"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          {["ALL", "Commercial", "Informational", "Transactional"].map((intent) => (
            <button
              key={intent}
              onClick={() => setIntentFilter(intent)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                intentFilter === intent
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {intent}
            </button>
          ))}
        </div>
      </div>

      {/* Opportunities List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-slate-500 text-sm">Loading discovered search queries...</div>
        ) : filteredOpportunities.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300 text-slate-500 text-sm">
            No keyword opportunities found matching your filters. Enter a seed keyword above to discover new intent clusters!
          </div>
        ) : (
          filteredOpportunities.map((opp) => (
            <div
              key={opp.id}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-sm font-extrabold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-lg">
                    {opp.keyword}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                      opp.search_intent === "Commercial"
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "bg-blue-50 text-blue-700 border border-blue-200"
                    }`}
                  >
                    {opp.search_intent} Intent
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    Cluster: {opp.topic_cluster}
                  </span>
                </div>

                <h3 className="font-bold text-base text-[#0B1025]">
                  {opp.suggested_title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {opp.opportunity_explanation}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                  <span>
                    Volume: <strong className="text-slate-700">{opp.estimated_volume || "1,200/mo"}</strong>
                  </span>
                  <span>
                    Competition: <strong className="text-slate-700">{opp.competition_level}</strong>
                  </span>
                  <span>
                    Source: <strong className="text-slate-700">{opp.research_source}</strong>
                  </span>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-3">
                <button
                  onClick={() => handlePromoteToBrief(opp)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-bold hover:opacity-95 transition-all shadow-sm cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Promote to Brief & Editor</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
