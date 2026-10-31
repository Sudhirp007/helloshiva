"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Mail,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileSpreadsheet,
  BookmarkCheck,
  Clock,
  PhoneCall,
  Loader2,
} from "lucide-react";

export default function ClientLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClientLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    // Store client session in localStorage
    const clientUser = {
      email: email.trim(),
      name: name.trim() || email.split("@")[0],
      company: company.trim() || "Independent Marketer",
      memberSince: "October 2026",
    };
    localStorage.setItem("helloshiva_client_user", JSON.stringify(clientUser));
    setTimeout(() => {
      setLoading(false);
      router.push("/portal");
    }, 600);
  };

  return (
    <div className="pt-28 pb-20 bg-light-section min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Benefits & Value Prop */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E8E7FF] text-[#6366F1]">
              <Sparkles className="w-3.5 h-3.5" />
              Free Client & Marketer Workspace
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#10183A] tracking-tight leading-tight">
              Unlock Your Dedicated Marketing Intelligence Portal
            </h1>

            <p className="text-sm sm:text-base text-[#626985] leading-relaxed">
              Supercharge your workflow with HelloShiva&apos;s free suite of tools. Save historical audits, export branded PDF/CSV reports, and manage campaign attribution links in one secure place.
            </p>

            {/* Exclusive Perks List */}
            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-[#E6E7F0] shadow-xs">
                <BookmarkCheck className="w-5 h-5 text-[#6366F1] shrink-0 mt-0.5" />
                <div>
                  <h2 className="text-xs font-bold text-[#10183A]">Saved Tool Audit History</h2>
                  <p className="text-xs text-[#626985]">
                    Never lose a crawl report. Store unlimited past audits across SEO Page Analyzer, Robots.txt, and HTTP Headers.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-[#E6E7F0] shadow-xs">
                <FileSpreadsheet className="w-5 h-5 text-[#8067FF] shrink-0 mt-0.5" />
                <div>
                  <h2 className="text-xs font-bold text-[#10183A]">1-Click PDF & CSV Audit Exports</h2>
                  <p className="text-xs text-[#626985]">
                    Download clean, executive-ready technical audit reports to share with your web developers or clients.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-[#E6E7F0] shadow-xs">
                <Clock className="w-5 h-5 text-[#6366F1] shrink-0 mt-0.5" />
                <div>
                  <h2 className="text-xs font-bold text-[#10183A]">Saved UTM Campaign Presets</h2>
                  <p className="text-xs text-[#626985]">
                    Pre-save campaign naming templates for Google Ads, Meta Ads, and Email Newsletters for flawless tracking.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-[#E6E7F0] shadow-xs">
                <PhoneCall className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h2 className="text-xs font-bold text-[#10183A]">Priority Agency Consultation Line</h2>
                  <p className="text-xs text-[#626985]">
                    Fast-track your inquiries directly to HelloShiva senior technical strategists.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sign In Form */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-[#E6E7F0] p-8 shadow-xl shadow-indigo-500/5 space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-extrabold text-[#10183A]">Sign In to Client Portal</h2>
              <p className="text-xs text-[#626985]">
                Enter your details to access your saved tools workspace. 100% free forever.
              </p>
            </div>

            <form onSubmit={handleClientLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#10183A] mb-1.5">
                  Work Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#626985] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E6E7F0] text-xs text-[#10183A] focus:outline-none focus:border-[#6366F1]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#10183A] mb-1.5">Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Sharma"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E7F0] text-xs text-[#10183A] focus:outline-none focus:border-[#6366F1]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#10183A] mb-1.5">Company / Website</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Acme Media or acme.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E7F0] text-xs text-[#10183A] focus:outline-none focus:border-[#6366F1]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-[#6366F1] to-[#8067FF] hover:opacity-90 shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Loading Workspace...</span>
                    </>
                  ) : (
                    <>
                      <span>Enter Free Marketer Workspace</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="pt-4 border-t border-[#E6E7F0] text-center text-[11px] text-[#626985] space-y-2">
              <div className="flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Zero spam guarantee. No mandatory credit card.</span>
              </div>
              <div className="pt-1">
                <span>Are you a HelloShiva Administrator? </span>
                <Link href="/admin/login" className="text-[#6366F1] font-semibold hover:underline">
                  Agency Admin Login &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
