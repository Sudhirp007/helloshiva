import { NextResponse } from "next/server";
import db, { ArticleItem } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const slug = searchParams.get("slug");
    const status = searchParams.get("status") || "ALL";

    if (id) {
      const article = db.getArticleById(id);
      if (!article) return NextResponse.json({ success: false, error: "Article not found" }, { status: 404 });
      return NextResponse.json({ success: true, article });
    }

    if (slug) {
      const article = db.getArticleBySlug(slug);
      if (!article) return NextResponse.json({ success: false, error: "Article not found" }, { status: 404 });
      return NextResponse.json({ success: true, article });
    }

    const articles = db.getArticles(status);
    return NextResponse.json({ success: true, articles });
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
      meta_description,
      category,
      outline,
      content_markdown,
      status,
      target_service_slug,
      related_free_tool_slug,
      primary_keyword,
      secondary_keywords,
      author,
      brief_id,
      scheduled_date,
      scheduled_time,
      timezone,
    } = body;

    if (!title || !slug) {
      return NextResponse.json({ success: false, error: "Title and slug are required" }, { status: 400 });
    }

    const cleanSlug = slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-");
    const articleId = body.id || `art-${Date.now()}`;

    const newArticle: ArticleItem = {
      id: articleId,
      brief_id: brief_id || null,
      calendar_id: body.calendar_id || null,
      cluster_id: body.cluster_id || null,
      title,
      slug: cleanSlug,
      meta_description: meta_description || `Actionable guide to ${title} by HelloShiva Strategic Engineering.`,
      category: category || "Technical SEO & Web Engineering",
      target_service_slug: target_service_slug || "seo-services",
      related_free_tool_slug: related_free_tool_slug || "seo-page-analyzer",
      primary_keyword: primary_keyword || "",
      secondary_keywords: secondary_keywords || [],
      outline: Array.isArray(outline) ? outline : (outline || "").split("\n").filter(Boolean),
      content_markdown: content_markdown || `# ${title}\n\nDraft content in progress...`,
      current_version: 1,
      status: status || "DRAFT",
      author: author || "HelloShiva Strategic Engineering",
      scheduled_date: scheduled_date || null,
      scheduled_time: scheduled_time || "10:00 AM",
      timezone: timezone || "IST (UTC+5:30)",
      published_at: status === "PUBLISHED" ? new Date().toISOString() : null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    db.saveArticle(newArticle);

    if (status === "SCHEDULED" && scheduled_date) {
      db.saveCalendarEntry({
        id: `cal-${articleId}`,
        article_id: articleId,
        scheduled_date,
        scheduled_time: scheduled_time || "10:00 AM",
        timezone: timezone || "IST (UTC+5:30)",
        theme: category || "Strategic Growth Guide",
        primary_keyword: primary_keyword || "",
        supporting_keywords: Array.isArray(secondary_keywords) ? secondary_keywords.join(", ") : secondary_keywords || "",
        search_intent: "Commercial",
        competitor_gap_notes: "Scheduled release from Content Studio",
        suggested_headline: title,
        content_format: "Strategic Guide",
        target_audience: "Founders, CMOs & Marketing Leaders",
        suggested_internal_links: `/services/${target_service_slug || "seo-services"}`,
        suggested_cta: "Consult HelloShiva Strategic Engineering",
        status: "SCHEDULED",
        created_at: new Date().toISOString(),
      });
    }

    return NextResponse.json({ success: true, article: newArticle });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, title, slug, meta_description, content_markdown, status, scheduled_date, scheduled_time, timezone } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Article ID is required" }, { status: 400 });
    }

    const article = db.getArticleById(id);
    if (!article) {
      return NextResponse.json({ success: false, error: "Article not found" }, { status: 404 });
    }

    if (title !== undefined) article.title = title;
    if (slug !== undefined) article.slug = slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-");
    if (meta_description !== undefined) article.meta_description = meta_description;
    if (content_markdown !== undefined) article.content_markdown = content_markdown;
    if (scheduled_date !== undefined) article.scheduled_date = scheduled_date;
    if (scheduled_time !== undefined) article.scheduled_time = scheduled_time;
    if (timezone !== undefined) article.timezone = timezone;
    
    if (status !== undefined) {
      article.status = status;
      if (status === "PUBLISHED" && !article.published_at) {
        article.published_at = new Date().toISOString();
      }
    }

    article.current_version = (article.current_version || 1) + 1;
    article.updated_at = new Date().toISOString();

    db.saveArticle(article);

    if (article.status === "SCHEDULED" && article.scheduled_date) {
      db.saveCalendarEntry({
        id: `cal-${article.id}`,
        article_id: article.id,
        scheduled_date: article.scheduled_date,
        scheduled_time: article.scheduled_time || "10:00 AM",
        timezone: article.timezone || "IST (UTC+5:30)",
        theme: article.category || "Strategic Growth Guide",
        primary_keyword: article.primary_keyword || "",
        supporting_keywords: (article.secondary_keywords || []).join(", "),
        search_intent: "Commercial",
        competitor_gap_notes: "Scheduled release from Content Studio",
        suggested_headline: article.title,
        content_format: "Strategic Guide",
        target_audience: "Founders, CMOs & Marketing Leaders",
        suggested_internal_links: `/services/${article.target_service_slug || "seo-services"}`,
        suggested_cta: "Consult HelloShiva Strategic Engineering",
        status: "SCHEDULED",
        created_at: new Date().toISOString(),
      });
    }
    return NextResponse.json({ success: true, article });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });

    db.deleteArticle(id);
    return NextResponse.json({ success: true, message: "Article deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
