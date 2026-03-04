(() => {
  const form = document.getElementById("bot2-form");
  const input = document.getElementById("bot2-input");
  const messages = document.getElementById("bot2-messages");

  if (!form || !input || !messages) return;

  const service = typeof window.ChatService === "function" ? new window.ChatService(window.CAREER_COPILOT_CONFIG || {}) : null;

  const appendMessage = (text, role = "bot") => {
    if (!text) return;
    const bubble = document.createElement("p");
    bubble.className = `msg ${role}`;
    bubble.textContent = text;
    messages.appendChild(bubble);
    messages.scrollTop = messages.scrollHeight;
  };

  appendMessage("Willkommen bei Nexoria Careers. Hinweis: M365 Agents SDK Integration folgt im nächsten Schritt.", "bot");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    appendMessage(text, "user");
    input.value = "";

    try {
      if (!service || typeof service.sendMessage !== "function") {
        appendMessage("Mock-Service nicht verfügbar. Bitte src/js/chat-service.js prüfen.", "bot");
        return;
      }

      const reply = await service.sendMessage("mock", text);
      appendMessage(reply?.text || "Keine Antwort verfügbar.", "bot");
    } catch (error) {
      appendMessage("Es gab einen lokalen Fehler. Bitte später erneut versuchen.", "bot");
      console.error("[bot2-chat]", error);
    }
  });
})();
