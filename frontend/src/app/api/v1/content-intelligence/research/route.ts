import { NextResponse } from "next/server";
import db, { KeywordOpportunity } from "@/lib/db";

export async function GET() {
  try {
    const opportunities = db.getKeywordOpportunities();
    return NextResponse.json({ success: true, opportunities });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, seedKeyword, pillar } = body;

    if (action === "SCAN_TRENDS" || action === "EXPAND_SEED") {
      const kw = seedKeyword?.trim() || "technical seo audit";
      
      // Generate rich strategic keyword expansions matching HelloShiva services
      const sampleExpansions: KeywordOpportunity[] = [
        {
          id: `kw-${Date.now()}-1`,
          keyword: `${kw} checklist for enterprise`,
          search_intent: "Commercial",
          topic_cluster: pillar || "Technical SEO & Web Architecture",
          suggested_title: `The 2026 ${kw.toUpperCase()} Checklist: 25 Bottlenecks to Fix Before Scaling`,
          opportunity_explanation: `Strong commercial intent from high-ticket decision-makers searching for actionable audit frameworks.`,
          competition_level: "Medium",
          estimated_volume: "1,800/mo",
          research_source: "Google Search Central & Trends Radar",
          status: "DISCOVERED",
          created_at: new Date().toISOString(),
        },
        {
          id: `kw-${Date.now()}-2`,
          keyword: `${kw} vs modern web performance`,
          search_intent: "Informational",
          topic_cluster: pillar || "Website Engineering & Digital Growth",
          suggested_title: `Why ${kw} Alone Won't Save Your Site: The Modern Core Web Vitals Benchmark`,
          opportunity_explanation: `Surging informational query connecting technical diagnostics directly to HelloShiva free tools.`,
          competition_level: "Low",
          estimated_volume: "3,200/mo",
          research_source: "Developer Search Trends",
          status: "DISCOVERED",
          created_at: new Date().toISOString(),
        },
        {
          id: `kw-${Date.now()}-3`,
          keyword: `how to calculate roi on ${kw}`,
          search_intent: "Commercial",
          topic_cluster: pillar || "Performance Marketing & CRO",
          suggested_title: `Calculating ROI on ${kw}: How to Justify Marketing Spend to Executive Boards`,
          opportunity_explanation: `Bottom-of-funnel decision query for founders and CMOs looking to contract agency retainers.`,
          competition_level: "Low",
          estimated_volume: "950/mo",
          research_source: "Executive Search Intent Radar",
          status: "DISCOVERED",
          created_at: new Date().toISOString(),
        },
      ];

      for (const item of sampleExpansions) {
        db.saveKeywordOpportunity(item);
      }

      return NextResponse.json({ success: true, added: sampleExpansions });
    }

    if (action === "ADD_CUSTOM") {
      const { keyword, search_intent, topic_cluster, suggested_title, opportunity_explanation, competition_level, estimated_volume } = body;
      if (!keyword) {
        return NextResponse.json({ success: false, error: "Keyword is required" }, { status: 400 });
      }

      const item: KeywordOpportunity = {
        id: `kw-${Date.now()}`,
        keyword,
        search_intent: search_intent || "Informational",
        topic_cluster: topic_cluster || "Technical SEO & Web Architecture",
        suggested_title: suggested_title || `Comprehensive Guide to ${keyword}`,
        opportunity_explanation: opportunity_explanation || "Discovered via HelloShiva Research Desk",
        competition_level: competition_level || "Medium",
        estimated_volume: estimated_volume || "1,500/mo",
        research_source: "Manual Research Desk Input",
        status: "DISCOVERED",
        created_at: new Date().toISOString(),
      };

      db.saveKeywordOpportunity(item);
      return NextResponse.json({ success: true, opportunity: item });
    }

    if (action === "UPDATE_STATUS") {
      const { id, status } = body;
      const opportunities = db.getKeywordOpportunities();
      const opp = opportunities.find(o => o.id === id);
      if (opp) {
        opp.status = status;
        db.saveKeywordOpportunity(opp);
        return NextResponse.json({ success: true, opportunity: opp });
      }
      return NextResponse.json({ success: false, error: "Opportunity not found" }, { status: 404 });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
