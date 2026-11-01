# auth.md - HelloShiva Agent Authentication & Discovery

Welcome to the HelloShiva agent authentication protocol documentation. This document specifies authentication, authorization, and discovery mechanisms for autonomous agents, AI assistants, and LLM applications interacting with HelloShiva APIs and services.

## Agent Audience & Permissions
- **Audience:** AI Agents, MCP Clients, Search Crawlers, and Programmatic Decision Engines.
- **Resource Identifier:** `https://helloshiva.com`
- **Protected Resource Metadata (PRM):** `/.well-known/oauth-protected-resource`
- **OAuth Authorization Server Metadata:** `/.well-known/oauth-authorization-server`

## Supported Authentication Methods
1. **Anonymous Read-Only Access:**
   - **Scopes:** `read:tools`, `read:marketing`, `read:content`
   - **Method:** Public HTTP GET requests without credentials.
   - **Usage:** Reading site content, sitemaps, API catalogs, and executing free SEO diagnostic tools.

2. **Bearer Token Authentication (Header):**
   - **Scopes:** `write:enquiries`, `manage:content`
   - **Header:** `Authorization: Bearer <access_token>`
   - **Token Endpoint:** `https://helloshiva.com/oauth/token`
   - **Grant Types:** `client_credentials`, `authorization_code`

3. **Agent Registration & Provisioning:**
   - **Registration URI:** `https://helloshiva.com/api/v1/enquiry`
   - **Supported Flows:** Verified email, client credentials, and token exchange.
   - **Credential Usage:** Issued bearer tokens must be sent in standard HTTP `Authorization` headers.

## Discoverability & Protocol Links
- API Catalog: `/.well-known/api-catalog`
- MCP Server Card: `/.well-known/mcp.json`
- A2A Agent Card: `/.well-known/agent-card.json`
- Agentic Commerce (ACP): `/.well-known/acp.json`
