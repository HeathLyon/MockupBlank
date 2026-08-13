const header = document.querySelector("#siteHeader");
const menuButton = document.querySelector("#menuButton");
const mainNav = document.querySelector("#mainNav");
const searchInput = document.querySelector("#vendorSearch");
const filterButtons = [...document.querySelectorAll(".filter-chip")];
const vendorCards = [...document.querySelectorAll(".vendor-card")];
const resultCount = document.querySelector("#resultCount");
const noResults = document.querySelector("#noResults");
const clearFilters = document.querySelector("#clearFilters");

let activeFilter = "all";

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

mainNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

const updateHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > window.innerHeight * 0.7);
};

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

const applyFilters = () => {
  const query = searchInput.value.trim().toLowerCase();
  let visibleCount = 0;

  vendorCards.forEach((card) => {
    const matchesCategory = activeFilter === "all" || card.dataset.category === activeFilter;
    const matchesSearch = !query || card.dataset.search.includes(query) || card.textContent.toLowerCase().includes(query);
    const shouldShow = matchesCategory && matchesSearch;
    card.hidden = !shouldShow;
    if (shouldShow) visibleCount += 1;
  });

  const label = visibleCount === 1 ? "vendor" : "vendors";
  resultCount.textContent = activeFilter === "all" && !query
    ? `Showing all ${visibleCount} ${label}`
    : `Showing ${visibleCount} ${label}`;
  noResults.hidden = visibleCount !== 0;
};

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach((item) => {
      const isActive = item === button;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });
    applyFilters();
  });
});

searchInput.addEventListener("input", applyFilters);

clearFilters.addEventListener("click", () => {
  activeFilter = "all";
  searchInput.value = "";
  filterButtons.forEach((item) => {
    const isAll = item.dataset.filter === "all";
    item.classList.toggle("is-active", isAll);
    item.setAttribute("aria-pressed", String(isAll));
  });
  applyFilters();
  searchInput.focus();
});
