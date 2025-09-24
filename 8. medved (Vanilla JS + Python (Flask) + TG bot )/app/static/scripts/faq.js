document.addEventListener("DOMContentLoaded", () => {
    const faqBlocks = document.querySelectorAll(".faq__block");
    const showMoreButton = document.querySelector(".faq_show");
    // Если вдруг вёрстка поменяется, убедись, что у .faq_show только одна кнопка,
    // иначе querySelector(".faq_show") будет работать только на первую

    // --------------------------------
    // ЛОГИКА ОТКРЫТИЯ/ЗАКРЫТИЯ КАЖДОГО FAQ-БЛОКА
    // --------------------------------
    faqBlocks.forEach((block) => {
        const info = block.querySelector(".faq__info");
        const text = block.querySelector(".faq__text");
        const arrow = block.querySelector(".icon-arrow");

        info.addEventListener("click", () => {
            // Закрываем все тексты и сбрасываем стрелки, кроме текущего
            faqBlocks.forEach((otherBlock) => {
                const otherText = otherBlock.querySelector(".faq__text");
                const otherArrow = otherBlock.querySelector(".icon-arrow");
                if (otherBlock !== block) {
                    otherText.style.display = "none";
                    if (otherArrow) {
                        otherArrow.style.transform = "rotate(45deg)";
                        otherArrow.style.marginTop = "-2px";
                        otherArrow.style.marginBottom = "0";
                    }
                }
            });

            // Переключаем видимость текста в текущем блоке
            if (text.style.display === "flex") {
                text.style.display = "none";
                if (arrow) {
                    arrow.style.transform = "rotate(45deg)";
                    arrow.style.marginTop = "-2px";
                    arrow.style.marginBottom = "0";
                }
            } else {
                text.style.display = "flex";
                if (arrow) {
                    arrow.style.transform = "rotate(-135deg)";
                    arrow.style.marginTop = "0";
                    arrow.style.marginBottom = "-2px";
                }
            }
        });
    });

    // --------------------------------
    // ЛОГИКА "ПОКАЗАТЬ ЕЩЁ" / "СКРЫТЬ"
    // --------------------------------
    // 1. Находим все элементы ниже кнопки “Показать ещё”.
    //    Будем их скрывать/показывать при ширине < 768px.
    if (showMoreButton) {
        const buttonParent = showMoreButton.closest(".faq__button");
        const hiddenElements = document.querySelectorAll(".show-close");
        // let nextSibling = buttonParent.nextElementSibling;
        //
        // // Собираем все элементы (блоки), идущие сразу после .faq__button
        // while (nextSibling) {
        //     hiddenElements.push(nextSibling);
        //     nextSibling = nextSibling.nextElementSibling;
        // }

        // 2. Функция, которая прячет блоки, если ширина < 768px
        //    И показывает их, если > 768px.
        let isHidden = true;

        function handleScreenWidth() {
            if (window.innerWidth < 768) {
                // Прячем всё ниже кнопки по умолчанию
                if (isHidden) {
                    hiddenElements.forEach(el => {
                        el.style.display = "none";
                    });
                    showMoreButton.textContent = "Показать еще";
                }
            } else {
                // Если > 768, показываем всё, игнорируя кнопку
                hiddenElements.forEach(el => {
                    el.style.display = "block";
                });
                // Чтобы при возвращении на < 768 всё снова пряталось корректно
                isHidden = true;
                showMoreButton.textContent = "Показать еще";
            }
        }

        handleScreenWidth(); // Запускаем проверку при загрузке
        window.addEventListener("resize", handleScreenWidth);

        // 3. Переключение по клику на кнопку
        showMoreButton.addEventListener("click", () => {
            // Работает только, если мы на мобильном (< 768px)
            if (window.innerWidth < 768) {
                if (isHidden) {
                    // Показываем всё
                    hiddenElements.forEach(el => {
                        el.style.display = "block";
                    });
                    showMoreButton.textContent = "Скрыть";
                } else {
                    // Скрываем обратно
                    hiddenElements.forEach(el => {
                        el.style.display = "none";
                    });
                    showMoreButton.textContent = "Показать еще";
                }
                isHidden = !isHidden;
            }
        });
    }
});
