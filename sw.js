:root {
  --grad-a: #4B228D;
  --grad-b: #2D3F6E;
  --grad-c: #14CA22;
  --blue: #185FA5;
  --blue-tint: #E6F1FB;
  --red: #A32D2D;
  --red-tint: #FCEBEB;
  --green: #1D9E75;
  --green-tint: #E1F5EE;
  --amber: #854F0B;
  --amber-tint: #FAEEDA;
  --bg: #EDEDF0;
  --surface: #FFFFFF;
  --surface-2: #F3F3F5;
  --border: #E0E0E4;
  --border-strong: #CFCFD4;
  --text-primary: #1C1C1E;
  --text-secondary: #6B6B70;
  --text-muted: #9A9AA0;
  --text-on-grad: #F4F1FB;
  --text-on-grad-muted: rgba(244,241,251,0.78);
  --radius-lg: 20px;
  --radius-md: 12px;
  --safe-top: env(safe-area-inset-top, 0px);
  --safe-bottom: env(safe-area-inset-bottom, 0px);
}

* { box-sizing: border-box; }

html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
  background: var(--bg);
  color: var(--text-primary);
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
  -webkit-tap-highlight-color: transparent;
}

#app {
  position: relative;
  height: 100%;
  max-width: 480px;
  margin: 0 auto;
  background: linear-gradient(135deg, var(--grad-a) 0%, var(--grad-b) 50%, var(--grad-c) 100%);
}

.screen {
  position: absolute;
  inset: 0;
  padding: calc(20px + var(--safe-top)) 18px calc(110px + var(--safe-bottom));
  overflow-y: auto;
  display: none;
  -webkit-overflow-scrolling: touch;
}
.screen.is-active { display: block; }

/* ---------- Home / remote panel ---------- */
#screen-home { padding: 0; display: none; overflow: hidden; }
#screen-home.is-active { display: block; }

.remote {
  width: 100%;
  height: 100%;
  max-width: 480px;
  margin: 0 auto;
  background: linear-gradient(135deg, var(--grad-a) 0%, var(--grad-b) 50%, var(--grad-c) 100%);
  padding: calc(24px + var(--safe-top)) 22px calc(120px + var(--safe-bottom));
  position: relative;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.remote-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; flex-shrink: 0; }
.greeting { font-size: 20px; font-weight: 600; color: var(--text-on-grad); margin: 0 0 2px; text-shadow: 0 1px 4px rgba(0,0,0,0.2); }
.home-date { font-size: 13px; color: var(--text-on-grad-muted); margin: 0; }

.remote-credit {
  font-size: 11px;
  color: #FCE6E6;
  text-align: right;
  line-height: 1.4;
  border: 1px solid rgba(252,230,230,0.6);
  border-radius: 8px;
  padding: 6px 10px;
  flex-shrink: 0;
}

.remote-grid {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 16px;
}

.remote-btn {
  border: none;
  border-radius: 20px;
  background: rgba(255,255,255,0.14);
  border: 1px solid rgba(255,255,255,0.35);
  color: #F4F1FB;
  font-size: 16px;
  font-weight: 500;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
}
.remote-btn svg { width: 34px; height: 34px; }
.remote-btn:active { transform: scale(0.96); background: rgba(255,255,255,0.22); }

/* ---------- Topbar ---------- */
.topbar { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 18px; }
.topbar--simple { align-items: center; }
.page-title { font-size: 22px; font-weight: 600; margin: 0; flex: 1; color: var(--text-on-grad); text-shadow: 0 1px 4px rgba(0,0,0,0.2); }
.spacer { width: 24px; }

.back-btn {
  width: 32px; height: 32px;
  border: none; background: var(--surface);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  color: var(--text-primary);
  box-shadow: 0 1px 2px rgba(0,0,0,0.06);
}
.back-btn svg { width: 18px; height: 18px; }

/* ---------- Status card ---------- */
.status-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 14px 16px;
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 18px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
}
.status-label { font-size: 12px; color: var(--text-muted); margin: 0; }
.status-value { font-size: 16px; font-weight: 600; margin: 3px 0 0; }
.status-card .icon { width: 24px; height: 24px; color: var(--text-secondary); }
.status-card.is-active .status-value { color: var(--blue); }

/* ---------- Big buttons ---------- */
.big-btn {
  width: 100%;
  height: 96px;
  border: none;
  border-radius: var(--radius-lg);
  font-size: 18px;
  font-weight: 600;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 6px;
  margin-bottom: 14px;
  transition: transform .08s ease, opacity .15s ease;
}
.big-btn:active { transform: scale(0.97); }
.big-btn svg { width: 26px; height: 26px; }
.big-btn--blue { background: var(--blue); color: var(--blue-tint); }
.big-btn--red { background: var(--red); color: var(--red-tint); }
.big-btn:disabled {
  background: var(--surface-2);
  color: var(--text-muted);
  border: 1px solid var(--border);
  opacity: 1;
}
.big-btn:disabled svg { opacity: 0.5; }

/* ---------- Today summary ---------- */
.today-summary { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 12px 16px; margin-top: 4px; }
.summary-label { font-size: 12px; color: var(--text-muted); margin: 0 0 6px; }
.summary-empty { font-size: 13px; color: var(--text-secondary); margin: 0; }
.summary-entry { display: flex; gap: 8px; align-items: flex-start; font-size: 13px; padding: 4px 0; }
.summary-entry .dot { width: 8px; height: 8px; border-radius: 50%; margin-top: 4px; flex-shrink: 0; }
.summary-entry.in .dot { background: var(--blue); }
.summary-entry.out .dot { background: var(--red); }
.summary-entry.marker .dot { background: var(--amber); }
.summary-entry .reason { color: var(--text-muted); font-size: 12px; }

/* ---------- Pill buttons ---------- */
.pill-btn {
  width: 100%; height: 50px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text-primary);
  font-size: 15px;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  margin-bottom: 12px;
}
.pill-btn svg { width: 18px; height: 18px; }
.pill-btn--filled { background: var(--blue-tint); border-color: transparent; color: var(--blue); font-weight: 600; }
.pill-btn--amber { background: var(--amber-tint); border-color: transparent; color: var(--amber); font-weight: 600; }
.pill-btn:active { transform: scale(0.98); }

.section-label { font-size: 12px; color: var(--text-on-grad-muted); margin: 20px 0 8px; }

.list { display: flex; flex-direction: column; gap: 8px; }
.list-empty { font-size: 13px; color: var(--text-on-grad-muted); margin: 8px 0; }

.list-row { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 12px 14px; display: flex; justify-content: space-between; align-items: center; }
.list-row .row-date { font-size: 14px; font-weight: 500; }
.list-row .chev { width: 16px; height: 16px; color: var(--text-muted); }

/* ---------- Note editor ---------- */
.note-textarea {
  width: 100%; min-height: 50vh;
  border: 1px solid var(--border); border-radius: var(--radius-md);
  background: var(--surface); padding: 14px; font-size: 15px;
  font-family: inherit; resize: none; margin-bottom: 14px; color: var(--text-primary);
}
.note-textarea:focus { outline: none; border-color: var(--blue); }
.note-readonly { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 16px; font-size: 15px; line-height: 1.5; white-space: pre-wrap; min-height: 200px; }

/* ---------- Time stamps ---------- */
.filter-select {
  width: 100%; height: 44px; border-radius: var(--radius-md);
  border: 1px solid var(--border); background: var(--surface);
  padding: 0 12px; font-size: 14px; margin-bottom: 12px; color: var(--text-primary);
  -webkit-appearance: none;
}

.legend { display: flex; gap: 14px; margin-bottom: 16px; flex-wrap: wrap; }
.legend-item { font-size: 11.5px; color: var(--text-on-grad-muted); display: flex; align-items: center; gap: 5px; }
.legend .dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; box-shadow: 0 0 0 1.5px rgba(255,255,255,0.7); }
.dot-blue { background: var(--blue); }
.dot-green { background: var(--green); }
.dot-amber { background: var(--amber); }

.day-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 12px 14px; cursor: pointer; }
.day-card-head { display: flex; justify-content: space-between; align-items: center; }
.day-card-head .row-date { font-size: 14px; font-weight: 500; }
.day-card-head .row-meta { font-size: 12px; color: var(--text-secondary); }
.day-card-detail { border-top: 1px solid var(--border); margin-top: 10px; padding-top: 10px; display: none; flex-direction: column; gap: 8px; }
.day-card.is-open .day-card-detail { display: flex; }
.day-card.is-open { border-color: var(--border-strong); }

.entry-row { display: flex; gap: 8px; align-items: flex-start; }
.entry-row svg { width: 15px; height: 15px; margin-top: 2px; flex-shrink: 0; }
.entry-row.cat-work.type-in svg, .entry-row.cat-work.type-out svg { color: var(--blue); }
.entry-row.cat-fahrt svg { color: var(--green); }
.entry-row.cat-work.type-marker svg { color: var(--amber); }
.entry-row .entry-time { font-size: 12.5px; margin: 0; }
.entry-row .entry-reason { font-size: 11.5px; color: var(--text-muted); margin: 1px 0 0; }

/* ---------- Bottom sheet ---------- */
.sheet-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.35); opacity: 0; pointer-events: none; transition: opacity .2s ease; z-index: 40; }
.sheet-backdrop.is-open { opacity: 1; pointer-events: auto; }
.sheet {
  position: fixed; left: 50%; bottom: 0; transform: translate(-50%, 100%);
  width: 100%; max-width: 480px; background: var(--surface);
  border-radius: 20px 20px 0 0; padding: 14px 18px calc(20px + var(--safe-bottom));
  transition: transform .25s cubic-bezier(.32,.72,0,1); z-index: 50;
  box-shadow: 0 -4px 24px rgba(0,0,0,0.12);
}
.sheet.is-open { transform: translate(-50%, 0); }
.sheet-handle { width: 36px; height: 4px; background: var(--border-strong); border-radius: 4px; margin: 0 auto 14px; }
.sheet-title { font-size: 15px; font-weight: 600; margin: 0 0 10px; }
.sheet-label { font-size: 12px; color: var(--text-secondary); margin: 0 0 6px; }
.sheet-textarea { width: 100%; height: 80px; border: 1px solid var(--border); border-radius: var(--radius-md); padding: 10px 12px; font-size: 14px; font-family: inherit; resize: none; margin-bottom: 6px; color: var(--text-primary); }
.sheet-textarea:focus { outline: none; border-color: var(--blue); }
.sheet-error { font-size: 12px; color: var(--red); margin: 0 0 10px; display: none; }
.sheet-error.is-visible { display: block; }

/* ---------- Persistent home button ---------- */
.home-fab {
  position: absolute;
  left: 50%;
  bottom: calc(20px + var(--safe-bottom));
  transform: translateX(-50%);
  width: 56px; height: 56px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, var(--grad-a) 0%, var(--grad-c) 100%);
  color: #FFFFFF;
  border: 2px solid rgba(255,255,255,0.85);
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 3px 10px rgba(0,0,0,0.3);
  z-index: 30;
}
.home-fab svg { width: 24px; height: 24px; }
.home-fab:active { transform: translateX(-50%) scale(0.94); }
