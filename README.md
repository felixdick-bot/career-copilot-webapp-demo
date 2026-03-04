# Career Copilot Webapp Demo (Neuaufbau)

Kompletter Neustart als **responsive, mobile-first Karriere-Webseite** mit Chatbot-Launcher unten rechts und vorbereiteten Integrationspfaden für Microsoft Copilot.

## Features

- Moderne Karriere-Landingpage (Vanilla HTML/CSS/JS)
- Chat-Widget mit:
  - Floating Action Button (FAB) unten rechts
  - auf-/zuklappbarem Panel
  - Header, Message-Area, Input
  - Accessibility-Basics (ARIA, ESC schließen, Fokus-Rückgabe)
- Integrationsmodi im UI:
  1. **Mock / Local** (ohne Backend)
  2. **Copilot Embed (iFrame)**
  3. **Agents SDK (Placeholder)**
- Strukturell vorbereitet für späteres Python-Backend

## Lokal starten

```bash
cd /home/azureuser/.openclaw/workspace/career-copilot-webapp
python -m http.server 8080
```

Dann öffnen: <http://localhost:8080>

## Projektstruktur

```text
career-copilot-webapp/
├── docs/
│   ├── PLAN.md
│   └── WORKPACKAGES.md
├── src/
│   ├── js/
│   │   ├── app.js
│   │   ├── chat-service.js
│   │   └── config.js
│   └── styles/
│       └── main.css
├── index.html
└── README.md
```

## Integrationspfad A: Copilot Embed (iFrame)

Referenz:
- https://learn.microsoft.com/en-us/microsoft-copilot-studio/publication-connect-bot-to-web-channels

### Schritte

1. Bot in Copilot Studio veröffentlichen.
2. Web Channel / Embed-Link erzeugen.
3. In `src/js/config.js` setzen:

```js
copilotEmbed: {
  iframeUrl: "https://...",
  title: "Copilot Studio Web Channel"
}
```

4. Im Chat-Widget Modus **Copilot Embed (iFrame)** wählen.

> Hinweis: In produktiven Szenarien Token/Secrets nicht im Frontend halten; stattdessen über sicheren Backend-Flow liefern.

## Integrationspfad B: Microsoft 365 Agents SDK

Referenz:
- https://learn.microsoft.com/en-us/microsoft-copilot-studio/publication-integrate-web-or-native-app-m365-agents-sdk

Der Modus ist UI-seitig vorbereitet (`Agents SDK Placeholder`), aber bewusst noch ohne echte SDK-Ausführung im Browser.

### Warum Placeholder?

Für saubere Security und Betriebsfähigkeit sollten **Connection String, Token und ggf. On-Behalf-Of/Auth-Flow** über ein Backend laufen (z. B. Python FastAPI).

### Konfigurationshaken

In `src/js/config.js`:

```js
agentsSdk: {
  connectionString: "",
  endpoint: "",
  useAuthenticatedFlow: true
}
```

### Auth vs. No-auth (Kurzüberblick)

- **Authenticated empfohlen:**
  - Benutzeridentität vorhanden
  - Rollen-/Tenant-spezifische Antworten
  - besser für Enterprise-Szenarien
- **No-auth nur für einfache öffentliche Szenarien** (mit stark eingeschränktem Risiko- und Datenmodell)

## Python-Backend anschließen (geplanter Pfad)

Ziel: `chat-service.js` soll statt Mock-Logik auf `/api/chat` gehen.

Vorschlag:

- Backend (z. B. FastAPI):
  - `POST /api/chat` (Message + Session)
  - `POST /api/copilot/token` (kurzlebige Embed-Tokens)
  - `POST /api/agents/session` (Agents SDK/Connection-String serverseitig kapseln)
- Frontend: `config.api.baseUrl` setzen und Service-Layer auf Fetch umstellen.

## Status

- ✅ Neuaufbau von Null umgesetzt
- ✅ Laufbar als statische Seite
- ✅ Integrationsmodi vorbereitet
- ✅ Dokumentation für beide Microsoft-Pfade enthalten
