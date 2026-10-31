import { NextRequest, NextResponse } from "next/server";
import { contentStudioService } from "@/lib/studio/contentStudioService";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const market = body.market || body.corridor || "Global Remote & India B2B";
    const focusNiche = body.focus_niche || undefined;
    const model = body.model || undefined;

    const data = await contentStudioService.generateSevenDayCalendar(market, focusNiche, model);

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
