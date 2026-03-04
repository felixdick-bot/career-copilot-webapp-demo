(() => {
  const config = window.CAREER_COPILOT_CONFIG;
  const service = new window.ChatService(config);

  const fab = document.getElementById("chat-fab");
  const panel = document.getElementById("chat-panel");
  const closeBtn = document.getElementById("chat-close");
  const form = document.getElementById("chat-form");
  const input = document.getElementById("chat-input");
  const messages = document.getElementById("chat-messages");
  const modeSelect = document.getElementById("integration-mode");
  const status = document.getElementById("chat-status");
  const embedContainer = document.getElementById("embed-container");

  let lastFocused = null;

  function setStatus(text) {
    status.textContent = text;
  }

  function addMessage(role, text) {
    const div = document.createElement("div");
    div.className = `msg ${role}`;
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function renderIframe() {
    embedContainer.innerHTML = "";
    if (!config.copilotEmbed.iframeUrl) {
      embedContainer.innerHTML = "<p>Kein Embed konfiguriert. Trage <code>copilotEmbed.iframeUrl</code> in <code>src/js/config.js</code> ein.</p>";
      return;
    }

    const frame = document.createElement("iframe");
    frame.src = config.copilotEmbed.iframeUrl;
    frame.title = config.copilotEmbed.title || "Copilot Embed";
    frame.loading = "lazy";
    embedContainer.appendChild(frame);
  }

  function updateMode(mode) {
    config.integrationMode = mode;

    if (mode === "mock") {
      embedContainer.hidden = true;
      form.hidden = false;
      setStatus("Mock/Local aktiv – lokale Antworten ohne externe Calls.");
      return;
    }

    if (mode === "iframe") {
      embedContainer.hidden = false;
      form.hidden = true;
      renderIframe();
      setStatus("Copilot Embed aktiv – Web Channel per iFrame.");
      return;
    }

    embedContainer.hidden = true;
    form.hidden = false;
    setStatus("Agents SDK Platzhalter aktiv – Backend-Integration vorbereiten.");
    addMessage("bot", "Agents SDK ist vorbereitet. Nächster Schritt: sichere Auth + Connection-String Handling im Backend.");
  }

  function openPanel() {
    lastFocused = document.activeElement;
    panel.hidden = false;
    panel.setAttribute("aria-modal", "true");
    fab.setAttribute("aria-expanded", "true");
    input.focus();
  }

  function closePanel() {
    panel.hidden = true;
    panel.setAttribute("aria-modal", "false");
    fab.setAttribute("aria-expanded", "false");
    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus();
    } else {
      fab.focus();
    }
  }

  fab.addEventListener("click", () => {
    if (panel.hidden) openPanel();
    else closePanel();
  });

  closeBtn.addEventListener("click", closePanel);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !panel.hidden) {
      closePanel();
    }
  });

  modeSelect.value = config.integrationMode;
  modeSelect.addEventListener("change", (event) => updateMode(event.target.value));

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    addMessage("user", text);
    input.value = "";

    const response = await service.sendMessage(config.integrationMode, text);
    addMessage("bot", response.text);
  });

  addMessage("bot", "Hi! Ich bin dein Career Copilot. Frag mich zu Rollen, CV oder Interview.");
  updateMode(config.integrationMode);
})();
