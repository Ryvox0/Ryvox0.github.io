const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

if (navToggle && navLinks) {
  const mobileQuery = window.matchMedia("(max-width: 760px)");

  const closeNav = () => {
    navLinks.classList.remove("nav-open");
    navToggle.setAttribute("aria-expanded", "false");
    if (mobileQuery.matches) {
      navLinks.setAttribute("hidden", "");
    } else {
      navLinks.removeAttribute("hidden");
    }
  };

  const openNav = () => {
    navLinks.classList.add("nav-open");
    navToggle.setAttribute("aria-expanded", "true");
    navLinks.removeAttribute("hidden");
  };

  const syncNavMode = () => {
    if (mobileQuery.matches) {
      closeNav();
    } else {
      navLinks.classList.remove("nav-open");
      navToggle.setAttribute("aria-expanded", "false");
      navLinks.removeAttribute("hidden");
    }
  };

  navToggle.addEventListener("click", () => {
    const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
    if (isExpanded) {
      closeNav();
    } else {
      openNav();
    }
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeNav);
  });

  document.addEventListener("click", (event) => {
    const clickedInsideNav = navLinks.contains(event.target) || navToggle.contains(event.target);
    if (!clickedInsideNav) {
      closeNav();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeNav();
    }
  });

  window.addEventListener("resize", () => {
    syncNavMode();
  });

  syncNavMode();
}
