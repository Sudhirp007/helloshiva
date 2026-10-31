"use client";

import React, { useEffect, useState } from "react";
import { Mail, Phone, Building, Globe, CheckCircle, Clock, Loader2, RefreshCw } from "lucide-react";

export default function AdminEnquiriesPage() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/admin/enquiries");
      const data = await res.json();
      if (data.success) {
        setInquiries(data.inquiries);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await fetch("/api/v1/admin/enquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      fetchInquiries();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#10183A]">
            Agency Inquiries & Lead Management
          </h1>
          <p className="text-sm text-[#626985] mt-1">
            Review incoming consultation requests, service interest, and attribution sources.
          </p>
        </div>
        <button
          onClick={fetchInquiries}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-[#6366F1] bg-white border border-[#E6E7F0] hover:bg-[#F5F4FF] transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-[#626985] flex flex-col items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-[#6366F1]" />
          <span>Loading client inquiries...</span>
        </div>
      ) : inquiries.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-[#E6E7F0] space-y-2">
          <Mail className="w-10 h-10 text-[#626985]/40 mx-auto" />
          <h3 className="text-base font-bold text-[#10183A]">No Inquiries Received Yet</h3>
          <p className="text-xs text-[#626985] max-w-sm mx-auto">
            When visitors submit the consultation form on your website, their requests and attribution sources will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {inquiries.map((inq) => (
            <div
              key={inq.id}
              className="bg-white rounded-2xl border border-[#E6E7F0] p-6 shadow-sm space-y-4 hover:border-[#6366F1]/40 transition-colors"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E6E7F0] pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F5F4FF] text-[#6366F1] font-bold flex items-center justify-center text-sm">
                    {inq.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#10183A]">{inq.name}</h3>
                    <div className="flex items-center gap-3 text-xs text-[#626985]">
                      <span>{inq.email}</span>
                      {inq.phone && <span>• {inq.phone}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-[11px] font-extrabold uppercase px-3 py-1 rounded-full ${
                      inq.status === "NEW"
                        ? "bg-emerald-100 text-emerald-800"
                        : inq.status === "CONTACTED"
                        ? "bg-indigo-100 text-indigo-800"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {inq.status}
                  </span>
                  <select
                    value={inq.status}
                    onChange={(e) => updateStatus(inq.id, e.target.value)}
                    className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-[#E6E7F0] bg-white text-[#10183A]"
                  >
                    <option value="NEW">Mark as NEW</option>
                    <option value="CONTACTED">Mark as CONTACTED</option>
                    <option value="CLOSED">Mark as CLOSED</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div className="p-4 rounded-xl bg-[#F5F4FF] text-xs text-[#10183A] space-y-1">
                <div className="font-semibold text-[#6366F1] uppercase text-[10px] tracking-wider">
                  Service Interested In: {inq.service}
                </div>
                <p className="leading-relaxed whitespace-pre-wrap">{inq.message}</p>
              </div>

              {/* Attribution */}
              <div className="flex flex-wrap items-center gap-4 text-[11px] text-[#626985] pt-1">
                <span>Submitted: {new Date(inq.created_at).toLocaleString()}</span>
                <span>• Source Page: {inq.source_page}</span>
                {inq.utm_source && <span>• UTM Source: {inq.utm_source}</span>}
                {inq.company && <span>• Company: {inq.company}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
