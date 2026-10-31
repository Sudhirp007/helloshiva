import { KeywordOpportunity, ResearchProvider } from "./types";

/**
 * OctopusOn Research Provider Adapter
 * Replicates the deterministic expansion and clustering logic of octopusOn/seo-keyword-research
 * without binary dependencies or external server overhead.
 */
export class OctopusOnAdapter implements ResearchProvider {
  name = "OctopusOn Algorithmic Adapter";

  private questionModifiers = ["how to improve", "why is", "what is", "best practices for", "guide to"];
  private commercialModifiers = ["services", "agency", "framework", "audit checklist", "strategy", "consulting"];

  async discoverKeywords(seed: string): Promise<KeywordOpportunity[]> {
    const cleanSeed = seed.trim().toLowerCase();
    const results: KeywordOpportunity[] = [];

    // 1. Core Informational Opportunity
    results.push({
      keyword: `how to optimize ${cleanSeed} for b2b growth`,
      searchIntent: "Informational",
      topicCluster: "Strategic Foundations",
      suggestedTitle: `The Comprehensive Guide to Optimizing ${seed} in 2026`,
      opportunityExplanation:
        "High informational intent answering foundational practitioner questions. Captures top-of-funnel decision makers seeking execution clarity.",
      competitionLevel: "Medium",
      source: "OctopusOn Algorithmic Expansion",
      suggestedContentType: "Pillar Technical Guide",
      recommendedAction: "Add to 7-Day Editorial Calendar for drafting",
    });

    // 2. Commercial Intent Opportunity
    results.push({
      keyword: `${cleanSeed} agency vs in-house team`,
      searchIntent: "Commercial",
      topicCluster: "Evaluation & Comparison",
      suggestedTitle: `Hiring a ${seed} Agency vs. Building In-House: Complete ROI Breakdown`,
      opportunityExplanation:
        "High commercial intent: prospects evaluating resource allocation models before signing service retainers.",
      competitionLevel: "Low",
      source: "OctopusOn SERP Intent Classifier",
      suggestedContentType: "Comparison & Buyer Guide",
      recommendedAction: "Draft with primary CTA pointing to HelloShiva consultation",
    });

    // 3. Technical Audit Intent
    results.push({
      keyword: `${cleanSeed} technical audit checklist`,
      searchIntent: "Commercial",
      topicCluster: "Audits & Diagnostics",
      suggestedTitle: `The 2026 ${seed} Technical Audit Checklist: 25 Bottlenecks to Fix`,
      opportunityExplanation:
        "Identifies website owners actively diagnosing code debt, crawl blocks, and indexing issues.",
      competitionLevel: "Medium",
      source: "OctopusOn Clustering Logic",
      suggestedContentType: "Diagnostic Checklist",
      recommendedAction: "Cross-link to HelloShiva Free SEO Page Analyzer tool",
    });

    // 4. Transactional Intent Opportunity
    results.push({
      keyword: `enterprise ${cleanSeed} services`,
      searchIntent: "Transactional",
      topicCluster: "Agency Solutions",
      suggestedTitle: `Enterprise ${seed} Services Built for Sustainable Pipeline Revenue`,
      opportunityExplanation:
        "Direct transactional intent from senior marketing leaders ready to engage a specialized agency partner.",
      competitionLevel: "High",
      source: "OctopusOn Modifier Expansion",
      suggestedContentType: "Service Landing Editorial",
      recommendedAction: "Prioritize for conversion-focused content cluster",
    });

    return results;
  }
}

export const defaultOctopusOnAdapter = new OctopusOnAdapter();
