const reviewsSlider = document.querySelector('.reviews');

if (reviewsSlider && typeof Swiper !== 'undefined') {
    new Swiper(reviewsSlider, {
        speed: 500,
        loop: true,
        centeredSlides: true,
        autoplay: {
            delay: 2000,
            disableOnInteraction: false,
        },
        slidesPerView: 'auto',
        spaceBetween: 40,
        watchOverflow: true,
        on: {
            slideChangeTransitionStart() {
                window.setTimeout(() => {
                    reviewsSlider.classList.add('shake');
                }, 250);
            },
            slideChangeTransitionEnd() {
                window.setTimeout(() => {
                    reviewsSlider.classList.remove('shake');
                }, 500);
            },
        },
    });
}
