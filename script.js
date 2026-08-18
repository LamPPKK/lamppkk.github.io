const languageToggle = document.querySelector(".language-toggle");
const languageLabels = languageToggle?.querySelectorAll("span:not([aria-hidden])");
const translatableElements = document.querySelectorAll("[data-en][data-vi]");
const translatableAriaElements = document.querySelectorAll(
  "[data-en-aria-label][data-vi-aria-label]",
);
const translatableAltElements = document.querySelectorAll("[data-en-alt][data-vi-alt]");
const progressBar = document.querySelector(".page-progress span");

const setLanguage = (language) => {
  const nextLanguage = language === "vi" ? "vi" : "en";

  document.documentElement.lang = nextLanguage;
  translatableElements.forEach((element) => {
    element.textContent = element.dataset[nextLanguage];
  });
  translatableAriaElements.forEach((element) => {
    element.setAttribute("aria-label", element.dataset[`${nextLanguage}AriaLabel`]);
  });
  translatableAltElements.forEach((element) => {
    element.setAttribute("alt", element.dataset[`${nextLanguage}Alt`]);
  });

  languageLabels?.forEach((label) => {
    const isActive = label.textContent.toLowerCase() === nextLanguage;
    label.classList.toggle("language-active", isActive);
  });

  languageToggle?.setAttribute(
    "aria-label",
    nextLanguage === "en" ? "Switch to Vietnamese" : "Chuyển sang tiếng Anh",
  );
  document.title =
    nextLanguage === "en"
      ? "Lâm Nguyễn — Technical Project Manager"
      : "Lâm Nguyễn — Quản lý dự án công nghệ";

  try {
    localStorage.setItem("portfolio-language", nextLanguage);
  } catch {
    // The portfolio still works when storage is unavailable.
  }
};

const getPreferredLanguage = () => {
  try {
    const storedLanguage = localStorage.getItem("portfolio-language");
    if (storedLanguage === "en" || storedLanguage === "vi") return storedLanguage;
  } catch {
    // Fall through to the browser preference.
  }

  return navigator.language.toLowerCase().startsWith("vi") ? "vi" : "en";
};

setLanguage(getPreferredLanguage());

languageToggle?.addEventListener("click", () => {
  setLanguage(document.documentElement.lang === "en" ? "vi" : "en");
});

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8%", threshold: 0.08 },
  );

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

const updateProgress = () => {
  if (!progressBar) return;

  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
  progressBar.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
};

window.addEventListener("scroll", updateProgress, { passive: true });
window.addEventListener("resize", updateProgress);
updateProgress();

const currentYear = document.querySelector("#current-year");
if (currentYear) currentYear.textContent = String(new Date().getFullYear());
