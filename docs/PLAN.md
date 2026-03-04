# Projektplan – Career Copilot Webapp (Neustart)

## Zielbild
Eine moderne, mobile-first Karriere-Webseite mit integriertem Chatbot-Launcher (unten rechts), die lokal ohne Backend lauffähig ist und zwei spätere Integrationswege vorbereitet:

1. **Copilot Studio Embed (iFrame/Web Channel)**
2. **Microsoft 365 Agents SDK (Connection String-basiert)**

## Architekturprinzipien
- **Vanilla Stack**: HTML + CSS + JS (kein schweres Framework)
- **Saubere Trennung**: `src/styles`, `src/js`, `docs`
- **Konfigurierbarkeit**: Integrationsmodus über zentrale Config
- **Backend-ready**: Chat-Service-Schicht so aufgesetzt, dass später Python-API leicht angebunden werden kann
- **Accessibility first**: ARIA-Labels, Keyboard-Steuerung, ESC-Schließen, Fokus-Handling

## Umsetzungsphasen

### Phase 1 – Planung & Arbeitspakete
- PLAN und Arbeitspaketliste erstellen
- Scope und Deliverables fixieren

### Phase 2 – Frontend-Neubau
- Neue responsive Landingpage erstellen
- Hero, Value-Proposition, Feature-Bereiche, CTA
- Mobile-first Layout und moderne UI

### Phase 3 – Chat-Widget
- FAB/Launcher unten rechts
- Ein-/Ausklappbares Chatpanel mit Header, Nachrichtenbereich, Input
- Keyboard- und Fokus-Handling
- Mock/Local Chatflow

### Phase 4 – Integrationspfade vorbereiten
- Modus-Umschaltung im UI:
  - Mock/Local
  - Copilot Embed (iFrame)
  - Agents SDK (Platzhalter)
- Config Hooks und klare Trennung zwischen UI und Integrationslogik
- Dokumentation der Anforderungen (inkl. Auth-/No-auth-Hinweis)

### Phase 5 – Doku, Git, Übergabe
- README komplett neu schreiben
- Run- und Integrationsanleitung
- Commits mit klarer Historie
- Push auf `origin/main`

## Akzeptanzkriterien
- Läuft statisch per `python -m http.server`
- Chat-Launcher unten rechts funktioniert auf Mobile/Desktop
- ESC schließt Panel, Fokus wird zurückgesetzt
- Integrationsmodi sichtbar und dokumentiert
- Struktur vorbereitet für spätere Python-Backend-Anbindung
