document.addEventListener("DOMContentLoaded", () => {
    const sliderContainer = document.querySelector(".mobile-block.info__images");
    const slides = document.querySelectorAll(".mobile-slider.call__images.info__img");
    const dotsContainer = document.querySelector(".slider-dots"); // Контейнер для точек

    // Текущий слайд
    let currentIndex = 0;
    // Для отслеживания касаний / курсора
    let startX = 0;
    let currentX = 0;
    let isSwiping = false;
    const SWIPE_THRESHOLD = 50;

    // Ширина одного слайда/экрана (пересчитываем при resize)
    let slideWidth = 0;

    // Массив для хранения созданных точек
    let dots = [];

    // -----------------------------
    // СОЗДАЕМ ТОЧКИ
    // -----------------------------
    function createDots() {
        // Очищаем контейнер на случай перезапуска
        dotsContainer.innerHTML = "";

        slides.forEach((slide, index) => {
            const dot = document.createElement("span");
            dot.classList.add("slider-dot");

            // При клике на точку – переход к слайду (опционально)
            dot.addEventListener("click", () => {
                currentIndex = index;
                updateSlidePosition();
                updateDots();
            });

            dotsContainer.appendChild(dot);
            dots.push(dot);
        });

        updateDots(); // сразу проставим активную точку
    }

    function updateDots() {
        // Делаем все точки неактивными
        dots.forEach(dot => dot.classList.remove("active"));
        // Активируем точку, соответствующую currentIndex
        if (dots[currentIndex]) {
            dots[currentIndex].classList.add("active");
        }
    }

    // -----------------------------
    // СЛАЙДЕРНЫЕ ФУНКЦИИ
    // -----------------------------
    function enableSlider() {
        sliderContainer.style.overflow = "hidden";
        slideWidth = sliderContainer.clientWidth;
        updateSlidePosition();
    }

    function disableSlider() {
        sliderContainer.style.overflow = "";
        currentIndex = 0;
        slides.forEach(slide => {
            slide.style.transform = "";
        });
    }

    function updateSlidePosition() {
        // Смещение = -индекс * (ширина + 16px gap, если у вас есть отступ)
        const offset = -currentIndex * (slideWidth + 16);

        slides.forEach(slide => {
            slide.style.transform = `translateX(${offset}px)`;
        });

        // Обновляем точки
        updateDots();
    }

    function checkViewport() {
        if (window.innerWidth < 767) {
            enableSlider();
        } else {
            disableSlider();
        }
    }

    // -----------------------------
    // TOUCH-СОБЫТИЯ
    // -----------------------------
    sliderContainer.addEventListener("touchstart", (e) => {
        if (window.innerWidth >= 767) return;
        isSwiping = true;
        startX = e.touches[0].clientX;
        currentX = startX;
    }, { passive: true });

    sliderContainer.addEventListener("touchmove", (e) => {
        if (!isSwiping || window.innerWidth >= 767) return;
        currentX = e.touches[0].clientX;
    });

    sliderContainer.addEventListener("touchend", () => {
        if (!isSwiping || window.innerWidth >= 767) return;
        isSwiping = false;

        const diff = startX - currentX;
        if (Math.abs(diff) > SWIPE_THRESHOLD) {
            if (diff > 0 && currentIndex < slides.length - 1) {
                // Свайп влево => следующий слайд
                currentIndex++;
            } else if (diff < 0 && currentIndex > 0) {
                // Свайп вправо => предыдущий слайд
                currentIndex--;
            }
        }
        updateSlidePosition();
    });

    // -----------------------------
    // MOUSE-СОБЫТИЯ (если нужно свайп мышью)
    // -----------------------------
    // Можете добавить аналогично, если хочется и на десктопе «драг»:
    // mousedown / mousemove / mouseup и т.д.

    // -----------------------------
    // РЕСАЙЗ
    // -----------------------------
    window.addEventListener("resize", () => {
        checkViewport();
        if (window.innerWidth < 767) {
            slideWidth = sliderContainer.clientWidth;
            updateSlidePosition();
        }
    });

    // -----------------------------
    // ИНИЦИАЛИЗАЦИЯ
    // -----------------------------
    createDots();   // Создаем точки (по количеству slides)
    checkViewport();
});
