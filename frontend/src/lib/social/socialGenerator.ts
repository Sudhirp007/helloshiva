export interface SocialChannelPost {
  platform: "TWITTER" | "LINKEDIN" | "FACEBOOK" | "INSTAGRAM" | "REDDIT";
  platformName: string;
  contentText: string;
  hashtags: string[];
  carouselSlides?: { slideNumber: number; headline: string; body: string; visualDirection: string }[];
  ctaUrl: string;
}

/**
 * Generates platform-specific social distribution copy from an approved article draft.
 * STRICTLY COPY-ONLY: Zero automated social bots or mass-posting.
 */
export function generateSocialDistribution(article: {
  title: string;
  slug: string;
  summary: string;
  primaryTakeaway: string;
}): SocialChannelPost[] {
  const articleUrl = `https://helloshiva.com/blog/${article.slug}`;

  return [
    // 1. X / Twitter (Thread Format)
    {
      platform: "TWITTER",
      platformName: "X (Twitter) Thread",
      contentText: `🧵 1/4 Most digital teams treat ${article.title.toLowerCase()} as a guesswork game.

Here is the exact technical framework we use at HelloShiva to turn organic search into a predictable growth engine: 👇

2/4 The biggest bottleneck isn't content volume—it's search intent misalignment and unoptimized Core Web Vitals. If bots struggle to render your code, you're dead on arrival.

3/4 Fix these 3 items first:
• Semantic H1-H6 hierarchy
• Structured FAQ JSON-LD schema
• Sub-second Largest Contentful Paint (LCP)

4/4 We broke down the full step-by-step blueprint with code examples in our latest guide:
Read it here: ${articleUrl}`,
      hashtags: ["#SEO", "#GrowthMarketing", "#WebEngineering", "#HelloShiva"],
      ctaUrl: articleUrl,
    },

    // 2. LinkedIn (B2B Executive Format)
    {
      platform: "LINKEDIN",
      platformName: "LinkedIn B2B Post",
      contentText: `Vanity metrics don't pay agency payroll.

When evaluating digital growth strategies, most leaders focus on impression spikes. But impressions that fail to convert into booked pipeline are simply wasted capital.

In our latest engineering breakdown: "${article.title}"

We unpack:
• Why technical SEO must precede content scaling
• How to eliminate crawl budget waste across enterprise architectures
• The exact attribution framework connecting search clicks to qualified revenue

Full teardown published on HelloShiva:
🔗 ${articleUrl}

What is your team's biggest challenge when balancing organic search against paid customer acquisition cost (CAC)? Let's discuss in the comments below.`,
      hashtags: ["#DigitalMarketing", "#B2BMarketing", "#SEOStrategy", "#HelloShivaAgency"],
      ctaUrl: articleUrl,
    },

    // 3. Facebook (Community & Discussion)
    {
      platform: "FACEBOOK",
      platformName: "Facebook Community Post",
      contentText: `Looking to get more qualified leads from your website this quarter?

We just published a comprehensive technical teardown on HelloShiva: "${article.title}".

Whether you're struggling with Google search indexing or optimizing your landing page conversion rates, this guide provides actionable steps you can implement today.

👉 Read the full guide here: ${articleUrl}`,
      hashtags: ["#DigitalMarketing", "#SEO", "#HelloShiva"],
      ctaUrl: articleUrl,
    },

    // 4. Instagram (5-Slide Carousel Storyboard)
    {
      platform: "INSTAGRAM",
      platformName: "Instagram Carousel (5 Slides)",
      contentText: `Slide 1: ${article.title}\nSwipe through to see the 4-step framework we use to scale organic pipeline.\n\nSave this post for your next website audit! 🔖\n\nLink in bio for the complete technical guide.`,
      hashtags: ["#SEOStrategy", "#WebEngineering", "#MarketingTips", "#HelloShivaAgency"],
      carouselSlides: [
        {
          slideNumber: 1,
          headline: article.title,
          body: "Why most websites struggle to rank and convert in 2026.",
          visualDirection: "Bold Deep Navy background (#0B1025) with Electric Violet (#8067FF) typography and HelloShiva badge.",
        },
        {
          slideNumber: 2,
          headline: "The Core Mistake",
          body: "Targeting high-volume vanity keywords instead of high-intent commercial buyers.",
          visualDirection: "Clean contrast card with comparison metrics and red warning accent.",
        },
        {
          slideNumber: 3,
          headline: "The Technical Foundation",
          body: "Sub-second LCP, zero layout shifts, and flawless semantic heading trees.",
          visualDirection: "Minimalist code architecture graphic with green pass badges.",
        },
        {
          slideNumber: 4,
          headline: "Attribution Clarity",
          body: "Connect search intent directly to qualified demo bookings using fail-safe UTM tracking.",
          visualDirection: "Flowchart visual mapping Search -> Landing Page -> Pipeline.",
        },
        {
          slideNumber: 5,
          headline: "Take Action",
          body: "Use HelloShiva's 10 free marketing tools to audit your website today. Link in bio.",
          visualDirection: "Dark luxury brand card with 'Explore Free Tools' CTA pill.",
        },
      ],
      ctaUrl: articleUrl,
    },

    // 5. Reddit (Value-First Community Discussion)
    {
      platform: "REDDIT",
      platformName: "Reddit Value Post (r/SEO or r/marketing)",
      contentText: `**Case Study / Technical Framework: Solving common bottlenecks in ${article.title}**

Hey everyone,

I often see teams running into the same trap when scaling organic traffic: spending thousands on content while ignoring the underlying code-level bottlenecks that prevent Googlebot from properly evaluating topical relevance.

Here are 4 specific technical observations from our recent platform benchmarks:

1. **Heading Hierarchy Matters More Than Density:** Skipping from H1 to H3 confuses semantic parsing on long-form articles. Always enforce sequential H1 -> H2 -> H3 trees.
2. **First-Party Diagnostic Tools:** Before paying for Semrush or Ahrefs audits, inspect your raw response headers. If your TTFB exceeds 600ms, Googlebot spends its crawl budget waiting on server threads rather than indexing new pages.
3. **Structured Schema Completeness:** FAQPage and Article schemas remain one of the most consistent ways to capture SERP real estate without building hundreds of backlinks.

Happy to answer any questions about technical audits or crawl architecture in the comments below!`,
      hashtags: [],
      ctaUrl: articleUrl,
    },
  ];
}
