document.addEventListener('DOMContentLoaded', () => {
    const sections = [
        {id: 'main', linkId: "nav_1"},
        {id: 'nav2', linkId: 'nav_2'},
        {id: 'nav3', linkId: 'nav_3'}
    ];

    const addActiveClass = () => {
        let lastVisibleIndex = -1;

        sections.forEach(({id, linkId}, index) => {
            const section = document.getElementById(id);
            const link = document.getElementById(linkId);
            if (!section || !link) return;

            const rect = section.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

            // Проверяем, виден ли текущий блок
            if (isVisible) {
                lastVisibleIndex = index; // Запоминаем индекс последнего видимого элемента
                link.classList.add('active_nav');
            } else {
                link.classList.remove('active_nav');
            }
        });

        // Деактивация всех элементов, которые выше последнего видимого
        sections.forEach(({linkId}, index) => {
            const link = document.getElementById(linkId);
            if (!link) return;

            if (index > lastVisibleIndex) {
                link.classList.remove('active_nav'); // Убираем класс у следующих элементов
            }
        });
    };

    window.addEventListener('scroll', addActiveClass);

    // Первоначальная проверка при загрузке страницы
    addActiveClass();


    const animScrollElements = document.querySelectorAll('.anim_scroll');

    const handleScrollAnimation = () => {
        animScrollElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight - 100 && rect.bottom > 100;

            if (isVisible) {
                if (element.textContent.trim() === "Zielgruppe") {
                    element.classList.add('anim_scroll_active2');
                } else {
                    element.classList.add('anim_scroll_active');
                }
            }
        });
    };

    window.addEventListener('scroll', handleScrollAnimation);

    // Первоначальная проверка при загрузке страницы
    handleScrollAnimation();
});
