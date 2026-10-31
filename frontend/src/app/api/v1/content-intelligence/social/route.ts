import { NextResponse } from "next/server";
import db, { SocialPostItem } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const articleId = searchParams.get("articleId");
    const posts = db.getSocialPosts(articleId || undefined);
    return NextResponse.json({ success: true, posts });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { articleId, title, slug, primaryTakeaway, category } = body;

    if (!title || !slug) {
      return NextResponse.json({ success: false, error: "Title and slug are required" }, { status: 400 });
    }

    const articleUrl = `https://helloshiva.com/blog/${slug}`;

    // Generate 5 platform posts with trackable UTM tags
    const platforms: SocialPostItem[] = [
      {
        id: `post-${Date.now()}-li`,
        article_id: articleId || "custom",
        platform: "LINKEDIN",
        content_text: `Vanity metrics don't pay agency payroll.

When evaluating digital growth strategies, most leaders focus on impression spikes. But impressions that fail to convert into booked pipeline are simply wasted capital.

In our latest engineering breakdown: "${title}"

We unpack:
• Why technical SEO must precede content scaling
• How to eliminate crawl budget waste across enterprise architectures
• The exact attribution framework connecting search clicks to qualified revenue

Full teardown published on HelloShiva:
🔗 ${articleUrl}?utm_source=linkedin&utm_medium=organic_social&utm_campaign=editorial_repurpose

What is your team's biggest challenge when balancing organic search against paid customer acquisition cost (CAC)? Let's discuss in the comments below.`,
        hashtags: ["#DigitalMarketing", "#B2BMarketing", "#SEOStrategy", "#HelloShivaAgency"],
        cta_url: `${articleUrl}?utm_source=linkedin&utm_medium=organic_social&utm_campaign=editorial_repurpose`,
        status: "DRAFT",
        created_at: new Date().toISOString(),
      },
      {
        id: `post-${Date.now()}-tw`,
        article_id: articleId || "custom",
        platform: "TWITTER",
        content_text: `🧵 1/4 Most digital teams treat ${title.toLowerCase()} as a guesswork game.

Here is the exact technical framework we use at HelloShiva to turn organic search into a predictable growth engine: 👇

2/4 The biggest bottleneck isn't content volume—it's search intent misalignment and unoptimized Core Web Vitals. If search bots struggle to render your code, you're dead on arrival.

3/4 Fix these 3 items first:
• Semantic H1-H6 hierarchy
• Structured FAQ JSON-LD schema
• Sub-second Largest Contentful Paint (LCP)

4/4 We broke down the full step-by-step blueprint with code examples in our latest guide:
Read it here: ${articleUrl}?utm_source=twitter&utm_medium=thread&utm_campaign=editorial_repurpose`,
        hashtags: ["#SEO", "#GrowthMarketing", "#WebEngineering", "#HelloShiva"],
        cta_url: `${articleUrl}?utm_source=twitter&utm_medium=thread&utm_campaign=editorial_repurpose`,
        status: "DRAFT",
        created_at: new Date().toISOString(),
      },
      {
        id: `post-${Date.now()}-fb`,
        article_id: articleId || "custom",
        platform: "FACEBOOK",
        content_text: `Looking to get more qualified leads from your website this quarter?

We just published a comprehensive technical teardown on HelloShiva: "${title}".

Whether you're struggling with Google search indexing or optimizing your landing page conversion rates, this guide provides actionable steps you can implement today.

👉 Read the full guide here: ${articleUrl}?utm_source=facebook&utm_medium=community&utm_campaign=editorial_repurpose`,
        hashtags: ["#DigitalMarketing", "#SEO", "#HelloShiva"],
        cta_url: `${articleUrl}?utm_source=facebook&utm_medium=community&utm_campaign=editorial_repurpose`,
        status: "DRAFT",
        created_at: new Date().toISOString(),
      },
      {
        id: `post-${Date.now()}-ig`,
        article_id: articleId || "custom",
        platform: "INSTAGRAM",
        content_text: `Slide 1: ${title}
Swipe through to see the 4-step framework we use to scale organic pipeline.

Save this post for your next website audit! 🔖

Link in bio for the complete technical guide.`,
        hashtags: ["#SEOStrategy", "#WebEngineering", "#MarketingTips", "#HelloShivaAgency"],
        slide_data: [
          { slideNumber: 1, headline: title, body: "Why most websites struggle to rank and convert in 2026." },
          { slideNumber: 2, headline: "The Core Mistake", body: "Targeting high-volume vanity keywords instead of high-intent commercial buyers." },
          { slideNumber: 3, headline: "The Fix", body: "Aligning technical code health, sub-second LCP, and structured Schema markup." },
          { slideNumber: 4, headline: "The Result", body: "Compounding inbound search equity without increasing monthly ad spend." },
          { slideNumber: 5, headline: "Take Action", body: "Use HelloShiva's 10 Free Tools to audit your site today. Link in bio!" }
        ],
        cta_url: `${articleUrl}?utm_source=instagram&utm_medium=bio_link&utm_campaign=editorial_repurpose`,
        status: "DRAFT",
        created_at: new Date().toISOString(),
      },
      {
        id: `post-${Date.now()}-rd`,
        article_id: articleId || "custom",
        platform: "REDDIT",
        content_text: `**Detailed Case Study: A Technical Approach to ${title}**

Hey r/SEO and r/digitalmarketing,

Over the past few quarters at our agency (HelloShiva), we observed that the majority of traffic plateaus aren't caused by algorithm penalties—they're caused by basic code rendering bottlenecks and unaligned search intent.

Here is the exact framework we implemented:

1. **Rendering & Crawl Efficiency:** Moving away from heavy client-side hydration for indexable assets to server-side static generation.
2. **Entity & Schema Alignment:** Explicit JSON-LD declarations for Organization, Article, and FAQPage.
3. **Intent-Driven Architecture:** Creating dedicated topic clusters around commercial problems rather than broad generic queries.

We open-sourced our entire methodology and benchmark checklists in a deep dive:
${articleUrl}?utm_source=reddit&utm_medium=community_post&utm_campaign=editorial_repurpose

Happy to answer any specific technical questions in the comments!`,
        hashtags: ["SEO", "DigitalMarketing", "CaseStudy"],
        cta_url: `${articleUrl}?utm_source=reddit&utm_medium=community_post&utm_campaign=editorial_repurpose`,
        status: "DRAFT",
        created_at: new Date().toISOString(),
      },
    ];

    for (const p of platforms) {
      db.saveSocialPost(p);
    }

    return NextResponse.json({ success: true, posts: platforms });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
