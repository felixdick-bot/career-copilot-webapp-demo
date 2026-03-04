class ChatService {
  constructor(config) {
    this.config = config;
  }

  async sendMessage(mode, text) {
    if (mode === "mock") return this.mockReply(text);
    if (mode === "iframe") {
      return {
        text: "iFrame-Modus aktiv: Interaktion erfolgt im eingebetteten Web-Channel.",
      };
    }
    return {
      text: "Agents-SDK-Modus vorbereitet: Verbinde als nächsten Schritt das SDK über ein gesichertes Backend.",
    };
  }

  async mockReply(text) {
    const lower = text.toLowerCase();
    if (lower.includes("interview")) {
      return { text: "Tipp: Starte mit STAR-Beispielen und übe 3 konkrete Erfolgsgeschichten." };
    }
    if (lower.includes("cv") || lower.includes("lebenslauf")) {
      return { text: "Setze auf messbare Ergebnisse pro Rolle (z. B. +25% Conversion in 6 Monaten)." };
    }
    return {
      text: "Danke! Im Mock-Modus antworte ich lokal. Später kann hier dein Python-Backend oder Copilot angebunden werden.",
    };
  }
}

window.ChatService = ChatService;
