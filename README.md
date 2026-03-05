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
│   │   ├── config.js
│   │   └── config.local.example.js
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
- Beim Öffnen des Panels nutzt das Frontend bevorzugt den Session-Bootstrap vom eigenen Backend (`/api/bot2/session`) und rendert danach Web Chat im Panel.
- Fallback für ältere Backends: `/api/bot2/token`.
- Kein Upstream-Token-Endpoint und keine Secrets im Frontend.

## Architektur (Bot2)

```text
Browser (career-bot2.html)
  -> POST /api/bot2/session (same-origin, bevorzugt)
  -> fallback: POST /api/bot2/token
FastAPI backend (Session/Token-Proxy)
  -> GET .../powervirtualagents/regionalchannelsettings?api-version=...
  -> POST BOT2_TOKEN_ENDPOINT (serverseitig)
Session-Response (sanitized)
  -> { token, domain, conversationId?, expires_in? }
  -> WebChat.createDirectLine({ token, domain })
  -> renderWebChat(...) im Bot2-Panel
```

## Lokaler Start

### 1) Frontend

```bash
cd career-copilot-webapp
python -m http.server 4173
```

Öffnen:

- <http://localhost:4173/index.html>
- <http://localhost:4173/career-bot1.html>
- <http://localhost:4173/career-bot2.html>

### 2) Backend (FastAPI)

```bash
cd career-copilot-webapp
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Hinweis: `.env.example` ist eine Dotfile und kann je nach Dateiexplorer standardmäßig ausgeblendet sein.

Danach `.env` anpassen (mindestens `BOT2_TOKEN_ENDPOINT`).

Start:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8787
```

Healthcheck:

- `GET http://localhost:8787/api/health`

## ENV-Konfiguration (Backend)

- `BOT2_TOKEN_ENDPOINT` (**required**): serverseitiger Upstream-Endpunkt zur Token-Erzeugung.
- `BOT2_TOKEN_TIMEOUT_SECONDS` (optional, Default `10`)
- `BACKEND_CORS_ORIGINS` (optional, kommasepariert). Wenn leer, nutzt das Backend dev-freundliche Defaults (`http://localhost:4173`, `http://127.0.0.1:4173`, `http://localhost:5173`, `http://127.0.0.1:5173`).

## Frontend-Konfiguration

In `src/js/config.js`:

- `bot2.sessionApiPath` (Default: `/api/bot2/session`, bevorzugt)
- `bot2.tokenApiPath` (Default: `/api/bot2/token`, optionaler Fallback)
- `bot2.apiBaseUrl` (optional, z. B. `http://localhost:8787` bei getrennten Origins)
- `bot2.styleOptions` (Avatar-Initialen, Farben, etc.)

Wenn `bot2.apiBaseUrl` leer ist, versucht das Frontend zuerst relative API-Pfade. Für lokale Dev-Setups mit Frontend auf `localhost:4173/5173` nutzt es automatisch `http://localhost:8787` für `/api/...`.

## Troubleshooting Bot2 502 (Quick Checks)

Wenn Bot2 im Frontend mit 502 fehlschlägt, zuerst Backend-Endpunkte direkt testen:

```bash
# 1) Health
curl -i http://localhost:8787/api/health

# 2) Neuer Session-Bootstrap (liefert token + domain)
curl -i -X POST http://localhost:8787/api/bot2/session \
  -H 'Content-Type: application/json' \
  -d '{}'

# 3) Legacy Token-Proxy ohne userId (muss Upstream ohne JSON-Body aufrufen)
curl -i -X POST http://localhost:8787/api/bot2/token \
  -H 'Content-Type: application/json' \
  -d '{}'

# 4) Legacy Token-Proxy mit userId (sendet {"userId":"..."} an Upstream)
curl -i -X POST http://localhost:8787/api/bot2/token \
  -H 'Content-Type: application/json' \
  -d '{"user_id":"felix"}'
```

Bei Upstream-Fehlern enthält die Backend-Response jetzt einen sicheren Hinweis mit Upstream-Status und Kurzgrund (ohne Secret-Leaks).
Hinweis: Einige Copilot-Token-Endpunkte erwarten `GET` statt `POST`. Das Backend nutzt bei `user_id` zuerst `POST` und fällt bei `404 RouteNotFound` automatisch auf `GET` zurück (ohne `user_id` direkt `GET`).

### Lokale Overrides ohne Git-Konflikte

1. Kopiere `src/js/config.local.example.js` nach `src/js/config.local.js`
2. Trage deine persönliche Werte dort ein (z. B. `copilotEmbed.iframeUrl`)
3. `src/js/config.local.js` ist gitignored und wird nicht committed

So bleiben persönliche URLs/Secrets lokal, während `src/js/config.js` saubere Team-Defaults enthält.

