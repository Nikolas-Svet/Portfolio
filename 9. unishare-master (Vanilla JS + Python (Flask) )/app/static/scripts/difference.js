
document.addEventListener("DOMContentLoaded", () => {
    const tasks = document.querySelectorAll(".difference__task"); // Все элементы задач
    const texts = document.querySelectorAll(".difference__text > div"); // Все текстовые блоки
    const mobileTexts = document.querySelectorAll(".mobile_text"); // Мобильные текстовые блоки
    var flag = true

    // Функция для обработки логики в зависимости от ширины
    const handleResize = () => {
        if (window.innerWidth > 767) {
            console.log("Ширина больше 767 пикселей, включен функционал кликов по задачам.");

            tasks.forEach((task) => {
                task.classList.remove("active-mobile");
            })

            mobileTexts.forEach((text) => (text.classList.remove("mobile_active")));

            const texts = [
                document.querySelector(".text1"),
                document.querySelector(".text2"),
                document.querySelector(".text3"),
                document.querySelector(".text4")
            ];

            texts.forEach((text, index) => {
                console.log(1)
                if (text && text.style.opacity !== "0") {
                    console.log(tasks[index])
                    tasks[index].classList.add("active");
                    // tasks[Number(text[text.length - 1])]
                }
            });

            // Включаем функционал кликов
            tasks.forEach((task, index) => {
                task.addEventListener("click", () => {
                    if (window.innerWidth <= 767) {
                        return
                    }
                    // Удаляем класс active и сбрасываем opacity у всех задач и текстов
                    tasks.forEach((t) => t.classList.remove("active"));
                    texts.forEach((text) => {
                        text.style.opacity = "0";
                    });

                    // Добавляем класс active к выбранной задаче
                    task.classList.add("active");

                    // Показываем соответствующий текстовый блок
                    texts[index].style.opacity = "1";
                });
            });
        } else {
            console.log("Ширина меньше или равна 767 пикселям, включен функционал для мобильных.");

            if (flag) {
                setTimeout(() => {
                    mobileTexts.forEach(text => {
                        text.classList.remove("mobile_anim");
                        console.log(11, text.offsetHeight)
                        text.style.marginTop = `-${text.offsetHeight}px`;
                        setTimeout(() => {
                            text.classList.add("mobile_anim");
                        }, 300);
                    })
                },  55)
            }

            tasks.forEach((task, index) => {
                task.classList.remove("active"); // Убираем класс active для десктопа
                task.addEventListener("click", () => {
                    if (window.innerWidth > 767) {
                        return
                    }

                    if (task.classList.contains("active-mobile")) {
                        // Если задача уже активна, убираем класс и скрываем текст
                        task.classList.remove("active-mobile");
                        if (mobileTexts[index]) {
                            // mobileTexts[index].style.display = "none";
                            mobileTexts[index].classList.remove("mobile_active")
                        }
                    } else {
                        // Убираем класс active-mobile у всех задач и скрываем тексты
                        tasks.forEach((t) => t.classList.remove("active-mobile"));
                        // mobileTexts.forEach((text) => (text.style.display = "none"));
                        mobileTexts.forEach((text) => (text.classList.remove("mobile_active")));

                        // Добавляем класс active-mobile к текущей задаче
                        task.classList.add("active-mobile");

                        // Показываем соответствующий текстовый блок
                        if (mobileTexts[index]) {
                            // mobileTexts[index].style.display = "flex";
                            mobileTexts[index].classList.add("mobile_active")
                            flag = false
                        }
                    }
                });
            });
        }
    };

    // Вызываем функцию сразу при загрузке страницы
    handleResize();

    // Добавляем обработчик на изменение размеров окна
    window.addEventListener("resize", handleResize);
});
