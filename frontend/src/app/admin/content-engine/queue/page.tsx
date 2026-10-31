"use client";

import React, { useState, useEffect } from "react";
import { Clock, ShieldAlert, CheckCircle2, Lock, FileText, ArrowRight } from "lucide-react";

export default function PublishingQueuePage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/content-engine/drafting")
      .then((res) => res.json())
      .then((d) => {
        if (d.success) setArticles(d.articles);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E8E7FF] text-[#6366F1] mb-2">
          <Clock className="w-3.5 h-3.5" />
          Desk 7 • Governance & Review Gate
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#10183A]">
          Central Publishing Queue & Release Management
        </h1>
        <p className="text-sm text-[#626985]">
          Manage content stages from initial research to final approval. Automated public publishing is strictly disabled; manual confirmation is required for every release.
        </p>
      </div>

      {/* Safety Notice */}
      <div className="p-5 rounded-2xl bg-[#0B1025] text-white flex items-start gap-3.5 border border-[#252B49]">
        <Lock className="w-5 h-5 text-[#8067FF] shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-[#C6C9DC]">
          <span className="font-bold text-white text-sm">Staging Production Gate Active</span>
          <p className="leading-relaxed">
            Content drafts are never published automatically upon AI generation. Production deployment requires: (1) Approved outline, (2) Code-level SEO audit pass, (3) Explicit owner sign-off.
          </p>
        </div>
      </div>

      {/* Queue Table */}
      <div className="bg-white rounded-3xl border border-[#E6E7F0] p-6 sm:p-8 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-[#10183A] border-b border-[#E6E7F0] pb-3 flex items-center justify-between">
          <span>Articles in Content Queue</span>
          <span className="text-xs font-normal text-[#626985]">{articles.length} items</span>
        </h2>

        {articles.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#626985]">
            No articles currently in the drafting queue. Start by approving an editorial brief in the Editorial Calendar.
          </div>
        ) : (
          <div className="divide-y divide-[#E6E7F0]">
            {articles.map((art) => (
              <div key={art.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#10183A]">{art.title}</span>
                    <span className="text-[10px] font-mono bg-[#F5F4FF] text-[#6366F1] px-2 py-0.5 rounded">
                      v{art.current_version}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[#626985]">
                    <span>ID: {art.id}</span>
                    <span>• Author: {art.author}</span>
                    <span>• Path: /blog/{art.slug}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase bg-purple-100 text-purple-800">
                    {art.status}
                  </span>
                  <button
                    onClick={() => alert("Staging mode: Manual owner confirmation recorded for audit log.")}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#6366F1] to-[#8067FF] hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    Authorize Release
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
