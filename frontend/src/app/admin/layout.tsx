"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Search,
  Calendar,
  FileEdit,
  CheckCircle,
  Share2,
  Clock,
  Settings,
  Mail,
  ArrowLeft,
  Menu,
  X,
  Sparkles,
  ShieldAlert,
} from "lucide-react";

const navSections = [
  {
    title: "Agency Operations",
    items: [
      { name: "Inquiries & Leads", href: "/admin/enquiries", icon: <Mail className="w-4 h-4" /> },
    ],
  },
  {
    title: "Content Marketing Engine",
    items: [
      { name: "1. Overview Dashboard", href: "/admin/content-engine/overview", icon: <LayoutDashboard className="w-4 h-4" /> },
      { name: "2. SEO Research Desk", href: "/admin/content-engine/research", icon: <Search className="w-4 h-4" /> },
      { name: "3. Editorial Calendar", href: "/admin/content-engine/calendar", icon: <Calendar className="w-4 h-4" /> },
      { name: "4. AI Drafting Desk", href: "/admin/content-engine/drafting", icon: <FileEdit className="w-4 h-4" /> },
      { name: "5. SEO Optimization", href: "/admin/content-engine/optimization", icon: <CheckCircle className="w-4 h-4" /> },
      { name: "6. Social Distribution", href: "/admin/content-engine/social", icon: <Share2 className="w-4 h-4" /> },
      { name: "7. Publishing Queue", href: "/admin/content-engine/queue", icon: <Clock className="w-4 h-4" /> },
      { name: "8. Settings & Flags", href: "/admin/content-engine/settings", icon: <Settings className="w-4 h-4" /> },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F5F4FF] flex flex-col md:flex-row font-sans">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-[#0B1025] text-white p-4 flex items-center justify-between border-b border-[#252B49] sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#6366F1] to-[#8067FF] flex items-center justify-center font-bold text-xs">
            H
          </div>
          <span className="font-bold text-sm tracking-tight">HelloShiva Admin</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded-lg bg-[#171F42] text-[#C6C9DC]"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`${
          sidebarOpen ? "block" : "hidden"
        } md:block w-full md:w-64 bg-[#0B1025] text-[#C6C9DC] border-r border-[#252B49] shrink-0 min-h-screen p-5 flex flex-col justify-between`}
      >
        <div className="space-y-6">
          {/* Logo */}
          <div className="hidden md:flex items-center gap-2.5 pb-5 border-b border-[#252B49]">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#6366F1] to-[#8067FF] flex items-center justify-center text-white font-extrabold text-sm shadow-md">
              H
            </div>
            <div>
              <span className="font-bold text-white text-base">
                Hello<span className="text-[#8067FF]">Shiva</span>
              </span>
              <div className="text-[10px] text-[#C6C9DC]/60 uppercase tracking-wider font-semibold">
                Agency Command Center
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-6">
            {navSections.map((sec, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="text-[10px] uppercase font-bold tracking-wider text-[#C6C9DC]/40 px-3">
                  {sec.title}
                </div>
                <div className="space-y-0.5">
                  {sec.items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                          isActive
                            ? "bg-gradient-to-r from-[#6366F1] to-[#8067FF] text-white shadow-md shadow-indigo-500/20"
                            : "text-[#C6C9DC]/80 hover:text-white hover:bg-[#171F42]"
                        }`}
                      >
                        {item.icon}
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Footer Sidebar Info */}
        <div className="pt-6 border-t border-[#252B49] space-y-3">
          <div className="p-3 rounded-xl bg-[#171F42] border border-[#252B49] text-[11px] space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-white">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Staging Mode Active</span>
            </div>
            <p className="text-[#C6C9DC]/70 text-[10px] leading-snug">
              Auto-publishing locked. All social posts copy-only.
            </p>
          </div>

          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-[#C6C9DC]/70 hover:text-white transition-colors px-2 py-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Website</span>
          </Link>
        </div>
      </aside>

      {/* Main Admin Workspace */}
      <main className="flex-1 p-5 sm:p-8 lg:p-10 max-w-7xl overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
