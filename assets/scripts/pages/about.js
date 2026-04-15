lucide.createIcons();

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if(entry.isIntersecting) entry.target.classList.add("active");
  });
});

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

