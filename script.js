const sidebar = document.getElementById("sidebar");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = Array.from(document.querySelectorAll(".nav-link"));
const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

if (menuToggle && sidebar) {
    menuToggle.addEventListener("click", () => {
        const isOpen = sidebar.classList.toggle("is-open");
        menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            sidebar.classList.remove("is-open");
            menuToggle.setAttribute("aria-expanded", "false");
        });
    });
}

const activateLink = (id) => {
    navLinks.forEach((link) => {
        const isActive = link.getAttribute("href") === `#${id}`;
        link.classList.toggle("is-active", isActive);
    });
};

if ("IntersectionObserver" in window && sections.length > 0) {
    const observer = new IntersectionObserver(
        (entries) => {
            const visibleEntries = entries
                .filter((entry) => entry.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

            if (visibleEntries[0]?.target?.id) {
                activateLink(visibleEntries[0].target.id);
            }
        },
        {
            rootMargin: "-20% 0px -55% 0px",
            threshold: [0.2, 0.45, 0.7]
        }
    );

    sections.forEach((section) => observer.observe(section));
}
