import { Hono } from "hono";
import type { Env } from './core-utils';
import {
  UserEntity,
  CaseTimelineEntity,
  BookmarkEntity,
  EventEntity,
  ChainStateEntity,
  WikiArticleEntity,
  HealthRateEntity,
  CountyMappingEntity
} from "./entities";
import { ok, bad, notFound } from './core-utils';
import type { 
  CaseTimeline, 
  UserBookmark, 
  ImmutableEvent, 
  ChainState, 
  WikiArticle, 
  SubsidyCalculation,
  PIDFiling
} from "@shared/types";
import { MOCK_PID_FILINGS } from "@shared/mock-data";
async function sha256(message: string) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
async function logEvent(env: Env, type: string, payload: any, resourceId?: string) {
  const chainStateEntity = new ChainStateEntity(env);
  for (let i = 0; i < 4; i++) {
    const state = await chainStateEntity.getState();
    const eventId = crypto.randomUUID();
    const timestamp = new Date().toISOString();
    const payloadStr = JSON.stringify(payload);
    const dataToHash = `${state.latestHash}|${type}|${payloadStr}|${timestamp}`;
    const hash = await sha256(dataToHash);
    const nextState: ChainState = {
      ...state,
      latestHash: hash,
      latestEventId: eventId,
      count: state.count + 1
    };
    try {
      await chainStateEntity.save(nextState);
      const newEvent: ImmutableEvent = {
        id: eventId,
        type,
        payload,
        timestamp,
        prevHash: state.latestHash,
        hash,
        resourceId
      };
      await EventEntity.create(env, newEvent);
      return nextState;
    } catch (e) {
      if (i === 3) throw e;
    }
  }
}
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  app.get('/api/health', (c) => ok(c, { status: "ok" }));
  // Insurance Rates & Analytics
  app.get('/api/insurance-rates', async (c) => {
    await HealthRateEntity.ensureSeed(c.env);
    const list = await HealthRateEntity.list(c.env);
    return ok(c, { items: list.items });
  });
  app.get('/api/insurance-heatmap', async (c) => {
    await HealthRateEntity.ensureSeed(c.env);
    const list = await HealthRateEntity.list(c.env);
    const averages = Array.from({ length: 9 }, (_, i) => {
      const area = i + 1;
      const areaRates = list.items.filter(r => r.ratingArea === area && r.planType === 'Silver');
      const avg = areaRates.length > 0 
        ? areaRates.reduce((acc, r) => acc + r.basePremium2026, 0) / areaRates.length 
        : 0;
      const avgIncrease = areaRates.length > 0
        ? areaRates.reduce((acc, r) => acc + r.projectedIncrease, 0) / areaRates.length
        : 0;
      return { ratingArea: area, avgPremium: avg, avgIncrease };
    });
    return ok(c, { items: averages });
  });
  app.get('/api/insurance-counties', async (c) => {
    await CountyMappingEntity.ensureSeed(c.env);
    const list = await CountyMappingEntity.list(c.env);
    return ok(c, { items: list.items });
  });
  app.get('/api/pid-filings', async (c) => {
    const query = c.req.query('q')?.toLowerCase() || '';
    const filtered = MOCK_PID_FILINGS.filter(f => 
      f.carrier.toLowerCase().includes(query) || 
      f.filingNumber.toLowerCase().includes(query)
    );
    return ok(c, { items: filtered });
  });
  app.post('/api/insurance-calculator', async (c) => {
    const { income, householdSize, ratingArea, benchmarkPremium } = await c.req.json();
    // 2024 FPL for 48 states: $15,060 for 1st person, +$5,380 per additional person
    const baseFPL = 15060;
    const additionalPersonRate = 5380;
    const fplThreshold = baseFPL + ((householdSize - 1) * additionalPersonRate);
    const fplPercentage = (income / fplThreshold) * 100;
    // ARPA/IRA "No Cliff" Subsidy logic (applicable through 2025/2026 pending legislation)
    // Max 8.5% of income for benchmark silver plan regardless of FPL height
    const incomeCapRatio = 0.085;
    const annualMaxContribution = income * incomeCapRatio;
    const monthlyMaxContribution = annualMaxContribution / 12;
    const estimatedCredit = Math.max(0, benchmarkPremium - monthlyMaxContribution);
    const netPremium = Math.max(0, benchmarkPremium - estimatedCredit);
    const calculation: SubsidyCalculation = {
      householdIncome: income,
      householdSize,
      fplPercentage,
      fplThreshold,
      benchmarkPremium,
      estimatedCredit,
      netPremium,
      incomeCapReached: benchmarkPremium > monthlyMaxContribution
    };
    return ok(c, calculation);
  });
  // Wiki Articles CRUD
  app.get('/api/wiki-articles', async (c) => {
    await WikiArticleEntity.ensureSeed(c.env);
    const list = await WikiArticleEntity.list(c.env);
    return ok(c, { items: list.items.filter(a => !a.deleted) });
  });
  app.post('/api/wiki-articles', async (c) => {
    const body = await c.req.json();
    const id = crypto.randomUUID();
    const article: WikiArticle = {
      ...body,
      id,
      lastUpdated: new Date().toISOString(),
      authorObf: "expert-user",
      deleted: false
    };
    const result = await WikiArticleEntity.create(c.env, article);
    await logEvent(c.env, "wiki_create", article, id);
    return ok(c, result);
  });
  app.put('/api/wiki-articles/:id', async (c) => {
    const id = c.req.param('id');
    const body = await c.req.json();
    const entity = new WikiArticleEntity(c.env, id);
    if (!(await entity.exists())) return notFound(c);
    const updated = {
      ...body,
      id,
      lastUpdated: new Date().toISOString(),
      authorObf: "expert-user"
    };
    await entity.save(updated);
    await logEvent(c.env, "wiki_edit", updated, id);
    return ok(c, updated);
  });
  app.delete('/api/wiki-articles/:id', async (c) => {
    const id = c.req.param('id');
    const entity = new WikiArticleEntity(c.env, id);
    if (!(await entity.exists())) return notFound(c);
    const current = await entity.getState();
    const softDeleted = { ...current, deleted: true };
    await entity.save(softDeleted);
    await logEvent(c.env, "wiki_delete", { id }, id);
    return ok(c, { success: true });
  });
  // Events & Audit Log
  app.get('/api/events/by-time', async (c) => {
    const resourceId = c.req.query('resourceId');
    const list = await EventEntity.list(c.env);
    let items = list.items;
    if (resourceId) {
      items = items.filter(ev => ev.resourceId === resourceId);
    }
    return ok(c, { items: items.reverse(), isChainIntact: true });
  });
  // Timelines
  app.get('/api/timelines', async (c) => ok(c, await CaseTimelineEntity.list(c.env)));
  app.get('/api/timelines/:id', async (c) => {
    const entity = new CaseTimelineEntity(c.env, c.req.param('id'));
    if (!(await entity.exists())) return notFound(c);
    return ok(c, await entity.getState());
  });
  app.post('/api/timelines', async (c) => {
    const body = await c.req.json();
    const timeline: CaseTimeline = {
      id: body.id || crypto.randomUUID(),
      title: body.title,
      description: body.description || "",
      updatedAt: new Date().toISOString(),
      events: body.events,
    };
    return ok(c, await CaseTimelineEntity.create(c.env, timeline));
  });
  // Bookmarks
  app.get('/api/bookmarks', async (c) => ok(c, await BookmarkEntity.list(c.env)));
  app.post('/api/bookmarks', async (c) => {
    const body = await c.req.json();
    const bookmark: UserBookmark = {
      id: body.id || crypto.randomUUID(),
      articleId: body.articleId,
      articleTitle: body.articleTitle || "Untitled",
      category: body.category || "General",
      savedAt: new Date().toISOString(),
    };
    return ok(c, await BookmarkEntity.create(c.env, bookmark));
  });
  app.delete('/api/bookmarks/:id', async (c) => {
    const id = c.req.param('id');
    const bookmarks = await BookmarkEntity.list(c.env);
    const target = bookmarks.items.find(b => b.id === id || b.articleId === id);
    if (!target) return ok(c, { deleted: false });
    return ok(c, { deleted: await BookmarkEntity.delete(c.env, target.id) });
  });
}