# Career Copilot Webapp (Demo)

Responsive Beispiel-Webseite mit Karriere-Inhalten und einem **Copilot-ähnlichen Chat-Widget** unten rechts.

## Features

- Mobile-responsive Landing Page
- Karriere-Content (Rollen, Roadmap, Ressourcen)
- Floating Copilot Icon unten rechts
- Klick öffnet/schließt Chat-Fenster
- Chat-UI als Frontend vorbereitet (Backend folgt in Python)

## Starten

```bash
# im Projektordner
python3 -m http.server 8000
# oder
npx serve .
```

Dann öffnen: `http://localhost:8000`

## Struktur

- `index.html` – Seite + Chat-Widget
- `styles.css` – Layout + responsive Styles
- `script.js` – Chat-Panel Interaktion

## Nächste Schritte (für dich)

- `script.js` um API-Call zu deinem Python-Backend erweitern
- Eingabe an `/chat` Endpoint senden
- Antwort als Bot-Message rendern
