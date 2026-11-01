import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { siteConfig } from './config/site';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const acceptHeader = request.headers.get('accept') || '';

  // Host Canonical Redirect: www.helloshiva.com -> https://helloshiva.com
  const host = request.headers.get('host') || '';
  if (host.startsWith('www.')) {
    const canonicalUrl = new URL(request.url);
    canonicalUrl.host = 'helloshiva.com';
    canonicalUrl.protocol = 'https:';
    return NextResponse.redirect(canonicalUrl.toString(), 308);
  }

  // Content Negotiation: Markdown for Agents (Accept: text/markdown)
  const wantsMarkdown =
    acceptHeader.includes('text/markdown') ||
    acceptHeader.includes('text/x-markdown');

  // Skip static assets, API routes, and .well-known files from markdown negotiation
  const isStaticOrApi =
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/.well-known') ||
    pathname.includes('.') ||
    pathname.startsWith('/admin');

  if (wantsMarkdown && !isStaticOrApi) {
    let md = '';

    if (pathname === '/' || pathname === '') {
      md = `# HelloShiva | Digital Marketing, SEO & Growth Agency

> Grow your online presence with HelloShiva. Explore SEO, digital marketing, social media, PPC, and website solutions designed to help businesses grow.

## Overview
HelloShiva is an engineering-driven digital marketing agency combining organic search science, performance paid acquisition, and modern web architecture to compound pipeline and revenue.

## Core Services
${siteConfig.services.map((s) => `### [${s.title}](https://helloshiva.com/services/${s.slug})\n${s.shortDesc}\n- **Problems Solved:** ${s.problemsSolved.slice(0, 2).join('; ')}\n`).join('\n')}

## Free Marketing & SEO Tools
${siteConfig.tools.map((t) => `- **[${t.name}](https://helloshiva.com/tools/${t.slug}):** ${t.description}`).join('\n')}

## Agent & Machine-Readable Interfaces
- **API Catalog:** [/.well-known/api-catalog](https://helloshiva.com/.well-known/api-catalog)
- **Agent Card (A2A & AP2):** [/.well-known/agent-card.json](https://helloshiva.com/.well-known/agent-card.json)
- **MCP Server Card:** [/.well-known/mcp.json](https://helloshiva.com/.well-known/mcp.json)
- **Auth & Protocols:** [/auth.md](https://helloshiva.com/auth.md)
- **OpenAPI Specification:** [/openapi.json](https://helloshiva.com/openapi.json)

## Contact & Inquiries
- **Email:** ${siteConfig.contact.email}
- **Phone / WhatsApp:** ${siteConfig.contact.phone}
- **Website:** https://helloshiva.com
`;
    } else if (pathname.startsWith('/services/')) {
      const slug = pathname.replace('/services/', '').replace(/\/$/, '');
      const svc = siteConfig.services.find((s) => s.slug === slug);
      if (svc) {
        md = `# ${svc.title} - HelloShiva

> ${svc.tagline}

${svc.shortDesc}

## Hero Statement
${svc.heroHeadline}

## Challenges This Service Eliminates
${svc.problemsSolved.map((p) => `- ${p}`).join('\n')}

## Deliverables & Strategic Framework
${svc.whatsIncluded.map((w) => `- ${w}`).join('\n')}

## Target Audience
${svc.suitableFor.map((sf) => `- ${sf}`).join('\n')}

## Frequently Asked Questions
${svc.faqs.map((f) => `### ${f.question}\n${f.answer}\n`).join('\n')}

## Consultation
Book a strategy consultation at https://helloshiva.com/contact?service=${svc.slug}
`;
      }
    } else if (pathname === '/services') {
      md = `# Digital Marketing Services - HelloShiva

We design, deploy, and scale unified growth systems that capture buyer intent, outrank competitors, and compound revenue.

${siteConfig.services.map((s) => `## [${s.title}](https://helloshiva.com/services/${s.slug})\n${s.shortDesc}\n`).join('\n')}
`;
    } else if (pathname === '/tools') {
      md = `# 10 Free Marketing & SEO Diagnostic Tools - HelloShiva

Inspect metadata, test robots rules, validate sitemaps, build campaign tracking links, and diagnose code-level SEO elements.

${siteConfig.tools.map((t) => `### [${t.name}](https://helloshiva.com/tools/${t.slug})\nCategory: ${t.category}\n${t.description}\n`).join('\n')}
`;
    } else {
      md = `# HelloShiva - ${pathname}

Visit https://helloshiva.com${pathname} for complete information.
- API Catalog: https://helloshiva.com/.well-known/api-catalog
- Authentication: https://helloshiva.com/auth.md
`;
    }

    const response = new NextResponse(md, {
      status: 200,
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Vary': 'Accept',
        'X-Markdown-For-Agents': 'true',
        'Link': `</${pathname.replace(/^\//, '')}>; rel="alternate"; type="text/html"`,
      },
    });
    return response;
  }

  // Normal HTML/API request: Attach RFC 8288 / RFC 9727 Link headers
  const response = NextResponse.next();
  const linkHeader = [
    '</.well-known/api-catalog>; rel="api-catalog"',
    '</.well-known/oauth-protected-resource>; rel="service-desc"',
    '</auth.md>; rel="service-doc"',
    '</.well-known/openid-configuration>; rel="describedby"',
    '</.well-known/agent-card.json>; rel="agent-card"',
    '</.well-known/mcp.json>; rel="mcp-server-card"',
  ].join(', ');

  response.headers.set('Link', linkHeader);
  response.headers.set('Vary', 'Accept');

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
