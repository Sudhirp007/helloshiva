import { NextResponse } from "next/server";
import db, { TopicCluster } from "@/lib/db";

export async function GET() {
  try {
    const clusters = db.getTopicClusters();
    return NextResponse.json({ success: true, clusters });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, slug, pillar_page_headline, target_service_slug, related_free_tool_slug, subtopics } = body;

    if (!title || !slug) {
      return NextResponse.json({ success: false, error: "Title and slug are required" }, { status: 400 });
    }

    const clusterId = body.id || `cluster-${Date.now()}`;
    const newCluster: TopicCluster = {
      id: clusterId,
      pillar_id: body.pillar_id || "pillar-custom",
      title,
      slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
      pillar_page_headline: pillar_page_headline || title,
      target_service_slug: target_service_slug || "seo-services",
      related_free_tool_slug: related_free_tool_slug || "seo-page-analyzer",
      subtopics: subtopics || [],
      completeness_score: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    db.saveTopicCluster(newCluster);
    return NextResponse.json({ success: true, cluster: newCluster });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
