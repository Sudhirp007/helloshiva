import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { defaultOctopusOnAdapter } from "@/lib/research/octopusOnAdapter";

export async function GET() {
  try {
    const opportunities = db.prepare("SELECT * FROM keyword_opportunities ORDER BY created_at DESC LIMIT 50").all();
    return NextResponse.json({ success: true, opportunities });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { seed } = await req.json();
    if (!seed || typeof seed !== "string" || !seed.trim()) {
      return NextResponse.json({ success: false, message: "Seed keyword is required." }, { status: 400 });
    }

    const discovered = await defaultOctopusOnAdapter.discoverKeywords(seed);
    const insertStmt = db.prepare(`
      INSERT INTO keyword_opportunities (
        id, keyword, search_intent, topic_cluster, suggested_title,
        opportunity_explanation, competition_level, research_source, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'DISCOVERED')
    `);

    for (const item of discovered) {
      const id = `kw-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      insertStmt.run(
        id,
        item.keyword,
        item.searchIntent,
        item.topicCluster,
        item.suggestedTitle,
        item.opportunityExplanation,
        item.competitionLevel,
        item.source
      );
    }

    return NextResponse.json({ success: true, count: discovered.length, discovered });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
