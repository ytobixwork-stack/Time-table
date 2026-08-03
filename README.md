# Zeit & Notizen

Eine kleine Progressive Web App fürs iPhone, die Arbeitszeiterfassung und tägliche Notizen kombiniert. Alle Daten bleiben lokal auf dem Gerät – kein Server, kein Account.

## Funktionen

- **Ein-/Ausstempeln** mit Pflichtfeld für den Grund (z. B. "Anfahrt zur Arbeit")
- **Notizen**: eine Notiz pro Tag, wandert automatisch um Mitternacht in den Verlauf
- **Zeiterfassung**: Tage aufklappbar, zeigt Ein-/Ausstempelzeiten inkl. Grund und berechnet automatisch die Tagesstunden, filterbar nach Woche/Monat/Alle
- Läuft offline und lässt sich über Safari als App auf den Home-Bildschirm installieren

## Installation auf dem iPhone

1. Diese Seite in **Safari** öffnen (nicht Chrome)
2. Teilen-Symbol → **"Zum Home-Bildschirm"**
3. Fertig – App startet im Vollbildmodus, ohne Browser-UI

## Technik

- Reines HTML/CSS/JavaScript, kein Framework
- Daten werden per `localStorage` gespeichert – bleiben nur auf diesem Gerät
- Service Worker (`sw.js`) für Offline-Nutzung
- `manifest.json` für die Installierbarkeit als PWA

## Projektstruktur
