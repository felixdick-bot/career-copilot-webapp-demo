(() => {
  const panel = document.getElementById("chat-panel");
  const fab = document.getElementById("chat-fab");
  const messages = document.getElementById("bot2-messages");
  const webchatRoot = document.getElementById("bot2-webchat");

  if (!panel || !fab || !messages || !webchatRoot) return;

  const config = window.CAREER_COPILOT_CONFIG || {};
  const bot2Config = {
    tokenApiPath: "/api/bot2/token",
    styleOptions: {
      accent: "#0f172a",
      botAvatarInitials: "CC",
      userAvatarInitials: "DU",
      backgroundColor: "#ffffff",
      bubbleBackground: "#e2e8f0",
      bubbleFromUserBackground: "#dbeafe",
    },
    ...(config.bot2 || {}),
  };

  let initialized = false;

  const showTextMessage = (text, variant = "bot") => {
    messages.hidden = false;
    webchatRoot.hidden = true;

    const bubble = document.createElement("p");
    bubble.className = `msg ${variant}`;
    bubble.textContent = text;
    messages.appendChild(bubble);
    messages.scrollTop = messages.scrollHeight;
  };

  const showError = (text) => {
    showTextMessage(text, "bot");
  };

  const fetchToken = async () => {
    const response = await fetch(bot2Config.tokenApiPath, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      throw new Error(`Token request failed (${response.status})`);
    }

    return response.json();
  };

  const initWebChat = async () => {
    if (initialized) return;
    initialized = true;

    if (!window.WebChat) {
      showError("Chat-Engine konnte nicht geladen werden. Bitte Seite neu laden.");
      return;
    }

    try {
      const tokenPayload = await fetchToken();
      if (!tokenPayload?.token) {
        throw new Error("Missing token field in response");
      }

      const directLineOptions = {
        token: tokenPayload.token,
      };

      if (tokenPayload.domain) {
        directLineOptions.domain = tokenPayload.domain;
      }

      const directLine = window.WebChat.createDirectLine(directLineOptions);
      const styleOptions = {
        accent: bot2Config.styleOptions.accent,
        backgroundColor: bot2Config.styleOptions.backgroundColor,
        bubbleBackground: bot2Config.styleOptions.bubbleBackground,
        bubbleFromUserBackground: bot2Config.styleOptions.bubbleFromUserBackground,
        botAvatarInitials: bot2Config.styleOptions.botAvatarInitials,
        userAvatarInitials: bot2Config.styleOptions.userAvatarInitials,
        hideUploadButton: true,
      };

      messages.hidden = true;
      webchatRoot.hidden = false;

      window.WebChat.renderWebChat(
        {
          directLine,
          styleOptions,
        },
        webchatRoot
      );
    } catch (error) {
      initialized = false;
      showError("Bot2 ist aktuell nicht erreichbar. Bitte versuche es später erneut.");
      console.error("[bot2-chat]", error);
    }
  };

  showTextMessage("Bot2 wird beim Öffnen verbunden…", "bot");

  const maybeInitOnOpen = () => {
    if (!panel.hidden) {
      void initWebChat();
    }
  };

  fab.addEventListener("click", () => {
    window.setTimeout(maybeInitOnOpen, 0);
  });
})();
