"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Sparkles, Copy, Check, ArrowUpDown, RotateCcw, AlertCircle } from "lucide-react";

export default function UrlEncoderDecoderPage() {
  const [input, setInput] = useState("https://helloshiva.com/search?query=digital marketing & SEO services! &category=tech");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  // Process live
  const handleProcess = (val: string, currentMode: "encode" | "decode") => {
    setInput(val);
    setError("");
    if (!val) {
      setOutput("");
      return;
    }

    try {
      if (currentMode === "encode") {
        setOutput(encodeURIComponent(val));
      } else {
        setOutput(decodeURIComponent(val));
      }
    } catch (err: any) {
      setError("Malformed URI sequence: Unable to decode input.");
      setOutput("");
    }
  };

  const toggleMode = () => {
    const newMode = mode === "encode" ? "decode" : "encode";
    setMode(newMode);
    // Swap input and output
    if (output) {
      setInput(output);
      handleProcess(output, newMode);
    } else {
      handleProcess(input, newMode);
    }
  };

  const handleCopy = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

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
            <Sparkles className="w-3.5 h-3.5" /> Free Web & URI Utility
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#10183A]">
            URL Encoder & Decoder
          </h1>
          <p className="text-sm text-[#626985] max-w-2xl leading-relaxed">
            Encode special characters, query parameters, and Unicode paths into RFC 3986 percent-encoded strings, or decode encoded strings back to human-readable format.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
        {/* Main Workspace */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-[#E6E7F0] p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E6E7F0] pb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#10183A]">Current Mode:</span>
              <div className="flex rounded-xl bg-[#F5F4FF] p-1 border border-[#E8E7FF]">
                <button
                  onClick={() => {
                    setMode("encode");
                    handleProcess(input, "encode");
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    mode === "encode" ? "bg-white text-[#6366F1] shadow-xs" : "text-[#626985]"
                  }`}
                >
                  Encode URL
                </button>
                <button
                  onClick={() => {
                    setMode("decode");
                    handleProcess(input, "decode");
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    mode === "decode" ? "bg-white text-[#6366F1] shadow-xs" : "text-[#626985]"
                  }`}
                >
                  Decode URL
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleMode}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-[#626985] hover:text-[#10183A] bg-[#F5F4FF] hover:bg-[#E8E7FF] transition-colors"
                title="Swap input and output"
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
                <span>Swap</span>
              </button>
              <button
                onClick={() => {
                  setInput("");
                  setOutput("");
                  setError("");
                }}
                className="text-xs text-[#626985] hover:text-[#10183A] px-2 py-1"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Input Box */}
          <div>
            <label className="block text-xs font-semibold text-[#10183A] mb-1.5">
              Input String ({mode === "encode" ? "Plain / Raw Text" : "Encoded Percent String"})
            </label>
            <textarea
              rows={4}
              value={input}
              onChange={(e) => handleProcess(e.target.value, mode)}
              placeholder="Paste string here..."
              className="w-full px-4 py-3 rounded-2xl border border-[#E6E7F0] text-xs font-mono text-[#10183A] focus:outline-none focus:border-[#6366F1] transition-all"
            />
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2.5 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Output Box */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-[#10183A]">
                Output Result ({mode === "encode" ? "Encoded URL" : "Decoded Text"})
              </label>
              {output && (
                <button
                  onClick={handleCopy}
                  className="text-xs font-semibold text-[#6366F1] hover:text-[#8067FF] inline-flex items-center gap-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied!" : "Copy"}</span>
                </button>
              )}
            </div>
            <textarea
              readOnly
              rows={4}
              value={output}
              placeholder="Result will appear here..."
              className="w-full px-4 py-3 rounded-2xl bg-[#F5F4FF] border border-[#E8E7FF] text-xs font-mono text-[#10183A] focus:outline-none"
            />
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-[#E6E7F0] p-6 shadow-sm space-y-3 text-xs text-[#626985]">
            <h3 className="font-bold text-[#10183A] text-sm">Why Percent Encoding Matters:</h3>
            <p className="leading-relaxed">
              Standard URLs can only contain a limited set of ASCII characters. Special characters like spaces (`%20`), ampersands (`%26`), and non-Latin Unicode symbols must be encoded to avoid breaking browser requests and web server parsers.
            </p>
          </div>

          {/* Agency Cross-Sell CTA */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0B1025] to-[#171F42] text-white border border-[#252B49] space-y-3">
            <h4 className="text-sm font-bold">Building High-Performance Web Applications?</h4>
            <p className="text-xs text-[#C6C9DC]">
              HelloShiva engineers sub-second, SEO-friendly Next.js and React platforms designed to convert visitors.
            </p>
            <Link
              href="/services/web-design-development"
              className="inline-flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#6366F1] to-[#8067FF] hover:opacity-90 transition-opacity"
            >
              <span>Web Engineering</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
