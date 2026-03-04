window.CAREER_COPILOT_CONFIG = {
  integrationMode: "mock", // mock | iframe | agents
  copilotEmbed: {
    iframeUrl: "", // e.g. https://webchat.botframework.com/embed/<your-bot-id>?s=<token>
    title: "Copilot Studio Web Channel"
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
