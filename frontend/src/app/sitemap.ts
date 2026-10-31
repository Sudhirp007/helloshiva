import { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import db from "@/lib/db";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url || "https://helloshiva.com";

  // Core static marketing routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tools`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // 8 High-intent agency service pages
  const serviceRoutes: MetadataRoute.Sitemap = (siteConfig.services || []).map((s) => ({
    url: `${baseUrl}/services/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  // 10 Free marketing tools
  const toolRoutes: MetadataRoute.Sitemap = (siteConfig.tools || []).map((t) => ({
    url: `${baseUrl}/tools/${t.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  // Dynamic published blog articles
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const articles = db.getArticles();
    blogRoutes = (articles || [])
      .filter((a) => a.status === "PUBLISHED")
      .map((a) => ({
        url: `${baseUrl}/blog/${a.slug}`,
        lastModified: a.updated_at ? new Date(a.updated_at) : new Date(a.created_at || Date.now()),
        changeFrequency: "weekly",
        priority: 0.8,
      }));
  } catch (err) {
    console.error("Error generating sitemap blog routes:", err);
  }

  return [...staticRoutes, ...serviceRoutes, ...toolRoutes, ...blogRoutes];
}
