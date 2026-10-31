"use client";

import React, { useState, useEffect } from "react";
import { siteConfig } from "@/config/site";
import { Send, CheckCircle2, AlertCircle, Loader2, Sparkles, Shield } from "lucide-react";

interface EnquiryFormProps {
  defaultService?: string;
  sourcePage?: string;
  headline?: string;
  subheadline?: string;
  className?: string;
}

export default function EnquiryForm({
  defaultService = "seo-services",
  sourcePage = "/",
  headline = "Discuss Your Project With HelloShiva",
  subheadline = "Tell us about your business goals and marketing challenges. We will review your current presence and respond with actionable insights within 24 hours.",
  className = "",
}: EnquiryFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: defaultService,
    project_details: "",
    honeypot: "", // Spam trap for automated bots
  });

  const [utmParams, setUtmParams] = useState({
    utm_source: "",
    utm_medium: "",
    utm_campaign: "",
    referrer: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Capture attribution on client load
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      setUtmParams({
        utm_source: urlParams.get("utm_source") || "",
        utm_medium: urlParams.get("utm_medium") || "",
        utm_campaign: urlParams.get("utm_campaign") || "",
        referrer: document.referrer || "",
      });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    // Bot detection via honeypot
    if (formData.honeypot) {
      console.warn("Spam bot submission trapped.");
      setSubmitted(true);
      return;
    }

    if (!formData.name.trim() || !formData.email.trim() || !formData.project_details.trim()) {
      setErrorMsg("Please fill in all required fields (Name, Email, and Project Details).");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        company: formData.company.trim(),
        service: formData.service,
        message: formData.project_details.trim(),
        source_page: sourcePage,
        referrer: utmParams.referrer,
        utm_source: utmParams.utm_source,
        utm_medium: utmParams.utm_medium,
        utm_campaign: utmParams.utm_campaign,
      };

      // Call our API endpoint
      const res = await fetch("/api/v1/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to submit enquiry. Please try again.");
      }

      setSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred. Please contact us directly at contact@helloshiva.com");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-[#E6E7F0] p-6 sm:p-10 ${className}`}
    >
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E8E7FF] text-[#6366F1] mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Direct Agency Enquiry
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#10183A]">
          {headline}
        </h3>
        <p className="text-sm text-[#626985] mt-2 leading-relaxed">
          {subheadline}
        </p>
      </div>

      {submitted ? (
        <div className="py-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h4 className="text-xl font-bold text-[#10183A]">Thank You for Reaching Out!</h4>
          <p className="text-sm text-[#626985] max-w-md mx-auto leading-relaxed">
            Your inquiry has been received by our digital strategy team. We will review your project details and respond to <strong className="text-[#10183A]">{formData.email}</strong> within 24 hours.
          </p>
          <div className="pt-4">
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  name: "",
                  email: "",
                  phone: "",
                  company: "",
                  service: defaultService,
                  project_details: "",
                  honeypot: "",
                });
              }}
              className="text-xs font-semibold text-[#6366F1] hover:underline"
            >
              Submit another inquiry
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3 text-red-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Honeypot field - hidden from human users */}
          <div className="hidden" aria-hidden="true">
            <input
              type="text"
              name="honeypot"
              tabIndex={-1}
              autoComplete="off"
              value={formData.honeypot}
              onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-[#10183A] mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Rahul Sharma"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E6E7F0] text-sm text-[#10183A] placeholder-[#626985]/50 focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/10 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#10183A] mb-1.5">
                Work Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="e.g. rahul@company.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E6E7F0] text-sm text-[#10183A] placeholder-[#626985]/50 focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/10 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-[#10183A] mb-1.5">
                Phone / WhatsApp <span className="text-xs font-normal text-[#626985]">(Optional)</span>
              </label>
              <input
                type="tel"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E6E7F0] text-sm text-[#10183A] placeholder-[#626985]/50 focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/10 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#10183A] mb-1.5">
                Company Name / Website <span className="text-xs font-normal text-[#626985]">(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. yourcompany.com"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E6E7F0] text-sm text-[#10183A] placeholder-[#626985]/50 focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/10 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#10183A] mb-1.5">
              Service Interested In <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.service}
              onChange={(e) => setFormData({ ...formData, service: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E6E7F0] text-sm text-[#10183A] bg-white focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/10 transition-all"
            >
              {siteConfig.services.map((svc) => (
                <option key={svc.id} value={svc.slug}>
                  {svc.title} — {svc.tagline}
                </option>
              ))}
              <option value="other-custom">Other / Comprehensive Multi-Channel Growth</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#10183A] mb-1.5">
              Project Details & Goals <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              placeholder="Tell us about your current challenges, monthly traffic/leads, and what you want to achieve..."
              value={formData.project_details}
              onChange={(e) => setFormData({ ...formData, project_details: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-[#E6E7F0] text-sm text-[#10183A] placeholder-[#626985]/50 focus:outline-none focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/10 transition-all"
            />
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-[#6366F1] to-[#8067FF] hover:from-[#5558E6] hover:to-[#7358F5] shadow-lg shadow-indigo-500/25 disabled:opacity-50 transition-all cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting Inquiry...</span>
                </>
              ) : (
                <>
                  <span>Send Project Inquiry</span>
                  <Send className="w-4 h-4" />
                </>
              )}
            </button>
            <div className="flex items-center gap-1.5 text-[11px] text-[#626985]">
              <Shield className="w-3.5 h-3.5 text-[#22C55E]" />
              <span>100% confidential. No spam or aggressive sales calls.</span>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
