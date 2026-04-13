document.addEventListener('DOMContentLoaded', () => {
    const navigationMenu = document.querySelector('.navigation_menu');
    const openMenu = document.getElementById('rectangle');
    const closeMenu = document.querySelector('.navigation_menu__close');

    if (!navigationMenu) {
        return;
    }

    navigationMenu.classList.add('hidden');

    window.setTimeout(() => {
        navigationMenu.classList.add('navigation_menu--anim');
    }, 50);

    if (openMenu) {
        openMenu.addEventListener('click', () => {
            navigationMenu.classList.add('open');
        });
    }

    if (closeMenu) {
        closeMenu.addEventListener('click', () => {
            navigationMenu.classList.remove('open');
        });
    }
});
