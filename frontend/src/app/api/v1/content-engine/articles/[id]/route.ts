import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const article = db.prepare("SELECT * FROM articles WHERE id = ?").get(id);

    if (!article) {
      return NextResponse.json({ success: false, message: "Article not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, article });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { title, slug, meta_description, content_markdown, status } = body;

    const existing = db.prepare("SELECT * FROM articles WHERE id = ?").get(id);
    if (!existing) {
      return NextResponse.json({ success: false, message: "Article not found" }, { status: 404 });
    }

    // Update article content
    db.prepare(`
      UPDATE articles 
      SET title = ?, slug = ?, meta_description = ?, content_markdown = ?, updated_at = ?
      WHERE id = ?
    `).run(
      title || existing.title,
      slug || existing.slug,
      meta_description || existing.meta_description,
      content_markdown !== undefined ? content_markdown : existing.content_markdown,
      new Date().toISOString(),
      id
    );

    // If status is provided, update status
    if (status) {
      db.prepare("UPDATE articles SET status = ? WHERE id = ?").run(status, id);
    }

    // Record revision in article_versions
    const versionId = `ver-${Date.now()}`;
    db.prepare(`
      INSERT INTO article_versions (id, article_id, version_number, created_by, change_summary, content_markdown)
      VALUES (?, ?, ?, 'HelloShiva Editor', 'Manual content & SEO metadata revision', ?)
    `).run(
      versionId,
      id,
      (existing.current_version || 1) + 1,
      content_markdown !== undefined ? content_markdown : existing.content_markdown
    );

    const updated = db.prepare("SELECT * FROM articles WHERE id = ?").get(id);

    return NextResponse.json({
      success: true,
      message: "Article updated successfully",
      article: updated,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    db.prepare("DELETE FROM articles WHERE id = ?").run(id);
    return NextResponse.json({ success: true, message: "Article deleted successfully." });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
