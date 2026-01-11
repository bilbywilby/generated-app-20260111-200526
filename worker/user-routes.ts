import { Hono } from "hono";
import type { Env } from './core-utils';
import { UserEntity, CaseTimelineEntity, BookmarkEntity } from "./entities";
import { ok, bad, isStr } from './core-utils';
import type { CaseTimeline, UserBookmark } from "@shared/types";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // TIMELINES
  app.get('/api/timelines', async (c) => {
    const page = await CaseTimelineEntity.list(c.env);
    return ok(c, page);
  });
  app.post('/api/timelines', async (c) => {
    const body = (await c.req.json()) as Partial<CaseTimeline>;
    if (!body.title || !body.events) return bad(c, 'Title and events required');
    const timeline: CaseTimeline = {
      id: body.id || crypto.randomUUID(),
      title: body.title,
      description: body.description || "",
      updatedAt: new Date().toISOString(),
      events: body.events,
    };
    return ok(c, await CaseTimelineEntity.create(c.env, timeline));
  });
  app.delete('/api/timelines/:id', async (c) => {
    return ok(c, { deleted: await CaseTimelineEntity.delete(c.env, c.req.param('id')) });
  });
  // BOOKMARKS
  app.get('/api/bookmarks', async (c) => {
    const page = await BookmarkEntity.list(c.env);
    return ok(c, page);
  });
  app.post('/api/bookmarks', async (c) => {
    const body = (await c.req.json()) as Partial<UserBookmark>;
    if (!body.articleId) return bad(c, 'Article ID required');
    const bookmark: UserBookmark = {
      id: body.id || crypto.randomUUID(),
      articleId: body.articleId,
      articleTitle: body.articleTitle || "Untitled Article",
      category: body.category || "General",
      savedAt: new Date().toISOString(),
    };
    return ok(c, await BookmarkEntity.create(c.env, bookmark));
  });
  app.delete('/api/bookmarks/:id', async (c) => {
    // Delete by ID or by Article ID (heuristic for toggle)
    const id = c.req.param('id');
    const bookmarks = await BookmarkEntity.list(c.env);
    const target = bookmarks.items.find(b => b.id === id || b.articleId === id);
    if (!target) return ok(c, { deleted: false });
    return ok(c, { deleted: await BookmarkEntity.delete(c.env, target.id) });
  });
  // USERS (Minimal)
  app.get('/api/users/me', async (c) => {
    return ok(c, { id: 'default-user', name: 'PA Health Advocate', onboardingCompleted: true });
  });
}