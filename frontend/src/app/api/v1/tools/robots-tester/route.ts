import { NextRequest, NextResponse } from "next/server";
import { safeFetch } from "@/lib/ssrf";

export async function POST(req: NextRequest) {
  try {
    const { url, path = "/", userAgent = "Googlebot" } = await req.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json({ success: false, message: "Valid domain or URL is required." }, { status: 400 });
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url.startsWith("http") ? url : `https://${url}`);
    } catch {
      return NextResponse.json({ success: false, message: "Invalid URL syntax." }, { status: 400 });
    }

    const robotsUrl = `${parsedUrl.origin}/robots.txt`;
    let robotsContent = "";
    let statusCode = 200;

    try {
      const fetchResult = await safeFetch(robotsUrl, { timeoutMs: 5000 });
      robotsContent = fetchResult.bodyText;
      statusCode = fetchResult.statusCode;
    } catch (err: any) {
      return NextResponse.json({
        success: true,
        allowed: true,
        matchingRule: "No accessible robots.txt found (HTTP error / 404). Search engines default to ALLOWED.",
        robotsUrl,
        statusCode: 404,
        robotsContent: "",
      });
    }

    // Parse robots.txt for user-agent rules
    const lines = robotsContent.split("\n").map((l) => l.trim());
    let currentAgent = "";
    let isApplicableAgent = false;
    let matchingRule: string | null = null;
    let allowed = true;

    const normalizedPath = path.startsWith("/") ? path : `/${path}`;

    for (const rawLine of lines) {
      const line = rawLine.split("#")[0].trim(); // Remove inline comments
      if (!line) continue;

      const lower = line.toLowerCase();
      if (lower.startsWith("user-agent:")) {
        const agent = line.substring(11).trim();
        currentAgent = agent;
        isApplicableAgent =
          agent === "*" || agent.toLowerCase() === userAgent.toLowerCase();
      } else if (isApplicableAgent) {
        if (lower.startsWith("disallow:")) {
          const rulePath = line.substring(9).trim();
          if (rulePath && normalizedPath.startsWith(rulePath)) {
            allowed = false;
            matchingRule = `Disallow: ${rulePath} (Agent: ${currentAgent})`;
            break;
          }
        } else if (lower.startsWith("allow:")) {
          const rulePath = line.substring(6).trim();
          if (rulePath && normalizedPath.startsWith(rulePath)) {
            allowed = true;
            matchingRule = `Allow: ${rulePath} (Agent: ${currentAgent})`;
            break;
          }
        }
      }
    }

    if (!matchingRule) {
      matchingRule = "No specific disallow pattern matched this path. Default: ALLOWED.";
    }

    return NextResponse.json({
      success: true,
      allowed,
      matchingRule,
      robotsUrl,
      statusCode,
      testedAgent: userAgent,
      testedPath: normalizedPath,
      robotsContent: robotsContent.slice(0, 5000), // Cap preview
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to test robots.txt." },
      { status: 400 }
    );
  }
}
