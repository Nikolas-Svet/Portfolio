document.addEventListener('DOMContentLoaded', () => {
    // Список страниц, для которых нужно применить класс
    const pagesWithDesignTwo = ['/cars/', '/children/', '/services/', '/about-us/'];

    // Получаем текущий путь из URL
    const currentPath = window.location.pathname;

    // Проверяем, если путь есть в списке, добавляем класс к body
    if (pagesWithDesignTwo.includes(currentPath)) {
        document.body.classList.add('designTwo');
    }
});
