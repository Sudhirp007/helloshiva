import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { generateSevenDayCalendar, getCalendarEntries } from "@/lib/calendar/calendarEngine";

export async function GET() {
  try {
    let entries = getCalendarEntries();
    if (entries.length === 0) {
      // Auto-seed initial 7 days if empty
      entries = generateSevenDayCalendar();
    }
    return NextResponse.json({ success: true, entries });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const startDate = body.startDate || undefined;

    // Delete existing proposals and regenerate fresh 7-day proposals
    db.prepare("DELETE FROM editorial_calendar WHERE status = 'PROPOSED'").run();
    const entries = generateSevenDayCalendar(startDate);

    return NextResponse.json({ success: true, message: "Regenerated 7-day editorial calendar.", entries });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, status, scheduled_date } = await req.json();
    if (!id) {
      return NextResponse.json({ success: false, message: "Entry ID required." }, { status: 400 });
    }

    if (status) {
      db.prepare("UPDATE editorial_calendar SET status = ? WHERE id = ?").run(status, id);
    }
    if (scheduled_date) {
      db.prepare("UPDATE editorial_calendar SET scheduled_date = ? WHERE id = ?").run(scheduled_date, id);
    }

    return NextResponse.json({ success: true, message: "Calendar entry updated." });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
