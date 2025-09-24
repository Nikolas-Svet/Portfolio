const swiper = new Swiper('.reviews', {
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
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    on: {
        slideChangeTransitionStart: function () {
            setTimeout(() => {
                const swiperContainer = document.querySelector('.swiper');
                swiperContainer.classList.add('shake');
            }, 250)
        },
        slideChangeTransitionEnd: function () {
            const swiperContainer = document.querySelector('.swiper');
            setTimeout(() => {
                swiperContainer.classList.remove('shake');
            }, 500);
        }
    }

});