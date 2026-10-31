import { NextRequest, NextResponse } from "next/server";
import { contentStudioService } from "@/lib/studio/contentStudioService";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const title = body.title;
    const url = body.url;
    const content = body.content || body.content_markdown || "";
    const keywords = body.keywords || "Digital Marketing, SEO, Growth";

    if (!title) {
      return NextResponse.json({ success: false, message: "Title is required." }, { status: 400 });
    }

    const campaign = contentStudioService.generateSocialCampaign(title, url, content, keywords);

    return NextResponse.json({
      success: true,
      channels: campaign.channels,
      share_urls: campaign.share_urls,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
