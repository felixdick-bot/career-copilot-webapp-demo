(() => {
  const rawConfig = window.CAREER_COPILOT_CONFIG || {};
  const config = {
    copilotEmbed: {
      iframeUrl: "",
      title: "Copilot Studio Web Channel",
      ...(rawConfig.copilotEmbed || {}),
    },
  };

  const fab = document.getElementById("chat-fab");
  const panel = document.getElementById("chat-panel");
  const embedContainer = document.getElementById("embed-container");

  if (!fab || !panel || !embedContainer) return;

  let lastFocused = null;

  const normalizeIframeUrl = (value) => {
    if (!value || typeof value !== "string") return "";
    const trimmed = value.trim();

    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;

    const srcMatch = trimmed.match(/src\s*=\s*["']([^"']+)["']/i);
    return srcMatch?.[1]?.trim() || "";
  };

  const renderIframe = () => {
    embedContainer.innerHTML = "";
    const iframeUrl = normalizeIframeUrl(config.copilotEmbed.iframeUrl);

    if (!iframeUrl) {
      embedContainer.innerHTML =
        "<p>Kein gültiger Embed-Link gefunden. Trage in <code>src/js/config.js</code> die URL oder ein vollständiges <code>&lt;iframe&gt;</code>-Snippet ein.</p>";
      return;
    }

    const frame = document.createElement("iframe");
    frame.src = iframeUrl;
    frame.title = config.copilotEmbed.title || "Copilot Embed";
    frame.loading = "lazy";
    frame.referrerPolicy = "no-referrer-when-downgrade";
    frame.allow = "clipboard-read; clipboard-write";
    embedContainer.appendChild(frame);
  };

  const openPanel = () => {
    lastFocused = document.activeElement;
    panel.hidden = false;
    panel.setAttribute("aria-modal", "true");
    fab.setAttribute("aria-expanded", "true");
  };

  const closePanel = () => {
    panel.hidden = true;
    panel.setAttribute("aria-modal", "false");
    fab.setAttribute("aria-expanded", "false");
    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus();
    } else {
      fab.focus();
    }
  };

  fab.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    panel.hidden ? openPanel() : closePanel();
  });

  document.addEventListener("click", (event) => {
    if (panel.hidden) return;
    const target = event.target;
    if (!(target instanceof Node)) return;
    if (panel.contains(target) || fab.contains(target)) return;
    closePanel();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !panel.hidden) {
      closePanel();
    }
  });

  renderIframe();
})();
