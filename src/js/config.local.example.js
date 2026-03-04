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
    // sessionApiPath: "http://localhost:8787/api/bot2/session",
    // tokenApiPath: "http://localhost:8787/api/bot2/token", // optional fallback
    // directLineDomain: "https://directline.botframework.com/v3/directline", // optional fallback if token endpoint returns no domain
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
