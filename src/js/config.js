(() => {
  const baseConfig = {
    integrationMode: "iframe", // mock | iframe | agents
    copilotEmbed: {
      // Du kannst ENTWEDER die reine URL eintragen...
      // iframeUrl: "https://copilotstudio.microsoft.com/environments/.../webchat?__version__=2",
      // ...ODER das komplette iframe-Snippet. app.js extrahiert automatisch src="...".
      iframeUrl: "",
      title: "Copilot Studio Web Channel",
    },
    bot2: {
      tokenApiPath: "/api/bot2/token",
      styleOptions: {
        accent: "#0f172a",
        botAvatarInitials: "CC",
        userAvatarInitials: "DU",
        backgroundColor: "#ffffff",
        bubbleBackground: "#e2e8f0",
        bubbleFromUserBackground: "#dbeafe",
      },
    },
    agentsSdk: {
      connectionString: "", // never commit real secrets
      endpoint: "", // optional helper for backend relay
      useAuthenticatedFlow: true,
    },
    api: {
      baseUrl: "", // e.g. http://localhost:8787/api (future Python backend)
      timeoutMs: 12000,
    },
  };

  const deepMerge = (target, source) => {
    if (!source || typeof source !== "object") return target;

    const output = { ...target };

    Object.keys(source).forEach((key) => {
      const sourceValue = source[key];
      const targetValue = output[key];

      if (Array.isArray(sourceValue)) {
        output[key] = sourceValue.slice();
      } else if (
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

  const localOverrides = window.CAREER_COPILOT_CONFIG_LOCAL || {};
  const mergedConfig = deepMerge(baseConfig, localOverrides);

  window.CAREER_COPILOT_CONFIG = mergedConfig;
})();
