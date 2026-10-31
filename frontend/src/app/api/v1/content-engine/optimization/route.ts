import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { defaultOpenSeoAuditAdapter } from "@/lib/research/openSeoAuditAdapter";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { articleId, title, metaDescription, contentMarkdown, primaryKeyword } = await req.json();

    if (!contentMarkdown) {
      return NextResponse.json(
        { success: false, message: "Content markdown is required." },
        { status: 400 }
      );
    }

    const audit = defaultOpenSeoAuditAdapter.auditContent(
      title || "",
      metaDescription || "",
      contentMarkdown,
      primaryKeyword || ""
    );

    if (articleId) {
      const auditId = `audit-${Date.now()}`;
      db.prepare(`
        INSERT INTO seo_audits (id, article_id, checklist_results, recommendations, is_approved)
        VALUES (?, ?, ?, ?, ?)
      `).run(
        auditId,
        articleId,
        JSON.stringify(audit.checks),
        `Audit score: ${audit.score}/100. Word count: ${audit.wordCount}`,
        audit.score >= 80 ? 1 : 0
      );
    }

    return NextResponse.json({ success: true, audit });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
