document.addEventListener("DOMContentLoaded", () => {
    const sliderContainer = document.querySelector(".taking-care__blocks");
    let slides = [...document.querySelectorAll('.taking-care__block')];
    const dotsContainer = document.querySelector(".taking-care__dots");

    let currentIndex = 0;
    let startX = 0;
    let currentX = 0;
    let isSwiping = false;
    const SWIPE_THRESHOLD = 50; // Минимальное расстояние для переключения

    let slideWidth = 0;
    let dots = [];
    // -----------------------------
    // 1. Генерация точек по количеству слайдов
    // -----------------------------
    function createDots() {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = ""; // На случай повторной инициализации
        slides.forEach((slide, index) => {
            const dot = document.createElement("span");
            dot.classList.add("slider-dot");
            dot.addEventListener("click", () => {
                // При клике на точку — переход к соответствующему слайду
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

    // -----------------------------
    // 2. Включение / выключение “слайдера”
    // -----------------------------
    function enableSlider() {
        // Скрываем всё, что выходит за контейнер
        sliderContainer.style.overflow = "hidden";
        slideWidth = 284;
        updateSlidePosition();
    }

    function disableSlider() {
        // Возвращаем исходную верстку
        sliderContainer.style.overflow = "";
        currentIndex = 0;
        slides.forEach(slide => {
            slide.style.transform = "";
        });
    }

    // Сдвиг слайдов
    function updateSlidePosition() {
        /*
           Если у нас gap: 16px, то расстояние между карточками
           тоже нужно учитывать.
           offset = -currentIndex * (slideWidth + gap)
        */
        const gap = 16; // в @media (max-width: 767px) указано gap:16px
        const offset = -currentIndex * (284 + gap);

        slides.forEach(slide => {
            slide.style.transform = `translateX(${offset}px)`;
        });

        updateDots();
    }

    function handleLastDot() {
        const allDots = dotsContainer.querySelectorAll(".slider-dot");
        if (allDots.length >= 3) {
            if (sliderContainer.clientWidth > 384) {
                if (currentIndex === 2) {
                    currentIndex = 1;
                    updateSlidePosition();
                }
                allDots[2].style.display = "none";
            } else {
                // Во всех других случаях показываем
                allDots[2].style.display = "flex";
            }
        }
    }

    // -----------------------------
    // 3. Проверка ширины экрана
    // -----------------------------
    function checkViewport() {
        if (window.innerWidth < 767) {
            enableSlider();
        } else {
            disableSlider();
        }
        handleLastDot();
    }

    // -----------------------------
    // 4. Ловим свайпы (touch-события)
    // -----------------------------
    sliderContainer.addEventListener("touchstart", (e) => {
        if (window.innerWidth >= 767) return;
        isSwiping = true;
        startX = e.touches[0].clientX;
        currentX = startX;
    }, {passive: true});

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
                // Свайп влево => следующий
                currentIndex++;
            } else if (diff < 0 && currentIndex > 0) {
                // Свайп вправо => предыдущий
                currentIndex--;
            }
        }
        updateSlidePosition();
    });

    // Пересчитываем при изменении размера
    window.addEventListener("resize", () => {
        checkViewport();
        if (window.innerWidth < 767) {
            slideWidth = sliderContainer.clientWidth;
            updateSlidePosition();
        }
        if (sliderContainer.clientWidth > 384) {
            dotsContainer.querySelectorAll(".slider-dot")[2].style.display = "none"
        } else if (sliderContainer.clientWidth <= 284) {
            dotsContainer.querySelectorAll(".slider-dot")[2].style.display = "flex"
        }
    });

    // -----------------------------
    // 5. Инициализация
    // -----------------------------
    createDots();
    checkViewport();

    // if (window.innerWidth < 767) {
    //     slideWidth = sliderContainer.clientWidth;
    //     updateSlidePosition();
    // }
    // if (sliderContainer.clientWidth > 384) {
    //     dotsContainer.querySelectorAll(".slider-dot")[2].style.display = "none"
    // } else if (sliderContainer.clientWidth <= 284) {
    //     dotsContainer.querySelectorAll(".slider-dot")[2].style.display = "flex"
    // }

});