const projectLinks = document.querySelectorAll('.nav-links a[href^="#"]');
const sections = [...document.querySelectorAll("main section[id]")];

if (projectLinks.length && sections.length) {
  const setActive = () => {
    const scrollBottom = window.scrollY + window.innerHeight;
    const pageBottom = document.documentElement.scrollHeight - 24;
    let current = sections[0];

    if (scrollBottom >= pageBottom) {
      current = sections[sections.length - 1];
    } else {
      const viewportTarget = window.scrollY + (window.innerHeight * 0.35);
      current = sections.findLast((section) => viewportTarget >= section.offsetTop) || sections[0];
    }

    projectLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${current.id}`;
      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  window.addEventListener("scroll", setActive, { passive: true });
  window.addEventListener("resize", setActive);
  setActive();
}
