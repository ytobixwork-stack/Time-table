(() => {
  "use strict";

  /* ---------------- Storage helpers ---------------- */
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

  /* ---------------- Date helpers ---------------- */
  const pad = (n) => String(n).padStart(2, "0");
  const isoDate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const displayDate = (isoStr) => {
    const [y, m, d] = isoStr.split("-");
    return `${d}.${m}.${y.slice(2)}`;
  };
  const longDate = (d) => {
    const days = ["Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag"];
    return `${days[d.getDay()]}, ${displayDate(isoDate(d))}`;
  };
  const timeStr = (d) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;

  const greetingForHour = (h) => {
    if (h < 5) return "Guten Abend";
    if (h < 11) return "Guten Morgen";
    if (h < 17) return "Guten Tag";
    if (h < 22) return "Guten Abend";
    return "Gute Nacht";
  };

  /* ---------------- Navigation ---------------- */
  const screens = document.querySelectorAll(".screen");
  const tabs = document.querySelectorAll(".tab");

  function showScreen(name) {
    screens.forEach(s => s.classList.toggle("is-active", s.dataset.screen === name));
    tabs.forEach(t => t.classList.toggle("is-active", t.dataset.target === name));
    if (name === "home") renderHome();
    if (name === "notes") renderNotesList();
    if (name === "times") renderTimesList();
  }

  tabs.forEach(tab => tab.addEventListener("click", () => showScreen(tab.dataset.target)));
  document.querySelectorAll("[data-back]").forEach(btn => {
    btn.addEventListener("click", () => showScreen(btn.dataset.back));
  });

  /* ---------------- HOME ---------------- */
  const greetingEl = document.getElementById("greeting");
  const dateEl = document.getElementById("today-date");
  const statusCard = document.querySelector(".status-card");
  const statusValueEl = document.getElementById("status-value");
  const btnIn = document.getElementById("btn-clockin");
  const btnOut = document.getElementById("btn-clockout");
  const summaryEl = document.getElementById("today-summary");

  function currentStatus() {
    const entries = loadEntries();
    if (entries.length === 0) return "out";
    return entries[entries.length - 1].type; // 'in' means currently clocked in
  }

  function renderHome() {
    const now = new Date();
    greetingEl.textContent = greetingForHour(now.getHours());
    dateEl.textContent = longDate(now);

    const status = currentStatus();
    const isIn = status === "in";
    statusValueEl.textContent = isIn ? "Eingestempelt" : "Nicht eingestempelt";
    statusCard.classList.toggle("is-active", isIn);
    btnIn.disabled = isIn;
    btnOut.disabled = !isIn;

    const today = isoDate(now);
    const todaysEntries = loadEntries().filter(e => e.date === today);
    if (todaysEntries.length === 0) {
      summaryEl.innerHTML = `<p class="summary-label">Heute</p><p class="summary-empty">Noch keine Einträge</p>`;
    } else {
      const rows = todaysEntries.map(e => `
        <div class="summary-entry ${e.type}">
          <span class="dot"></span>
          <div>
            <p class="entry-time" style="margin:0;">${e.type === "in" ? "Eingestempelt" : "Ausgestempelt"}: ${e.time}</p>
            <p class="reason" style="margin:0;">${escapeHtml(e.reason)}</p>
          </div>
        </div>`).join("");
      summaryEl.innerHTML = `<p class="summary-label">Heute</p>${rows}`;
    }
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  /* ---------------- Bottom sheet (reason) ---------------- */
  const sheet = document.getElementById("reason-sheet");
  const sheetBackdrop = document.getElementById("sheet-backdrop");
  const sheetTitle = document.getElementById("sheet-title");
  const reasonInput = document.getElementById("reason-input");
  const sheetError = document.getElementById("sheet-error");
  const sheetConfirm = document.getElementById("sheet-confirm");

  let pendingType = null;

  function openSheet(type) {
    pendingType = type;
    const now = new Date();
    sheetTitle.textContent = `${type === "in" ? "Einstempeln" : "Ausstempeln"} um ${timeStr(now)}`;
    reasonInput.value = "";
    sheetError.classList.remove("is-visible");
    sheet.classList.add("is-open");
    sheetBackdrop.classList.add("is-open");
    setTimeout(() => reasonInput.focus(), 250);
  }

  function closeSheet() {
    sheet.classList.remove("is-open");
    sheetBackdrop.classList.remove("is-open");
    pendingType = null;
  }

  btnIn.addEventListener("click", () => openSheet("in"));
  btnOut.addEventListener("click", () => openSheet("out"));
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
      type: pendingType,
      time: timeStr(now),
      reason
    });
    saveEntries(entries);
    closeSheet();
    renderHome();
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
    if (text) {
      notes[today] = text;
    } else {
      delete notes[today];
    }
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
    const day = (d.getDay() + 6) % 7; // Monday = 0
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
    const sorted = [...dayEntries].sort((a, b) => a.time.localeCompare(b.time));
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
      const mins = dayTotalMinutes(dayEntries);
      const rows = dayEntries.map(e => `
        <div class="entry-row ${e.type}">
          ${e.type === "in"
            ? '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>'
            : '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>'}
          <div>
            <p class="entry-time">${e.type === "in" ? "Eingestempelt" : "Ausgestempelt"}: ${e.time}</p>
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
  // Notes and status are derived live from stored data + today's date,
  // so no explicit migration is needed at midnight — the next render
  // after 0:00 automatically shows "Neue Notiz" and moves yesterday's
  // note into the history list.
  function scheduleMidnightRefresh() {
    const now = new Date();
    const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 5);
    setTimeout(() => {
      renderHome();
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
