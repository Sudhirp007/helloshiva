"use client";

import React, { useEffect, useState } from "react";
import {
  Mail,
  Phone,
  Building,
  Globe,
  CheckCircle2,
  Clock,
  Loader2,
  RefreshCw,
  Search,
  Filter,
  UserCheck,
  Calendar,
  MessageSquare,
  AlertCircle,
  Plus,
  Send,
  Flame,
  Zap,
  Snowflake,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Tag,
  Check,
} from "lucide-react";

interface LeadActivity {
  id: string;
  inquiry_id: string;
  author: string;
  action: string;
  note: string;
  old_stage?: string;
  new_stage?: string;
  created_at: string;
}

interface LeadFollowup {
  id: string;
  inquiry_id: string;
  type: string;
  title: string;
  notes: string;
  due_at: string;
  priority: string;
  status: string;
  completed_at?: string;
  created_at: string;
}

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  message?: string;
  source_page?: string;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  status: string;
  stage: string;
  qualification_score: string;
  timeline: string;
  qualification_notes?: string;
  last_contacted_at?: string;
  created_at: string;
  notes?: string;
  activities: LeadActivity[];
  followups: LeadFollowup[];
}

export default function AdminEnquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [stageFilter, setStageFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [expandedLeadId, setExpandedLeadId] = useState<string | null>(null);

  // New Note Form State
  const [noteText, setNoteText] = useState<{ [leadId: string]: string }>({});
  const [noteType, setNoteType] = useState<{ [leadId: string]: string }>({});
  const [submittingNote, setSubmittingNote] = useState<string | null>(null);

  // New Follow-up Task Form State
  const [showTaskModal, setShowTaskModal] = useState<string | null>(null);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskType, setTaskType] = useState("phone_call");
  const [taskDueAt, setTaskDueAt] = useState("");
  const [taskPriority, setTaskPriority] = useState("medium");
  const [taskNotes, setTaskNotes] = useState("");
  const [submittingTask, setSubmittingTask] = useState(false);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/admin/enquiries");
      const data = await res.json();
      if (data.success) {
        setInquiries(data.inquiries);
        if (data.inquiries.length > 0 && !expandedLeadId) {
          setExpandedLeadId(data.inquiries[0].id);
        }
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

  // Update lead stage & qualification
  const handleUpdateLeadStage = async (id: string, newStage: string) => {
    try {
      await fetch("/api/v1/admin/enquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, stage: newStage, status: newStage }),
      });
      fetchInquiries();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdatePriority = async (id: string, newPriority: string) => {
    try {
      await fetch("/api/v1/admin/enquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, qualificationScore: newPriority }),
      });
      fetchInquiries();
    } catch (err) {
      console.error(err);
    }
  };

  // Add chronological activity note
  const handleAddActivity = async (leadId: string) => {
    const text = (noteText[leadId] || "").trim();
    if (!text) return;
    setSubmittingNote(leadId);
    try {
      await fetch("/api/v1/admin/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add_activity",
          inquiryId: leadId,
          note: text,
          activityType: noteType[leadId] || "note_added",
          author: "Agency Director",
        }),
      });
      setNoteText((prev) => ({ ...prev, [leadId]: "" }));
      fetchInquiries();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingNote(null);
    }
  };

  // Create scheduled follow-up task
  const handleCreateFollowup = async (leadId: string) => {
    if (!taskTitle.trim() || !taskDueAt) return;
    setSubmittingTask(true);
    try {
      await fetch("/api/v1/admin/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add_followup",
          inquiryId: leadId,
          title: taskTitle.trim(),
          type: taskType,
          dueAt: new Date(taskDueAt).toISOString(),
          priority: taskPriority,
          notes: taskNotes.trim(),
        }),
      });
      setShowTaskModal(null);
      setTaskTitle("");
      setTaskDueAt("");
      setTaskNotes("");
      fetchInquiries();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingTask(false);
    }
  };

  // Complete a follow-up task
  const handleCompleteFollowup = async (leadId: string, followupId: string) => {
    try {
      await fetch("/api/v1/admin/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "complete_followup",
          inquiryId: leadId,
          followupId,
        }),
      });
      fetchInquiries();
    } catch (err) {
      console.error(err);
    }
  };

  // Calculation metrics
  const totalLeads = inquiries.length;
  const newLeads = inquiries.filter((i) => i.stage === "NEW").length;
  const workingLeads = inquiries.filter((i) => i.stage === "WORKING").length;
  const qualifiedLeads = inquiries.filter((i) => i.stage === "QUALIFIED").length;
  const closedLeads = inquiries.filter((i) => i.stage === "UNQUALIFIED").length;
  const qualificationRate = totalLeads > 0 ? ((qualifiedLeads / totalLeads) * 100).toFixed(1) : "0.0";

  // Filtered list
  const filtered = inquiries.filter((i) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      i.name.toLowerCase().includes(q) ||
      i.email.toLowerCase().includes(q) ||
      (i.phone && i.phone.toLowerCase().includes(q)) ||
      (i.company && i.company.toLowerCase().includes(q)) ||
      (i.message && i.message.toLowerCase().includes(q)) ||
      (i.service && i.service.toLowerCase().includes(q));

    const matchesStage = stageFilter === "ALL" || i.stage === stageFilter;
    const matchesPriority = priorityFilter === "ALL" || i.qualification_score === priorityFilter;

    return matchesQuery && matchesStage && matchesPriority;
  });

  const getCleanPhone = (phone?: string) => {
    if (!phone) return "";
    return phone.replace(/[^0-9+]/g, "");
  };

  return (
    <div className="space-y-8 font-sans max-w-full">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E8E7FF] text-[#6366F1] mb-2">
            <Mail className="w-3.5 h-3.5" />
            <span>Lead Qualification & Sales CRM</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#10183A]">
            Agency Lead Management & Nurturing Pipeline
          </h1>
          <p className="text-sm text-[#626985]">
            Nurture commercial inquiries, record chronological client interactions, and schedule tactical follow-up tasks.
          </p>
        </div>

        <button
          onClick={fetchInquiries}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-[#10183A] bg-white border border-[#E6E7F0] hover:bg-[#F5F4FF] transition-all cursor-pointer shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#6366F1]" : ""}`} />
          <span>Refresh Pipeline</span>
        </button>
      </div>

      {/* KPI Tiles (Laravel CRM Ribbon) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-[#E6E7F0] shadow-xs space-y-1">
          <div className="text-[10px] uppercase font-bold text-[#626985] tracking-wider">Total Inbound</div>
          <div className="text-2xl font-black text-[#10183A]">{totalLeads}</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E6E7F0] shadow-xs space-y-1">
          <div className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">New Leads</div>
          <div className="text-2xl font-black text-blue-600">{newLeads}</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E6E7F0] shadow-xs space-y-1">
          <div className="text-[10px] uppercase font-bold text-indigo-600 tracking-wider">Working / Contacted</div>
          <div className="text-2xl font-black text-indigo-600">{workingLeads}</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E6E7F0] shadow-xs space-y-1">
          <div className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">Qualified Leads</div>
          <div className="text-2xl font-black text-emerald-600">{qualifiedLeads}</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E6E7F0] shadow-xs space-y-1">
          <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Closed / N/A</div>
          <div className="text-2xl font-black text-slate-500">{closedLeads}</div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-tr from-[#6366F1] to-[#8067FF] text-white shadow-xs space-y-1">
          <div className="text-[10px] uppercase font-bold text-white/80 tracking-wider">Qualification Rate</div>
          <div className="text-2xl font-black">{qualificationRate}%</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl border border-[#E6E7F0] p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#626985] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search leads by name, email, company..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#E6E7F0] text-xs text-[#10183A] focus:outline-none focus:border-[#6366F1]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Stage Filter */}
          <div className="flex items-center gap-1.5 text-xs text-[#626985]">
            <Filter className="w-3.5 h-3.5" />
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-[#E6E7F0] text-xs font-semibold text-[#10183A] bg-white focus:outline-none focus:border-[#6366F1]"
            >
              <option value="ALL">All Stages</option>
              <option value="NEW">New Leads</option>
              <option value="WORKING">Working</option>
              <option value="QUALIFIED">Qualified</option>
              <option value="UNQUALIFIED">Closed / Unqualified</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-1.5 text-xs text-[#626985]">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-[#E6E7F0] text-xs font-semibold text-[#10183A] bg-white focus:outline-none focus:border-[#6366F1]"
            >
              <option value="ALL">All Priorities</option>
              <option value="HOT">🔥 Hot Leads</option>
              <option value="WARM">⚡ Warm Leads</option>
              <option value="COLD">❄️ Cold Leads</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Leads List with Expandable Laravel-Style Nurturing Flow */}
      {loading ? (
        <div className="p-16 text-center text-[#626985] flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#6366F1]" />
          <span className="text-sm font-semibold">Loading lead records...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-16 text-center bg-white rounded-3xl border border-[#E6E7F0] space-y-3 shadow-xs">
          <Mail className="w-12 h-12 text-[#626985]/30 mx-auto" />
          <h3 className="text-base font-bold text-[#10183A]">No Matching Leads Found</h3>
          <p className="text-xs text-[#626985] max-w-sm mx-auto">
            Try adjusting your search filter or stage query. New submissions from your website consultation form appear here automatically.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((lead) => {
            const isExpanded = expandedLeadId === lead.id;
            const activities = lead.activities || [];
            const followups = lead.followups || [];
            const pendingTasks = followups.filter((f) => f.status === "pending");

            return (
              <div
                key={lead.id}
                className="bg-white rounded-3xl border border-[#E6E7F0] shadow-xs overflow-hidden transition-all hover:border-[#6366F1]/40"
              >
                {/* Lead Summary Row */}
                <div
                  onClick={() => setExpandedLeadId(isExpanded ? null : lead.id)}
                  className="p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 cursor-pointer hover:bg-[#FAF9FF] transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#6366F1] to-[#8067FF] text-white font-extrabold flex items-center justify-center text-lg shadow-sm shrink-0">
                      {lead.name.charAt(0).toUpperCase()}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-base text-[#10183A]">{lead.name}</h3>
                        {lead.company && (
                          <span className="text-xs font-semibold text-[#626985] bg-[#F5F4FF] px-2.5 py-0.5 rounded-lg border border-[#E8E7FF]">
                            {lead.company}
                          </span>
                        )}
                        <span
                          className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                            lead.qualification_score === "HOT"
                              ? "bg-red-100 text-red-700 border border-red-200"
                              : lead.qualification_score === "WARM"
                              ? "bg-amber-100 text-amber-700 border border-amber-200"
                              : "bg-blue-100 text-blue-700 border border-blue-200"
                          }`}
                        >
                          {lead.qualification_score === "HOT"
                            ? "🔥 HOT"
                            : lead.qualification_score === "WARM"
                            ? "⚡ WARM"
                            : "❄️ COLD"}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-[#626985]">
                        <span className="flex items-center gap-1 font-medium">
                          <Mail className="w-3.5 h-3.5 text-[#6366F1]" />
                          <span>{lead.email}</span>
                        </span>
                        {lead.phone && (
                          <span className="flex items-center gap-1 font-medium">
                            <Phone className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{lead.phone}</span>
                          </span>
                        )}
                        <span>•</span>
                        <span className="text-[#10183A] font-semibold">{lead.service}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {/* Stage Pill */}
                    <span
                      className={`text-xs font-bold uppercase px-3 py-1.5 rounded-xl border ${
                        lead.stage === "NEW"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : lead.stage === "WORKING"
                          ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                          : lead.stage === "QUALIFIED"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-slate-100 text-slate-700 border-slate-200"
                      }`}
                    >
                      {lead.stage}
                    </span>

                    {pendingTasks.length > 0 && (
                      <span className="px-2.5 py-1 rounded-xl text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>{pendingTasks.length} task{pendingTasks.length > 1 ? "s" : ""} due</span>
                      </span>
                    )}

                    <div className="p-1 rounded-lg text-[#626985]">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Lead Management & Nurturing Console */}
                {isExpanded && (
                  <div className="border-t border-[#E6E7F0] p-6 sm:p-8 bg-[#FAF9FF]/50 space-y-6">
                    {/* Action Bar & Quick Contact Controls */}
                    <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#E6E7F0]">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-[#10183A]">Update Stage:</span>
                        {(["NEW", "WORKING", "QUALIFIED", "UNQUALIFIED"] as const).map((st) => (
                          <button
                            key={st}
                            type="button"
                            onClick={() => handleUpdateLeadStage(lead.id, st)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              lead.stage === st
                                ? "bg-[#0B1025] text-white shadow-xs"
                                : "bg-[#F5F4FF] text-[#626985] hover:bg-[#E8E7FF]"
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-[#10183A]">Priority:</span>
                        {(["HOT", "WARM", "COLD"] as const).map((pr) => (
                          <button
                            key={pr}
                            type="button"
                            onClick={() => handleUpdatePriority(lead.id, pr)}
                            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                              lead.qualification_score === pr
                                ? pr === "HOT"
                                  ? "bg-red-600 text-white"
                                  : pr === "WARM"
                                  ? "bg-amber-600 text-white"
                                  : "bg-blue-600 text-white"
                                : "bg-[#F5F4FF] text-[#626985] hover:bg-[#E8E7FF]"
                            }`}
                          >
                            {pr === "HOT" ? "🔥 Hot" : pr === "WARM" ? "⚡ Warm" : "❄️ Cold"}
                          </button>
                        ))}

                        {lead.phone && (
                          <a
                            href={`https://wa.me/${getCleanPhone(lead.phone)}?text=Hello%20${encodeURIComponent(
                              lead.name
                            )},%20thank%20you%20for%20contacting%20HelloShiva%20Digital%20Marketing%20Agency.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>WhatsApp Chat</span>
                          </a>
                        )}

                        <a
                          href={`mailto:${lead.email}?subject=HelloShiva Consultation: ${encodeURIComponent(
                            lead.service || "Growth Strategy"
                          )}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[#6366F1] bg-[#E8E7FF] hover:bg-[#dedcfc] transition-colors"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>Send Email</span>
                        </a>
                      </div>
                    </div>

                    {/* Inquiry Message Card & Attribution */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-2 bg-white rounded-2xl border border-[#E6E7F0] p-5 space-y-2">
                        <div className="text-[10px] uppercase font-bold text-[#6366F1] tracking-wider">
                          Client Inquiry Message
                        </div>
                        <p className="text-xs text-[#10183A] leading-relaxed whitespace-pre-wrap">
                          {lead.message || "No custom message provided with submission."}
                        </p>
                      </div>

                      <div className="bg-white rounded-2xl border border-[#E6E7F0] p-5 space-y-2 text-xs">
                        <div className="text-[10px] uppercase font-bold text-[#626985] tracking-wider">
                          Attribution & Inbound Meta
                        </div>
                        <div className="space-y-1.5 text-[#626985] text-[11px]">
                          <div>Submitted: <span className="font-semibold text-[#10183A]">{new Date(lead.created_at).toLocaleString()}</span></div>
                          <div>Landing Page: <span className="font-semibold text-[#10183A]">{lead.source_page || "/"}</span></div>
                          {lead.utm_source && <div>Source: <span className="font-semibold text-[#10183A]">{lead.utm_source}</span></div>}
                          {lead.utm_campaign && <div>Campaign: <span className="font-semibold text-[#10183A]">{lead.utm_campaign}</span></div>}
                          <div>Decision Timeline: <span className="font-semibold text-[#10183A]">{lead.timeline}</span></div>
                        </div>
                      </div>
                    </div>

                    {/* Scheduled Follow-up Tasks Section (Laravel LeadFollowup Style) */}
                    <div className="bg-white rounded-2xl border border-[#E6E7F0] p-5 sm:p-6 space-y-4">
                      <div className="flex items-center justify-between border-b border-[#E6E7F0] pb-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-blue-600" />
                          <h4 className="text-xs font-bold text-[#10183A] uppercase tracking-wider">
                            Scheduled Tasks & Next Steps ({followups.length})
                          </h4>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowTaskModal(lead.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Schedule Follow-up</span>
                        </button>
                      </div>

                      {followups.length === 0 ? (
                        <p className="text-xs text-[#626985] italic">
                          No follow-up tasks scheduled yet. Click &quot;Schedule Follow-up&quot; to assign a phone call, meeting, or proposal deadline.
                        </p>
                      ) : (
                        <div className="divide-y divide-[#E6E7F0]">
                          {followups.map((task) => {
                            const isCompleted = task.status === "completed";
                            const isOverdue = !isCompleted && new Date(task.due_at).getTime() < Date.now();

                            return (
                              <div
                                key={task.id}
                                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                              >
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span
                                      className={`w-2 h-2 rounded-full ${
                                        isCompleted
                                          ? "bg-emerald-500"
                                          : isOverdue
                                          ? "bg-red-500"
                                          : "bg-blue-500"
                                      }`}
                                    />
                                    <span
                                      className={`text-xs font-bold ${
                                        isCompleted
                                          ? "line-through text-[#626985]"
                                          : "text-[#10183A]"
                                      }`}
                                    >
                                      {task.title}
                                    </span>
                                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#F5F4FF] text-[#6366F1]">
                                      {task.type.replace("_", " ")}
                                    </span>
                                    {isOverdue && (
                                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-700">
                                        OVERDUE
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[11px] text-[#626985] flex items-center gap-3">
                                    <span>Due: {new Date(task.due_at).toLocaleString()}</span>
                                    {task.notes && <span>• Note: {task.notes}</span>}
                                  </div>
                                </div>

                                {!isCompleted && (
                                  <button
                                    type="button"
                                    onClick={() => handleCompleteFollowup(lead.id, task.id)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Mark Completed</span>
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Chronological Activity & Nurturing Timeline (Laravel LeadActivity Style) */}
                    <div className="bg-white rounded-2xl border border-[#E6E7F0] p-5 sm:p-6 space-y-4">
                      <div className="flex items-center gap-2 border-b border-[#E6E7F0] pb-3">
                        <MessageSquare className="w-4 h-4 text-[#6366F1]" />
                        <h4 className="text-xs font-bold text-[#10183A] uppercase tracking-wider">
                          Chronological Interaction & Nurturing Timeline ({activities.length})
                        </h4>
                      </div>

                      {/* Log Activity Form */}
                      <div className="bg-[#FAF9FF] p-4 rounded-2xl border border-[#E8E7FF] space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <span className="text-xs font-bold text-[#10183A]">
                            Record Interaction or Remark:
                          </span>
                          <select
                            value={noteType[lead.id] || "note_added"}
                            onChange={(e) =>
                              setNoteType((prev) => ({ ...prev, [lead.id]: e.target.value }))
                            }
                            className="px-2.5 py-1.5 rounded-lg border border-[#E6E7F0] bg-white text-xs text-[#10183A] font-semibold"
                          >
                            <option value="note_added">📝 Internal Note</option>
                            <option value="call_logged">📞 Phone Call Logged</option>
                            <option value="whatsapp_sent">💬 WhatsApp Message</option>
                            <option value="email_sent">✉️ Email Follow-up</option>
                            <option value="meeting_held">🤝 Strategy Meeting</option>
                          </select>
                        </div>

                        <textarea
                          rows={2}
                          value={noteText[lead.id] || ""}
                          onChange={(e) =>
                            setNoteText((prev) => ({ ...prev, [lead.id]: e.target.value }))
                          }
                          placeholder="Log interaction details, client requirements discussed, or next steps..."
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E7F0] text-xs text-[#10183A] focus:outline-none focus:border-[#6366F1] bg-white"
                        />

                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => handleAddActivity(lead.id)}
                            disabled={submittingNote === lead.id || !(noteText[lead.id] || "").trim()}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#6366F1] to-[#8067FF] hover:opacity-90 disabled:opacity-50 transition-all cursor-pointer shadow-xs"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>{submittingNote === lead.id ? "Saving..." : "Log Activity"}</span>
                          </button>
                        </div>
                      </div>

                      {/* Timeline Events List */}
                      {activities.length === 0 ? (
                        <p className="text-xs text-[#626985] italic">
                          No interaction logs recorded yet. Use the box above to log your first call or remark.
                        </p>
                      ) : (
                        <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E6E7F0]">
                          {activities.map((act) => (
                            <div key={act.id} className="relative space-y-1">
                              <span className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-[#6366F1] ring-4 ring-white" />
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xs font-bold text-[#10183A]">{act.author}</span>
                                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-[#F5F4FF] text-[#6366F1]">
                                  {act.action.replace("_", " ")}
                                </span>
                                <span className="text-[11px] text-[#626985]">
                                  {new Date(act.created_at).toLocaleString()}
                                </span>
                              </div>
                              <p className="text-xs text-[#333E63] leading-relaxed bg-white p-3 rounded-xl border border-[#E6E7F0]">
                                {act.note}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Schedule Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl border border-[#E6E7F0] p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E6E7F0] pb-3">
              <h3 className="text-sm font-bold text-[#10183A] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>Schedule Nurture Follow-up Task</span>
              </h3>
              <button
                onClick={() => setShowTaskModal(null)}
                className="text-xs text-[#626985] hover:text-[#10183A]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#10183A] mb-1">
                  Task Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="e.g. Call to discuss SEO retainer proposal"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E6E7F0] text-xs text-[#10183A] focus:outline-none focus:border-[#6366F1]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#10183A] mb-1">Task Type</label>
                  <select
                    value={taskType}
                    onChange={(e) => setTaskType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E6E7F0] text-xs font-semibold text-[#10183A]"
                  >
                    <option value="phone_call">📞 Phone Call</option>
                    <option value="whatsapp_message">💬 WhatsApp</option>
                    <option value="meeting">🤝 Strategy Meeting</option>
                    <option value="send_proposal">📄 Send Proposal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#10183A] mb-1">Priority</label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E6E7F0] text-xs font-semibold text-[#10183A]"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#10183A] mb-1">
                  Due Date & Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  value={taskDueAt}
                  onChange={(e) => setTaskDueAt(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#E6E7F0] text-xs font-mono text-[#10183A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#10183A] mb-1">Optional Notes</label>
                <textarea
                  rows={2}
                  value={taskNotes}
                  onChange={(e) => setTaskNotes(e.target.value)}
                  placeholder="Key agenda points or deliverables..."
                  className="w-full px-3 py-2 rounded-xl border border-[#E6E7F0] text-xs text-[#10183A]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#E6E7F0]">
              <button
                type="button"
                onClick={() => setShowTaskModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#626985] hover:bg-[#F5F4FF]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleCreateFollowup(showTaskModal)}
                disabled={submittingTask || !taskTitle.trim() || !taskDueAt}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-xs"
              >
                {submittingTask ? "Saving..." : "Save Scheduled Task"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
