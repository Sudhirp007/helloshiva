import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required." },
        { status: 400 }
      );
    }

    const user = db.prepare("SELECT * FROM admin_users WHERE email = ? AND password = ?").get(email, password);

    // Also support default admin if db is being re-seeded
    const isValid = (user && user.password === password) || (email === "admin@helloshiva.com" && password === "admin");

    if (!isValid) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password." },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Admin authentication successful",
      user: {
        email: email,
        name: "HelloShiva Lead Administrator",
        role: "SUPER_ADMIN",
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
