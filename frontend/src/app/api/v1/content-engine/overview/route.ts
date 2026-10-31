import { NextResponse } from "next/server";
import db from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const keywordsCount = (db.prepare("SELECT count(*) as cnt FROM keyword_opportunities").get() as any)?.cnt || 0;
    const calendarCount = (db.prepare("SELECT count(*) as cnt FROM editorial_calendar").get() as any)?.cnt || 0;
    const draftsCount = (db.prepare("SELECT count(*) as cnt FROM articles").get() as any)?.cnt || 0;
    const approvedCount = (db.prepare("SELECT count(*) as cnt FROM articles WHERE status = 'APPROVED'").get() as any)?.cnt || 0;
    const socialCount = (db.prepare("SELECT count(*) as cnt FROM social_posts").get() as any)?.cnt || 0;
    const enquiriesCount = (db.prepare("SELECT count(*) as cnt FROM enquiries").get() as any)?.cnt || 0;

    const recentCalendar = db.prepare("SELECT * FROM editorial_calendar ORDER BY scheduled_date ASC LIMIT 5").all();
    const recentDrafts = db.prepare("SELECT id, title, slug, status, updated_at FROM articles ORDER BY updated_at DESC LIMIT 5").all();
    const flags = db.prepare("SELECT * FROM feature_flags").all();

    return NextResponse.json({
      success: true,
      stats: {
        keywordsResearched: keywordsCount,
        articlesPlanned: calendarCount,
        draftsGenerated: draftsCount,
        articlesApproved: approvedCount,
        socialPostsPrepared: socialCount,
        enquiriesReceived: enquiriesCount,
      },
      recentCalendar,
      recentDrafts,
      flags,
      integrations: {
        geminiStatus: process.env.GEMINI_API_KEY ? "CONFIGURED (Live)" : "STAGING / DEMO MODE",
        octopusOnStatus: "READY (Local Algorithmic Adapter)",
        openSeoStatus: "READY (In-Process Audit Heuristics)",
        publishingMode: "STAGING (Manual Approval Mandatory)",
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
