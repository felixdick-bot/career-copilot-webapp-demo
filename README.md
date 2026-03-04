# Nexoria Consulting – Multi-Page Career Copilot Demo

Statischer Frontend-Demo mit drei Seiten plus optionalem FastAPI-Backend für Bot2-Token-Proxy.

## Projektstruktur

```text
career-copilot-webapp/
├── backend/
│   ├── .env.example
│   ├── main.py
│   └── requirements.txt
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
- Nutzt FAB + Panel mit eingebettetem iFrame.
- Konfiguration über `src/js/config.js > copilotEmbed.iframeUrl`.

### Bot 2 (Custom UI + Web Chat/Direct Line)

- Seite: `career-bot2.html`
- Behält das bestehende FAB-/Panel-Pattern bei.
- Die Nachrichten-Engine läuft über Bot Framework Web Chat (CDN nur auf dieser Seite).
- Beim Öffnen des Panels holt das Frontend ein Token **nur vom eigenen Backend** (`/api/bot2/token`) und rendert dann Web Chat im Panel.
- Kein Upstream-Token-Endpoint und keine Secrets im Frontend.

## Architektur (Bot2)

```text
Browser (career-bot2.html)
  -> POST /api/bot2/token (same-origin)
FastAPI backend (Token-Proxy)
  -> POST BOT2_TOKEN_ENDPOINT (serverseitig)
Token-Response (sanitized)
  -> WebChat.createDirectLine({ token, domain? })
  -> renderWebChat(...) im Bot2-Panel
```

## Lokaler Start

### 1) Frontend

```bash
cd /home/azureuser/.openclaw/workspace/career-copilot-webapp
python -m http.server 8080
```

Öffnen:

- <http://localhost:8080/index.html>
- <http://localhost:8080/career-bot1.html>
- <http://localhost:8080/career-bot2.html>

### 2) Backend (FastAPI)

```bash
cd /home/azureuser/.openclaw/workspace/career-copilot-webapp/backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Danach `.env` anpassen (mindestens `BOT2_TOKEN_ENDPOINT`).

Start:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Healthcheck:

- `GET http://localhost:8000/api/health`

## ENV-Konfiguration (Backend)

- `BOT2_TOKEN_ENDPOINT` (**required**): serverseitiger Upstream-Endpunkt zur Token-Erzeugung.
- `BOT2_TOKEN_TIMEOUT_SECONDS` (optional, Default `10`)
- `BACKEND_CORS_ORIGINS` (optional, kommasepariert)

## Frontend-Konfiguration

In `src/js/config.js`:

- `bot2.tokenApiPath` (Default: `/api/bot2/token`)
- `bot2.styleOptions` (Avatar-Initialen, Farben, etc.)

Das Frontend spricht nur den lokalen/same-origin Proxy-Pfad an.
