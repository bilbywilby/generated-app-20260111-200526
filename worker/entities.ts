import { IndexedEntity, Entity } from "./core-utils";
import type {
  User,
  CaseTimeline,
  UserBookmark,
  ImmutableEvent,
  ChainState,
  WikiArticle,
  HealthRate,
  CountyMapping
} from "@shared/types";
import {
  MOCK_USERS,
  MOCK_WIKI_ARTICLES,
  MOCK_HEALTH_RATES,
  MOCK_COUNTY_MAPPINGS
} from "@shared/mock-data";
export class UserEntity extends IndexedEntity<User> {
  static readonly entityName = "user";
  static readonly indexName = "users";
  static readonly initialState: User = { id: "", name: "" };
  static seedData = MOCK_USERS;
}
export class WikiArticleEntity extends IndexedEntity<WikiArticle> {
  static readonly entityName = "wiki-article";
  static readonly indexName = "wiki-articles";
  static readonly initialState: WikiArticle = {
    id: "",
    title: "",
    category: "Access",
    summary: "",
    content: "",
    lastUpdated: "",
    authorObf: "system"
  };
  static seedData = MOCK_WIKI_ARTICLES;
}
export class HealthRateEntity extends IndexedEntity<HealthRate> {
  static readonly entityName = "health-rate";
  static readonly indexName = "health-rates";
  static readonly initialState: HealthRate = {
    id: "",
    carrier: "",
    planType: "Silver",
    ratingArea: 1,
    basePremium2026: 0,
    projectedIncrease: 0,
    glp1Covered: false,
    avgDeductible: 0
  };
  static seedData = MOCK_HEALTH_RATES;
}
export class CountyMappingEntity extends IndexedEntity<CountyMapping> {
  static readonly entityName = "county-mapping";
  static readonly indexName = "county-mappings";
  static readonly initialState: CountyMapping = {
    id: "",
    county: "",
    ratingArea: 1
  };
  static seedData = MOCK_COUNTY_MAPPINGS;
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