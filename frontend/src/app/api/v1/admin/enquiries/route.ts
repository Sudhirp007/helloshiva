import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const rawInquiries = db.prepare("SELECT * FROM enquiries ORDER BY created_at DESC").all();
    
    // Enrich with activities and follow-ups
    const inquiries = rawInquiries.map((inq: any) => {
      const activities = db
        .prepare("SELECT * FROM lead_activities WHERE inquiry_id = ?")
        .all(inq.id);
      const followups = db
        .prepare("SELECT * FROM lead_followups WHERE inquiry_id = ?")
        .all(inq.id);

      return {
        ...inq,
        stage: inq.stage || inq.status || "NEW",
        qualification_score: inq.qualification_score || "WARM",
        timeline: inq.timeline || "1-2 Weeks",
        activities: activities || [],
        followups: followups || [],
      };
    });

    return NextResponse.json({ success: true, inquiries });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, inquiryId } = body;

    if (!inquiryId) {
      return NextResponse.json({ success: false, message: "Inquiry ID is required." }, { status: 400 });
    }

    // 1. Add Chronological Activity (Laravel LeadActivity style)
    if (action === "add_activity") {
      const { note, activityType = "note_added", author = "Agency Admin", oldStage, newStage } = body;
      if (!note || !note.trim()) {
        return NextResponse.json({ success: false, message: "Note text is required." }, { status: 400 });
      }

      const actId = `act-${Date.now()}`;
      db.prepare(`
        INSERT INTO lead_activities (id, inquiry_id, author, action, note, old_stage, new_stage)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(actId, inquiryId, author, activityType, note.trim(), oldStage || null, newStage || null);

      // Update last_contacted_at on the lead
      db.prepare("UPDATE enquiries SET notes = ? WHERE id = ?").run(note.trim(), inquiryId);

      return NextResponse.json({ success: true, message: "Lead activity logged successfully." });
    }

    // 2. Add Scheduled Follow-up Task (Laravel LeadFollowup style)
    if (action === "add_followup") {
      const { type = "phone_call", title, notes, dueAt, priority = "medium" } = body;
      if (!title || !title.trim()) {
        return NextResponse.json({ success: false, message: "Task title is required." }, { status: 400 });
      }

      const folId = `fol-${Date.now()}`;
      db.prepare(`
        INSERT INTO lead_followups (id, inquiry_id, type, title, notes, due_at, priority)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(folId, inquiryId, type, title.trim(), notes || "", dueAt || new Date().toISOString(), priority);

      // Also log as an activity
      db.prepare(`
        INSERT INTO lead_activities (id, inquiry_id, author, action, note, old_stage, new_stage)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(`act-${Date.now()}`, inquiryId, "System", "followup_scheduled", `Scheduled ${type.replace("_", " ")}: ${title.trim()} for ${dueAt}`, null, null);

      return NextResponse.json({ success: true, message: "Follow-up task scheduled successfully." });
    }

    // 3. Mark Follow-up Completed
    if (action === "complete_followup") {
      const { followupId } = body;
      if (!followupId) {
        return NextResponse.json({ success: false, message: "Follow-up ID is required." }, { status: 400 });
      }

      db.prepare(`
        UPDATE lead_followups SET status = ?, completed_at = ? WHERE id = ?
      `).run("completed", new Date().toISOString(), followupId);

      // Log completion activity
      db.prepare(`
        INSERT INTO lead_activities (id, inquiry_id, author, action, note, old_stage, new_stage)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(`act-${Date.now()}`, inquiryId, "System", "followup_completed", "Scheduled follow-up task marked completed.", null, null);

      return NextResponse.json({ success: true, message: "Task completed." });
    }

    return NextResponse.json({ success: false, message: "Invalid action." }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, stage, status, qualificationScore, timeline, qualificationNotes } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: "Inquiry ID is required." }, { status: 400 });
    }

    const currentLead = (db.prepare("SELECT * FROM enquiries").all() as any[]).find((e) => e.id === id);
    const oldStage = currentLead?.stage || currentLead?.status || "NEW";
    const targetStage = stage || status || oldStage;

    db.prepare(`
      UPDATE enquiries SET stage = ? WHERE id = ?
    `).run(targetStage, qualificationScore, timeline, qualificationNotes, new Date().toISOString(), id);

    // If stage changed, record an activity in the timeline!
    if (stage && stage !== oldStage) {
      db.prepare(`
        INSERT INTO lead_activities (id, inquiry_id, author, action, note, old_stage, new_stage)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(
        `act-${Date.now()}`,
        id,
        "Agency Admin",
        "stage_change",
        `Lead stage transitioned from ${oldStage} to ${targetStage}`,
        oldStage,
        targetStage
      );
    }

    return NextResponse.json({ success: true, message: "Lead qualification and stage updated." });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
