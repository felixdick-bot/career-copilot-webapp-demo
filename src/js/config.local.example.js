window.CAREER_COPILOT_CONFIG_LOCAL = {
  integrationMode: "iframe", // optional local override
  copilotEmbed: {
    // Trage hier DEINE persönliche Copilot Embed URL ein (nicht in config.js):
    // iframeUrl: "https://copilotstudio.microsoft.com/environments/.../webchat?__version__=2",
    // Oder vollständiges iframe-Snippet:
    // iframeUrl: "<iframe src=\"https://...\"></iframe>",
    // title: "Mein lokaler Copilot"
  },
  bot2: {
    // tokenApiPath: "http://localhost:8787/api/bot2/token",
    // styleOptions: {
    //   accent: "#0f172a"
    // }
  },
  agentsSdk: {
    // connectionString: "",
    // endpoint: "",
    // useAuthenticatedFlow: true
  },
  api: {
    // baseUrl: "http://localhost:8787/api",
    // timeoutMs: 12000
  }
};
