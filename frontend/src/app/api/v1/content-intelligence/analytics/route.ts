import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const articles = db.getArticles();
    const clusters = db.getTopicClusters();
    const inquiries = db.prepare("SELECT * FROM enquiries").all();
    const clientAudits = db.prepare("SELECT * FROM client_audits").all();

    const totalArticles = articles.length;
    const publishedArticles = articles.filter((a) => a.status === "PUBLISHED").length;
    const scheduledArticles = articles.filter((a) => a.status === "SCHEDULED").length;
    const draftArticles = articles.filter((a) => a.status === "DRAFT" || a.status === "DRAFT_READY").length;

    // Decay Analysis: articles published > 90 days ago or > 180 days ago
    const now = Date.now();
    const decayingArticles = articles.map((art) => {
      const pubDate = art.published_at ? new Date(art.published_at).getTime() : new Date(art.created_at).getTime();
      const ageDays = Math.round((now - pubDate) / (1000 * 60 * 60 * 24));
      return {
        id: art.id,
        title: art.title,
        slug: art.slug,
        status: art.status,
        ageDays,
        needsRefresh: ageDays >= 90,
        urgency: ageDays >= 180 ? "HIGH" : ageDays >= 90 ? "MEDIUM" : "FRESH",
      };
    });

    // Lead Attributions: connect inquiries with referring source or page
    const leadAttributions = inquiries.map((inq: any) => ({
      id: inq.id,
      leadName: inq.name,
      company: inq.company,
      service: inq.service,
      sourcePage: inq.source_page,
      utmSource: inq.utm_source,
      utmCampaign: inq.utm_campaign,
      createdAt: inq.created_at,
    }));

    return NextResponse.json({
      success: true,
      metrics: {
        totalArticles,
        publishedArticles,
        scheduledArticles,
        draftArticles,
        totalClusters: clusters.length,
        avgCompleteness: Math.round(
          clusters.reduce((acc, c) => acc + (c.completeness_score || 0), 0) / (clusters.length || 1)
        ),
        totalClientAudits: clientAudits.length,
        totalLeadsGenerated: inquiries.length,
      },
      decayingArticles,
      leadAttributions,
      clusters,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
