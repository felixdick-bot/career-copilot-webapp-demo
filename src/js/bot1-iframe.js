(() => {
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

  const baseConfig = window.CAREER_COPILOT_CONFIG || {};
  const localConfig = window.CAREER_COPILOT_CONFIG_LOCAL || {};
  const mergedConfig = deepMerge(baseConfig, localConfig);
  const config = {
    copilotEmbed: {
      iframeUrl: "",
      title: "Copilot Studio Web Channel",
      ...(mergedConfig.copilotEmbed || {}),
    },
  };

  const embedContainer = document.getElementById("embed-container");
  const panel = document.getElementById("chat-panel");
  const fab = document.getElementById("chat-fab");
  if (!embedContainer) return;

  const normalizeIframeUrl = (value) => {
    if (!value || typeof value !== "string") return "";
    const trimmed = value.trim();

    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;

    const srcMatch = trimmed.match(/src\s*=\s*["']([^"']+)["']/i);
    return srcMatch?.[1]?.trim() || "";
  };

  const appendConnectionHints = (url) => {
    try {
      const parsed = new URL(url, window.location.href);
      const origin = parsed.origin;
      const host = parsed.hostname;

      const ensureHint = (rel, href, extras = {}) => {
        if (!href) return;
        const selector = `link[rel="${rel}"][href="${href}"]`;
        if (document.head.querySelector(selector)) return;

        const link = document.createElement("link");
        link.rel = rel;
        link.href = href;
        Object.entries(extras).forEach(([key, value]) => {
          link.setAttribute(key, value);
        });
        document.head.appendChild(link);
      };

      ensureHint("preconnect", origin, { crossorigin: "" });
      ensureHint("dns-prefetch", `//${host}`);
    } catch {
      // Invalid URLs are handled by fallback messaging below.
    }
  };

  const iframeUrl = normalizeIframeUrl(config.copilotEmbed.iframeUrl);
  embedContainer.innerHTML = "";

  if (!iframeUrl) {
    embedContainer.innerHTML =
      '<p class="embed-fallback">Kein gültiger Embed-Link gefunden. Trage die URL in <code>src/js/config.local.js</code> (oder Team-Defaults in <code>src/js/config.js</code>) ein.</p>';
    return;
  }

  appendConnectionHints(iframeUrl);

  let frame = null;

  const ensureFrame = () => {
    if (frame && embedContainer.contains(frame)) return frame;

    frame = document.createElement("iframe");
    frame.src = iframeUrl;
    frame.title = config.copilotEmbed.title || "Copilot Embed";
    frame.loading = "eager";
    frame.referrerPolicy = "no-referrer-when-downgrade";
    frame.allow = "clipboard-read; clipboard-write";
    embedContainer.appendChild(frame);

    return frame;
  };

  const warmup = () => {
    if (frame) return;
    ensureFrame();
  };

  if (typeof window.requestIdleCallback === "function") {
    window.requestIdleCallback(warmup, { timeout: 1200 });
  } else {
    window.setTimeout(warmup, 250);
  }

  const openOnDemand = () => {
    if (!panel || panel.hidden) return;
    ensureFrame();
  };

  if (fab && panel) {
    fab.addEventListener("click", () => {
      // fab-panel.js toggles hidden state in the same tick.
      window.setTimeout(openOnDemand, 0);
    });
  }
})();
