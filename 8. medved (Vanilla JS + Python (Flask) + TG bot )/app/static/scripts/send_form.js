document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector(".call__content");
    if (!form) {
        console.error("Ошибка: Форма .call__content не найдена в DOM.");
        return;
    }

    const submitButton = document.querySelector(".call__send");
    const submitButtonReview = document.querySelector(".call__send__review");

    const inputsReview = [
        document.querySelector('.call__message__review'),
        document.querySelector('.call__fullname__review'),
        document.querySelector('.call__city'),
        document.querySelector('.call__reviews'),
    ].filter(input => input !== null);

    submitButtonReview.addEventListener("click", (e) => {
        event.preventDefault();


        inputsReview.forEach((input) => {
            const wasValid = validationState.get(input);
            const isValid = validateField(input);

            if (!isValid) {
                if (wasValid !== false) {
                    input.classList.add("invalid");
                }
                validationState.set(input, false);
                isFormValid = false;
            } else {
                validationState.set(input, true);
            }
        });

    })

    const inputs = [
        document.querySelector('.call__fullname'),
        document.querySelector('.call__message'),
        document.querySelector('.call__phone'),
        document.querySelector('.call__email'),
        document.querySelector('.trip__main')
    ]
    const phoneInput = form.querySelector(".call__phone");
    const fullnameInput = form.querySelector(".call__fullname");
    const emailInput = form.querySelector(".call__email");
    const messageInput = form.querySelector(".call__message");
    const directionElement = document.getElementById("trip_main");

    if (!phoneInput || !fullnameInput || !emailInput || !messageInput || !directionElement) {
        console.error("Ошибка: Один или несколько элементов формы не найдены.");
        return;
    }

    // Обработчик для поля телефона
    phoneInput.addEventListener("focus", () => {
        if (!phoneInput.value.startsWith("+7")) {
            phoneInput.value = "+7 ";
        }
    });

    phoneInput.addEventListener("blur", () => {
        if (phoneInput.value.trim() === "+7") {
            phoneInput.value = "";
        }
    });

    phoneInput.addEventListener("input", () => {
        let value = phoneInput.value.replace(/\D/g, "").substring(0, 11);

        let formattedValue = "+7 ";
        if (value.length > 1) formattedValue += value.substring(1, 4);
        if (value.length >= 5) formattedValue += " " + value.substring(4, 7);
        if (value.length >= 8) formattedValue += " " + value.substring(7, 9);
        if (value.length >= 10) formattedValue += " " + value.substring(9, 11);

        phoneInput.value = formattedValue;

        const cursorPosition = phoneInput.value.length;
        phoneInput.setSelectionRange(cursorPosition, cursorPosition);
    });

    const validationState = new Map();

    const validateField = (field) => {
        if (field.classList.contains("trip__main") || field.classList.contains("call__reviews")) {
            if (field.innerText === "Выберите направление") {
                document.getElementById('selects').classList.add("invalid");
                return true
            }
            if (field.innerText === "Выберите ваш балл для сервиса") {
                document.getElementById('review-selects').classList.add("invalid");
                return true
            }
            return true
        }
        if (field.classList.contains("call__message")) {
            return field.value !== "";
        }
        if (field.classList.contains("call__message__review")) {
            return field.value !== "";
        }
        if (field.classList.contains("call__email")) return true;
        if (field.tagName === "SELECT") return field.value !== "";
        return field.value.trim() !== "";
    };

    submitButton.addEventListener("click", async (event) => {
        event.preventDefault();

        let isFormValid = true;

        inputs.forEach((input) => {
            const wasValid = validationState.get(input);
            const isValid = validateField(input);

            if (!isValid) {
                if (wasValid !== false) {
                    input.classList.add("invalid");
                }
                validationState.set(input, false);
                isFormValid = false;
            } else {
                validationState.set(input, true);
            }
        });

        if (isFormValid) {
            const direction = directionElement.textContent.trim() === "Выберите направление"
                ? "Не выбрано"
                : directionElement.textContent.trim();

            try {
                directionElement.textContent === "Выберите направление"
                const data = {
                    fullname: fullnameInput.value,
                    phone: phoneInput.value,
                    email: emailInput.value,
                    direction: direction,
                    message: messageInput.value,
                };

                const response = await fetch("/api/tg_bot/", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(data),
                });

                if (response.ok) {
                    form.reset();
                } else {
                    console.error("Ошибка при отправке заявки.");
                }
            } catch (error) {
                console.error("Сетевая ошибка:", error);
            }
        }
    });

    inputs.forEach((input) => {
        input.addEventListener("input", () => {
            if (validateField(input)) {
                input.classList.remove("invalid");
                validationState.set(input, true);
            }
        });
    });

    inputsReview.forEach((input) => {
        input.addEventListener("input", () => {
            input.classList.remove("invalid");
            validationState.set(input, true);
        });
    });
});
