"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import { Menu, X, ArrowRight, Sparkles, ChevronDown } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0B1025]/90 backdrop-blur-md border-b border-[#252B49] shadow-lg shadow-black/10 py-3.5"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6366F1] to-[#8067FF] flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-200">
              <span className="font-extrabold text-white text-xl tracking-tight">H</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                Hello<span className="text-gradient">Shiva</span>
              </span>
              <span className="text-[10px] tracking-wider uppercase font-semibold text-[#C6C9DC]/70 -mt-1">
                Digital Marketing Agency
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {siteConfig.nav.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "text-white bg-[#171F42] border border-[#252B49]"
                      : "text-[#C6C9DC] hover:text-white hover:bg-white/5"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Header Action CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/tools"
              className="px-3.5 py-2 rounded-lg text-xs font-semibold text-[#C6C9DC] hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#8067FF]" />
              Free Tools (10)
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#6366F1] to-[#8067FF] hover:from-[#5558E6] hover:to-[#7358F5] shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all duration-200 group"
            >
              <span>Discuss Your Project</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-[#C6C9DC] hover:text-white hover:bg-white/10"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden bg-[#0B1025] border-b border-[#252B49] px-4 pt-3 pb-6 space-y-2">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="block px-3 py-2.5 rounded-lg text-base font-medium text-[#C6C9DC] hover:text-white hover:bg-[#171F42]"
            >
              {item.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-[#252B49] flex flex-col gap-2.5">
            <Link
              href="/tools"
              className="w-full text-center py-2.5 rounded-lg text-sm font-semibold text-[#C6C9DC] bg-[#171F42] border border-[#252B49]"
            >
              Explore 10 Free Tools
            </Link>
            <Link
              href="/contact"
              className="w-full text-center py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#6366F1] to-[#8067FF]"
            >
              Discuss Your Project
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
