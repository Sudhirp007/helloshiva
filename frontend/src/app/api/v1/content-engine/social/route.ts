import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { generateSocialDistribution } from "@/lib/social/socialGenerator";

export async function POST(req: NextRequest) {
  try {
    const { articleId, title, slug, summary, primaryTakeaway } = await req.json();

    if (!title || !slug) {
      return NextResponse.json({ success: false, message: "Title and slug are required." }, { status: 400 });
    }

    const posts = generateSocialDistribution({
      title,
      slug,
      summary: summary || "Comprehensive guide by HelloShiva",
      primaryTakeaway: primaryTakeaway || "Fix code-level technical SEO before scaling ad spend.",
    });

    if (articleId) {
      const insertPost = db.prepare(`
        INSERT INTO social_posts (id, article_id, platform, content_text, hashtags, slide_data, status)
        VALUES (?, ?, ?, ?, ?, ?, 'DRAFT')
      `);

      for (const p of posts) {
        insertPost.run(
          `sp-${Date.now()}-${p.platform}`,
          articleId,
          p.platform,
          p.contentText,
          p.hashtags.join(", "),
          p.carouselSlides ? JSON.stringify(p.carouselSlides) : null
        );
      }
    }

    return NextResponse.json({ success: true, posts });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
