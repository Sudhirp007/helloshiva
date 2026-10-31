"use client";

import React, { useState, useEffect } from "react";
import { Settings, Sparkles, Save, CheckCircle2, Lock, ShieldCheck, Key, Cpu } from "lucide-react";

export default function ContentEngineSettingsPage() {
  const [flags, setFlags] = useState<any[]>([]);
  const [geminiKey, setGeminiKey] = useState("");
  const [geminiModel, setGeminiModel] = useState("gemini-3.5-flash");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/content-engine/settings")
      .then((res) => res.json())
      .then((d) => {
        if (d.success) {
          setFlags(d.flags);
          const keyRow = d.settings.find((s: any) => s.key === "GEMINI_API_KEY");
          const modelRow = d.settings.find((s: any) => s.key === "GEMINI_MODEL");
          if (keyRow) setGeminiKey(keyRow.value);
          if (modelRow) setGeminiModel(modelRow.value);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleToggleFlag = (key: string) => {
    if (key === "AUTOMATIC_PUBLISHING_ENABLED") {
      alert("AUTOMATIC_PUBLISHING_ENABLED is permanently locked in staging to prevent unapproved production releases.");
      return;
    }

    setFlags(
      flags.map((f) => (f.key === key ? { ...f, enabled: f.enabled ? 0 : 1 } : f))
    );
  };

  const handleSave = async () => {
    const flagMap: Record<string, number> = {};
    flags.forEach((f) => {
      flagMap[f.key] = f.enabled;
    });

    await fetch("/api/v1/content-engine/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        flags: flagMap,
        settings: {
          GEMINI_API_KEY: geminiKey,
          GEMINI_MODEL: geminiModel,
        },
      }),
    });

    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E8E7FF] text-[#6366F1] mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          Desk 8 • System Configuration & Feature Flags
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#10183A]">
          Content Engine Settings & Integrations
        </h1>
        <p className="text-sm text-[#626985]">
          Manage modular feature flags, configure the Google Gemini API credentials, and verify security locks.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: API & Model Settings */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-3xl border border-[#E6E7F0] p-6 sm:p-8 shadow-sm space-y-5">
            <h2 className="text-base font-bold text-[#10183A] border-b border-[#E6E7F0] pb-3 flex items-center gap-2">
              <Key className="w-4 h-4 text-[#6366F1]" />
              <span>Google Gemini API Configuration</span>
            </h2>

            <div>
              <label className="block text-xs font-semibold text-[#10183A] mb-1">
                Gemini API Key
              </label>
              <input
                type="password"
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                placeholder="AIzaSy... (Leave empty for deterministic agency templates)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E7F0] text-sm text-[#10183A] focus:outline-none focus:border-[#6366F1] font-mono transition-all"
              />
              <p className="text-[11px] text-[#626985] mt-1">
                Stored privately in your server database. Never exposed to browser visitors.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#10183A] mb-1">
                Configurable Gemini Model
              </label>
              <select
                value={geminiModel}
                onChange={(e) => setGeminiModel(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#E6E7F0] text-xs font-semibold text-[#10183A] bg-white focus:outline-none focus:border-[#6366F1]"
              >
                <option value="gemini-3.5-flash">Google Gemini 3.5 Flash (Fast, High Reasoning - Recommended Default)</option>
                <option value="gemini-3.6-flash">Google Gemini 3.6 Flash (Advanced Reasoning & Deep Generation)</option>
                <option value="gemini-flash-latest">Google Gemini Flash Latest (Auto-updated Stable Flash)</option>
                <option value="gemini-pro-latest">Google Gemini Pro Latest (Enterprise Long-Form Pro)</option>
              </select>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#0B1025] text-white space-y-2 border border-[#252B49]">
            <div className="flex items-center gap-2 font-bold text-sm text-[#8067FF]">
              <ShieldCheck className="w-4 h-4" />
              <span>Resource & Cost Safeguards</span>
            </div>
            <p className="text-xs text-[#C6C9DC] leading-relaxed">
              API requests are capped at 3,500 output tokens to prevent runaway billing. Local research adapters (OctopusOn / OpenSEO) run 100% in-process with 0 KB subscription overhead.
            </p>
          </div>
        </div>

        {/* Right Column: Independent Feature Flags */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-[#E6E7F0] p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-[#10183A] border-b border-[#E6E7F0] pb-3 flex items-center justify-between">
            <span>Modular Feature Flags</span>
            <span className="text-xs font-normal text-[#626985]">Independent Subsystems</span>
          </h2>

          <div className="divide-y divide-[#E6E7F0] space-y-1">
            {flags.map((flag) => {
              const isLocked = flag.key === "AUTOMATIC_PUBLISHING_ENABLED";
              return (
                <div key={flag.key} className="pt-3 pb-2 flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#10183A]">{flag.key}</span>
                      {isLocked && (
                        <span className="text-[9px] font-black uppercase bg-red-100 text-red-800 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                          <Lock className="w-2.5 h-2.5" /> Locked
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#626985]">{flag.description}</p>
                  </div>

                  <button
                    onClick={() => handleToggleFlag(flag.key)}
                    className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                      flag.enabled ? "bg-[#6366F1]" : "bg-slate-200"
                    } ${isLocked ? "opacity-60 cursor-not-allowed" : ""}`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full bg-white block transition-transform absolute top-1 ${
                        flag.enabled ? "left-6" : "left-1"
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-[#E6E7F0] flex justify-end">
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#6366F1] to-[#8067FF] hover:opacity-90 shadow-md transition-all cursor-pointer"
            >
              {saved ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
              <span>{saved ? "Settings Saved!" : "Save All Settings"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
