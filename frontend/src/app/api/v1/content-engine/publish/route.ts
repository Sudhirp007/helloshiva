import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { id, status, scheduled_date } = await req.json();

    if (!id) {
      return NextResponse.json({ success: false, message: "Article ID is required." }, { status: 400 });
    }

    let targetStatus = "DRAFT_READY";
    if (status === "PUBLISHED") targetStatus = "PUBLISHED";
    else if (status === "SCHEDULED") targetStatus = "SCHEDULED";

    const publishedAt = targetStatus === "PUBLISHED" ? new Date().toISOString() : null;
    const schedDate = targetStatus === "SCHEDULED" ? (scheduled_date || new Date().toISOString().split("T")[0]) : null;

    // Update in database
    const updateStmt = db.prepare("UPDATE articles SET status = ?, published_at = ? WHERE id = ?");
    updateStmt.run(targetStatus, schedDate || publishedAt, id);

    // Fetch updated article
    const updated = db.prepare("SELECT * FROM articles WHERE id = ?").get(id);

    if (!updated) {
      return NextResponse.json({ success: false, message: "Article not found." }, { status: 404 });
    }

    let message = "Article reverted to draft mode.";
    if (targetStatus === "PUBLISHED") {
      message = `🚀 Article published live at /blog/${updated.slug}`;
    } else if (targetStatus === "SCHEDULED") {
      message = `📅 Article scheduled for release on ${schedDate}`;
    }

    return NextResponse.json({
      success: true,
      message,
      article: updated,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
