import { NextRequest, NextResponse } from "next/server";
import { contentStudioService } from "@/lib/studio/contentStudioService";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const articleId = body.article_id || body.id;
    const goal = body.goal;
    const keywords = body.keywords;
    const model = body.model;

    if (!articleId) {
      return NextResponse.json({ success: false, message: "article_id is required." }, { status: 400 });
    }
    if (!goal) {
      return NextResponse.json({ success: false, message: "goal is required." }, { status: 400 });
    }

    const data = await contentStudioService.improveExistingContent({
      articleId,
      goal,
      keywords,
      modelOverride: model,
    });

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
