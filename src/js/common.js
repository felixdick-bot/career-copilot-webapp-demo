(() => {
  const page = document.body?.dataset?.page;
  if (!page) return;

  const navLinks = document.querySelectorAll("[data-nav]");
  if (!navLinks.length) return;

  navLinks.forEach((link) => {
    if (!(link instanceof HTMLElement)) return;
    const isActive = link.dataset.nav === page;
    link.classList.toggle("is-active", isActive);
    link.setAttribute("aria-current", isActive ? "page" : "false");
  });
})();
