"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Layers,
  Sparkles,
  ArrowRight,
  Plus,
  CheckCircle2,
  Clock,
  ExternalLink,
  Target,
  Wrench,
  Search,
  RefreshCw,
  FolderPlus,
} from "lucide-react";

interface Subtopic {
  title: string;
  keyword: string;
  intent: string;
  article_id?: string;
  status: "PLANNED" | "DRAFTED" | "PUBLISHED";
}

interface TopicCluster {
  id: string;
  pillar_id: string;
  title: string;
  slug: string;
  pillar_page_headline: string;
  target_service_slug: string;
  related_free_tool_slug: string;
  subtopics: Subtopic[];
  completeness_score: number;
}

export default function TopicClustersPage() {
  const router = useRouter();
  const [clusters, setClusters] = useState<TopicCluster[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCluster, setSelectedCluster] = useState<TopicCluster | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSubtopic, setNewSubtopic] = useState({ title: "", keyword: "", intent: "Informational" });

  const fetchClusters = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/content-intelligence/clusters");
      const data = await res.json();
      if (data.success && data.clusters) {
        setClusters(data.clusters);
        setSelectedCluster(data.clusters[0] || null);
      }
    } catch (err) {
      console.error("Failed to load clusters", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClusters();
  }, []);

  const handleAddSubtopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCluster || !newSubtopic.title || !newSubtopic.keyword) return;

    const updatedSubtopics = [
      ...selectedCluster.subtopics,
      {
        title: newSubtopic.title,
        keyword: newSubtopic.keyword,
        intent: newSubtopic.intent,
        status: "PLANNED" as const,
      },
    ];

    try {
      const res = await fetch("/api/v1/content-intelligence/clusters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...selectedCluster,
          subtopics: updatedSubtopics,
        }),
      });
      if (res.ok) {
        setShowAddModal(false);
        setNewSubtopic({ title: "", keyword: "", intent: "Informational" });
        fetchClusters();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleStartBrief = (cluster: TopicCluster, subtopic?: Subtopic) => {
    const params = new URLSearchParams({
      cluster_id: cluster.id,
      target_service_slug: cluster.target_service_slug,
      related_free_tool_slug: cluster.related_free_tool_slug,
    });
    if (subtopic) {
      params.set("keyword", subtopic.keyword);
      params.set("title", subtopic.title);
      params.set("intent", subtopic.intent);
    }
    router.push(`/admin/content-intelligence/editor?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-16 text-slate-500 text-sm">
        <RefreshCw className="w-5 h-5 animate-spin mr-2 text-indigo-600" />
        Loading HelloShiva Topic Clusters & Strategy Engine...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">
            <Layers className="w-4 h-4" />
            Stage 4 • Pillar & Topic Cluster Strategy Planner
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1025] tracking-tight">
            The 5 Core Content Pillars
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Eliminate fragmented articles. Organize HelloShiva&apos;s editorial authority into 5 high-converting topic clusters. Every article strengthens topical authority, embeds a free marketing tool, and drives leads to a core agency service.
          </p>
        </div>

        <button
          onClick={() => {
            if (selectedCluster) handleStartBrief(selectedCluster);
          }}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-sm shadow-md shadow-indigo-500/20 hover:opacity-95 transition-all shrink-0 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>New Brief / Draft</span>
        </button>
      </div>

      {/* 5 Pillars Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {clusters.map((cluster) => {
          const isSelected = selectedCluster?.id === cluster.id;
          return (
            <div
              key={cluster.id}
              onClick={() => setSelectedCluster(cluster)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer text-left flex flex-col justify-between ${
                isSelected
                  ? "bg-white border-indigo-600 shadow-lg shadow-indigo-500/10 ring-2 ring-indigo-500/20"
                  : "bg-white/70 border-slate-200 hover:border-slate-300 hover:bg-white"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
                    {cluster.pillar_id.toUpperCase()}
                  </span>
                  <span className="text-xs font-extrabold text-slate-700">
                    {cluster.completeness_score}% Complete
                  </span>
                </div>

                <h3 className="font-bold text-base text-[#0B1025] leading-snug">
                  {cluster.title}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-2">
                  {cluster.pillar_page_headline}
                </p>

                {/* Progress Bar */}
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-violet-600 transition-all duration-500"
                    style={{ width: `${cluster.completeness_score}%` }}
                  />
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>{cluster.subtopics.length} Subtopics Mapped</span>
                <span className="font-semibold text-indigo-600 flex items-center gap-1">
                  View Roadmap <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Pillar Roadmap Teardown */}
      {selectedCluster && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
                Active Cluster Focus
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#0B1025]">
                {selectedCluster.title}
              </h2>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-600">
                <span className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg font-medium">
                  <Target className="w-3.5 h-3.5 text-indigo-600" />
                  Target Service: <strong className="text-slate-800">/services/{selectedCluster.target_service_slug}</strong>
                </span>
                <span className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg font-medium">
                  <Wrench className="w-3.5 h-3.5 text-violet-600" />
                  Free Tool CTA: <strong className="text-slate-800">/tools/{selectedCluster.related_free_tool_slug}</strong>
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-bold hover:bg-indigo-100 transition-colors cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Subtopic</span>
            </button>
          </div>

          {/* Subtopics Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="pb-3 px-2">Subtopic & Angle</th>
                  <th className="pb-3 px-2">Target Search Keyword</th>
                  <th className="pb-3 px-2">Intent</th>
                  <th className="pb-3 px-2">Cluster Status</th>
                  <th className="pb-3 px-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {selectedCluster.subtopics.map((sub, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-2 font-bold text-slate-900">
                      {sub.title}
                    </td>
                    <td className="py-4 px-2 font-mono text-xs text-indigo-600">
                      {sub.keyword}
                    </td>
                    <td className="py-4 px-2">
                      <span className="inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {sub.intent}
                      </span>
                    </td>
                    <td className="py-4 px-2">
                      {sub.status === "PUBLISHED" ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Published Live
                        </span>
                      ) : sub.status === "DRAFTED" ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg">
                          <Clock className="w-3.5 h-3.5 text-indigo-600" />
                          Draft Ready
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                          Planned (Gap)
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-2 text-right">
                      {sub.status === "PUBLISHED" ? (
                        <Link
                          href={`/blog/${sub.article_id ? "the-2026-core-web-vitals-blueprint" : ""}`}
                          target="_blank"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                        >
                          <span>Live URL</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      ) : (
                        <button
                          onClick={() => handleStartBrief(selectedCluster, sub)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors shadow-sm cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Draft Guide</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Subtopic Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl">
            <h3 className="font-bold text-lg text-slate-900">
              Add Subtopic to {selectedCluster?.title}
            </h3>
            <form onSubmit={handleAddSubtopic} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subtopic Title / Angle</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Next.js Schema Markup Implementation"
                  value={newSubtopic.title}
                  onChange={(e) => setNewSubtopic({ ...newSubtopic, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Keyword</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. nextjs json ld structured data"
                  value={newSubtopic.keyword}
                  onChange={(e) => setNewSubtopic({ ...newSubtopic, keyword: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Search Intent</label>
                <select
                  value={newSubtopic.intent}
                  onChange={(e) => setNewSubtopic({ ...newSubtopic, intent: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Informational">Informational</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Transactional">Transactional</option>
                  <option value="Navigational">Navigational</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-colors shadow-sm cursor-pointer"
                >
                  Save Subtopic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
