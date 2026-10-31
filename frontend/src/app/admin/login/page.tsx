"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, Key, ShieldCheck, ArrowRight, Loader2, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@helloshiva.com");
  const [password, setPassword] = useState("admin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Verify credentials
    try {
      const res = await fetch("/api/v1/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("helloshiva_admin_auth", "true");
        localStorage.setItem("helloshiva_admin_user", JSON.stringify(data.user));
        document.cookie = "helloshiva_admin_session=active; path=/; max-age=86400";
        router.push("/admin/content-engine/overview");
      } else {
        setError(data.message || "Invalid email or password.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to authenticate.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1025] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden font-sans">
      {/* Background glow accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#6366F1]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-8 relative z-10">
        {/* Brand Logo */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#6366F1] to-[#8067FF] flex items-center justify-center text-white font-extrabold text-2xl shadow-lg shadow-indigo-500/25">
              H
            </div>
            <span className="text-2xl font-black text-white tracking-tight">
              Hello<span className="text-[#8067FF]">Shiva</span>
            </span>
          </Link>
          <h1 className="text-xl font-bold text-white tracking-tight pt-2">
            Agency Owner & Admin Command Center
          </h1>
          <p className="text-xs text-[#C6C9DC]">
            Secure portal to manage editorial workflows, publishing gates, and client leads.
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#171F42] border border-[#252B49] rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8067FF] bg-[#0B1025] px-3 py-1.5 rounded-xl border border-[#252B49]">
            <Lock className="w-3.5 h-3.5" />
            <span>Authorized Personnel Only</span>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#C6C9DC] mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#626985] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@helloshiva.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0B1025] border border-[#252B49] text-xs text-white focus:outline-none focus:border-[#6366F1] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#C6C9DC] mb-1.5">
                Admin Password
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-[#626985] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0B1025] border border-[#252B49] text-xs text-white focus:outline-none focus:border-[#6366F1] transition-all"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-[#6366F1] to-[#8067FF] hover:opacity-90 shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>Enter Admin Command Center</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Credentials helper hint */}
          <div className="p-3.5 rounded-2xl bg-[#0B1025] border border-[#252B49] text-[11px] text-[#C6C9DC]/70 space-y-1">
            <div className="font-semibold text-white">Default Agency Admin Access:</div>
            <div>Email: <code className="text-[#8067FF]">admin@helloshiva.com</code></div>
            <div>Password: <code className="text-[#8067FF]">admin</code></div>
          </div>
        </div>

        <div className="text-center">
          <Link href="/" className="text-xs text-[#C6C9DC]/60 hover:text-white transition-colors">
            &larr; Return to HelloShiva Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
