(() => {
  const root = document.documentElement;
  const themeSwitch = document.querySelector("#appearance-switch");
  const storedTheme = (() => { try { return localStorage.getItem("theme"); } catch (_) { return null; } })();
  const preferredTheme = storedTheme || (window.matchMedia?.("(prefers-color-scheme: light)").matches ? "light" : "dark");
  root.dataset.theme = preferredTheme;
  if (themeSwitch) {
    themeSwitch.checked = preferredTheme === "dark";
    themeSwitch.addEventListener("change", () => {
      const next = themeSwitch.checked ? "dark" : "light";
      root.dataset.theme = next;
      try { localStorage.setItem("theme", next); } catch (_) {}
    });
  }

  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector("#site-nav");
  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const open = navToggle.getAttribute("aria-expanded") !== "true";
      navToggle.setAttribute("aria-expanded", String(open));
      nav.classList.toggle("is-open", open);
    });
    nav.addEventListener("click", event => {
      if (event.target.closest("a")) {
        navToggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
      }
    });
  }

  const projectButtons = [...document.querySelectorAll("[data-project-filter]")];
  const projectCards = [...document.querySelectorAll("[data-project-card]")];
  projectButtons.forEach(button => button.addEventListener("click", () => {
    const filter = button.dataset.projectFilter;
    projectButtons.forEach(candidate => {
      const active = candidate === button;
      candidate.classList.toggle("is-active", active);
      candidate.setAttribute("aria-pressed", String(active));
    });
    projectCards.forEach(card => { card.hidden = filter !== "all" && card.dataset.category !== filter; });
  }));

  const credentialSearch = document.querySelector("[data-credential-search]");
  const credentialCards = [...document.querySelectorAll("[data-credential-card]")];
  const credentialEmpty = document.querySelector("[data-credential-empty]");
  if (credentialSearch) {
    credentialSearch.addEventListener("input", () => {
      const query = credentialSearch.value.trim().toLocaleLowerCase();
      let visible = 0;
      credentialCards.forEach(card => {
        const matches = card.dataset.search.includes(query);
        card.hidden = !matches;
        if (matches) visible += 1;
      });
      if (credentialEmpty) credentialEmpty.hidden = visible !== 0;
    });
  }

  const dataNode = document.querySelector("#repository-data");
  const repoGrid = document.querySelector("[data-repo-grid]");
  if (!dataNode || !repoGrid) return;

  let repositories = [];
  try { repositories = JSON.parse(dataNode.textContent || "[]"); } catch (_) { repositories = []; }
  const copyNode = document.querySelector("#repository-copy");
  let copy = {};
  try { copy = JSON.parse(copyNode?.textContent || "{}"); } catch (_) { copy = {}; }
  const represented = new Set(["XanhTab", "fireball-webkit", "fireball-docker", "fireball-blink", "SmartMovie", "Android.Smart.Movie", "Waydroid-WSL", "Waydroid-WSLg"]);
  const repoSearch = document.querySelector("[data-repo-search]");
  const repoButtons = [...document.querySelectorAll("[data-repo-filter]")];
  const repoMore = document.querySelector("[data-repo-more]");
  const repoEmpty = document.querySelector("[data-repo-empty]");
  const showingNode = document.querySelector("[data-repo-showing]");
  const countNode = document.querySelector("[data-repo-count]");
  let filter = "all";
  let limit = 30;

  const appendText = (parent, tag, value, className) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    node.textContent = value || "";
    parent.appendChild(node);
    return node;
  };

  const render = () => {
    const query = (repoSearch?.value || "").trim().toLocaleLowerCase();
    const matches = repositories.filter(repo => {
      if (represented.has(repo.name)) return false;
      const haystack = `${repo.name} ${repo.description || ""} ${repo.language || ""}`.toLocaleLowerCase();
      const categoryMatches = filter === "all" || (filter === "original" && !repo.fork && !repo.archived) || (filter === "fork" && repo.fork) || (filter === "archived" && repo.archived);
      return categoryMatches && haystack.includes(query);
    });
    repoGrid.replaceChildren();
    matches.slice(0, limit).forEach(repo => {
      const article = document.createElement("article");
      article.className = "repo-card";
      const heading = appendText(article, "h2", "");
      const link = appendText(heading, "a", repo.name);
      link.href = repo.html_url;
      link.rel = "noopener";
      appendText(article, "p", repo.description || "—");
      const meta = appendText(article, "div", "", "repo-meta");
      if (repo.language) appendText(meta, "span", repo.language);
      if (repo.fork) appendText(meta, "span", copy.fork || "Fork");
      if (repo.archived) appendText(meta, "span", copy.archived || "Archived");
      appendText(meta, "span", `${(copy.stars || "Stars").toLocaleUpperCase()} ${repo.stargazers_count || 0}`);
      repoGrid.appendChild(article);
    });
    if (showingNode) showingNode.textContent = String(Math.min(limit, matches.length));
    if (countNode) countNode.textContent = String(matches.length);
    if (repoEmpty) repoEmpty.hidden = matches.length !== 0;
    if (repoMore) repoMore.hidden = limit >= matches.length;
  };

  repoButtons.forEach(button => button.addEventListener("click", () => {
    filter = button.dataset.repoFilter;
    limit = 30;
    repoButtons.forEach(candidate => {
      const active = candidate === button;
      candidate.classList.toggle("is-active", active);
      candidate.setAttribute("aria-pressed", String(active));
    });
    render();
  }));
  repoSearch?.addEventListener("input", () => { limit = 30; render(); });
  repoMore?.addEventListener("click", () => { limit += 30; render(); });
  render();
})();
