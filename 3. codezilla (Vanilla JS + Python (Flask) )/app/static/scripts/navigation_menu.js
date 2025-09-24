document.addEventListener("DOMContentLoaded", () => {
    const navigationMenu = document.querySelector(".navigation_menu");
    navigationMenu.classList.add("hidden");

    setTimeout(() => {
        navigationMenu.classList.add("anim_menu");
    }, 50);
});

const openMenu = document.getElementById("rectangle");
const closeMenu = document.querySelector(".cancel_icon");

openMenu.addEventListener("click", () => {
    document.querySelector(".navigation_menu").classList.add("open");
});

closeMenu.addEventListener("click", () => {
    document.querySelector(".navigation_menu").classList.remove("open");
});
