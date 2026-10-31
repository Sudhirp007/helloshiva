import { NextRequest, NextResponse } from "next/server";
import { contentStudioService } from "@/lib/studio/contentStudioService";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = await contentStudioService.generateArticle({
      keywords: body.keywords,
      trend: body.trend,
      market: body.market || body.corridor,
      content_type: body.content_type,
      service_anchor: body.service_anchor || body.property_id,
      brief: body.brief,
      modelOverride: body.model,
      mode: body.mode,
    });

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
