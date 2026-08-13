const header = document.querySelector("#siteHeader");
const menuButton = document.querySelector("#menuButton");
const mainNav = document.querySelector("#mainNav");
const form = document.querySelector("#inquiryForm");
const formStatus = document.querySelector("#formStatus");

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
document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeMenu(); });

const updateHeader = () => header.classList.toggle("is-scrolled", window.scrollY > window.innerHeight * 0.65);
window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

const selectEventFromHash = () => {
  const map = { "#wedding-inquiry": "Wedding", "#corporate-inquiry": "Corporate event", "#event-inquiry": "Celebration or retreat" };
  const value = map[window.location.hash];
  if (!value) return;
  const option = form.querySelector(`input[name="event_type"][value="${value}"]`);
  if (option) option.checked = true;
};

window.addEventListener("hashchange", selectEventFromHash);
selectEventFromHash();

form.addEventListener("submit", (event) => {
  event.preventDefault();
  formStatus.textContent = "Mockup form complete. In WordPress, this button would send the inquiry to the 9 Acres team.";
});
