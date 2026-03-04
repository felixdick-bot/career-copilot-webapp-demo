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

### Bot 1 (iFrame)

- Seite: `career-bot1.html`
- Verwendet das bestehende **FAB + Panel** Verhalten.
- Der Chat-Inhalt wird ausschließlich per iFrame gerendert.
- Konfiguration über `src/js/config.js > copilotEmbed.iframeUrl`.

### Bot 2 (M365 Agents SDK Placeholder)

- Seite: `career-bot2.html`
- Eigene lokale Chat-UI (Header, Nachrichtenbereich, Input, Senden).
- Aktuell **Mock-Modus** über `chat-service.js`.
- Sichtbarer Hinweis: **„SDK Integration folgt im nächsten Schritt“ / „M365 Agents SDK (coming next)“.**

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