window.CAREER_COPILOT_CONFIG = {
  integrationMode: "iframe", // mock | iframe | agents
  copilotEmbed: {
    // Du kannst ENTWEDER die reine URL eintragen...
    // iframeUrl: "https://copilotstudio.microsoft.com/environments/.../webchat?__version__=2",
    // ...ODER das komplette iframe-Snippet. app.js extrahiert automatisch src="...".
    iframeUrl: "",
    title: "Copilot Studio Web Channel"
  },
  bot2: {
    useApi: false,
    apiUrl: "/api/bot2/chat"
  },
  agentsSdk: {
    connectionString: "", // never commit real secrets
    endpoint: "", // optional helper for backend relay
    useAuthenticatedFlow: true
  },
  api: {
    baseUrl: "", // e.g. http://localhost:8000/api (future Python backend)
    timeoutMs: 12000
  }
};
