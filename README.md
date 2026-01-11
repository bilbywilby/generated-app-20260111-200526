# Cloudflare Workers + React Boilerplate

[cloudflarebutton]

A production-ready full-stack boilerplate for Cloudflare Workers, featuring a React frontend with Tailwind CSS & shadcn/ui, Hono backend with Durable Objects for stateful entities (Users, Chats, Messages), TanStack Query for data fetching, and seamless local development/deploy.

## Features

- **Full-Stack Ready**: React 18 + Vite frontend with server-side Durable Objects backend.
- **Durable Objects Entities**: Pre-built `UserEntity` and `ChatBoardEntity` with indexing for listings, CRUD, pagination, and real-time chat messages.
- **Modern UI**: shadcn/ui components, Tailwind CSS with custom design system, dark mode, responsive layout.
- **API-First**: Hono routes for users/chats/messages with CORS, error handling, and JSON responses.
- **Data Fetching**: TanStack Query integration with typed API client.
- **Development Tools**: Hot reload, Bun support, TypeScript everywhere, ESLint, Tailwind IntelliSense.
- **Production Optimized**: Cloudflare Pages/Workers integration, SQLite-backed Durable Objects for persistence.
- **Extensible**: Easy to add new entities/routes via `worker/entities.ts` and `worker/user-routes.ts`.

## Tech Stack

- **Frontend**: React 18, Vite 6, TypeScript, Tailwind CSS 3, shadcn/ui, Lucide icons, TanStack Query, React Router, Sonner toasts, Framer Motion.
- **Backend**: Cloudflare Workers, Hono 4, Durable Objects (GlobalDurableObject with entity isolation).
- **State & Data**: Immer, Zustand-ready, indexed entity listings with pagination.
- **Build Tools**: Bun, Wrangler 3, Cloudflare Vite plugin.
- **Dev Tools**: ESLint 9, TypeScript 5.8, Vitest-ready.

## Quick Start (Local Development)

1. **Prerequisites**:
   - [Bun](https://bun.sh) installed.
   - [Cloudflare Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install/) installed (`bunx wrangler@latest` works too).

2. **Clone & Install**:
   ```bash
   git clone <your-repo>
   cd <project>
   bun install
   ```

3. **Run Locally**:
   ```bash
   bun run dev
   ```
   Opens at `http://localhost:3000` (or `$PORT`). Backend at `/api/*`, frontend auto-proxies.

4. **Type Generation** (for IDE support):
   ```bash
   bun run cf-typegen
   ```

## Usage Examples

### API Endpoints (via `worker/user-routes.ts`)
All responses follow `{ success: boolean; data?: T; error?: string }`.

- **Users**:
  ```bash
  # List (paginated)
  GET /api/users?limit=10&cursor=abc123

  # Create
  POST /api/users { "name": "Alice" }

  # Delete
  DELETE /api/users/:id
  POST /api/users/deleteMany { "ids": ["id1", "id2"] }
  ```

- **Chats**:
  ```bash
  GET /api/chats?limit=5
  POST /api/chats { "title": "My Chat" }
  DELETE /api/chats/:id
  ```

- **Messages**:
  ```bash
  GET /api/chats/:chatId/messages
  POST /api/chats/:chatId/messages { "userId": "u1", "text": "Hello!" }
  ```

### Frontend Integration
Use `api()` helper:
```tsx
import { api } from '@/lib/api-client';

const users = useQuery({
  queryKey: ['users'],
  queryFn: () => api<User[]>('/api/users'),
});
```

Seed data loads automatically on first request (`MOCK_USERS`, etc., editable in `shared/mock-data.ts`).

## Customizing

- **Add Entities**: Extend `IndexedEntity` in `worker/entities.ts`, add statics (`entityName`, `indexName`, `seedData`), import to `user-routes.ts`.
- **Add Routes**: Extend `userRoutes()` in `worker/user-routes.ts` (dynamic import prevents bundling issues).
- **UI Components**: Use shadcn/ui (`npx shadcn-ui@latest add <component>`).
- **Pages**: Edit `src/pages/` and update `main.tsx` router.
- **Sidebar**: Customize `src/components/app-sidebar.tsx` or remove from layout.

**Do not edit** `worker/index.ts`, `worker/core-utils.ts`, or `wrangler.jsonc`.

## Deployment

1. **Build**:
   ```bash
   bun run build
   ```

2. **Deploy to Cloudflare Workers**:
   ```bash
   bun run deploy
   ```
   Deploys Worker + assets (frontend SPA handled via `assets` config).

3. **Custom Domain/Pages**:
   - Bind custom domain in Wrangler dashboard.
   - For Pages: `wrangler pages deploy dist` (after `bun run build`).

[cloudflarebutton]

## Environment Variables

None required. All state in Durable Objects (SQLite-backed, multi-region).

## Troubleshooting

- **Port conflicts**: Set `PORT=3001 bun run dev`.
- **Types missing**: `bun run cf-typegen`.
- **Tailwind issues**: Restart dev server after config changes.
- **Wrangler auth**: `wrangler login`.
- **Logs**: `wrangler tail` post-deploy.

## License

MIT. See [LICENSE](LICENSE) for details.