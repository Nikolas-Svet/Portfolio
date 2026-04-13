document.addEventListener("DOMContentLoaded", () => {
    // Проверяем текущий путь
    if (window.location.pathname !== "/") {
        // Получаем элементы с классом header__nav
        const navElements = document.querySelectorAll(".header__nav");

        // Устанавливаем display: none для каждого элемента
        navElements.forEach(nav => {
            nav.style.display = "none";
        });
    }
});
