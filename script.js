const menuButtons = document.querySelectorAll(".menu-toggle");

menuButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const nav = button.closest(".topbar")?.querySelector(".nav-links");
    if (!nav) return;

    nav.classList.toggle("is-open");
  });
});

document.querySelectorAll(".business-nav .nav-links a").forEach((link) => {
  link.addEventListener("click", () => {
    link.closest(".nav-links")?.classList.remove("is-open");
  });
});
