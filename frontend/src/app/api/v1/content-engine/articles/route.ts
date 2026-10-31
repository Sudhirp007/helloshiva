import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    let articles: any[];
    if (status === "PUBLISHED") {
      articles = db.prepare("SELECT * FROM articles WHERE status = 'PUBLISHED' ORDER BY updated_at DESC").all();
    } else if (status === "DRAFT_READY") {
      articles = db.prepare("SELECT * FROM articles WHERE status = 'DRAFT_READY' ORDER BY updated_at DESC").all();
    } else {
      articles = db.prepare("SELECT * FROM articles ORDER BY updated_at DESC").all();
    }

    return NextResponse.json({ success: true, articles });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
