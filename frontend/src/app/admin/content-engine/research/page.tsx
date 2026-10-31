"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Sparkles, Loader2, Plus, ArrowRight, CheckCircle2, Layers } from "lucide-react";

export default function SeoResearchDeskPage() {
  const router = useRouter();
  const [seed, setSeed] = useState("technical seo");
  const [loading, setLoading] = useState(false);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  const fetchOpportunities = async () => {
    try {
      const res = await fetch("/api/v1/content-engine/research");
      const data = await res.json();
      if (data.success) {
        setOpportunities(data.opportunities);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const handleResearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!seed.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/v1/content-engine/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seed: seed.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        fetchOpportunities();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E8E7FF] text-[#6366F1] mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          Desk 1 • OctopusOn Algorithmic Adapter
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#10183A]">
          SEO Research & Keyword Opportunity Desk
        </h1>
        <p className="text-sm text-[#626985]">
          Expand seed keywords into question modifiers, cluster them by search intent, and identify content opportunities without third-party recurring subscriptions.
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-3xl border border-[#E6E7F0] p-6 sm:p-8 shadow-sm">
        <form onSubmit={handleResearch} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            required
            value={seed}
            onChange={(e) => setSeed(e.target.value)}
            placeholder="Enter seed topic (e.g. local seo, performance marketing, core web vitals)..."
            className="flex-1 px-4 py-3 rounded-xl border border-[#E6E7F0] text-sm text-[#10183A] focus:outline-none focus:border-[#6366F1] transition-all"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-[#6366F1] to-[#8067FF] hover:from-[#5558E6] hover:to-[#7358F5] shadow-md shadow-indigo-500/20 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Clustering Keywords...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Run Keyword Discovery</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Discovered Opportunities */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-[#10183A] flex items-center justify-between border-b border-[#E6E7F0] pb-2">
          <span>Identified Keyword Opportunities</span>
          <span className="text-xs font-normal text-[#626985]">{opportunities.length} opportunities discovered</span>
        </h2>

        {opportunities.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-[#E6E7F0] space-y-2">
            <Layers className="w-10 h-10 text-[#626985]/40 mx-auto" />
            <h3 className="text-sm font-bold text-[#10183A]">No Research Generated Yet</h3>
            <p className="text-xs text-[#626985]">
              Enter a seed keyword above to execute the OctopusOn intent clustering algorithm.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {opportunities.map((opp) => (
              <div
                key={opp.id}
                className="bg-white rounded-2xl border border-[#E6E7F0] p-6 shadow-sm space-y-4 hover:border-[#6366F1]/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        opp.search_intent === "Transactional"
                          ? "bg-emerald-100 text-emerald-800"
                          : opp.search_intent === "Commercial"
                          ? "bg-indigo-100 text-indigo-800"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {opp.search_intent} Intent
                    </span>
                    <span className="text-[10px] font-semibold text-[#626985]">
                      Cluster: {opp.topic_cluster}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#10183A] leading-snug">
                    {opp.suggested_title}
                  </h3>

                  <div className="text-xs font-mono text-[#6366F1] bg-[#F5F4FF] px-2.5 py-1 rounded-md inline-block my-2">
                    Keyword: {opp.keyword}
                  </div>

                  <p className="text-xs text-[#626985] leading-relaxed">
                    {opp.opportunity_explanation}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E6E7F0] flex items-center justify-between text-xs">
                  <span className="text-[11px] text-[#626985]">{opp.research_source}</span>
                  <button
                    onClick={() => {
                      const params = new URLSearchParams({
                        headline: opp.suggested_title,
                        primaryKeyword: opp.keyword,
                        theme: opp.topic_cluster,
                        targetAudience: "Digital Marketers, Founders, and CTOs",
                        suggestedCta: "Book a Strategic SEO Architecture Audit with HelloShiva",
                      });
                      router.push(`/admin/content-engine/drafting?${params.toString()}`);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#6366F1] to-[#8067FF] hover:opacity-90 shadow-xs cursor-pointer transition-all"
                  >
                    <span>Draft & Edit Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
