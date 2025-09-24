const content = document.querySelector('.reviews__content');
const blocks = document.querySelectorAll('.reviews__block');

let isDragging = false;
let startX = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let maxTranslate = 0;
let minTranslate = 0;

function calculateBounds() {
    const contentWidth = content.offsetWidth;
    const blocksWidth = Array.from(blocks).reduce((acc, block) => acc + block.offsetWidth, 0);
    const gap = parseInt(getComputedStyle(content).gap) || 0;

    maxTranslate = 0;
    minTranslate = -(blocksWidth + gap * (blocks.length - 1) - contentWidth);
}

calculateBounds();
window.addEventListener('resize', calculateBounds);

/* -------------------------------
   ОБЩИЕ ФУНКЦИИ ДЛЯ ПОЛЗУНКА
------------------------------- */
function onDragStart(clientX) {
    isDragging = true;
    // Запоминаем, где нажали, с учётом текущего сдвига
    startX = clientX - currentTranslate;

    // Меняем курсор только для мыши (на мобильном не нужно)
    content.style.cursor = 'grabbing';

    // Отключаем выделение текста на всём документе
    document.body.style.userSelect = 'none';
}

function onDragMove(clientX) {
    if (!isDragging) return;
    // Сколько пикселей мы протащили
    const deltaX = clientX - startX;
    currentTranslate = deltaX;

    // Ограничиваем движение
    if (currentTranslate > maxTranslate) {
        currentTranslate = maxTranslate;
    } else if (currentTranslate < minTranslate) {
        currentTranslate = minTranslate;
    }

    content.style.transform = `translateX(${currentTranslate}px)`;
}

function onDragEnd() {
    isDragging = false;
    prevTranslate = currentTranslate;
    // Возвращаем курсор и выделение текста
    content.style.cursor = 'grab';
    document.body.style.userSelect = '';
}

/* -------------------------------
   ОБРАБОТЧИКИ ДЛЯ МЫШИ (DESKTOP)
------------------------------- */
content.addEventListener('mousedown', (e) => {
    // Отключаем дефолтное поведение (выделение)
    e.preventDefault();
    onDragStart(e.pageX);
});

content.addEventListener('mousemove', (e) => {
    e.preventDefault();
    onDragMove(e.pageX);
});

content.addEventListener('mouseup', () => {
    onDragEnd();
});

content.addEventListener('mouseleave', () => {
    // Если мышь ушла за пределы, как будто отпустили
    if (isDragging) {
        onDragEnd();
    }
});

/* -------------------------------
   ОБРАБОТЧИКИ ДЛЯ ТАЧ-СОБЫТИЙ (MOBILE)
------------------------------- */
content.addEventListener('touchstart', (e) => {
    // Если несколько пальцев — игнорируем (по желанию)
    if (e.touches.length > 1) return;

    // Можно отключить вертикальный скролл страницы
    // но только если точно хотим блокировать:
    // e.preventDefault(); // {passive: false} можно добавить

    onDragStart(e.touches[0].clientX);
}, { passive: true });

content.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    // Блокируем прокрутку страницы во время "перетаскивания"
    e.preventDefault(); // нужно указать {passive:false} при addEventListener

    onDragMove(e.touches[0].clientX);
}, { passive: false });

content.addEventListener('touchend', () => {
    if (isDragging) {
        onDragEnd();
    }
});

content.addEventListener('touchcancel', () => {
    if (isDragging) {
        onDragEnd();
    }
});
