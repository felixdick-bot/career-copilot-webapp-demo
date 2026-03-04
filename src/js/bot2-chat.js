(() => {
  const form = document.getElementById("bot2-form");
  const input = document.getElementById("bot2-input");
  const messages = document.getElementById("bot2-messages");

  if (!form || !input || !messages) return;

  const config = window.CAREER_COPILOT_CONFIG || {};
  const service = typeof window.ChatService === "function" ? new window.ChatService(config) : null;

  const appendMessage = (text, role = "bot") => {
    if (!text) return;
    const bubble = document.createElement("p");
    bubble.className = `msg ${role}`;
    bubble.textContent = text;
    messages.appendChild(bubble);
    messages.scrollTop = messages.scrollHeight;
  };

  appendMessage("Hi! Ich bin dein Career Copilot. Aktuell antworte ich lokal im Mock-Modus.", "bot");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    appendMessage(text, "user");
    input.value = "";

    try {
      if (!service || typeof service.sendBot2Message !== "function") {
        appendMessage("Service nicht verfügbar. Bitte src/js/chat-service.js prüfen.", "bot");
        return;
      }

      const reply = await service.sendBot2Message(text);
      appendMessage(reply?.text || "Keine Antwort verfügbar.", "bot");
    } catch (error) {
      appendMessage("Es gab einen Fehler. Bitte später erneut versuchen.", "bot");
      console.error("[bot2-chat]", error);
    }
  });
})();
