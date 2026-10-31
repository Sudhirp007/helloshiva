import dns from "dns/promises";
import net from "net";

interface SafeFetchOptions {
  timeoutMs?: number;
  maxSizeBytes?: number;
  maxRedirects?: number;
  headers?: Record<string, string>;
}

export interface SafeFetchResult {
  statusCode: number;
  statusText: string;
  headers: Record<string, string>;
  bodyText: string;
  finalUrl: string;
}

/**
 * Checks if an IPv4 or IPv6 address is in a private, loopback, link-local, or cloud-metadata range.
 */
export function isPrivateOrReservedIP(ip: string): boolean {
  if (net.isIPv4(ip)) {
    const parts = ip.split(".").map(Number);
    if (parts.length !== 4 || parts.some((p) => isNaN(p) || p < 0 || p > 255)) {
      return true; // Malformed IPv4
    }

    // 0.0.0.0/8 (Current network)
    if (parts[0] === 0) return true;

    // 127.0.0.0/8 (Loopback)
    if (parts[0] === 127) return true;

    // 10.0.0.0/8 (Private)
    if (parts[0] === 10) return true;

    // 172.16.0.0/12 (Private)
    if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;

    // 192.168.0.0/16 (Private)
    if (parts[0] === 192 && parts[1] === 168) return true;

    // 169.254.0.0/16 (Link-local & Oracle/AWS Cloud Metadata!)
    if (parts[0] === 169 && parts[1] === 254) return true;

    // 100.64.0.0/10 (Carrier grade NAT)
    if (parts[0] === 100 && parts[1] >= 64 && parts[1] <= 127) return true;

    // 224.0.0.0/4 (Multicast)
    if (parts[0] >= 224 && parts[0] <= 239) return true;

    // 240.0.0.0/4 (Reserved)
    if (parts[0] >= 240) return true;

    return false;
  }

  if (net.isIPv6(ip)) {
    const lower = ip.toLowerCase();
    // Loopback ::1
    if (lower === "::1" || lower === "0:0:0:0:0:0:0:1") return true;
    // Unspecified ::
    if (lower === "::" || lower === "0:0:0:0:0:0:0:0") return true;
    // Unique local addresses fc00::/7 (fc00... - fdff...)
    if (lower.startsWith("fc") || lower.startsWith("fd")) return true;
    // Link local fe80::/10
    if (lower.startsWith("fe8") || lower.startsWith("fe9") || lower.startsWith("fea") || lower.startsWith("feb")) {
      return true;
    }
    // IPv4-mapped IPv6 ::ffff:127.0.0.1
    if (lower.includes("::ffff:")) {
      const v4Part = lower.split("::ffff:")[1];
      if (net.isIPv4(v4Part)) return isPrivateOrReservedIP(v4Part);
    }
    return false;
  }

  return true; // Unknown IP format -> block
}

/**
 * Performs an SSRF-safe HTTP GET request:
 * 1. Validates http / https scheme
 * 2. Resolves DNS pre-flight to check target IP against private/metadata blocklist
 * 3. Enforces 5-second timeout and 2MB streaming payload cap
 * 4. Limits redirects with strict re-validation
 */
export async function safeFetch(
  targetUrl: string,
  options: SafeFetchOptions = {}
): Promise<SafeFetchResult> {
  const timeoutMs = options.timeoutMs || 5000;
  const maxSizeBytes = options.maxSizeBytes || 2 * 1024 * 1024; // 2 MB
  const maxRedirects = options.maxRedirects ?? 2;

  let currentUrl = targetUrl;
  let redirectsCount = 0;

  while (redirectsCount <= maxRedirects) {
    let parsed: URL;
    try {
      parsed = new URL(currentUrl);
    } catch {
      throw new Error("Invalid URL format.");
    }

    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      throw new Error("Protocol not permitted. Only HTTP and HTTPS are allowed.");
    }

    const hostname = parsed.hostname;

    // Block localhost alias and cloud metadata hostnames directly
    if (
      hostname === "localhost" ||
      hostname.endsWith(".localhost") ||
      hostname === "169.254.169.254" ||
      hostname === "metadata.google.internal" ||
      hostname === "instance-data"
    ) {
      throw new Error("Access to localhost or internal cloud metadata is strictly forbidden.");
    }

    // Pre-flight DNS resolution
    let resolvedAddresses: string[] = [];
    try {
      const records = await dns.lookup(hostname, { all: true });
      resolvedAddresses = records.map((r) => r.address);
    } catch (err) {
      throw new Error(`Failed to resolve DNS for ${hostname}.`);
    }

    if (resolvedAddresses.length === 0) {
      throw new Error(`No DNS records found for ${hostname}.`);
    }

    // Ensure NONE of the resolved IPs are in private or metadata ranges
    for (const ip of resolvedAddresses) {
      if (isPrivateOrReservedIP(ip)) {
        throw new Error(`Access to restricted IP address (${ip}) is blocked for security.`);
      }
    }

    // Fetch with AbortController
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(currentUrl, {
        method: "GET",
        headers: {
          "User-Agent": "HelloShiva-SEOBot/1.0 (+https://helloshiva.com)",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          ...options.headers,
        },
        redirect: "manual", // Handle redirects manually to inspect IP
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle redirect
      if ([301, 302, 303, 307, 308].includes(response.status)) {
        const location = response.headers.get("location");
        if (!location) {
          throw new Error("Redirect response missing Location header.");
        }
        currentUrl = new URL(location, currentUrl).toString();
        redirectsCount++;
        continue;
      }

      // Read response body with streaming byte limit
      const reader = response.body?.getReader();
      let chunks: Uint8Array[] = [];
      let totalBytes = 0;

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          if (value) {
            totalBytes += value.length;
            if (totalBytes > maxSizeBytes) {
              await reader.cancel();
              throw new Error(`Response exceeded maximum allowed size of ${maxSizeBytes / (1024 * 1024)} MB.`);
            }
            chunks.push(value);
          }
        }
      }

      const bodyBuffer = Buffer.concat(chunks);
      const bodyText = bodyBuffer.toString("utf-8");

      // Extract response headers into clean dictionary
      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((val, key) => {
        responseHeaders[key.toLowerCase()] = val;
      });

      return {
        statusCode: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
        bodyText,
        finalUrl: currentUrl,
      };
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err.name === "AbortError") {
        throw new Error(`Request timed out after ${timeoutMs}ms.`);
      }
      throw err;
    }
  }

  throw new Error("Too many redirects.");
}
