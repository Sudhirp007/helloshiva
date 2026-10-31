import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      phone,
      company,
      service,
      message,
      source_page,
      referrer,
      utm_source,
      utm_medium,
      utm_campaign,
      honeypot,
    } = body;

    // 1. Anti-spam honeypot detection
    if (honeypot) {
      return NextResponse.json({ success: true, message: "Inquiry received." });
    }

    // 2. Input validation
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid name." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (!message || typeof message !== "string" || message.trim().length < 5) {
      return NextResponse.json(
        { success: false, message: "Please include project details or goals." },
        { status: 400 }
      );
    }

    // 3. Persist to SQLite Database
    const id = `enq-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const insertStmt = db.prepare(`
      INSERT INTO enquiries (
        id, name, email, phone, company, service, message,
        source_page, referrer, utm_source, utm_medium, utm_campaign, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'NEW')
    `);

    insertStmt.run(
      id,
      name.trim(),
      email.trim(),
      phone ? phone.trim() : null,
      company ? company.trim() : null,
      service || "seo-services",
      message.trim(),
      source_page || "/",
      referrer || null,
      utm_source || null,
      utm_medium || null,
      utm_campaign || null
    );

    return NextResponse.json({
      success: true,
      message: "Thank you! Your enquiry has been received. Our team will contact you within 24 hours.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error processing enquiry." },
      { status: 500 }
    );
  }
}
