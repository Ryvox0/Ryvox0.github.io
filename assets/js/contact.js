document.querySelectorAll('.nav-links a').forEach((link) => {
  const href = link.getAttribute("href");
  if (href === "contact.html") {
    link.setAttribute("aria-current", "page");
  }
});
