(() => {
  "use strict";

  const STORE_ENTRIES = "zn_entries";
  const STORE_NOTES = "zn_notes";

  const loadEntries = () => {
    try { return JSON.parse(localStorage.getItem(STORE_ENTRIES)) || []; }
    catch { return []; }
  };
  const saveEntries = (entries) => localStorage.setItem(STORE_ENTRIES, JSON.stringify(entries));

  const loadNotes = () => {
    try { return JSON.parse(localStorage.getItem(STORE_NOTES)) || {}; }
    catch { return {}; }
  };
  const saveNotes = (notes) => localStorage.setItem(STORE_NOTES, JSON.stringify(notes));

  const pad = (n) => String(n).padStart(2, "0");
  const isoDate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const displayDate = (isoStr) => {
    const [y, m, d] = isoStr.split("-");
    return `${d}.${m}.${y.slice(2)}`;
  };
  const timeStr = (d) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  /* ---------------- Navigation ---------------- */
  const screens = document.querySelectorAll(".screen");

  function showScreen(name) {
    screens.forEach(s => s.classList.toggle("is-active", s.dataset.screen === name));
    if (name === "work") renderWork();
    if (name === "fahrten") renderFahrten();
    if (name === "notes") renderNotesList();
    if (name === "times") renderTimesList();
  }

  document.querySelectorAll("[data-target]").forEach(btn => {
    btn.addEventListener("click", () => showScreen(btn.dataset.target));
  });
  document.querySelectorAll("[data-back]").forEach(btn => {
    btn.addEventListener("click", () => showScreen(btn.dataset.back));
  });
  document.getElementById("home-fab").addEventListener("click", () => showScreen("home"));

  /* ---------------- Shared: status per category ---------------- */
  function currentStatus(category) {
    const entries = loadEntries().filter(e => e.category === category && e.type !== "marker");
    if (entries.length === 0) return "out";
    return entries[entries.length - 1].type;
  }

  function renderSummary(container, category) {
    const today = isoDate(new Date());
    const todaysEntries = loadEntries().filter(e => e.category === category && e.date === today);
    if (todaysEntries.length === 0) {
      container.innerHTML = `<p class="summary-label">Heute</p><p class="summary-empty">Noch keine Einträge</p>`;
      return;
    }
    const label = { in: "Eingestempelt", out: "Ausgestempelt", marker: "Marker" };
    const rows = todaysEntries.map(e => `
      <div class="summary-entry ${e.type}">
        <span class="dot"></span>
        <div>
          <p class="entry-time" style="margin:0;">${label[e.type]}: ${e.time}</p>
          <p class="reason" style="margin:0;">${escapeHtml(e.reason)}</p>
        </div>
      </div>`).join("");
    container.innerHTML = `<p class="summary-label">Heute</p>${rows}`;
  }

  /* ---------------- ZEITERFASSUNG (work) ---------------- */
  const workStatusCard = document.getElementById("work-status-card");
  const workStatusValue = document.getElementById("work-status-value");
  const btnWorkIn = document.getElementById("btn-work-in");
  const btnWorkOut = document.getElementById("btn-work-out");
  const btnWorkMarker = document.getElementById("btn-work-marker");
  const workSummary = document.getElementById("work-summary");

  function renderWork() {
    const status = currentStatus("work");
    const isIn = status === "in";
    workStatusValue.textContent = isIn ? "Eingestempelt" : "Nicht eingestempelt";
    workStatusCard.classList.toggle("is-active", isIn);
    btnWorkIn.disabled = isIn;
    btnWorkOut.disabled = !isIn;
    renderSummary(workSummary, "work");
  }

  btnWorkIn.addEventListener("click", () => openSheet("work", "in"));
  btnWorkOut.addEventListener("click", () => openSheet("work", "out"));
  btnWorkMarker.addEventListener("click", () => openSheet("work", "marker"));

  /* ---------------- FAHRTEN ---------------- */
  const fahrtStatusCard = document.getElementById("fahrt-status-card");
  const fahrtStatusValue = document.getElementById("fahrt-status-value");
  const btnFahrtIn = document.getElementById("btn-fahrt-in");
  const btnFahrtOut = document.getElementById("btn-fahrt-out");
  const fahrtSummary = document.getElementById("fahrt-summary");

  function renderFahrten() {
    const status = currentStatus("fahrt");
    const isIn = status === "in";
    fahrtStatusValue.textContent = isIn ? "Eingestempelt" : "Nicht eingestempelt";
    fahrtStatusCard.classList.toggle("is-active", isIn);
    btnFahrtIn.disabled = isIn;
    btnFahrtOut.disabled = !isIn;
    renderSummary(fahrtSummary, "fahrt");
  }

  btnFahrtIn.addEventListener("click", () => openSheet("fahrt", "in"));
  btnFahrtOut.addEventListener("click", () => openSheet("fahrt", "out"));

  /* ---------------- Bottom sheet (shared reason input) ---------------- */
  const sheet = document.getElementById("reason-sheet");
  const sheetBackdrop = document.getElementById("sheet-backdrop");
  const sheetTitle = document.getElementById("sheet-title");
  const reasonInput = document.getElementById("reason-input");
  const sheetError = document.getElementById("sheet-error");
  const sheetConfirm = document.getElementById("sheet-confirm");

  let pendingCategory = null;
  let pendingType = null;

  const sheetTitleLabel = { in: "Einstempeln", out: "Ausstempeln", marker: "Marker setzen" };

  function openSheet(category, type) {
    pendingCategory = category;
    pendingType = type;
    const now = new Date();
    sheetTitle.textContent = `${sheetTitleLabel[type]} um ${timeStr(now)}`;
    reasonInput.value = "";
    sheetError.classList.remove("is-visible");
    sheet.classList.add("is-open");
    sheetBackdrop.classList.add("is-open");
    setTimeout(() => reasonInput.focus(), 250);
  }

  function closeSheet() {
    sheet.classList.remove("is-open");
    sheetBackdrop.classList.remove("is-open");
    pendingCategory = null;
    pendingType = null;
  }

  sheetBackdrop.addEventListener("click", closeSheet);

  sheetConfirm.addEventListener("click", () => {
    const reason = reasonInput.value.trim();
    if (!reason) {
      sheetError.classList.add("is-visible");
      reasonInput.focus();
      return;
    }
    const now = new Date();
    const entries = loadEntries();
    entries.push({
      id: `${Date.now()}`,
      date: isoDate(now),
      category: pendingCategory,
      type: pendingType,
      time: timeStr(now),
      reason
    });
    saveEntries(entries);
    const category = pendingCategory;
    closeSheet();
    if (category === "work") renderWork();
    if (category === "fahrt") renderFahrten();
  });

  /* ---------------- NOTES ---------------- */
  const noteBtnLabel = document.getElementById("note-btn-label");
  const btnNoteOpen = document.getElementById("btn-note-open");
  const btnHistoryOpen = document.getElementById("btn-history-open");
  const notesHistoryList = document.getElementById("notes-history-list");
  const noteTextarea = document.getElementById("note-textarea");
  const noteEditorTitle = document.getElementById("note-editor-title");
  const btnNoteSave = document.getElementById("btn-note-save");
  const noteViewTitle = document.getElementById("note-view-title");
  const noteViewContent = document.getElementById("note-view-content");

  function renderNotesList() {
    const notes = loadNotes();
    const today = isoDate(new Date());
    const hasToday = !!notes[today];
    noteBtnLabel.textContent = hasToday ? "Aktuelle Notiz" : "Neue Notiz";

    const pastDates = Object.keys(notes).filter(d => d !== today).sort().reverse();
    if (pastDates.length === 0) {
      notesHistoryList.innerHTML = `<p class="list-empty">Noch keine vergangenen Notizen</p>`;
    } else {
      notesHistoryList.innerHTML = pastDates.map(d => `
        <div class="list-row" data-date="${d}" data-role="history-row">
          <span class="row-date">${displayDate(d)}</span>
          <svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg>
        </div>`).join("");
      notesHistoryList.querySelectorAll('[data-role="history-row"]').forEach(row => {
        row.addEventListener("click", () => openNoteView(row.dataset.date));
      });
    }
  }

  btnNoteOpen.addEventListener("click", () => {
    const notes = loadNotes();
    const today = isoDate(new Date());
    noteEditorTitle.textContent = notes[today] ? "Aktuelle Notiz" : "Neue Notiz";
    noteTextarea.value = notes[today] || "";
    showScreen("note-editor");
  });

  btnHistoryOpen.addEventListener("click", () => {
    document.getElementById("notes-history-list").scrollIntoView({ behavior: "smooth" });
  });

  btnNoteSave.addEventListener("click", () => {
    const notes = loadNotes();
    const today = isoDate(new Date());
    const text = noteTextarea.value.trim();
    if (text) notes[today] = text; else delete notes[today];
    saveNotes(notes);
    showScreen("notes");
  });

  function openNoteView(dateStr) {
    const notes = loadNotes();
    noteViewTitle.textContent = displayDate(dateStr);
    noteViewContent.textContent = notes[dateStr] || "";
    showScreen("note-view");
  }

  /* ---------------- TIME STAMPS ---------------- */
  const filterSelect = document.getElementById("filter-range");
  const timesList = document.getElementById("times-list");

  function startOfWeek(d) {
    const day = (d.getDay() + 6) % 7;
    const res = new Date(d);
    res.setDate(d.getDate() - day);
    res.setHours(0, 0, 0, 0);
    return res;
  }

  function groupByDay(entries) {
    const groups = {};
    entries.forEach(e => {
      if (!groups[e.date]) groups[e.date] = [];
      groups[e.date].push(e);
    });
    return groups;
  }

  function fmtDuration(mins) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${pad(m)}m`;
  }

  function dayTotalMinutes(dayEntries) {
    const sorted = [...dayEntries].filter(e => e.type !== "marker").sort((a, b) => a.time.localeCompare(b.time));
    let total = 0, lastIn = null;
    sorted.forEach(e => {
      if (e.type === "in") lastIn = e.time;
      else if (e.type === "out" && lastIn) {
        const [h1, m1] = lastIn.split(":").map(Number);
        const [h2, m2] = e.time.split(":").map(Number);
        total += (h2 * 60 + m2) - (h1 * 60 + m1);
        lastIn = null;
      }
    });
    return total;
  }

  const iconFor = (category, type) => {
    if (category === "fahrt") {
      return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 17h14M6 17l1.5-6h9L18 17M8 11l1-4h6l1 4"/><circle cx="8" cy="17" r="1.5"/><circle cx="16" cy="17" r="1.5"/></svg>';
    }
    if (type === "marker") {
      return '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 3v18l6-4 6 4V3z"/></svg>';
    }
    if (type === "in") return '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
    return '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>';
  };

  const labelFor = (category, type) => {
    if (type === "marker") return "Marker";
    const base = type === "in" ? "Eingestempelt" : "Ausgestempelt";
    return category === "fahrt" ? `${base} (Fahrt)` : base;
  };

  function renderTimesList() {
    const range = filterSelect.value;
    const now = new Date();
    let entries = loadEntries();

    if (range === "week") {
      const from = isoDate(startOfWeek(now));
      entries = entries.filter(e => e.date >= from);
    } else if (range === "month") {
      const from = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-01`;
      entries = entries.filter(e => e.date >= from);
    }

    const groups = groupByDay(entries);
    const dates = Object.keys(groups).sort().reverse();

    if (dates.length === 0) {
      timesList.innerHTML = `<p class="list-empty">Noch keine Zeiteinträge</p>`;
      return;
    }

    timesList.innerHTML = dates.map(d => {
      const dayEntries = [...groups[d]].sort((a, b) => a.time.localeCompare(b.time));
      const mins = dayTotalMinutes(dayEntries.filter(e => e.category === "work"));
      const rows = dayEntries.map(e => `
        <div class="entry-row cat-${e.category} type-${e.type}">
          ${iconFor(e.category, e.type)}
          <div>
            <p class="entry-time">${labelFor(e.category, e.type)}: ${e.time}</p>
            <p class="entry-reason">Grund: ${escapeHtml(e.reason)}</p>
          </div>
        </div>`).join("");

      return `
        <div class="day-card" data-date="${d}">
          <div class="day-card-head">
            <span class="row-date">${displayDate(d)}</span>
            <span class="row-meta">${mins > 0 ? fmtDuration(mins) : "\u2013"}</span>
          </div>
          <div class="day-card-detail">${rows}</div>
        </div>`;
    }).join("");

    timesList.querySelectorAll(".day-card").forEach(card => {
      card.addEventListener("click", () => card.classList.toggle("is-open"));
    });
  }

  filterSelect.addEventListener("change", renderTimesList);

  /* ---------------- Midnight rollover ---------------- */
  function scheduleMidnightRefresh() {
    const now = new Date();
    const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 5);
    setTimeout(() => {
      renderNotesList();
      renderTimesList();
      scheduleMidnightRefresh();
    }, next - now);
  }
  scheduleMidnightRefresh();

  /* ---------------- Init ---------------- */
  showScreen("home");

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    });
  }
})();
