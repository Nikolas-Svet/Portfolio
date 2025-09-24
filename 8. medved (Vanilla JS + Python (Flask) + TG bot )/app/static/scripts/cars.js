document.addEventListener("DOMContentLoaded", () => {
    const SWIPE_THRESHOLD = 50;

    // Находим все контейнеры для слайдов
    const allSliders = document.querySelectorAll(".info-cars__cars");

    // Функция инициализации слайдера
    function initSlider(container) {
        const slides = container.querySelectorAll(".info-cars__car");
        if (!slides.length) return;

        // Находим контейнер для точек — .info-cars__dots,
        // обычно идёт сразу после container (или ищем в .info-cars__content)
        let dotsContainer = container.parentNode.querySelector(".info-cars__dots");
        if (!dotsContainer) return;

        // --- Локальные переменные для слайдера ---
        let currentIndex = 0;
        let startX = 0;
        let currentX = 0;
        let isSwiping = false;
        let slideWidth = 0;
        let gap = 24; // дефолтный gap из ваших стилей (можно изменить на 16, если нужно)

        // Массив для хранения созданных точек
        let dots = [];

        // 1) Создаём точки (по количеству слайдов)
        function createDots() {
            dotsContainer.innerHTML = ""; // Очищаем на случай повторной инициализации
            slides.forEach((slide, index) => {
                const dot = document.createElement("span");
                dot.classList.add("info-cars__dot");
                dot.addEventListener("click", () => {
                    currentIndex = index;
                    updateSlidePosition();
                    updateDots();
                });
                dotsContainer.appendChild(dot);
                dots.push(dot);
            });
            updateDots();
        }

        // Подсвечиваем активную точку
        function updateDots() {
            dots.forEach(dot => dot.classList.remove("active"));
            if (dots[currentIndex]) {
                dots[currentIndex].classList.add("active");
            }
        }

        // 2) Включение / отключение “слайдера”
        function enableSlider() {
            container.style.overflow = "hidden";
            slideWidth = 310;
            updateSlidePosition();
        }

        function disableSlider() {
            container.style.overflow = "";
            currentIndex = 0;
            slides.forEach(slide => {
                slide.style.transform = "";
            });
            updateDots();
        }

        // Обновляем позицию слайдов
        function updateSlidePosition() {
            // Пример: offset = -текущийИндекс * (slideWidth + gap)
            // У вас gap может быть 16 или 24. Подгоните под фактический gap на мобиле.
            const offset = -currentIndex * (310 + gap);
            slides.forEach(slide => {
                slide.style.transform = `translateX(${offset}px)`;
            });
            updateDots();
        }

        function handleLastDot() {
            const allDots = dotsContainer.querySelectorAll(".info-cars__dot");
            // Убедимся, что есть 5 точек (индекс 4)
            if (allDots.length >= 5) {
                // Если ширина 684 < x < 767, скрываем точку [4]
                if (window.innerWidth > 684 && window.innerWidth < 767) {
                    // Если текущая точка была 4-й и мы её прячем — уводим фокус на 3-ю
                    if (currentIndex === 4) {
                        currentIndex = 3;
                        updateSlidePosition();
                    }
                    allDots[4].style.display = "none";
                } else {
                    // Во всех других случаях показываем
                    allDots[4].style.display = "flex";
                }
            }
        }

        // 3) Проверка ширины
        function checkViewport() {
            if (window.innerWidth < 767) {
                enableSlider();
            } else {
                disableSlider();
            }
            handleLastDot();
        }

        // 4) События “свайпа” (touch)
        container.addEventListener("touchstart", (e) => {
            if (window.innerWidth >= 767) return;
            isSwiping = true;
            startX = e.touches[0].clientX;
            currentX = startX;
        }, {passive: true});

        container.addEventListener("touchmove", (e) => {
            if (!isSwiping || window.innerWidth >= 767) return;
            currentX = e.touches[0].clientX;
        });

        container.addEventListener("touchend", () => {
            if (!isSwiping || window.innerWidth >= 767) return;
            isSwiping = false;
            const diff = startX - currentX;

            if (Math.abs(diff) > SWIPE_THRESHOLD) {
                if (diff > 0 && currentIndex < slides.length - 1) {
                    // Свайп влево => следующий
                    currentIndex++;
                } else if (diff < 0 && currentIndex > 0) {
                    // Свайп вправо => предыдущий
                    currentIndex--;
                }
            }
            updateSlidePosition();
        });

        // 5) Слушаем resize
        window.addEventListener("resize", () => {
            checkViewport();
            if (window.innerWidth < 767) {
                slideWidth = 310;
                updateSlidePosition();
            }
        });

        // 6) Инициализация
        createDots();
        checkViewport();
    }

    // Инициализируем слайдер для каждого .info-cars__cars
    allSliders.forEach(sliderContainer => {
        initSlider(sliderContainer);
    });
});