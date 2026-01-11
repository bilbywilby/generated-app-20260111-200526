import { WikiArticle } from '@shared/types';
export type RightCategory = 'Privacy' | 'Billing' | 'Access' | 'Consent' | 'Quality';
export { WikiArticle };
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
  remedy?: string;
}