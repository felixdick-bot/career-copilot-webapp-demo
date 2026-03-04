(() => {
  const defaultConfig = {
    integrationMode: "iframe",
    copilotEmbed: {
      iframeUrl: "",
      title: "Copilot Studio Web Channel",
    },
  };

  const rawConfig = window.CAREER_COPILOT_CONFIG || {};
  const config = {
    ...defaultConfig,
    ...rawConfig,
    copilotEmbed: {
      ...defaultConfig.copilotEmbed,
      ...(rawConfig.copilotEmbed || {}),
    },
  };

  const fab = document.getElementById("chat-fab");
  const panel = document.getElementById("chat-panel");
  const closeBtn = document.getElementById("chat-close");
  const embedContainer = document.getElementById("embed-container");

  if (!fab || !panel || !closeBtn || !embedContainer) {
    console.error("[career-copilot] Chat UI elements not found.");
    return;
  }

  let lastFocused = null;

  function normalizeIframeUrl(value) {
    if (!value || typeof value !== "string") return "";

    const trimmed = value.trim();

    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      return trimmed;
    }

    const srcMatch = trimmed.match(/src\s*=\s*["']([^"']+)["']/i);
    if (srcMatch && srcMatch[1]) {
      return srcMatch[1].trim();
    }

    return "";
  }

  function renderIframe() {
    embedContainer.innerHTML = "";

    const iframeUrl = normalizeIframeUrl(config.copilotEmbed.iframeUrl);

    if (!iframeUrl) {
      embedContainer.innerHTML =
        "<p>Kein gültiger Embed-Link gefunden. Trage in <code>src/js/config.js</code> entweder die reine URL oder ein komplettes <code>&lt;iframe ...&gt;</code>-Snippet ein.</p>";
      return;
    }

    const frame = document.createElement("iframe");
    frame.src = iframeUrl;
    frame.title = config.copilotEmbed.title || "Copilot Embed";
    frame.loading = "lazy";
    frame.referrerPolicy = "no-referrer-when-downgrade";
    frame.allow = "clipboard-read; clipboard-write";
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
    if (panel.hidden) {
      openPanel();
    } else {
      closePanel();
    }
  });

  closeBtn.addEventListener("click", closePanel);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !panel.hidden) {
      closePanel();
    }
  });

  renderIframe();
})();
