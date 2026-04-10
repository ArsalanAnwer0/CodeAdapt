# CodeAdapt — Frontend

A React + TypeScript + Vite front-end for **CodeAdapt**, a coding-interview
practice platform where the AI interviewer adapts in real time — injecting
bugs, changing requirements mid-session, and scoring your adaptability.

> This README covers the front-end only. The API lives in a separate
> backend service; the front-end talks to it through a thin service layer
> that can be swapped between a mock implementation and a real HTTP client
> with a single environment variable.

---

## Quick start

```bash
npm install
npm run dev       # start Vite on http://localhost:5173
npm run build     # type-check + production build
npm run preview   # preview the production build locally
```

## Environment

All environment variables are prefixed with `VITE_` so they are visible to
the bundled client. A template lives in `.env.example`; copy it to `.env`
and edit as needed:

| Variable              | Default                  | Description                                      |
| --------------------- | ------------------------ | ------------------------------------------------ |
| `VITE_API_URL`        | `http://localhost:8787`  | Backend base URL.                                |
| `VITE_API_TIMEOUT_MS` | `12000`                  | Request timeout before the HTTP client aborts.   |
| `VITE_ENABLE_MOCK_API`| `true`                   | When `true`, uses the in-memory mock adapter.    |
| `VITE_ENABLE_ANALYTICS` | `false`                | Toggle analytics event sink.                     |
| `VITE_LOG_LEVEL`      | `info`                   | `debug` / `info` / `warn` / `error` / `silent`.  |

## Architecture

```
src/
├─ components/          UI — feature screens and domain widgets
│  ├─ ui/               Reusable primitives (Button, Card, Modal, …)
│  └─ InterviewSession/ Three-pane interview layout
├─ hooks/               Reusable React hooks
├─ lib/                 Pure utilities (cn, format, env, logger, constants)
├─ services/            API contract + mock and HTTP adapters
├─ stores/              Persistent client state (preferences, history)
├─ theme/               ThemeProvider and dark-mode integration
├─ types/               Domain types, split by concern and re-exported
├─ data/                Static problem and injection seed data
├─ utils/               Legacy mock-AI helpers (consumed by mockAdapter)
├─ App.tsx              Top-level router / screen orchestrator
└─ main.tsx             Provider tree + render root
```

### Layers at a glance

- **UI components** never talk to the network directly. They dispatch to
  `services/api.ts`, which owns the `Api` interface and picks an adapter
  (`mockAdapter.ts` or a future `httpAdapter.ts`) based on
  `VITE_ENABLE_MOCK_API`.
- **Primitives** in `components/ui/` are the only place where raw design
  tokens and low-level interaction styles live. Feature screens should
  compose these rather than re-implement buttons, cards, etc.
- **Stores** use `useLocalStorage` under the hood, so every feature gets
  cross-tab sync and corruption-safe reads for free.
- **Theme** is driven by a `data-theme` attribute on `<html>` and a set of
  CSS custom properties. Dark mode is purely CSS — no React re-render is
  required when the user toggles it.
- **Types** live in `src/types/` split by domain (`session`, `problem`,
  `chat`, `result`) and re-exported from `src/types/index.ts` as a barrel.

### Switching to a real backend

1. Set `VITE_ENABLE_MOCK_API=false` in `.env`.
2. Set `VITE_API_URL` to your backend.
3. Implement the `Api` interface in a new `services/httpAdapter.ts`,
   using the `http` client from `services/http.ts`.
4. The rest of the front-end does not change — every screen already
   imports `api` from `services/api.ts`, not from the mock.

## Design system

Primitives live in `components/ui/`:

- `Button`, `IconButton` — variants, sizes, loading, icons
- `Card` — padding / elevation / interactive lift
- `Badge` — status and severity tags
- `Modal` — portal dialog with focus trap and scroll lock
- `Tooltip` — hover/focus label with configurable placement
- `Skeleton` — loading placeholder with shimmer
- `Toast` — notifications via `useToast()`

Tokens (colors, shadows, radii, transitions) are declared in
`src/index.css` as CSS custom properties and shadowed for dark mode via
`:root[data-theme='dark']`. Prefer reading `var(--token)` in inline
styles or using the Tailwind color utilities configured in
`tailwind.config.js`.

## Keyboard shortcuts

The `useKeyboardShortcut` hook supports `mod+` (⌘ on macOS, Ctrl
elsewhere) prefixes and multiple bindings per handler. The
`KeyboardShortcutsModal` documents every binding registered by the app —
update it whenever you add a new shortcut.

## Performance notes

- The initial bundle excludes Monaco, the results screen, and the history
  screen. Those chunks are lazy-loaded via `React.lazy` when first needed.
- `vite.config.ts` uses `manualChunks` to isolate `monaco`, `icons`,
  `react`, and `react-dom` into cacheable vendor chunks.
- `prefers-reduced-motion` is honored everywhere — confetti and page
  transitions skip animation automatically.

## Accessibility

- All interactive controls have `:focus-visible` outlines defined in
  `index.css`.
- Icon-only buttons use `IconButton`, which requires an `aria-label`.
- The `Modal` primitive sets `role="dialog"` / `aria-modal` and restores
  body scroll on close.
- `ToastProvider` mounts an `aria-live="polite"` region so screen readers
  announce toasts as they appear.

## Testing the mock

The mock adapter in `services/mockAdapter.ts` wraps the legacy
`utils/mockAI.ts` helpers with simulated latency so loading states are
exercised during development. It implements the same `Api` interface as
the eventual HTTP client, so feature code is agnostic.
