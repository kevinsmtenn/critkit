# CritKit

> Design crit for your coding agents — walk your build, crit what's wrong, hand your agent a source-anchored to-do list.

CritKit is the design QA step in the agentic coding loop. You build a UI with a
coding agent (Claude Code, Cursor), open the running app, and walk it — every
time something's off (spacing, a color, a label, an alignment), you **crit**
it: hit a key, click the element, drop a note.

CritKit gathers the session into a single ready-to-paste prompt. Each crit carries
its **source** — the component that rendered the element — plus values
harvested from the live DOM, so you barely type. Paste the prompt to your
agent; it works through the list top to bottom.

**Agent builds → you crit → agent fixes.**

## Install

```bash
npm i -D critkit
```

CritKit is a standalone, dev-only tool — zero runtime dependencies, no build
step, nothing to configure.

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

## The crit session

- Press **`C`** (or click the launcher) to enter crit mode.
- Hover any element — it highlights. Click to crit it.
- Type a note, hit `⏎`. Repeat across the page.
- Open the list and **Copy Crit Prompt** — paste it to your agent.
- `Esc` exits crit mode.

## How source resolution works

CritKit resolves a clicked element to the component that rendered it by reading
React's dev-mode fiber data — no build plugin, no instrumentation. Because that
data only exists in a development build, CritKit is dev-only by nature.

## Requirements

React 19, on the client.

## License

MIT © Kevin Tenn
