document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("contactToggle");
    const menu = document.getElementById("contactMenu");

    if (toggle && menu) {
        toggle.addEventListener("click", () => {
            menu.classList.toggle("active");
        });
    }

    // klik poza menu = zamyka
    document.addEventListener("click", (e) => {
        if (!e.target.closest(".contact-wrapper")) {
            menu.classList.remove("active");
        }
    });

    // Lucide icons init (raz)
    if (window.lucide) {
        lucide.createIcons();
    }
});