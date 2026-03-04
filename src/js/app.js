(() => {
  const defaultConfig = {
    integrationMode: "iframe",
    copilotEmbed: {
      iframeUrl: "",
      title: "Copilot Studio Web Channel",
    },
  };

  const deepMerge = (target, source) => {
    if (!source || typeof source !== "object") return { ...target };

    const output = { ...target };

    Object.keys(source).forEach((key) => {
      const sourceValue = source[key];
      const targetValue = output[key];

      if (
        sourceValue &&
        typeof sourceValue === "object" &&
        !Array.isArray(sourceValue) &&
        targetValue &&
        typeof targetValue === "object" &&
        !Array.isArray(targetValue)
      ) {
        output[key] = deepMerge(targetValue, sourceValue);
      } else {
        output[key] = sourceValue;
      }
    });

    return output;
  };

  const rawConfig = window.CAREER_COPILOT_CONFIG || {};
  const localConfig = window.CAREER_COPILOT_CONFIG_LOCAL || {};
  const mergedConfig = deepMerge(rawConfig, localConfig);

  const config = {
    ...defaultConfig,
    ...mergedConfig,
    copilotEmbed: {
      ...defaultConfig.copilotEmbed,
      ...(mergedConfig.copilotEmbed || {}),
    },
  };

  const fab = document.getElementById("chat-fab");
  const panel = document.getElementById("chat-panel");
  const closeBtn = document.getElementById("chat-close");
  const embedContainer = document.getElementById("embed-container");

  if (!fab || !panel || !embedContainer) {
    console.error("[career-copilot] Required chat UI elements not found.");
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
        "<p>Kein gültiger Embed-Link gefunden. Trage die URL in <code>src/js/config.local.js</code> (oder Team-Defaults in <code>src/js/config.js</code>) ein.</p>";
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

  function togglePanel() {
    if (panel.hidden) {
      openPanel();
    } else {
      closePanel();
    }
  }

  fab.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    togglePanel();
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", (event) => {
      event.preventDefault();
      closePanel();
    });
  }

  document.addEventListener("click", (event) => {
    if (panel.hidden) return;

    const target = event.target;
    if (!(target instanceof Node)) return;

    if (panel.contains(target) || fab.contains(target)) {
      return;
    }

    closePanel();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !panel.hidden) {
      closePanel();
    }
  });

  renderIframe();
})();
