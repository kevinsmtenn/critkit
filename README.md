# CritKit

> Walk your build, crit what's wrong, hand your coding agent a source-anchored to-do list.

CritKit is the human QA step in the agent loop. You build a UI with a coding
agent (Claude Code, Cursor), open the running app, and walk it — every time
something's off (spacing, a color, a label, an alignment), you **crit** it: hit
a key, click the element, drop a note.

CritKit gathers the pass into a single ready-to-paste prompt. Each crit carries
its **source location** — file, line, component — plus values harvested from
the live DOM, so you barely type. Paste the prompt to your agent; it works
through the list top to bottom.

**Agent builds → you crit → agent fixes.**

## Install

```bash
npm i -D critkit react-grab
```

CritKit is built on [react-grab](https://github.com/aidenybai/react-grab), which
it uses headlessly to resolve a clicked element back to its source. `react-grab`
is a peer dependency.

## Usage

Register CritKit once, on the client, **in development only**:

```tsx
"use client"
import { useEffect } from "react"

export function CritKitDev() {
  useEffect(() => {
    void import("critkit").then(({ registerCritKit }) => registerCritKit())
  }, [])
  return null
}
```

Render it only in development — e.g. in your root layout:

```tsx
{process.env.NODE_ENV === "development" && <CritKitDev />}
```

CritKit never loads in a production build — zero production footprint.

## The crit pass

- Press **`C`** (or click the launcher) to enter crit mode.
- Hover any element — it highlights. Click to crit it.
- Type a note, hit `⏎`. Repeat across the page.
- Open the list and **Copy Crit Prompt** — paste it to your agent.
- `Esc` exits crit mode.

## License

MIT © Kevin Tenn
