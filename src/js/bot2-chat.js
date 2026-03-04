(() => {
  const panel = document.getElementById("chat-panel");
  const fab = document.getElementById("chat-fab");
  const messages = document.getElementById("bot2-messages");
  const webchatRoot = document.getElementById("bot2-webchat");

  if (!panel || !fab || !messages || !webchatRoot) return;

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
  const config = deepMerge(baseConfig, localConfig);
  const bot2Config = {
    sessionApiPath: "/api/bot2/session",
    tokenApiPath: "/api/bot2/token",
    directLineDomain: "",
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

  const formatBackendError = async (response) => {
    let detail = "";
    try {
      const body = await response.clone().json();
      if (body && typeof body.detail === "string") {
        detail = body.detail;
      }
    } catch (_error) {
      // ignore parse errors
    }

    const statusPart = `HTTP ${response.status}`;
    return detail ? `${statusPart} - ${detail}` : statusPart;
  };

  const fetchSessionOrToken = async () => {
    let sessionError = null;

    try {
      const sessionResponse = await fetch(bot2Config.sessionApiPath, {
        method: "POST",
      });

      if (!sessionResponse.ok) {
        throw new Error(await formatBackendError(sessionResponse));
      }

      const sessionPayload = await sessionResponse.json();
      if (!sessionPayload?.token) {
        throw new Error("Session response missing token");
      }

      if (!sessionPayload?.domain) {
        throw new Error("Session response missing domain");
      }

      return sessionPayload;
    } catch (error) {
      sessionError = error;
      console.warn("[bot2-chat] Session bootstrap failed, trying token fallback:", error);
    }

    const tokenResponse = await fetch(bot2Config.tokenApiPath, {
      method: "POST",
    });

    if (!tokenResponse.ok) {
      const tokenErrorText = await formatBackendError(tokenResponse);
      const sessionErrorText = sessionError ? `; session: ${sessionError.message}` : "";
      throw new Error(`Token fallback failed (${tokenErrorText}${sessionErrorText})`);
    }

    const tokenPayload = await tokenResponse.json();
    if (!tokenPayload?.token) {
      throw new Error("Token fallback response missing token");
    }

    if (!tokenPayload.domain && bot2Config.directLineDomain) {
      tokenPayload.domain = bot2Config.directLineDomain;
    }

    return tokenPayload;
  };

  const initWebChat = async () => {
    if (initialized) return;
    initialized = true;

    if (!window.WebChat) {
      showError("Chat-Engine konnte nicht geladen werden. Bitte Seite neu laden.");
      return;
    }

    try {
      const tokenPayload = await fetchSessionOrToken();

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
