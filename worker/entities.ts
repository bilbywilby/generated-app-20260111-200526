import { IndexedEntity } from "./core-utils";
import type { User, Chat, ChatMessage, CaseTimeline, UserBookmark } from "@shared/types";
import { MOCK_CHAT_MESSAGES, MOCK_CHATS, MOCK_USERS } from "@shared/mock-data";
export class UserEntity extends IndexedEntity<User> {
  static readonly entityName = "user";
  static readonly indexName = "users";
  static readonly initialState: User = { id: "", name: "" };
  static seedData = MOCK_USERS;
}
export class CaseTimelineEntity extends IndexedEntity<CaseTimeline> {
  static readonly entityName = "case-timeline";
  static readonly indexName = "case-timelines";
  static readonly initialState: CaseTimeline = { 
    id: "", 
    title: "", 
    description: "", 
    updatedAt: "", 
    events: [] 
  };
}
export class BookmarkEntity extends IndexedEntity<UserBookmark> {
  static readonly entityName = "bookmark";
  static readonly indexName = "bookmarks";
  static readonly initialState: UserBookmark = { 
    id: "", 
    articleId: "", 
    articleTitle: "", 
    category: "", 
    savedAt: "" 
  };
}
export type ChatBoardState = Chat & { messages: ChatMessage[] };
const SEED_CHAT_BOARDS: ChatBoardState[] = MOCK_CHATS.map(c => ({
  ...c,
  messages: MOCK_CHAT_MESSAGES.filter(m => m.chatId === c.id),
}));
export class ChatBoardEntity extends IndexedEntity<ChatBoardState> {
  static readonly entityName = "chat";
  static readonly indexName = "chats";
  static readonly initialState: ChatBoardState = { id: "", title: "", messages: [] };
  static seedData = SEED_CHAT_BOARDS;
  async listMessages(): Promise<ChatMessage[]> {
    const { messages } = await this.getState();
    return messages;
  }
  async sendMessage(userId: string, text: string): Promise<ChatMessage> {
    const msg: ChatMessage = { id: crypto.randomUUID(), chatId: this.id, userId, text, ts: Date.now() };
    await this.mutate(s => ({ ...s, messages: [...s.messages, msg] }));
    return msg;
  }
}