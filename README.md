# Nexoria Consulting – Multi-Page Career Copilot Demo

Statischer Frontend-Demo mit drei Seiten und konsistentem Corporate-Look:

1. **Landing Page** (`index.html`)
2. **Karriere (Bot 1 – iFrame)** (`career-bot1.html`)
3. **Karriere (Bot 2 – M365 Agents SDK Placeholder)** (`career-bot2.html`)

## Seitenstruktur

```text
career-copilot-webapp/
├── career-bot1.html
├── career-bot2.html
├── index.html
├── src/
│   ├── js/
│   │   ├── bot1-iframe.js
│   │   ├── bot2-chat.js
│   │   ├── chat-service.js
│   │   ├── common.js
│   │   └── config.js
│   └── styles/
│       └── main.css
└── README.md
```

## Bot 1 vs Bot 2

### Bot 1 (iFrame-only panel)

- Seite: `career-bot1.html`
- Verwendet ein rundes FAB unten rechts mit gemeinsamem Toggle-Verhalten.
- Beim Öffnen zeigt das Panel nur den iFrame (ohne zusätzliche sichtbare Wrapper-Header/UI).
- Der iFrame wird nach dem Seitenaufbau im Hintergrund vorgewärmt (idle warmup), beim Schließen nicht zerstört und beim erneuten Öffnen direkt weiterverwendet.
- Die Bot1-Seite setzt zusätzlich `preconnect`/`dns-prefetch` auf die Copilot-Domain für schnelleren Verbindungsaufbau.
- Konfiguration über `src/js/config.js > copilotEmbed.iframeUrl`.

### Bot 2 (Custom Chat-UI, SDK/API-ready)

- Seite: `career-bot2.html`
- Nutzt dasselbe FAB-Muster wie Bot 1 (unten rechts, gleiches Verhalten).
- Beim Öffnen zeigt das Panel eine eigene kompakte Chat-UI (Header, Messages, Input + Send).
- Aktuell **Mock-Modus** über `chat-service.js`, vorbereitet für späteren Python Bot Framework SDK API-Call.
- Konfigurierbar über `src/js/config.js > bot2.useApi` und `bot2.apiUrl` (Default: `/api/bot2/chat`).

## Lokal starten

```bash
cd /home/azureuser/.openclaw/workspace/career-copilot-webapp
python -m http.server 8080
```

Dann im Browser öffnen:

- <http://localhost:8080/index.html>
- <http://localhost:8080/career-bot1.html>
- <http://localhost:8080/career-bot2.html>

## Hinweise zur Konfiguration

In `src/js/config.js`:

```js
window.CAREER_COPILOT_CONFIG = {
  copilotEmbed: {
    iframeUrl: "", // URL oder vollständiges iframe-Snippet
    title: "Copilot Studio Web Channel"
  }
};
```

Ohne gültige URL zeigt Bot 1 eine sichere Fallback-Meldung an.