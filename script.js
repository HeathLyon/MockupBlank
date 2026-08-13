const shell = document.querySelector(".snap-shell");
const panels = [...document.querySelectorAll(".panel")];
const rail = document.querySelector(".section-rail");
const railLinks = [...document.querySelectorAll(".section-rail a")];
const header = document.querySelector(".site-header");
const menuButton = document.querySelector("#menuButton");
const mainNav = document.querySelector("#mainNav");
const heroSlides = [...document.querySelectorAll(".hero-slide")];
const heroSlideButtons = [...document.querySelectorAll(".hero-pagination button")];

if (heroSlides.length > 1) {
  let currentSlide = 0;
  let slideTimer;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const showSlide = (nextSlide) => {
    currentSlide = (nextSlide + heroSlides.length) % heroSlides.length;

    heroSlides.forEach((slide, index) => {
      slide.classList.toggle("is-active", index === currentSlide);
    });

    heroSlideButtons.forEach((button, index) => {
      const isActive = index === currentSlide;
      button.classList.toggle("is-active", isActive);
      if (isActive) button.setAttribute("aria-current", "true");
      else button.removeAttribute("aria-current");
    });
  };

  const startSlideshow = () => {
    if (reduceMotion) return;
    window.clearInterval(slideTimer);
    slideTimer = window.setInterval(() => showSlide(currentSlide + 1), 6400);
  };

  heroSlideButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
      showSlide(index);
      startSlideshow();
    });
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) window.clearInterval(slideTimer);
    else startSlideshow();
  });

  startSlideshow();
}

const updateChrome = (panel) => {
  const activeId = panel.id;
  const isDark = panel.dataset.tone === "dark";

  header.classList.toggle("is-on-dark", isDark);
  rail.classList.toggle("is-on-light", !isDark);
  railLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${activeId}`;
    link.classList.toggle("is-active", isActive);
    if (isActive) link.setAttribute("aria-current", "true");
    else link.removeAttribute("aria-current");
  });
};

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      updateChrome(entry.target);
    });
  },
  {
    root: window.matchMedia("(min-width: 901px) and (min-height: 650px)")
      .matches
      ? shell
      : null,
    threshold: 0.52,
  },
);

panels.forEach((panel) => sectionObserver.observe(panel));
panels[0]?.classList.add("is-visible");

const closeMenu = () => {
  menuButton.setAttribute("aria-expanded", "false");
  mainNav.classList.remove("is-open");
  header.classList.remove("menu-open");
  document.body.style.overflow = "";
};

menuButton.addEventListener("click", () => {
  const willOpen = menuButton.getAttribute("aria-expanded") !== "true";
  menuButton.setAttribute("aria-expanded", String(willOpen));
  mainNav.classList.toggle("is-open", willOpen);
  header.classList.toggle("menu-open", willOpen);
  document.body.style.overflow = willOpen ? "hidden" : "";
});

mainNav
  .querySelectorAll("a")
  .forEach((link) => link.addEventListener("click", closeMenu));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});
