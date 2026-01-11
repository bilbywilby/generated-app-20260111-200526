export type RightCategory = 'Privacy' | 'Billing' | 'Access' | 'Consent' | 'Quality' | 'Insurance';
export interface HealthRate {
  id: string;
  carrier: string;
  planType: 'Bronze' | 'Silver' | 'Gold';
  ratingArea: number;
  basePremium2026: number;
  projectedIncrease: number;
}
export interface CountyMapping {
  id: string;
  county: string;
  ratingArea: number;
}
export interface SubsidyCalculation {
  householdIncome: number;
  fplPercentage: number;
  benchmarkPremium: number;
  estimatedCredit: number;
  netPremium: number;
  incomeCapReached: boolean;
}
export interface ForensicEvent {
  id: string;
  type: 'request' | 'receipt' | 'discharge' | 'filing';
  date: string | Date;
  label: string;
  notes?: string;
}
export interface ViolationResult {
  id: string;
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  statute: string;
  isTriggered: boolean;
  remedy?: string;
}
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export interface User {
  id: string;
  name: string;
  onboardingCompleted?: boolean;
}
export interface WikiArticle {
  id: string;
  title: string;
  category: RightCategory;
  summary: string;
  content: string;
  statuteReference?: string;
  lastUpdated: string;
  authorObf: string;
  deleted?: boolean;
  actuarialSection?: {
    analysis: string;
    impactScore: number;
    glp1Influence: boolean;
  };
}
export interface WikiArticleInput {
  title: string;
  category: RightCategory;
  summary: string;
  content: string;
  statuteReference?: string;
  actuarialSection?: WikiArticle['actuarialSection'];
}
export interface CaseTimeline {
  id: string;
  title: string;
  description: string;
  updatedAt: string;
  events: ForensicEvent[];
}
export interface UserBookmark {
  id: string;
  articleId: string;
  articleTitle: string;
  category: string;
  savedAt: string;
}
export interface ImmutableEvent {
  id: string;
  type: string;
  payload: Record<string, any>;
  timestamp: string;
  prevHash: string;
  hash: string;
  resourceId?: string;
}
export interface ChainState {
  id: string;
  latestHash: string;
  latestEventId: string;
  count: number;
}
export interface AuditLogResponse {
  items: ImmutableEvent[];
  isChainIntact: boolean;
}
export interface Chat {
  id: string;
  title: string;
}
export interface ChatMessage {
  id: string;
  chatId: string;
  userId: string;
  text: string;
  ts: number;
}