(() => {
  const fab = document.getElementById("chat-fab");
  const panel = document.getElementById("chat-panel");

  if (!fab || !panel) return;

  let lastFocused = null;

  const openPanel = () => {
    lastFocused = document.activeElement;
    panel.hidden = false;
    panel.setAttribute("aria-modal", "true");
    fab.setAttribute("aria-expanded", "true");
  };

  const closePanel = () => {
    panel.hidden = true;
    panel.setAttribute("aria-modal", "false");
    fab.setAttribute("aria-expanded", "false");

    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus();
      return;
    }

    fab.focus();
  };

  fab.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    panel.hidden ? openPanel() : closePanel();
  });

  panel.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  document.addEventListener("click", (event) => {
    if (panel.hidden) return;
    const target = event.target;
    if (!(target instanceof Node)) return;
    if (panel.contains(target) || fab.contains(target)) return;
    closePanel();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !panel.hidden) {
      closePanel();
    }
  });
})();
