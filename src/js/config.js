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
    sessionApiPath: "/api/bot2/session", // bevorzugter Bootstrap-Endpoint (liefert token + domain)
    tokenApiPath: "/api/bot2/token", // optionaler Fallback für ältere Backends
    // directLineDomain: "https://directline.botframework.com/v3/directline", // optional fallback when token response has no domain
    styleOptions: {
      accent: "#0f172a",
      botAvatarInitials: "CC",
      userAvatarInitials: "DU",
      backgroundColor: "#ffffff",
      bubbleBackground: "#e2e8f0",
      bubbleFromUserBackground: "#dbeafe"
    }
  },
  agentsSdk: {
    connectionString: "", // never commit real secrets
    endpoint: "", // optional helper for backend relay
    useAuthenticatedFlow: true
  },
  api: {
    baseUrl: "", // e.g. http://localhost:8787/api (future Python backend)
    timeoutMs: 12000
  }
};
