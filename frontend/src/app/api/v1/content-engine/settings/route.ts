import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const flags = db.prepare("SELECT * FROM feature_flags").all();
    const settings = db.prepare("SELECT * FROM integration_settings").all();
    return NextResponse.json({ success: true, flags, settings });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { flags, settings } = await req.json();

    if (flags && typeof flags === "object") {
      const updateFlag = db.prepare("UPDATE feature_flags SET enabled = ? WHERE key = ?");
      for (const [key, enabled] of Object.entries(flags)) {
        // Enforce hard lock on AUTOMATIC_PUBLISHING_ENABLED
        if (key === "AUTOMATIC_PUBLISHING_ENABLED" && enabled === 1) {
          continue; // Block production auto-publish activation
        }
        updateFlag.run(enabled ? 1 : 0, key);
      }
    }

    if (settings && typeof settings === "object") {
      const upsertSetting = db.prepare(`
        INSERT INTO integration_settings (key, value) VALUES (?, ?)
        ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
      `);
      for (const [key, value] of Object.entries(settings)) {
        if (typeof value === "string") {
          upsertSetting.run(key, value);
        }
      }
    }

    return NextResponse.json({ success: true, message: "Settings updated successfully." });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
