export type RightCategory = 'Privacy' | 'Billing' | 'Access' | 'Consent' | 'Quality';
export interface WikiArticle {
  id: string;
  title: string;
  category: RightCategory;
  summary: string;
  content: string; // Markdown supported
  statuteReference?: string;
  lastUpdated: string;
}
export interface ForensicEvent {
  id: string;
  type: 'request' | 'receipt' | 'discharge' | 'filing';
  date: Date;
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
}