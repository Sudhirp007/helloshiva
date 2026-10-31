import { NextRequest, NextResponse } from "next/server";
import { contentStudioService } from "@/lib/studio/contentStudioService";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await contentStudioService.publishArticle({
      id: body.id || body.article_id,
      title: body.title,
      slug: body.slug,
      category: body.category,
      excerpt: body.excerpt || body.meta_description,
      content: body.content || body.content_markdown,
      read_time: body.read_time,
      status: body.status || "PUBLISHED",
      scheduled_date: body.scheduled_date,
    });

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
