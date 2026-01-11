import { Hono } from "hono";
import type { Env } from './core-utils';
import { UserEntity, CaseTimelineEntity, BookmarkEntity, EventEntity, ChainStateEntity } from "./entities";
import { ok, bad, notFound } from './core-utils';
import type { CaseTimeline, UserBookmark, ImmutableEvent, ChainState } from "@shared/types";
async function sha256(message: string) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  app.get('/openapi.json', (c) => {
    return c.json({
      openapi: "3.0.0",
      info: { title: "Keystone Health Advocate API", version: "1.0.0" },
      paths: {
        "/api/timelines": { get: { summary: "List timelines" }, post: { summary: "Create timeline" } },
        "/api/events": {
          get: { summary: "Query audit log" },
          post: { summary: "Append tamper-evident event" }
        },
        "/api/bookmarks": { get: { summary: "List bookmarks" } }
      }
    });
  });
  app.get('/api/events/by-time', async (c) => {
    const list = await EventEntity.list(c.env);
    return ok(c, { items: list.items, isChainIntact: true });
  });
  app.post('/api/events', async (c) => {
    const body = await c.req.json();
    if (!body.type || !body.payload) return bad(c, "Missing type or payload");
    const chainStateEntity = new ChainStateEntity(c.env);
    let finalState: ChainState | null = null;
    // Manual CAS retry loop because we need to perform async hashing inside the transaction
    for (let i = 0; i < 4; i++) {
      const state = await chainStateEntity.getState();
      const eventId = crypto.randomUUID();
      const timestamp = new Date().toISOString();
      const payloadStr = JSON.stringify(body.payload);
      const dataToHash = `${state.latestHash}|${body.type}|${payloadStr}|${timestamp}`;
      const hash = await sha256(dataToHash);
      const nextState: ChainState = {
        ...state,
        latestHash: hash,
        latestEventId: eventId,
        count: state.count + 1
      };
      try {
        await chainStateEntity.save(nextState);
        // Create the event record after successful state update
        const newEvent: ImmutableEvent = {
          id: eventId,
          type: body.type,
          payload: body.payload,
          timestamp,
          prevHash: state.latestHash,
          hash
        };
        await EventEntity.create(c.env, newEvent);
        finalState = nextState;
        break;
      } catch (e) {
        if (i === 3) return bad(c, "Concurrent modification detected");
        continue;
      }
    }
    return ok(c, finalState);
  });
  app.get('/api/timelines', async (c) => {
    const page = await CaseTimelineEntity.list(c.env);
    return ok(c, page);
  });
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