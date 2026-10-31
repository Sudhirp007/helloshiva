export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  shortDesc: string;
  tagline: string;
  heroHeadline: string;
  problemsSolved: string[];
  whatsIncluded: string[];
  suitableFor: string[];
  faqs: { question: string; answer: string }[];
  relatedTools: { name: string; href: string }[];
}

export interface ToolItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: "Technical SEO" | "Content & Keywords" | "Link & Tracking" | "Network & Social";
  isClientSide: boolean;
  ctaText: string;
  badge?: string;
}

export const siteConfig = {
  name: "HelloShiva",
  legalName: "HelloShiva Digital Agency",
  domain: "helloshiva.com",
  url: "https://helloshiva.com",
  tagline: "Grow your business with smarter digital marketing.",
  subheadline:
    "Data-driven SEO, performance marketing, high-converting web engineering, and content strategies designed to generate qualified pipeline and compound your revenue.",
  
  contact: {
    email: "contact@helloshiva.com",
    phone: "+91 9821502493",
    whatsapp: "+919821502493",
    address: "UER Heights, Delhi, India",
    workingHours: "Mon - Sat: 9:00 AM - 7:00 PM IST",
    coverage: "India & Global Remote",
  },

  socials: {
    linkedin: "https://linkedin.com/company/helloshiva",
    twitter: "https://twitter.com/helloshiva",
    github: "https://github.com/Sudhirp007/helloshiva",
  },

  nav: [
    { name: "Services", href: "/services" },
    { name: "Free Tools", href: "/tools" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "About", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ],

  services: [
    {
      id: "seo-services",
      slug: "seo-services",
      title: "SEO Services",
      shortDesc: "End-to-end organic search engine optimization to capture high-intent buyers.",
      tagline: "Compound your inbound traffic with search visibility that converts.",
      heroHeadline: "Organic Search Optimization That Drives Revenue, Not Just Vanity Clicks.",
      problemsSolved: [
        "Plateaued or declining organic search impressions.",
        "High reliance on costly paid ad campaigns for lead acquisition.",
        "Content ranking for keywords that generate zero business inquiries.",
      ],
      whatsIncluded: [
        "In-depth competitor and commercial keyword opportunity mapping",
        "On-page optimization across meta tags, semantic HTML, and internal linking",
        "Technical audit addressing Core Web Vitals and crawl budgets",
        "Authoritative digital PR and content outreach framework",
        "Monthly executive revenue and search position reporting",
      ],
      suitableFor: [
        "B2B software companies seeking consistent demo requests",
        "E-commerce brands wanting to reduce customer acquisition cost (CAC)",
        "High-ticket service firms targeting high-intent decision makers",
      ],
      faqs: [
        {
          question: "How long does it take to see results from SEO?",
          answer:
            "While quick technical wins (indexing fixes, title optimizations) often yield measurable gains within 30 to 60 days, sustainable top-tier rankings and compounding organic pipeline typically build over 3 to 6 months.",
        },
        {
          question: "Do you guarantee #1 rankings on Google?",
          answer:
            "No ethical agency guarantees #1 rankings because search engine algorithms are proprietary. Instead, we guarantee rigorous technical adherence, deep intent-matched content, and measurable increases in qualified traffic and leads.",
        },
      ],
      relatedTools: [
        { name: "SEO Page Analyzer", href: "/tools/seo-page-analyzer" },
        { name: "SERP Preview Tool", href: "/tools/serp-preview" },
      ],
    },
    {
      id: "technical-seo",
      slug: "technical-seo",
      title: "Technical SEO",
      shortDesc: "Speed, Core Web Vitals, crawl architecture, and indexing optimization.",
      tagline: "Make your web architecture flawless for search engine crawlers.",
      heroHeadline: "Rock-Solid Web Infrastructure Built for Flawless Indexing & Blazing Speed.",
      problemsSolved: [
        "Search engine bots failing to crawl or index newly published pages.",
        "Slow loading times causing high bounce rates and ranking drops.",
        "Duplicate content issues caused by faulty URL parameters or faceted navigation.",
      ],
      whatsIncluded: [
        "Comprehensive log file and crawl budget analysis",
        "Core Web Vitals remediation (LCP, INP, CLS optimization)",
        "XML sitemap and robots.txt architecture restructuring",
        "Schema.org JSON-LD structured data implementation",
        "Canonicalization and international hreflang configuration",
      ],
      suitableFor: [
        "Websites with 500+ URLs or complex dynamic database architectures",
        "Modern JavaScript SPAs (Next.js, Nuxt, React) needing proper SSR rendering",
        "Sites migrating domains, platforms, or URL structures",
      ],
      faqs: [
        {
          question: "Why does technical SEO matter if our content is great?",
          answer:
            "If search bots cannot render, parse, or easily discover your pages due to code bottlenecks, your great content will never rank. Technical SEO is the foundation upon which all content success rests.",
        },
      ],
      relatedTools: [
        { name: "Robots.txt Tester", href: "/tools/robots-txt-tester" },
        { name: "XML Sitemap Validator", href: "/tools/sitemap-validator" },
        { name: "HTTP Headers Checker", href: "/tools/http-headers-checker" },
      ],
    },
    {
      id: "local-seo",
      slug: "local-seo",
      title: "Local SEO",
      shortDesc: "Dominate Google Maps and local search queries in your service territory.",
      tagline: "Put your business at the top of local customer searches.",
      heroHeadline: "Own the Local 3-Pack and Turn Local Searches into Direct Phone Calls.",
      problemsSolved: [
        "Invisibility on Google Maps when nearby buyers search for your service.",
        "Inconsistent NAP (Name, Address, Phone) citations hurting local trust.",
        "Competitors outranking you on high-value geo-targeted queries.",
      ],
      whatsIncluded: [
        "Google Business Profile (GBP) audit, verification, and weekly optimization",
        "Local citation building and cleanup across tier-1 directories",
        "Geo-targeted localized landing page architecture",
        "Review generation and customer reputation management workflows",
        "Local rank tracking and call/direction attribution reporting",
      ],
      suitableFor: [
        "Multi-location service businesses, clinics, and professional firms",
        "Regional contractors, legal practices, and healthcare providers",
        "Businesses with physical locations serving specific geographic radiuses",
      ],
      faqs: [
        {
          question: "Can I do Local SEO without a physical storefront?",
          answer:
            "Yes! Google Business Profile allows Service Area Businesses (SABs) that visit or deliver to customers without displaying a public address.",
        },
      ],
      relatedTools: [
        { name: "SERP Preview Tool", href: "/tools/serp-preview" },
        { name: "SEO Page Analyzer", href: "/tools/seo-page-analyzer" },
      ],
    },
    {
      id: "performance-marketing",
      slug: "performance-marketing",
      title: "Performance Marketing / PPC",
      shortDesc: "High-ROI Google Ads, Meta Ads, and LinkedIn campaigns optimized for pipeline.",
      tagline: "Profitable paid advertising with relentless focus on Customer Acquisition Cost.",
      heroHeadline: "Precision Paid Campaigns Designed to Maximize ROI, Not Just Spend.",
      problemsSolved: [
        "Burning ad budget on clicks that never convert into booked meetings or sales.",
        "High customer acquisition costs (CAC) that make unit economics unprofitable.",
        "Lack of granular tracking connecting ad clicks to real revenue.",
      ],
      whatsIncluded: [
        "Full-funnel campaign architecture across Google Search, Performance Max, and Meta",
        "High-converting ad copywriting and creative visual testing frameworks",
        "Server-side conversion tracking (Google Enhanced Conversions, Meta CAPI)",
        "Negative keyword scrub and daily bidding strategy tuning",
        "Landing page conversion rate optimization (CRO) alignment",
      ],
      suitableFor: [
        "Growth-stage companies wanting predictable, scalable lead generation",
        "E-commerce brands scaling to 7-figure annual run rates",
        "High-margin professional service firms wanting fast qualified pipeline",
      ],
      faqs: [
        {
          question: "What minimum ad spend do you recommend?",
          answer:
            "We generally recommend a minimum monthly ad budget of $1,500 – $2,500 (or ₹1,00,000+) so that the algorithms gather statistical significance quickly to optimize bidding models.",
        },
      ],
      relatedTools: [
        { name: "UTM Link Builder", href: "/tools/utm-builder" },
        { name: "URL Encoder / Decoder", href: "/tools/url-encoder-decoder" },
      ],
    },
    {
      id: "social-media-marketing",
      slug: "social-media-marketing",
      title: "Social Media Marketing",
      shortDesc: "Brand authority, audience engagement, and distribution across social platforms.",
      tagline: "Build a community of engaged brand advocates that buy from you.",
      heroHeadline: "Strategic Organic Social That Builds Industry Authority & Engages Buyers.",
      problemsSolved: [
        "Inconsistent posting with low reach and nonexistent engagement.",
        "Generic content that fails to communicate unique brand differentiators.",
        "Social channels disconnected from actual business conversion funnels.",
      ],
      whatsIncluded: [
        "Multi-channel content pillars aligned with customer pain points",
        "High-impact graphic design, carousels, and short-form video scripting",
        "Active community engagement and executive profile ghostwriting",
        "Hashtag strategy and algorithmic reach optimization",
        "Monthly audience growth and referral traffic analytics",
      ],
      suitableFor: [
        "Founders and executives building thought leadership on LinkedIn & X",
        "Consumer brands seeking viral lifestyle affinity on Instagram",
        "B2B companies establishing trusted authority in niche verticals",
      ],
      faqs: [
        {
          question: "Do you handle community management and responding to comments?",
          answer:
            "Yes, our retainers include scheduled community moderation, comment replies, and proactive engagement with target prospect accounts.",
        },
      ],
      relatedTools: [
        { name: "Open Graph Previewer", href: "/tools/open-graph-preview" },
        { name: "UTM Link Builder", href: "/tools/utm-builder" },
      ],
    },
    {
      id: "content-marketing",
      slug: "content-marketing",
      title: "Content Marketing",
      shortDesc: "Thought leadership, whitepapers, case studies, and buyer-journey editorial.",
      tagline: "Publish content that answers customer questions and closes deals.",
      heroHeadline: "Authoritative Content That Educates, Builds Unshakable Trust, and Converts.",
      problemsSolved: [
        "Producing high-volume articles that fail to generate organic traffic or leads.",
        "Lack of content tailored to middle and bottom-of-funnel decision makers.",
        "Fragmented messaging between marketing campaigns and sales collateral.",
      ],
      whatsIncluded: [
        "Buyer persona mapping and pain-point content calendars",
        "Long-form authoritative pillar pages and original industry research",
        "Customer success case study interviews and whitepaper creation",
        "Search-optimized editorial written by subject-matter specialists",
        "Multi-format repurposing across newsletters, social posts, and PDFs",
      ],
      suitableFor: [
        "Complex products and high-consideration purchase lifecycles",
        "Companies looking to establish category leadership",
        "Businesses wanting to build an owned media asset that compounds",
      ],
      faqs: [
        {
          question: "Is your content human-written or AI-generated?",
          answer:
            "All core strategy, research, interviews, and final editorial are crafted and fact-checked by senior human copywriters. We leverage AI strictly for data clustering and ideation, ensuring brand voice integrity.",
        },
      ],
      relatedTools: [
        { name: "Keyword Density Checker", href: "/tools/keyword-density-checker" },
        { name: "Heading Structure Checker", href: "/tools/heading-checker" },
      ],
    },
    {
      id: "web-design-development",
      slug: "web-design-development",
      title: "Website Design & Development",
      shortDesc: "Fast, modern, high-converting websites engineered for performance and SEO.",
      tagline: "Transform your website into your highest-performing salesperson.",
      heroHeadline: "Bespoke Web Engineering Built for Speed, Conversion, and Flawless SEO.",
      problemsSolved: [
        "Outdated visual design that undermines corporate credibility.",
        "Cluttered user journeys that cause prospective clients to leave without contacting.",
        "Bloated page code that fails Core Web Vitals and slows down mobile users.",
      ],
      whatsIncluded: [
        "Modern UI/UX design wireframes and interactive prototypes in Figma",
        "Next.js, React, and Tailwind CSS clean architecture with sub-second page loads",
        "Full mobile responsiveness and accessible WCAG-compliant design",
        "Conversion rate optimized (CRO) form and lead capture flows",
        "Headless CMS integration for effortless client editorial updates",
      ],
      suitableFor: [
        "Companies ready to upgrade from outdated WordPress templates",
        "Firms launching a new service line or undergoing a complete rebrand",
        "Founders requiring a modern, lightning-fast digital headquarters",
      ],
      faqs: [
        {
          question: "Can our team easily edit text and add blog posts later?",
          answer:
            "Absolutely. We architect websites with modular content blocks and simple configuration interfaces, enabling non-technical team members to publish without touching code.",
        },
      ],
      relatedTools: [
        { name: "SEO Page Analyzer", href: "/tools/seo-page-analyzer" },
        { name: "Heading Structure Checker", href: "/tools/heading-checker" },
        { name: "HTTP Headers Checker", href: "/tools/http-headers-checker" },
      ],
    },
    {
      id: "digital-strategy",
      slug: "digital-strategy",
      title: "Digital Strategy",
      shortDesc: "Holistic marketing roadmaps, CAC/LTV modeling, and growth architectures.",
      tagline: "Stop guessing. Execute a unified roadmap engineered for sustainable growth.",
      heroHeadline: "Unifying Data, Channels, and Creative into an Unstoppable Growth Engine.",
      problemsSolved: [
        "Siloed marketing tactics without a cohesive strategic objective.",
        "Wasting budget across too many channels with zero attribution clarity.",
        "Unclear value proposition that blends into the competitor landscape.",
      ],
      whatsIncluded: [
        "Comprehensive market positioning and competitive moat analysis",
        "Channel attribution modeling and budget allocation framework",
        "Customer lifetime value (LTV) vs acquisition cost (CAC) forecasting",
        "Marketing tech stack evaluation and CRM/automation optimization",
        "Quarterly growth sprint roadmaps and executive steering sessions",
      ],
      suitableFor: [
        "Leadership teams seeking clarity on marketing ROI and channel priorities",
        "Businesses preparing for expansion, funding, or new market entry",
        "Established enterprises needing an objective third-party audit of their funnels",
      ],
      faqs: [
        {
          question: "How does a strategy engagement begin?",
          answer:
            "We conduct a 2-week diagnostic audit reviewing your existing analytics, historic channel performance, customer feedback, and unit economics before delivering a prioritized 90-day execution roadmap.",
        },
      ],
      relatedTools: [
        { name: "UTM Link Builder", href: "/tools/utm-builder" },
        { name: "SEO Page Analyzer", href: "/tools/seo-page-analyzer" },
      ],
    },
  ],

  tools: [
    {
      id: "seo-page-analyzer",
      slug: "seo-page-analyzer",
      name: "SEO Page Analyzer",
      description: "Audits page title, meta description, canonical URL, heading hierarchy, robots directives, and core technical signals.",
      category: "Technical SEO",
      isClientSide: false,
      ctaText: "Analyze Webpage",
      badge: "Popular",
    },
    {
      id: "serp-preview",
      slug: "serp-preview",
      name: "SERP Preview Tool",
      description: "Visualizes exactly how your page title, URL, and meta description render on Google Desktop and Mobile search results.",
      category: "Technical SEO",
      isClientSide: true,
      ctaText: "Preview Snippet",
      badge: "Instant",
    },
    {
      id: "keyword-density-checker",
      slug: "keyword-density-checker",
      name: "Keyword Density Checker",
      description: "Calculates single and multi-word frequency distribution, density percentages, and filters common stop words.",
      category: "Content & Keywords",
      isClientSide: true,
      ctaText: "Check Density",
      badge: "Instant",
    },
    {
      id: "heading-checker",
      slug: "heading-checker",
      name: "Heading Structure Checker",
      description: "Extracts and visualizes H1–H6 hierarchy from HTML code to detect skipped levels and multiple H1 elements.",
      category: "Content & Keywords",
      isClientSide: true,
      ctaText: "Inspect Headings",
      badge: "Instant",
    },
    {
      id: "robots-txt-tester",
      slug: "robots-txt-tester",
      name: "Robots.txt Tester",
      description: "Fetches and evaluates robots.txt rules against specific user-agents (Googlebot, Bingbot) and target URL paths.",
      category: "Technical SEO",
      isClientSide: false,
      ctaText: "Test Robots.txt",
    },
    {
      id: "sitemap-validator",
      slug: "sitemap-validator",
      name: "XML Sitemap Validator",
      description: "Verifies XML structure, URL limits, namespace definitions, and flags syntax errors in sitemaps and sitemap index files.",
      category: "Technical SEO",
      isClientSide: false,
      ctaText: "Validate Sitemap",
    },
    {
      id: "utm-builder",
      slug: "utm-builder",
      name: "UTM Link Builder",
      description: "Builds correctly formatted and encoded Google Analytics campaign tracking URLs with one-click copy.",
      category: "Link & Tracking",
      isClientSide: true,
      ctaText: "Generate Link",
      badge: "Instant",
    },
    {
      id: "url-encoder-decoder",
      slug: "url-encoder-decoder",
      name: "URL Encoder / Decoder",
      description: "Accurately encodes or decodes query parameters, paths, and special characters with full Unicode support.",
      category: "Link & Tracking",
      isClientSide: true,
      ctaText: "Encode / Decode",
      badge: "Instant",
    },
    {
      id: "open-graph-preview",
      slug: "open-graph-preview",
      name: "Open Graph Previewer",
      description: "Previews social sharing cards for Facebook, Twitter/X, and LinkedIn by fetching live tags or testing mock data.",
      category: "Network & Social",
      isClientSide: false,
      ctaText: "Preview Social Cards",
    },
    {
      id: "http-headers-checker",
      slug: "http-headers-checker",
      name: "HTTP Headers Checker",
      description: "Inspects live HTTP status codes, security headers (CSP, HSTS, X-Frame-Options), and cache directives.",
      category: "Network & Social",
      isClientSide: false,
      ctaText: "Check Headers",
    },
  ],

  caseStudies: [
    {
      id: "helloshiva-cwv",
      title: "HelloShiva Core Web Vitals & Technical Speed Architecture",
      client: "HelloShiva Platform (Internal Benchmark)",
      category: "Technical SEO & Web Engineering",
      summary:
        "How we engineered the HelloShiva platform to score 100/100 on Google PageSpeed Insights, achieving sub-second Largest Contentful Paint (LCP) and zero layout shift on a constrained cloud footprint.",
      metrics: [
        { label: "Performance Score", value: "100/100" },
        { label: "LCP (Mobile)", value: "0.68s" },
        { label: "Cumulative Layout Shift", value: "0.00" },
      ],
      tags: ["Core Web Vitals", "Next.js", "Server-Side Rendering", "Performance"],
    },
    {
      id: "b2b-saas-technical-audit",
      title: "Enterprise Technical SEO & Crawl Budget Optimization Framework",
      client: "B2B SaaS Demonstration Benchmark",
      category: "SEO Strategy & Crawl Architecture",
      summary:
        "A comprehensive demonstration of our 40-point technical audit methodology: discovering orphaned URLs, resolving faceted navigation index traps, and restructuring canonical hierarchies for search bot efficiency.",
      metrics: [
        { label: "Crawl Efficiency", value: "+320%" },
        { label: "Indexed URLs", value: "100% Target" },
        { label: "Waste Requests", value: "-84%" },
      ],
      tags: ["Technical SEO", "Crawl Budget", "Architecture", "Log Analysis"],
    },
    {
      id: "local-service-growth-framework",
      title: "Local SEO 3-Pack Domination for Multi-Location Service Practices",
      client: "Local Service Practice Framework",
      category: "Local SEO & Geo-Targeting",
      summary:
        "A structured execution framework demonstrating how geo-targeted landing pages, consistent NAP directory citation hygiene, and automated customer review workflows compound local search inquiries.",
      metrics: [
        { label: "Map Pack Reach", value: "Top 3 Radius" },
        { label: "Call Conversions", value: "+145%" },
        { label: "Citation Accuracy", value: "100%" },
      ],
      tags: ["Local SEO", "Google Maps", "Citations", "Reputation"],
    },
  ],
};
