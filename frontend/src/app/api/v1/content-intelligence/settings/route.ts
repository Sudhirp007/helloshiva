import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const geminiKey = process.env.GEMINI_API_KEY || db.getSetting("GEMINI_API_KEY", "");
    const geminiModel = db.getSetting("GEMINI_MODEL", "gemini-3.5-flash");
    const brandName = db.getSetting("EDITORIAL_BRAND_NAME", "HelloShiva Digital Agency");
    const antiFluff = db.getSetting("ANTI_AI_FLUFF_ENABLED", "1");

    return NextResponse.json({
      success: true,
      settings: {
        geminiKeyMasked: geminiKey ? `${geminiKey.slice(0, 8)}...${geminiKey.slice(-4)}` : "Not Configured",
        geminiModel,
        brandName,
        antiFluff: antiFluff === "1",
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { geminiKey, geminiModel, brandName, antiFluff } = body;

    if (geminiKey && !geminiKey.includes("...")) {
      db.setSetting("GEMINI_API_KEY", geminiKey.trim());
    }
    if (geminiModel) {
      db.setSetting("GEMINI_MODEL", geminiModel);
    }
    if (brandName) {
      db.setSetting("EDITORIAL_BRAND_NAME", brandName);
    }
    if (antiFluff !== undefined) {
      db.setSetting("ANTI_AI_FLUFF_ENABLED", antiFluff ? "1" : "0");
    }

    return NextResponse.json({ success: true, message: "Settings saved successfully" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
