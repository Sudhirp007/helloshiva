"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  LogOut,
  FileText,
  User,
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
      { name: "3. AI Drafting & Studio", href: "/admin/content-engine/drafting", icon: <FileEdit className="w-4 h-4" /> },
      { name: "4. Social Repurposing", href: "/admin/content-engine/social", icon: <Share2 className="w-4 h-4" /> },
      { name: "5. Editorial Calendar", href: "/admin/content-engine/calendar", icon: <Calendar className="w-4 h-4" /> },
      { name: "6. Article Library", href: "/admin/content-engine/articles", icon: <FileText className="w-4 h-4" /> },
      { name: "7. Settings & Flags", href: "/admin/content-engine/settings", icon: <Settings className="w-4 h-4" /> },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  // If on admin login page, render full screen without the sidebar layout
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setAuthChecked(true);
      return;
    }

    // Check auth
    const isAuth = localStorage.getItem("helloshiva_admin_auth");
    if (!isAuth) {
      router.push("/admin/login");
    } else {
      setAuthChecked(true);
    }
  }, [pathname, isLoginPage, router]);

  const handleLogout = () => {
    localStorage.removeItem("helloshiva_admin_auth");
    localStorage.removeItem("helloshiva_admin_user");
    document.cookie = "helloshiva_admin_session=; path=/; max-age=0";
    router.push("/admin/login");
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[#0B1025] flex items-center justify-center text-white text-xs">
        Verifying agency administrator credentials...
      </div>
    );
  }

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
        } md:block w-full md:w-64 bg-[#0B1025] text-[#C6C9DC] border-r border-[#252B49] shrink-0 md:sticky md:top-0 md:h-screen overflow-y-auto p-5 flex flex-col justify-between z-40`}
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

        {/* Footer Sidebar Info & Logout */}
        <div className="pt-6 border-t border-[#252B49] space-y-3">
          <div className="p-3 rounded-xl bg-[#171F42] border border-[#252B49] text-[11px] space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">Admin: Owner Gate</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <p className="text-[#C6C9DC]/70 text-[10px] leading-snug">
              Manual sign-off required for all public releases.
            </p>
          </div>

          <div className="flex items-center justify-between px-1">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs text-[#C6C9DC]/70 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Website</span>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Admin Workspace */}
      <main className="flex-1 min-w-0 overflow-x-hidden p-5 sm:p-8 lg:p-10 max-w-7xl">
        {children}
      </main>
    </div>
  );
}
