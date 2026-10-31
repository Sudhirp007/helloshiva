"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Sparkles, AlertTriangle, CheckCircle2, RotateCcw } from "lucide-react";

const commonStopWords = new Set([
  "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't",
  "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "can",
  "can't", "cannot", "could", "couldn't", "did", "didn't", "do", "does", "doesn't", "doing", "don't",
  "down", "during", "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't", "have",
  "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself", "him",
  "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "isn't",
  "it", "it's", "its", "itself", "let's", "me", "more", "most", "mustn't", "my", "myself", "no", "nor",
  "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out",
  "over", "own", "same", "shan't", "she", "she'd", "she'll", "she's", "should", "shouldn't", "so", "some",
  "such", "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then", "there", "there's",
  "these", "they", "they'd", "they'll", "they're", "they've", "this", "those", "through", "to", "too",
  "under", "until", "up", "very", "was", "wasn't", "we", "we'd", "we'll", "we're", "we've", "were", "weren't",
  "what", "what's", "when", "when's", "where", "where's", "which", "while", "who", "who's", "whom", "why",
  "why's", "with", "won't", "would", "wouldn't", "you", "you'd", "you'll", "you're", "you've", "your",
  "yours", "yourself", "yourselves"
]);

export default function KeywordDensityCheckerPage() {
  const [text, setText] = useState(
    `Digital marketing strategy requires a balance between organic search engine optimization and performance advertising. SEO services build compounding visibility over time, while performance marketing delivers immediate qualified traffic. A modern marketing agency should integrate both channels with technical web engineering to achieve sustainable revenue growth.`
  );
  const [minWordLength, setMinWordLength] = useState<number>(3);
  const [filterStopWords, setFilterStopWords] = useState<boolean>(true);
  const [ngramMode, setNgramMode] = useState<1 | 2 | 3>(1);

  const stats = useMemo(() => {
    if (!text.trim()) {
      return { totalWords: 0, uniqueWords: 0, readingTimeMin: 0, items: [] };
    }

    // Clean text into tokens
    const rawTokens = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 0);

    const totalWords = rawTokens.length;
    const readingTimeMin = Math.ceil(totalWords / 200);

    // Build n-grams
    const counts: Record<string, number> = {};

    if (ngramMode === 1) {
      for (const word of rawTokens) {
        if (word.length < minWordLength) continue;
        if (filterStopWords && commonStopWords.has(word)) continue;
        counts[word] = (counts[word] || 0) + 1;
      }
    } else if (ngramMode === 2) {
      for (let i = 0; i < rawTokens.length - 1; i++) {
        const w1 = rawTokens[i];
        const w2 = rawTokens[i + 1];
        if (filterStopWords && (commonStopWords.has(w1) || commonStopWords.has(w2))) continue;
        const phrase = `${w1} ${w2}`;
        counts[phrase] = (counts[phrase] || 0) + 1;
      }
    } else {
      for (let i = 0; i < rawTokens.length - 2; i++) {
        const w1 = rawTokens[i];
        const w2 = rawTokens[i + 1];
        const w3 = rawTokens[i + 2];
        if (filterStopWords && commonStopWords.has(w1) && commonStopWords.has(w3)) continue;
        const phrase = `${w1} ${w2} ${w3}`;
        counts[phrase] = (counts[phrase] || 0) + 1;
      }
    }

    const items = Object.entries(counts)
      .map(([keyword, count]) => {
        const density = totalWords > 0 ? (count / totalWords) * 100 : 0;
        return { keyword, count, density: Number(density.toFixed(2)) };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 15);

    return {
      totalWords,
      uniqueWords: Object.keys(counts).length,
      readingTimeMin,
      items,
    };
  }, [text, minWordLength, filterStopWords, ngramMode]);

  return (
    <div className="pt-28 pb-20 bg-light-section min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <Link
          href="/tools"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6366F1] hover:text-[#8067FF] mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to all 10 free tools
        </Link>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E8E7FF] text-[#6366F1]">
            <Sparkles className="w-3.5 h-3.5" /> Free Content & Keyword Tool
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#10183A]">
            Keyword Density & Frequency Checker
          </h1>
          <p className="text-sm text-[#626985] max-w-2xl leading-relaxed">
            Analyze article copy for single words and multi-word phrases. Filter common stop words, evaluate density ratios, and prevent keyword stuffing penalties.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
        {/* Left Column: Text Input & Controls */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#E6E7F0] p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-[#E6E7F0] pb-3">
            <h2 className="text-base font-bold text-[#10183A]">Article / Copy Text</h2>
            <button
              onClick={() => setText("")}
              className="text-xs text-[#626985] hover:text-[#10183A] flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>

          <textarea
            rows={10}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your article or copy here..."
            className="w-full px-4 py-3 rounded-2xl border border-[#E6E7F0] text-sm text-[#10183A] focus:outline-none focus:border-[#6366F1] transition-all font-mono leading-relaxed"
          />

          {/* Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-[#E6E7F0]">
            <div>
              <label className="block text-[11px] font-semibold text-[#10183A] mb-1">
                Phrase Length:
              </label>
              <div className="flex rounded-lg border border-[#E6E7F0] overflow-hidden text-xs">
                {([1, 2, 3] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setNgramMode(m)}
                    className={`flex-1 py-1.5 font-medium transition-colors ${
                      ngramMode === m ? "bg-[#6366F1] text-white" : "bg-white text-[#626985] hover:bg-[#F5F4FF]"
                    }`}
                  >
                    {m === 1 ? "1-Word" : m === 2 ? "2-Words" : "3-Words"}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#10183A] mb-1">
                Min. Word Length:
              </label>
              <select
                value={minWordLength}
                onChange={(e) => setMinWordLength(Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-lg border border-[#E6E7F0] text-xs text-[#10183A] bg-white"
              >
                <option value={2}>2+ chars</option>
                <option value={3}>3+ chars (Default)</option>
                <option value={4}>4+ chars</option>
                <option value={5}>5+ chars</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#10183A] mb-1">
                Stop Words Filter:
              </label>
              <button
                onClick={() => setFilterStopWords(!filterStopWords)}
                className={`w-full py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                  filterStopWords
                    ? "bg-[#E8E7FF] text-[#6366F1] border-[#6366F1]/30"
                    : "bg-white text-[#626985] border-[#E6E7F0]"
                }`}
              >
                {filterStopWords ? "Enabled (Ignore 'the, is...')" : "Disabled"}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Density Analysis Table */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-[#E6E7F0] text-center shadow-xs">
              <div className="text-xl font-black text-[#10183A]">{stats.totalWords}</div>
              <div className="text-[10px] text-[#626985] font-semibold uppercase mt-0.5">Total Words</div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-[#E6E7F0] text-center shadow-xs">
              <div className="text-xl font-black text-[#10183A]">{stats.uniqueWords}</div>
              <div className="text-[10px] text-[#626985] font-semibold uppercase mt-0.5">Unique Terms</div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-[#E6E7F0] text-center shadow-xs">
              <div className="text-xl font-black text-[#10183A]">{stats.readingTimeMin}m</div>
              <div className="text-[10px] text-[#626985] font-semibold uppercase mt-0.5">Read Time</div>
            </div>
          </div>

          {/* Keyword Frequency Table */}
          <div className="bg-white rounded-3xl border border-[#E6E7F0] p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#10183A] border-b border-[#E6E7F0] pb-2 flex items-center justify-between">
              <span>Top Keyword Distribution</span>
              <span className="text-[10px] font-normal text-[#626985]">Recommended &lt; 3.0%</span>
            </h3>

            {stats.items.length === 0 ? (
              <p className="text-xs text-[#626985] py-8 text-center">
                Paste text above to view keyword frequency and density metrics.
              </p>
            ) : (
              <div className="divide-y divide-[#E6E7F0] max-h-80 overflow-y-auto pr-1">
                {stats.items.map((item, idx) => {
                  const isHighDensity = item.density > 3.5;
                  return (
                    <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 max-w-[200px] truncate">
                        <span className="text-[10px] font-bold text-[#C6C9DC] w-4">{idx + 1}.</span>
                        <span className="font-semibold text-[#10183A] truncate">{item.keyword}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[#626985]">{item.count}x</span>
                        <span
                          className={`font-bold px-2 py-0.5 rounded-md text-[11px] ${
                            isHighDensity
                              ? "bg-amber-100 text-amber-800"
                              : "bg-[#F5F4FF] text-[#6366F1]"
                          }`}
                        >
                          {item.density}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Agency Cross-Sell CTA */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0B1025] to-[#171F42] text-white border border-[#252B49] flex items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold">Struggling with Search Intent & Rankings?</h4>
              <p className="text-xs text-[#C6C9DC] mt-0.5">Let HelloShiva craft data-backed, high-converting content strategies.</p>
            </div>
            <Link
              href="/services/content-marketing"
              className="shrink-0 inline-flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#6366F1] to-[#8067FF] hover:opacity-90 transition-opacity"
            >
              <span>Content Services</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
