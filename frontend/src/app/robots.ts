import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const disallowedPaths = [
    "/admin",
    "/admin/*",
    "/api/*",
    "/portal",
    "/portal/*",
  ];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: disallowedPaths,
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: disallowedPaths,
      },
      {
        userAgent: "Googlebot-Image",
        allow: "/",
        disallow: disallowedPaths,
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: disallowedPaths,
      },
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow: disallowedPaths,
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: disallowedPaths,
      },
      {
        userAgent: "ClaudeBot",
        allow: "/",
        disallow: disallowedPaths,
      },
    ],
    sitemap: "https://helloshiva.com/sitemap.xml",
    host: "https://helloshiva.com",
  };
}
