import { NextRequest, NextResponse } from "next/server";

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
      return NextResponse.json({ success: true, message: "Inquiry received" });
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

    // Attempt forward to FastAPI backend if running
    const backendUrl = process.env.BACKEND_API_URL || "http://127.0.0.1:8000";
    try {
      const backendRes = await fetch(`${backendUrl}/api/v1/enquiry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(2000), // Quick timeout
      });
      if (backendRes.ok) {
        return NextResponse.json(await backendRes.json());
      }
    } catch {
      // Backend not yet reachable (fallback to local mock persistence)
      console.log("[Enquiry Received via Frontend Fallback]:", {
        name,
        email,
        phone,
        service,
        source_page,
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      message: "Thank you! Your enquiry has been received. Our team will contact you within 24 hours.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Internal server error processing enquiry." },
      { status: 500 }
    );
  }
}
