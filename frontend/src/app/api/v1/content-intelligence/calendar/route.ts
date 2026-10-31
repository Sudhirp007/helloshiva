import { NextResponse } from "next/server";
import db, { CalendarEntry } from "@/lib/db";

export async function GET() {
  try {
    const entries = db.getEditorialCalendar();
    return NextResponse.json({ success: true, entries });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      scheduled_date,
      scheduled_time,
      timezone,
      theme,
      primary_keyword,
      supporting_keywords,
      search_intent,
      suggested_headline,
      target_audience,
      suggested_internal_links,
      suggested_cta,
      status,
      brief_id,
      article_id,
    } = body;

    if (!scheduled_date || !suggested_headline) {
      return NextResponse.json({ success: false, error: "Scheduled date and headline are required" }, { status: 400 });
    }

    const entryId = body.id || `cal-${Date.now()}`;
    const newEntry: CalendarEntry = {
      id: entryId,
      brief_id: brief_id || null,
      article_id: article_id || null,
      scheduled_date,
      scheduled_time: scheduled_time || "10:00 AM",
      timezone: timezone || "IST (UTC+5:30)",
      theme: theme || "Technical SEO & Web Architecture",
      primary_keyword: primary_keyword || "",
      supporting_keywords: supporting_keywords || "",
      search_intent: search_intent || "Informational",
      competitor_gap_notes: body.competitor_gap_notes || "Demonstrate HelloShiva code-level engineering authority.",
      suggested_headline,
      content_format: body.content_format || "Strategic Engineering Blueprint",
      target_audience: target_audience || "Founders, CMOs, and Technical Marketers",
      suggested_internal_links: suggested_internal_links || "/services/technical-seo, /tools/seo-page-analyzer",
      suggested_cta: suggested_cta || "Schedule a Technical Strategy Consultation",
      status: status || "SCHEDULED",
      created_at: new Date().toISOString(),
    };

    db.saveCalendarEntry(newEntry);
    return NextResponse.json({ success: true, entry: newEntry });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, scheduled_date, scheduled_time, status } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Calendar entry ID is required" }, { status: 400 });
    }

    const entries = db.getEditorialCalendar();
    const entry = entries.find((e) => e.id === id);
    if (!entry) {
      return NextResponse.json({ success: false, error: "Entry not found" }, { status: 404 });
    }

    if (scheduled_date) entry.scheduled_date = scheduled_date;
    if (scheduled_time) entry.scheduled_time = scheduled_time;
    if (status) entry.status = status;

    db.saveCalendarEntry(entry);
    return NextResponse.json({ success: true, entry });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
