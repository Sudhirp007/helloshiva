import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const inquiries = db.prepare("SELECT * FROM enquiries ORDER BY created_at DESC").all();
    return NextResponse.json({ success: true, inquiries });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, status, notes } = await req.json();
    if (!id) {
      return NextResponse.json({ success: false, message: "Inquiry ID is required." }, { status: 400 });
    }

    if (status) {
      db.prepare("UPDATE enquiries SET status = ? WHERE id = ?").run(status, id);
    }
    if (notes !== undefined) {
      db.prepare("UPDATE enquiries SET notes = ? WHERE id = ?").run(notes, id);
    }

    return NextResponse.json({ success: true, message: "Inquiry updated." });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
