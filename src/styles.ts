/**
 * Self-contained stylesheet injected into CritKit's shadow root. Kept as a
 * string (not a CSS file) so the package has no build-time CSS pipeline and
 * the styles can't leak into — or be overridden by — the host app.
 *
 * Shadow-DOM encapsulation also means react-grab's page-freeze CSS (which
 * targets main-document elements) never reaches this UI, so its motion runs
 * freely while the page underneath is frozen.
 */
export const CRITKIT_CSS = `
.ck-container {
  font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 13px;
  line-height: 1.45;
  -webkit-font-smoothing: antialiased;
  color: #f4f4f5;
  /* CritKit's UI keeps its own cursor. While crit mode is on the page wears
     the picker's crosshair; this stops that crosshair bleeding (via the host
     element's inherited cursor) into the menu, where it would be wrong —
     you're managing the crit list here, not picking a target. Inside the
     menu the cursor is normal chrome: grab on handles, pointer on controls. */
  cursor: default;
}
.ck-container *, .ck-container *::before, .ck-container *::after { box-sizing: border-box; }

.ck-mono {
  font-family: ui-monospace, SFMono-Regular, "JetBrains Mono", Menlo, Consolas, monospace;
}

/* — capture popover — */
.ck-backdrop { position: fixed; inset: 0; pointer-events: auto; }

.ck-pop {
  position: fixed;
  width: 300px;
  pointer-events: auto;
  background: #0b0b0c;
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow: 0 16px 50px -12px rgba(0, 0, 0, 0.85);
}
.ck-pop-body { padding: 10px 11px; }
.ck-input {
  width: 100%; background: #161617; color: #f4f4f5;
  border: 1px solid rgba(255, 255, 255, 0.12);
  padding: 7px 8px; font-size: 13px; font-family: inherit;
  outline: none; resize: none; display: block; cursor: text;
}
.ck-input:focus { border-color: rgba(255, 255, 255, 0.32); }
.ck-input::placeholder { color: #5a5a5f; }
.ck-pop-foot {
  display: flex; align-items: center; justify-content: space-between;
  padding: 8px 9px 9px; border-top: 1px solid rgba(255, 255, 255, 0.08);
}
.ck-foot-cancel {
  display: flex; align-items: center; gap: 6px;
  background: transparent; border: 0; color: #8a8a8f;
  font: 11px/1 inherit; cursor: pointer; padding: 5px 5px;
  transition: color 0.15s ease;
}
.ck-foot-cancel:hover { color: #c4c4c8; }
.ck-foot-add {
  display: flex; align-items: center; gap: 7px;
  background: #f4f4f5; color: #0b0b0c; border: 0;
  font: 600 11px/1 inherit; cursor: pointer; padding: 6px 8px 6px 11px;
  transition: background 0.15s ease, transform 0.08s ease;
}
.ck-foot-add:hover { background: #ffffff; }
.ck-foot-add:active { transform: scale(0.96); }
.ck-kbd {
  display: inline-flex; align-items: center; justify-content: center;
  height: 16px; min-width: 16px; padding: 0 4px;
  font: 600 9.5px/1 ui-monospace, SFMono-Regular, Menlo, monospace;
  background: #232325; border: 1px solid rgba(255, 255, 255, 0.16);
  color: #c4c4c8;
}
.ck-kbd-invert { background: #0b0b0c; border-color: #0b0b0c; color: #f4f4f5; }

/* — the draggable dock + snap hints — */
.ck-dock {
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: auto;
  touch-action: none;
}
/* Ghost footprint — a dotted square the size of the dock at each anchor. */
.ck-snap {
  position: fixed;
  border: 1.5px dotted rgba(255, 255, 255, 0.3);
  pointer-events: none;
}
.ck-snap-on {
  border-color: #f4f4f5;
  background: rgba(255, 255, 255, 0.05);
}

/* — list: collapsed badge — */
.ck-badge {
  display: flex; align-items: center; gap: 8px;
  background: #0b0b0c; color: #f4f4f5;
  border: 1px solid rgba(255, 255, 255, 0.14);
  padding: 8px 11px; cursor: grab; font-size: 12px;
  box-shadow: 0 8px 28px -10px rgba(0, 0, 0, 0.8);
  transition: border-color 0.15s ease, transform 0.08s ease;
}
.ck-badge:active { cursor: grabbing; }
.ck-badge:hover { border-color: rgba(255, 255, 255, 0.32); }
.ck-badge:active { transform: scale(0.97); }
.ck-count {
  font: 600 11px/1 ui-monospace, monospace;
  background: #f4f4f5; color: #0b0b0c; padding: 3px 6px;
}

/* — list: expanded panel — */
.ck-panel {
  width: 348px; max-height: 72vh;
  display: flex; flex-direction: column;
  background: #0b0b0c;
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow: 0 22px 64px -14px rgba(0, 0, 0, 0.88);
}
.ck-panel-head {
  display: flex; align-items: center; justify-content: space-between;
  padding: 11px 13px; border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  cursor: grab; user-select: none;
}
.ck-panel-head:active { cursor: grabbing; }
.ck-panel-heading { display: flex; align-items: center; gap: 8px; }
.ck-panel-title {
  font: 600 11px/1 ui-monospace, monospace;
  letter-spacing: 0.09em; text-transform: uppercase; color: #d4d4d8;
}
.ck-panel-actions { display: flex; align-items: center; gap: 6px; }
.ck-clear {
  background: transparent; border: 0; cursor: pointer;
  font: 600 9.5px/1 ui-monospace, SFMono-Regular, Menlo, monospace;
  letter-spacing: 0.07em; text-transform: uppercase; color: #7a7a7f;
  padding: 3px 4px; transition: color 0.15s ease, transform 0.08s ease;
}
.ck-clear:hover { color: #f87171; }
.ck-clear:active { transform: scale(0.95); }
.ck-panel-list { flex: 1; overflow-y: auto; }
.ck-empty {
  padding: 30px 20px; text-align: center;
  color: #6a6a6f; font-size: 12px; line-height: 1.65;
}
.ck-empty strong { color: #d4d4d8; font-weight: 600; }
.ck-row { padding: 11px 13px; border-bottom: 1px solid rgba(255, 255, 255, 0.06); }
.ck-row-top {
  display: flex; align-items: center; justify-content: space-between; gap: 8px;
}
.ck-row-note {
  width: 100%; background: transparent; border: 0; color: #f4f4f5;
  font-size: 13px; font-family: inherit; outline: none;
  padding: 0; margin-top: 6px; cursor: text;
}
.ck-row-note::placeholder { color: #5a5a5f; }
.ck-row-src {
  flex: 1; min-width: 0; font-size: 10px; color: #7a7a7f; word-break: break-all;
}
.ck-obs { margin-top: 5px; font-size: 10px; line-height: 1.6; color: #6a6a6f; }
.ck-panel-foot {
  display: flex; flex-direction: column; gap: 9px; padding: 11px 13px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}
.ck-check {
  display: flex; align-items: center; gap: 7px;
  cursor: pointer; user-select: none;
  font-size: 11px; color: #8a8a8f;
  transition: color 0.15s ease;
}
.ck-check:hover { color: #c4c4c8; }
.ck-check input {
  appearance: none; -webkit-appearance: none; margin: 0;
  width: 14px; height: 14px; flex: none;
  background: #161617; border: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer; display: grid; place-content: center;
  transition: background 0.15s ease, border-color 0.15s ease;
}
.ck-check input:checked { background: #f4f4f5; border-color: #f4f4f5; }
.ck-check input:checked::after {
  content: ""; width: 3.5px; height: 7px;
  border: solid #0b0b0c; border-width: 0 1.6px 1.6px 0;
  transform: translateY(-1px) rotate(45deg);
}
.ck-btn {
  width: 100%; background: #f4f4f5; color: #0b0b0c; border: 0;
  padding: 9px 10px; font: 600 12px/1 inherit; cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 6px;
  transition: background 0.15s ease, transform 0.08s ease;
}
.ck-btn:hover { background: #ffffff; }
.ck-btn:active { transform: scale(0.97); }
.ck-btn-copied { background: #4ade80; color: #052e12; }
.ck-btn-copied:hover { background: #4ade80; }
.ck-btn:disabled { opacity: 0.35; cursor: not-allowed; }
.ck-btn:disabled:hover { background: #f4f4f5; }
.ck-icon-btn {
  background: transparent; border: 0; color: #7a7a7f; cursor: pointer;
  padding: 2px; font-size: 13px; line-height: 1;
  display: flex; align-items: center; justify-content: center;
  transition: color 0.15s ease, transform 0.08s ease;
}
.ck-icon-btn:hover { color: #f4f4f5; }
.ck-icon-btn:active { transform: scale(0.9); }
.ck-del:hover { color: #f87171; }
.ck-trash { width: 13px; height: 13px; display: block; }

/* — crit-mode highlight (tracks the hovered element) — */
.ck-highlight {
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  border: 2px solid #f5f5f5;
  box-shadow: 0 0 0 1.5px rgba(0, 0, 0, 0.5);
}

/* — the always-present launcher: toggles crit mode (docked at 6 o'clock) — */
.ck-launcher-slot {
  position: fixed;
  left: 50%;
  bottom: 16px;
  transform: translateX(-50%);
  pointer-events: none;
}
.ck-launcher {
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: 7px;
  background: #0b0b0c;
  color: #d4d4d8;
  border: 1px solid rgba(255, 255, 255, 0.14);
  padding: 9px 13px;
  cursor: pointer;
  font: 600 11px/1 ui-monospace, SFMono-Regular, Menlo, monospace;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  box-shadow: 0 8px 28px -10px rgba(0, 0, 0, 0.8);
  transition: border-color 0.15s ease, color 0.15s ease,
    background 0.15s ease, transform 0.08s ease;
}
.ck-launcher:hover { border-color: rgba(255, 255, 255, 0.32); color: #f4f4f5; }
.ck-launcher:active { transform: scale(0.97); }
.ck-launcher-dot {
  width: 7px;
  height: 7px;
  flex: none;
  background: #5a5a5f;
  transition: background 0.15s ease, box-shadow 0.15s ease;
}
.ck-launcher-on {
  background: #f4f4f5;
  color: #0b0b0c;
  border-color: #f4f4f5;
}
/* The base :hover brightens text toward white — correct on the dark pill, but
   invisible once -on flips the background white. Override to stay dark-on-white
   (matching .ck-btn:hover). Must follow .ck-launcher:hover to win on order. */
.ck-launcher-on:hover {
  background: #ffffff;
  color: #0b0b0c;
  border-color: #ffffff;
}
.ck-launcher-on .ck-launcher-dot {
  background: #ef4444;
  box-shadow: 0 0 8px rgba(239, 68, 68, 0.85);
}
`
