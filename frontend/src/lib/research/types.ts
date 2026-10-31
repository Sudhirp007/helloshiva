export interface KeywordOpportunity {
  keyword: string;
  searchIntent: "Informational" | "Commercial" | "Transactional" | "Navigational";
  topicCluster: string;
  suggestedTitle: string;
  opportunityExplanation: string;
  competitionLevel: "Low" | "Medium" | "High";
  source: string;
  suggestedContentType: string;
  recommendedAction: string;
}

export interface ResearchProvider {
  name: string;
  discoverKeywords(seed: string): Promise<KeywordOpportunity[]>;
}
