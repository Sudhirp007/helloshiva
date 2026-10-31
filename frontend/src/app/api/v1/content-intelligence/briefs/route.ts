import { NextResponse } from "next/server";
import db, { ContentBrief } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (id) {
      const brief = db.getContentBriefById(id);
      if (!brief) {
        return NextResponse.json({ success: false, error: "Brief not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, brief });
    }
    const briefs = db.getContentBriefs();
    return NextResponse.json({ success: true, briefs });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      title,
      slug,
      primary_keyword,
      secondary_keywords,
      search_intent,
      target_persona,
      target_service_slug,
      related_free_tool_slug,
      core_problem,
      key_questions,
      outline,
      cluster_id,
      status,
    } = body;

    // Validation
    if (!title || !slug || !primary_keyword) {
      return NextResponse.json(
        { success: false, error: "Title, slug, and primary keyword are strictly mandatory for an editorial brief." },
        { status: 400 }
      );
    }

    const cleanSlug = slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-");
    const briefId = body.id || `brief-${Date.now()}`;

    const newBrief: ContentBrief = {
      id: briefId,
      cluster_id: cluster_id || "cluster-technical-seo",
      title,
      slug: cleanSlug,
      primary_keyword,
      secondary_keywords: Array.isArray(secondary_keywords)
        ? secondary_keywords
        : (secondary_keywords || "").split(",").map((s: string) => s.trim()).filter(Boolean),
      search_intent: search_intent || "Informational",
      target_persona: target_persona || "Marketing Executives & Technical Founders",
      target_service_slug: target_service_slug || "seo-services",
      related_free_tool_slug: related_free_tool_slug || "seo-page-analyzer",
      core_problem: core_problem || "Addressing high-intent search queries with verified engineering best practices.",
      key_questions: Array.isArray(key_questions)
        ? key_questions
        : (key_questions || "").split("\n").map((q: string) => q.trim()).filter(Boolean),
      outline: Array.isArray(outline)
        ? outline
        : (outline || "").split("\n").map((o: string) => o.trim()).filter(Boolean),
      status: status || "PROPOSED",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    db.saveContentBrief(newBrief);
    return NextResponse.json({ success: true, brief: newBrief });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, error: "id and status are required" }, { status: 400 });
    }

    const brief = db.getContentBriefById(id);
    if (!brief) {
      return NextResponse.json({ success: false, error: "Brief not found" }, { status: 404 });
    }

    db.updateContentBriefStatus(id, status);
    return NextResponse.json({ success: true, message: `Brief status updated to ${status}` });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
