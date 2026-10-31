import { NextRequest, NextResponse } from "next/server";
import { safeFetch } from "@/lib/ssrf";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json({ success: false, message: "Valid URL is required." }, { status: 400 });
    }

    const startTime = Date.now();
    const fetchResult = await safeFetch(url, { timeoutMs: 5000 });
    const responseTimeMs = Date.now() - startTime;
    const headers = fetchResult.headers;

    const securityHeaders = [
      {
        header: "Strict-Transport-Security",
        present: Boolean(headers["strict-transport-security"]),
        value: headers["strict-transport-security"] || "Not configured",
        description: "Enforces encrypted HTTPS connections and protects against SSL stripping.",
        type: "Security",
      },
      {
        header: "Content-Security-Policy",
        present: Boolean(headers["content-security-policy"]),
        value: headers["content-security-policy"] ? "Configured" : "Not configured",
        description: "Prevents Cross-Site Scripting (XSS) and unauthorized script injection.",
        type: "Security",
      },
      {
        header: "X-Frame-Options",
        present: Boolean(headers["x-frame-options"]),
        value: headers["x-frame-options"] || "Not configured",
        description: "Defends against clickjacking by controlling whether the site can be embedded in an iframe.",
        type: "Security",
      },
      {
        header: "X-Content-Type-Options",
        present: Boolean(headers["x-content-type-options"]),
        value: headers["x-content-type-options"] || "Not configured",
        description: "Forces browsers to respect the declared MIME type, preventing MIME confusion exploits.",
        type: "Security",
      },
      {
        header: "Referrer-Policy",
        present: Boolean(headers["referrer-policy"]),
        value: headers["referrer-policy"] || "Not configured",
        description: "Controls what referrer information is sent when users navigate away from your site.",
        type: "Privacy",
      },
      {
        header: "Cache-Control",
        present: Boolean(headers["cache-control"]),
        value: headers["cache-control"] || "Not configured",
        description: "Instructs browsers and edge CDNs how long resources can be cached.",
        type: "Performance",
      },
    ];

    return NextResponse.json({
      success: true,
      url: fetchResult.finalUrl,
      statusCode: fetchResult.statusCode,
      statusText: fetchResult.statusText,
      responseTimeMs,
      rawHeaders: headers,
      securityHeaders,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to inspect HTTP headers." },
      { status: 400 }
    );
  }
}
