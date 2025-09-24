document.addEventListener('DOMContentLoaded', () => {
    const icon_close = document.querySelector('.icon-close');
    const call_cancel = document.querySelector('.call__cancel');

    const message_call = document.querySelector('.message__call');
    const header_call = document.querySelector('.header__call');
    const header_call2 = document.querySelector('.header__call2');
    const footer_call = document.querySelector('.footer__call');
    const children_call = document.querySelector('.children__call');
    const question_call = document.querySelector('.question__call');
    const header_right = document.querySelector('.header-right__call');
    const header_right2 = document.querySelector('.header-right__call2');
    const header_right3 = document.querySelector('.header-right__call3');
    const header_right4 = document.querySelector('.header-right__call4');
    const header_right5 = document.querySelector('.header-right__call5');
    const header_right6 = document.querySelector('.header-right__call6');
    const message__call__sidebar = document.querySelector('.message__call__sidebar');
    const about_us = document.querySelector('.about-us__call');
    const about_us3 = document.querySelector('.about-us__call3');
    const review = document.querySelector('.call__rev');
    const images = document.querySelectorAll('.call__images');
    if (images) {
        images.forEach(image => {
            image.addEventListener('click', () => {
                openCall("Заказать перевозку");
            })
        })
    }

    if (review) {
        review.addEventListener('click', () => {
            openCall("Оставить отзыв");
        })
    }

    const selects = document.getElementById('selects');

    const review_selects = document.getElementById('review-selects');

    if (review_selects) {
        review_selects.addEventListener('click', () => {
            const arrow_review = document.getElementById('review-icon-arrow');
            const call__review = document.getElementById('reviews__selects');
            const tripMainReviews = document.getElementById('review_main');
            if (review_selects.classList.contains("invalid")) {
                review_selects.classList.remove("invalid");
            }

            // Проверка, открыт ли уже select, чтобы избежать повторного открытия
            if (call__review.style.display === 'flex') {
                call__review.style.display = 'none';
                arrow_review.style.transform = 'rotate(0deg)'; // возвращаем стрелку в исходное положение
                review_selects.style.boxShadow = 'none';
            } else {
                call__review.style.display = 'flex';
                arrow_review.style.transform = 'rotate(-180deg)';
                review_selects.style.boxShadow = '0 0 8px 3px rgba(0, 0, 0, 0.1)';
            }

            // Добавляем обработчик на закрытие при клике вне элемента
            document.addEventListener('click', (e) => {
                if (!review_selects.contains(e.target)) {
                    call__review.style.display = 'none';
                    arrow_review.style.transform = 'rotate(0deg)';
                    review_selects.style.boxShadow = 'none';
                }
            });
        })
    }

    const reviews = document.querySelectorAll('.call__review');

    reviews.forEach(review => {
        review.addEventListener('click', () => {
            const reviewMain = document.getElementById('review_main');

            // Очищаем содержимое перед вставкой
            reviewMain.innerHTML = '';

            // Копируем текст
            const selectedReviewText = review.firstChild.textContent.trim();
            reviewMain.appendChild(document.createTextNode(selectedReviewText));

            // Копируем блок со звёздами
            const starsBlock = review.querySelector('.call__stars');
            if (starsBlock) {
                const starsClone = starsBlock.cloneNode(true); // Клонируем звёзды

                // Определяем количество звёзд
                const starCount = starsClone.children.length;

                // Удаляем старые классы review1-review5
                starsClone.classList.remove("review1", "review2", "review3", "review4", "review5");

                // Добавляем нужный класс в зависимости от количества звёзд
                if (starCount >= 1 && starCount <= 5) {
                    starsClone.classList.add(`review${starCount}`);
                }

                reviewMain.appendChild(starsClone); // Добавляем звёзды в `review_main`
            }

            // Устанавливаем disabled на выбранный элемент
            reviews.forEach(item => {
                if (item === review) {
                    item.classList.add('disabled');
                    item.setAttribute('disabled', 'true');
                } else {
                    item.classList.remove('disabled');
                    item.removeAttribute('disabled');
                }
            });

            // Закрываем select после выбора
            document.getElementById('reviews__selects').style.display = 'none';
            document.getElementById('review-icon-arrow').style.transform = 'rotate(0deg)';
            document.getElementById('review-selects').style.boxShadow = 'none';
        });
    });


    if (header_right3) {
        header_right3.addEventListener('click', () => {
            openCall("Междугородние перевозки");
        })
    }

    if (header_right6) {
        header_right6.addEventListener('click', () => {
            closeSidebar()
            setTimeout(() => {
                openCall("Междугородние перевозки");
            }, 300)
        })
    }
    if (message__call__sidebar) {
        message__call__sidebar.addEventListener('click', () => {
            closeSidebar()
            setTimeout(() => {
                openCall("Обратный звонок");
            }, 300)
        })
    }

    function closeSidebar() {
        const sidebar = document.querySelector('.sidebar');
        const sidebar_wrap = document.querySelector('.sidebar__wrap');

        sidebar.style.transform = 'translateX(100%)';
        sidebar_wrap.style.opacity = '0';
        setTimeout(() => {
            sidebar_wrap.style.zIndex = '-110';
            sidebar.style.zIndex = '-112';
        }, 300)
    }

    if (header_right5) {
        header_right5.addEventListener('click', () => {
            closeSidebar()
            setTimeout(() => {
                openCall("Обслуживание корпоративов");
            }, 300)
        })
    }

    if (header_right4) {
        header_right4.addEventListener('click', () => {
            closeSidebar()
            setTimeout(() => {
                openCall("Доставка сотрудников");
            }, 300)
        })
    }


    if (selects) {
        selects.addEventListener('click', (event) => {
            const arrow = document.getElementById('icon-arrow');
            const call__selects = document.getElementById('call__selects');
            const tripMain = document.getElementById('trip_main');
            if (selects.classList.contains("invalid")) {
                selects.classList.remove("invalid");
            }

            // Проверка, открыт ли уже select, чтобы избежать повторного открытия
            if (call__selects.style.display === 'flex') {
                call__selects.style.display = 'none';
                arrow.style.transform = 'rotate(0deg)'; // возвращаем стрелку в исходное положение
                selects.style.boxShadow = 'none';
            } else {
                call__selects.style.display = 'flex';
                arrow.style.transform = 'rotate(-180deg)';
                selects.style.boxShadow = '0 0 8px 3px rgba(0, 0, 0, 0.1)';
            }

            // Добавляем обработчик на закрытие при клике вне элемента
            document.addEventListener('click', (e) => {
                if (!selects.contains(e.target)) {
                    call__selects.style.display = 'none';
                    arrow.style.transform = 'rotate(0deg)';
                    selects.style.boxShadow = 'none';
                }
            });
        });

        // Обработчик клика по каждому элементу trip
        const trips = document.querySelectorAll('.call__select');

        trips.forEach(trip => {
            trip.addEventListener('click', () => {
                const selectedTripText = trip.textContent || trip.innerText;
                const tripMain = document.getElementById('trip_main');

                tripMain.textContent = selectedTripText;  // Присваиваем текст в контейнер

                if (selectedTripText === 'Заказная перевозка (точный маршрут в сообщении)') {
                    tripMain.textContent = 'Заказная перевозка';
                }

                // Устанавливаем disabled на выбранный элемент
                trips.forEach(item => {
                    if (item === trip) {
                        item.classList.add('disabled');  // Добавляем класс disabled
                        item.setAttribute('disabled', 'true'); // Можно также добавить атрибут disabled
                    } else {
                        item.classList.remove('disabled'); // Убираем класс disabled с других элементов
                        item.removeAttribute('disabled'); // Убираем атрибут disabled
                    }
                });

                // Закрываем select после выбора
                document.getElementById('call__selects').style.display = 'none';
                document.getElementById('icon-arrow').style.transform = 'rotate(0deg)';
                selects.style.boxShadow = 'none';
            });
        });
    }

    if (header_right) {
        header_right.addEventListener('click', (e) => {
            openCall("Обслуживание корпоративов");
        });
    }
    if (about_us) {
        about_us.addEventListener('click', (e) => {
            openCall("Заказать перевозку");
        });
    }

    if (about_us3) {
        about_us3.addEventListener('click', (e) => {
            openCall("Обратный звонок");
        });
    }

    if (header_right2) {
        header_right2.addEventListener('click', (e) => {
            openCall("Доставка сотрудников");
        });
    }

    if (message_call) {
        message_call.addEventListener('click', (e) => {
            openCall("Обратный звонок");
        });
    }

    if (children_call) {
        children_call.addEventListener('click', (e) => {
            openCall("Заказать перевозку");
        });
    }


    footer_call.addEventListener('click', (e) => {
        openCall("Заказать перевозку")
    })

    header_call.addEventListener('click', (e) => {
        openCall("Заказать перевозку")
    })
    header_call2.addEventListener('click', (e) => {
        closeSidebar()
        setTimeout(() => {
            openCall("Заказать перевозку")
        }, 300)
    })

    if (question_call) {
        question_call.addEventListener('click', (e) => {
            openCall("Обратный звонок")
        })
    }

    icon_close.addEventListener('click', () => {
        const call = document.querySelector('.call');
        const call_wrap = document.querySelector('.call__wrap');
        const main_text = document.getElementById('main_text');

        call.style.transform = 'translateX(100%)';
        call_wrap.style.opacity = '0';
        setTimeout(() => {
            call_wrap.style.zIndex = '-110';
            call.style.zIndex = '-112';
            main_text.textContent = '';
        }, 300)

    })

    call_cancel.addEventListener('click', () => {
        const call = document.querySelector('.call');
        const call_wrap = document.querySelector('.call__wrap');
        const main_text = document.getElementById('main_text');

        call.style.transform = 'translateX(100%)';
        call_wrap.style.opacity = '0';
        document.body.style.overflow = 'auto';
        document.body.style.height = 'auto';
        setTimeout(() => {
            call_wrap.style.zIndex = '-110';
            call.style.zIndex = '-112';
            main_text.textContent = '';
        }, 300)

    })

    function openCall(text) {
        if (text === "Оставить отзыв") {
            document.getElementById('call__fullname').style.display = 'none';
            document.getElementById('call__fullname__review').style.display = 'block';
            document.getElementById('call__message__review').style.display = 'block';
            document.getElementById('call__message').style.display = 'none';
            document.getElementById('call__phone').style.display = 'none';
            document.getElementById('call__email').style.display = 'none';
            document.getElementById('call__trips').style.display = 'none';
            document.getElementById('call__city').style.display = 'block';
            document.getElementById('call__reviews').style.display = 'block';
            document.querySelector('.call__send').style.display = 'none';
            document.querySelector('.call__send__review').style.display = 'block';
        } else {
            document.getElementById('call__fullname').style.display = 'block';
            document.getElementById('call__fullname__review').style.display = 'none';
            document.getElementById('call__message__review').style.display = 'none';
            document.getElementById('call__message').style.display = 'block';
            document.getElementById('call__phone').style.display = 'block';
            document.getElementById('call__email').style.display = 'block';
            document.getElementById('call__trips').style.display = 'block';
            document.getElementById('call__city').style.display = 'none';
            document.getElementById('call__reviews').style.display = 'none';
            document.querySelector('.call__send').style.display = 'block';
            document.querySelector('.call__send__review').style.display = 'none';
        }
        const call = document.querySelector('.call');
        const call_wrap = document.querySelector('.call__wrap');
        const main_text = document.getElementById('main_text');
        // const tripMain = document.getElementById('trip_main');
        // tripMain.textContent = 'Выберите направление';
        document.body.style.overflow = 'hidden';
        document.body.style.height = '100dvh';

        call_wrap.addEventListener('click', (e) => {
            call.style.transform = 'translateX(100%)';
            document.body.style.overflow = 'auto';
            document.body.style.height = 'auto';
            call_wrap.style.opacity = '0';
            setTimeout(() => {
                call_wrap.style.zIndex = '-110';
                call.style.zIndex = '-112';
                main_text.textContent = '';
            }, 300)

        })

        call.style.transform = 'translateX(0)';
        call.style.zIndex = '112';
        call_wrap.style.opacity = '1';
        call_wrap.style.zIndex = '110';

        main_text.textContent = text;

    }
});
