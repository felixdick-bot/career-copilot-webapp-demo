(() => {
  const messages = document.getElementById("bot2-messages");
  const webchatRoot = document.getElementById("bot2-webchat");
  const promptsRoot = document.getElementById("bot2-prompts");
  const statusNode = document.getElementById("bot2-status");

  if (!messages || !webchatRoot || !promptsRoot || !statusNode) return;

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
    fallbackPrompts: [
      "Welche Stellen sind aktuell offen?",
      "Wie läuft der Bewerbungsprozess ab?",
      "Welche Benefits bietet Nexoria?",
      "Welche Rolle passt zu meinem Profil?"
    ],
    styleOptions: {
      accent: "#1d4ed8",
      botAvatarInitials: "NX",
      userAvatarInitials: "DU",
      backgroundColor: "#ffffff",
      bubbleBackground: "#e2e8f0",
      bubbleFromUserBackground: "#dbeafe"
    },
    ...(config.bot2 || {})
  };

  let webChatReady = false;
  let postActivity = null;
  let promptButtons = [];

  const setStatus = (text, mode = "neutral") => {
    statusNode.textContent = text;
    statusNode.dataset.mode = mode;
  };

  const showTextMessage = (text, variant = "bot") => {
    messages.hidden = false;
    webchatRoot.hidden = true;

    const bubble = document.createElement("p");
    bubble.className = `msg ${variant}`;
    bubble.textContent = text;
    messages.appendChild(bubble);
    messages.scrollTop = messages.scrollHeight;
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
        method: "POST"
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
      method: "POST"
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

  const extractPromptList = (actions = []) =>
    actions
      .map((action) => {
        const title = typeof action?.title === "string" ? action.title.trim() : "";
        const value = typeof action?.value === "string" ? action.value.trim() : title;
        return title || value ? { title: title || value, value } : null;
      })
      .filter(Boolean);

  const renderPromptButtons = (items) => {
    const nextPrompts = Array.isArray(items) && items.length ? items : extractPromptList(bot2Config.fallbackPrompts.map((text) => ({ title: text, value: text })));

    promptButtons = nextPrompts;
    promptsRoot.innerHTML = "";

    nextPrompts.forEach((prompt) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "prompt-chip";
      button.textContent = prompt.title;
      button.addEventListener("click", () => {
        if (!webChatReady || typeof postActivity !== "function") return;
        postActivity(prompt.value || prompt.title);
      });
      promptsRoot.appendChild(button);
    });
  };

  const initWebChat = async () => {
    if (!window.WebChat) {
      showTextMessage("Chat-Engine konnte nicht geladen werden. Bitte Seite neu laden.");
      setStatus("Nicht verfügbar", "error");
      return;
    }

    try {
      const tokenPayload = await fetchSessionOrToken();

      const directLineOptions = {
        token: tokenPayload.token
      };

      if (tokenPayload.domain) {
        directLineOptions.domain = tokenPayload.domain;
      }

      const directLine = window.WebChat.createDirectLine(directLineOptions);

      const store = window.WebChat.createStore({}, ({ dispatch }) => (next) => (action) => {
        if (action.type === "DIRECT_LINE/INCOMING_ACTIVITY") {
          const activity = action.payload?.activity;
          const promptList = extractPromptList(activity?.suggestedActions?.actions || []);
          if (promptList.length) {
            renderPromptButtons(promptList);
          }
        }

        return next(action);
      });

      const styleOptions = {
        accent: bot2Config.styleOptions.accent,
        backgroundColor: bot2Config.styleOptions.backgroundColor,
        bubbleBackground: bot2Config.styleOptions.bubbleBackground,
        bubbleFromUserBackground: bot2Config.styleOptions.bubbleFromUserBackground,
        botAvatarInitials: bot2Config.styleOptions.botAvatarInitials,
        userAvatarInitials: bot2Config.styleOptions.userAvatarInitials,
        hideUploadButton: true
      };

      messages.hidden = true;
      webchatRoot.hidden = false;

      window.WebChat.renderWebChat(
        {
          directLine,
          styleOptions,
          store
        },
        webchatRoot
      );

      postActivity = (text) => {
        directLine
          .postActivity({
            type: "message",
            from: { id: "user" },
            text
          })
          .subscribe({
            error: (error) => {
              console.error("[bot2-chat] postActivity failed", error);
            }
          });
      };

      webChatReady = true;
      setStatus("Online", "ok");
      renderPromptButtons([]);
    } catch (error) {
      webChatReady = false;
      showTextMessage("Der Karriere-Chat ist aktuell nicht erreichbar. Bitte versuche es später erneut.");
      setStatus("Offline", "error");
      console.error("[bot2-chat]", error);
    }
  };

  setStatus("Verbinde…", "neutral");
  showTextMessage("Karriere-Chat wird gestartet…", "bot");
  renderPromptButtons([]);
  void initWebChat();
})();
