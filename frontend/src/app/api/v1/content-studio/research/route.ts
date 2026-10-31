import { NextRequest, NextResponse } from "next/server";
import { contentStudioService, DIGITAL_MARKETING_KEYWORD_CLUSTERS } from "@/lib/studio/contentStudioService";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    success: true,
    clusters: DIGITAL_MARKETING_KEYWORD_CLUSTERS,
    isAiAvailable: contentStudioService.isAiAvailable(),
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const niche = body.niche || "b2b performance marketing";
    const market = body.market || body.corridor || "Global Remote & India B2B";
    const model = body.model || undefined;

    const data = await contentStudioService.researchKeywordsAndOpportunities(niche, market, model);

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
