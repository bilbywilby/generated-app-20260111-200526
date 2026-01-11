import type { ForensicEvent } from '../src/types/domain';
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