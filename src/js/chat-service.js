class ChatService {
  constructor(config) {
    this.config = config || {};
    this.bot2Config = {
      useApi: false,
      apiUrl: "/api/bot2/chat",
      ...(this.config.bot2 || {}),
    };
  }

  async sendBot2Message(text) {
    if (this.bot2Config.useApi) {
      return this.sendBot2ApiMessage(text);
    }

    return this.mockReply(text);
  }

  async sendBot2ApiMessage(text) {
    const response = await fetch(this.bot2Config.apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: text,
      }),
    });

    if (!response.ok) {
      throw new Error(`Bot2 API failed (${response.status})`);
    }

    const payload = await response.json();
    return {
      text: payload?.text || payload?.message || "API hat keine Antwort geliefert.",
    };
  }

  async mockReply(text) {
    const lower = text.toLowerCase();

    if (lower.includes("interview")) {
      return { text: "Tipp: Starte mit STAR-Beispielen und übe drei konkrete Erfolgsgeschichten." };
    }

    if (lower.includes("cv") || lower.includes("lebenslauf")) {
      return { text: "Setze auf messbare Ergebnisse je Rolle (z. B. +25% Conversion in 6 Monaten)." };
    }

    if (lower.includes("rolle") || lower.includes("job")) {
      return { text: "Für Beratungsrollen helfen Beispiele zu Kundennutzen, Kommunikation und Ownership." };
    }

    return {
      text: "Danke! Ich laufe lokal im Mock-Modus. Stelle später bot2.useApi=true für den Python Bot Framework SDK Endpoint.",
    };
  }
}

window.ChatService = ChatService;
