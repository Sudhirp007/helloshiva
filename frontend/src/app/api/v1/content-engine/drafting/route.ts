import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { defaultGeminiDraftingAdapter } from "@/lib/ai/geminiAdapter";

export async function GET() {
  try {
    const articles = db.prepare("SELECT * FROM articles ORDER BY updated_at DESC").all();
    return NextResponse.json({ success: true, articles });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action = "create", headline, primaryKeyword, theme, targetAudience, suggestedCta, calendarId, originalTitle, originalContent } = body;

    if (action === "improve") {
      if (!originalTitle || !originalContent) {
        return NextResponse.json({ success: false, message: "Original title and content are required." }, { status: 400 });
      }
      const improvement = await defaultGeminiDraftingAdapter.improveExistingContent(originalTitle, originalContent);
      return NextResponse.json({ success: true, improvement });
    }

    // Default: Create new article draft
    if (!headline || !primaryKeyword) {
      return NextResponse.json({ success: false, message: "Headline and primary keyword are required." }, { status: 400 });
    }

    const draft = await defaultGeminiDraftingAdapter.generateArticleWithAI({
      headline,
      primaryKeyword,
      theme: theme || "Technical SEO Strategy",
      targetAudience: targetAudience || "Digital Marketers and Founders",
      suggestedCta,
      modelOverride: body.modelOverride,
    });

    const articleId = `art-${Date.now()}`;
    const insertArticle = db.prepare(`
      INSERT INTO articles (
        id, calendar_id, title, slug, meta_description, outline, content_markdown,
        current_version, status, author
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 1, 'DRAFT_READY', 'HelloShiva AI Editorial')
    `);

    insertArticle.run(
      articleId,
      calendarId || null,
      draft.title,
      draft.slug,
      draft.metaDescription,
      JSON.stringify(draft.outline),
      draft.contentMarkdown
    );

    // Record initial version in audit log
    const insertVersion = db.prepare(`
      INSERT INTO article_versions (
        id, article_id, version_number, created_by, change_summary, content_markdown
      ) VALUES (?, ?, 1, 'Gemini AI Drafter', 'Initial draft generated from approved editorial brief', ?)
    `);
    insertVersion.run(`ver-${Date.now()}`, articleId, draft.contentMarkdown);

    // If linked to calendar, update calendar status to IN_DRAFTING
    if (calendarId) {
      db.prepare("UPDATE editorial_calendar SET status = 'IN_DRAFTING' WHERE id = ?").run(calendarId);
    }

    return NextResponse.json({ success: true, articleId, draft });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
