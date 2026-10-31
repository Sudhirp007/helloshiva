"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  Sparkles,
  Save,
  CheckCircle2,
  Key,
  Shield,
  Bot,
  Sliders,
  RefreshCw,
} from "lucide-react";

export default function EditorialSettingsPage() {
  const [geminiKey, setGeminiKey] = useState("");
  const [geminiModel, setGeminiModel] = useState("gemini-3.5-flash");
  const [brandName, setBrandName] = useState("HelloShiva Digital Agency");
  const [antiFluff, setAntiFluff] = useState(true);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/content-intelligence/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.settings) {
          setGeminiKey(data.settings.geminiKeyMasked || "");
          setGeminiModel(data.settings.geminiModel || "gemini-3.5-flash");
          setBrandName(data.settings.brandName || "HelloShiva Digital Agency");
          setAntiFluff(data.settings.antiFluff ?? true);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(false);
    try {
      const res = await fetch("/api/v1/content-intelligence/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          geminiKey,
          geminiModel,
          brandName,
          antiFluff,
        }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-sm text-slate-500">Loading Editorial Settings...</div>;
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">
            <Settings className="w-4 h-4" />
            Stage 27 & 30 • Engine Configurations & Brand Voice
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B1025] tracking-tight">
            AI Engine & Brand Settings
          </h1>
          <p className="text-sm text-slate-600 mt-1 leading-relaxed">
            Configure the AI model version, enforce HelloShiva&apos;s senior consultative voice, and manage API credentials.
          </p>
        </div>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Settings saved successfully. Changes apply immediately to new drafts.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
        {/* Gemini Model Selector */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700 flex items-center gap-2">
            <Bot className="w-4 h-4 text-indigo-600" />
            Primary Gemini AI Model
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: "gemini-flash-lite-latest", name: "Gemini Flash Lite (Active)", desc: "Highest availability, lightning-fast generation without quota limits." },
              { id: "gemini-3.5-flash", name: "Gemini 3.5 Flash", desc: "Structured deep analytical output with official agency citations." },
              { id: "gemini-3.8-flash", name: "Gemini 3.8 Flash", desc: "Latest Google AI model with advanced reasoning." },
              { id: "gemini-3.6-flash", name: "Gemini 3.6 Flash", desc: "Experimental reasoning engine for deep technical guides." },
            ].map((m) => (
              <label
                key={m.id}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                  geminiModel === m.id
                    ? "border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-500/20"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-[#0B1025]">{m.name}</span>
                    <input
                      type="radio"
                      name="geminiModel"
                      value={m.id}
                      checked={geminiModel === m.id}
                      onChange={(e) => setGeminiModel(e.target.value)}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>
                  <p className="text-xs text-slate-500">{m.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Gemini API Key */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700 flex items-center gap-2">
            <Key className="w-4 h-4 text-indigo-600" />
            Gemini API Key
          </label>
          <input
            type="text"
            value={geminiKey}
            onChange={(e) => setGeminiKey(e.target.value)}
            placeholder="Paste your Google Gemini API key"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <p className="text-[11px] text-slate-500">
            Stored securely in server JSON storage. Leave unchanged to keep the active verified key.
          </p>
        </div>

        {/* Brand Name */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700">Editorial Brand Name</label>
          <input
            type="text"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Anti-AI Fluff Filter Toggle */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-600" />
              Anti-AI Fluff & Cliché Filter
            </div>
            <p className="text-[11px] text-slate-500">
              Automatically strips phrases like &quot;In today&apos;s fast-paced digital world&quot; and &quot;In conclusion&quot; from output.
            </p>
          </div>
          <input
            type="checkbox"
            checked={antiFluff}
            onChange={(e) => setAntiFluff(e.target.checked)}
            className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
          />
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-colors shadow-md cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
