(() => {
  const config = window.CAREER_COPILOT_CONFIG;

  const fab = document.getElementById("chat-fab");
  const panel = document.getElementById("chat-panel");
  const closeBtn = document.getElementById("chat-close");
  const embedContainer = document.getElementById("embed-container");

  let lastFocused = null;

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

  function openPanel() {
    lastFocused = document.activeElement;
    panel.hidden = false;
    panel.setAttribute("aria-modal", "true");
    fab.setAttribute("aria-expanded", "true");
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

  renderIframe();
})();
