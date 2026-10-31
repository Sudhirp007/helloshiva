"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import { Mail, Phone, MapPin, ArrowUpRight, ShieldCheck, Heart } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();

  // Do not render public footer on admin pages
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="bg-[#0B1025] text-[#C6C9DC] border-t border-[#252B49]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-[#252B49]">
          {/* Brand info (2 columns on large screens) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6366F1] to-[#8067FF] flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-indigo-500/20">
                H
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                Hello<span className="text-gradient">Shiva</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-[#C6C9DC]/80 max-w-sm">
              {siteConfig.tagline} We engineer compounding organic search pipelines, profitable performance ads, and high-converting web experiences for forward-thinking businesses.
            </p>
            <div className="pt-2 space-y-2.5 text-xs text-[#C6C9DC]/90">
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#8067FF]" />
                <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-white transition-colors">
                  {siteConfig.contact.email}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#8067FF]" />
                <a href={`tel:${siteConfig.contact.phone}`} className="hover:text-white transition-colors">
                  {siteConfig.contact.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#8067FF]" />
                <span>{siteConfig.contact.address} ({siteConfig.contact.coverage})</span>
              </div>
            </div>
          </div>

          {/* Agency Services */}
          <div>
            <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
              Our Services
            </h3>
            <ul className="space-y-2.5 text-xs">
              {siteConfig.services.map((svc) => (
                <li key={svc.id}>
                  <Link
                    href={`/services/${svc.slug}`}
                    className="hover:text-white transition-colors flex items-center justify-between group"
                  >
                    <span>{svc.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Free Marketing Tools */}
          <div>
            <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
              Free Tools
            </h3>
            <ul className="space-y-2.5 text-xs">
              {siteConfig.tools.slice(0, 6).map((t) => (
                <li key={t.id}>
                  <Link
                    href={`/tools/${t.slug}`}
                    className="hover:text-white transition-colors flex items-center justify-between group"
                  >
                    <span>{t.name}</span>
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/tools"
                  className="text-[#8067FF] hover:text-white font-medium inline-flex items-center gap-1 transition-colors pt-1"
                >
                  <span>View all 10 tools</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Agency & Legal */}
          <div>
            <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
              Company
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About HelloShiva
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="hover:text-white transition-colors">
                  Case Studies & Benchmarks
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">
                  Marketing Insights
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Book a Consultation
                </Link>
              </li>
              <li className="pt-2">
                <Link href="/privacy-policy" className="hover:text-white transition-colors text-[11px] text-[#C6C9DC]/60">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors text-[11px] text-[#C6C9DC]/60">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#C6C9DC]/60">
          <p>© {new Date().getFullYear()} HelloShiva Digital Marketing Agency. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#22C55E]" />
              Enterprise Security & Privacy
            </span>
            <span>•</span>
            <span>Built with Next.js & Technical SEO Integrity</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
