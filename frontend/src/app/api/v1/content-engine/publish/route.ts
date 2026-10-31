import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { id, status } = await req.json();

    if (!id) {
      return NextResponse.json({ success: false, message: "Article ID is required." }, { status: 400 });
    }

    const targetStatus = status === "PUBLISHED" ? "PUBLISHED" : "DRAFT_READY";
    const publishedAt = targetStatus === "PUBLISHED" ? new Date().toISOString() : null;

    // Update in database
    const updateStmt = db.prepare("UPDATE articles SET status = ?, published_at = ? WHERE id = ?");
    updateStmt.run(targetStatus, publishedAt, id);

    // Fetch updated article
    const updated = db.prepare("SELECT * FROM articles WHERE id = ?").get(id);

    if (!updated) {
      return NextResponse.json({ success: false, message: "Article not found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: targetStatus === "PUBLISHED"
        ? `Article successfully published to live blog at /blog/${updated.slug}`
        : "Article reverted to draft mode.",
      article: updated,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
