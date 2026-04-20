const currentPage = window.location.pathname.split("/").pop() || "index.html";

document.querySelectorAll('.nav-links a').forEach((link) => {
  const href = link.getAttribute("href");
  if (href === currentPage) {
    link.setAttribute("aria-current", "page");
  }
});
