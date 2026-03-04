(() => {
  const rawConfig = window.CAREER_COPILOT_CONFIG || {};
  const config = {
    copilotEmbed: {
      iframeUrl: "",
      title: "Copilot Studio Web Channel",
      ...(rawConfig.copilotEmbed || {}),
    },
  };

  const embedContainer = document.getElementById("embed-container");
  if (!embedContainer) return;

  const normalizeIframeUrl = (value) => {
    if (!value || typeof value !== "string") return "";
    const trimmed = value.trim();

    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;

    const srcMatch = trimmed.match(/src\s*=\s*["']([^"']+)["']/i);
    return srcMatch?.[1]?.trim() || "";
  };

  const iframeUrl = normalizeIframeUrl(config.copilotEmbed.iframeUrl);
  embedContainer.innerHTML = "";

  if (!iframeUrl) {
    embedContainer.innerHTML =
      '<p class="embed-fallback">Kein gültiger Embed-Link gefunden. Trage in <code>src/js/config.js</code> die URL oder ein vollständiges <code>&lt;iframe&gt;</code>-Snippet ein.</p>';
    return;
  }

  const frame = document.createElement("iframe");
  frame.src = iframeUrl;
  frame.title = config.copilotEmbed.title || "Copilot Embed";
  frame.loading = "lazy";
  frame.referrerPolicy = "no-referrer-when-downgrade";
  frame.allow = "clipboard-read; clipboard-write";
  embedContainer.appendChild(frame);
})();
