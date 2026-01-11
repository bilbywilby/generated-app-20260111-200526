import { IndexedEntity, Entity } from "./core-utils";
import type { User, CaseTimeline, UserBookmark, ImmutableEvent, ChainState } from "@shared/types";
import { MOCK_USERS } from "@shared/mock-data";
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
export class EventEntity extends IndexedEntity<ImmutableEvent> {
  static readonly entityName = "immutable-event";
  static readonly indexName = "immutable-events";
  static readonly initialState: ImmutableEvent = {
    id: "",
    type: "",
    payload: {},
    timestamp: "",
    prevHash: "",
    hash: ""
  };
}
export class ChainStateEntity extends Entity<ChainState> {
  static readonly entityName = "chain-state";
  static readonly initialState: ChainState = {
    id: "global-chain",
    latestHash: "0".repeat(64),
    latestEventId: "",
    count: 0
  };
  constructor(env: any) {
    super(env, "global-chain");
  }
}