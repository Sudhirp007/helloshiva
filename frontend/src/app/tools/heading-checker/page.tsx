"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Sparkles, AlertCircle, CheckCircle2, HelpCircle, Layers } from "lucide-react";

interface HeadingItem {
  level: number;
  tag: string;
  text: string;
}

export default function HeadingCheckerPage() {
  const [htmlInput, setHtmlInput] = useState(
    `<!DOCTYPE html>
<html>
<body>
  <h1>Growth Marketing Agency Framework</h1>
  <p>Introductory paragraph</p>
  <h2>Core Growth Pillars</h2>
  <h3>Organic Search Strategy</h3>
  <h3>Performance Paid Acquisition</h3>
  <h2>Technical Web Architecture</h2>
  <h3>Core Web Vitals</h3>
</body>
</html>`
  );

  const analysis = useMemo(() => {
    if (!htmlInput.trim()) {
      return { headings: [], issues: [], h1Count: 0 };
    }

    const headings: HeadingItem[] = [];
    const issues: { type: "error" | "warning" | "success"; message: string }[] = [];

    // Regex match H1-H6 tags safely
    const headingRegex = /<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi;
    let match: RegExpExecArray | null;

    while ((match = headingRegex.exec(htmlInput)) !== null) {
      const level = parseInt(match[1], 10);
      const text = match[2].replace(/<[^>]*>/g, "").trim(); // Strip inner HTML
      if (text) {
        headings.push({ level, tag: `H${level}`, text });
      }
    }

    const h1Count = headings.filter((h) => h.level === 1).length;

    // Issue checks
    if (h1Count === 0) {
      issues.push({
        type: "error",
        message: "Missing <h1> tag. Every page should have exactly one clear H1 summarizing its topic.",
      });
    } else if (h1Count > 1) {
      issues.push({
        type: "warning",
        message: `Detected ${h1Count} <h1> tags. Using multiple H1s can dilute topical focus for search engines.`,
      });
    } else {
      issues.push({
        type: "success",
        message: "Perfect: Exactly one <h1> tag detected.",
      });
    }

    // Check for skipped hierarchy levels
    let previousLevel = 1;
    let hasSkippedLevels = false;

    for (let i = 0; i < headings.length; i++) {
      const currentLevel = headings[i].level;
      if (currentLevel > previousLevel + 1) {
        issues.push({
          type: "warning",
          message: `Skipped hierarchy level: <H${previousLevel}> followed directly by <H${currentLevel}> ("${headings[i].text.slice(0, 30)}...").`,
        });
        hasSkippedLevels = true;
      }
      previousLevel = currentLevel;
    }

    if (!hasSkippedLevels && headings.length > 0) {
      issues.push({
        type: "success",
        message: "Heading hierarchy flows logically without skipped levels.",
      });
    }

    return { headings, issues, h1Count };
  }, [htmlInput]);

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
            <Sparkles className="w-3.5 h-3.5" /> Free Technical & Content Tool
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#10183A]">
            Heading Structure & Hierarchy Checker
          </h1>
          <p className="text-sm text-[#626985] max-w-2xl leading-relaxed">
            Paste HTML to inspect your H1–H6 document hierarchy. Detect skipped heading levels, multiple H1s, and ensure search bots easily parse your content structure.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
        {/* Left Column: Input */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-[#E6E7F0] p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#E6E7F0] pb-3">
            <h2 className="text-base font-bold text-[#10183A]">Paste HTML or Document Markup</h2>
            <button
              onClick={() => setHtmlInput("")}
              className="text-xs text-[#626985] hover:text-[#10183A]"
            >
              Clear
            </button>
          </div>

          <textarea
            rows={14}
            value={htmlInput}
            onChange={(e) => setHtmlInput(e.target.value)}
            placeholder="Paste your HTML code here..."
            className="w-full px-4 py-3 rounded-2xl border border-[#E6E7F0] text-xs font-mono text-[#10183A] focus:outline-none focus:border-[#6366F1] transition-all"
          />

          {/* Issue Cards */}
          <div className="space-y-2 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#10183A]">
              Hierarchy Audit Summary:
            </h3>
            {analysis.issues.map((iss, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl border flex items-start gap-2.5 text-xs ${
                  iss.type === "error"
                    ? "bg-red-50 text-red-800 border-red-200"
                    : iss.type === "warning"
                    ? "bg-amber-50 text-amber-800 border-amber-200"
                    : "bg-emerald-50 text-emerald-800 border-emerald-200"
                }`}
              >
                {iss.type === "error" || iss.type === "warning" ? (
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                )}
                <span className="leading-relaxed">{iss.message}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Visual Hierarchy Tree */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-3xl border border-[#E6E7F0] p-6 sm:p-8 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-[#10183A] border-b border-[#E6E7F0] pb-3 flex items-center justify-between">
              <span>Detected Heading Tree</span>
              <span className="text-xs font-medium text-[#626985]">
                {analysis.headings.length} headings found
              </span>
            </h2>

            {analysis.headings.length === 0 ? (
              <p className="text-xs text-[#626985] py-8 text-center">
                No H1–H6 elements detected in the provided markup.
              </p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {analysis.headings.map((h, idx) => {
                  const indentPixels = (h.level - 1) * 16;
                  return (
                    <div
                      key={idx}
                      style={{ marginLeft: `${indentPixels}px` }}
                      className="p-2.5 rounded-xl bg-[#F5F4FF] border border-[#E8E7FF] flex items-center gap-2 text-xs"
                    >
                      <span
                        className={`font-black px-1.5 py-0.5 rounded text-[10px] ${
                          h.level === 1
                            ? "bg-[#6366F1] text-white"
                            : h.level === 2
                            ? "bg-[#8067FF] text-white"
                            : "bg-[#E8E7FF] text-[#10183A]"
                        }`}
                      >
                        {h.tag}
                      </span>
                      <span className="font-semibold text-[#10183A] truncate">{h.text}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Agency Cross-Sell CTA */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0B1025] to-[#171F42] text-white border border-[#252B49] flex items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold">Need Code-Level Technical SEO?</h4>
              <p className="text-xs text-[#C6C9DC] mt-0.5">Let our engineers audit your DOM tree, schemas, and Core Web Vitals.</p>
            </div>
            <Link
              href="/services/technical-seo"
              className="shrink-0 inline-flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#6366F1] to-[#8067FF] hover:opacity-90 transition-opacity"
            >
              <span>Technical SEO</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
