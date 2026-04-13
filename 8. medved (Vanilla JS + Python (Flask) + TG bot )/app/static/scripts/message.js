const message = document.querySelector(".message");
const message_block = document.querySelector(".message__block");
const message_wrap = document.querySelector(".message__wrap");

message.addEventListener("click", () => {
    message_wrap.style.display = "block";
    message_block.style.display = "flex";
    setTimeout(() => {
        message_block.style.zIndex = "101";
        message_block.style.opacity = "1";
    }, 10)
})

message_wrap.addEventListener("click", () => {
    message_wrap.style.display = "none";
    message_block.style.opacity = "0";
    setTimeout(() => {
        message_block.style.display = "none"
        message_block.style.zIndex = "-100";
    }, 300);
})

document.addEventListener("DOMContentLoaded", () => {
    const messageBackground = document.querySelector(".message__background");

    function checkViewport() {
        if (!messageBackground) return; // Если элемента нет, ничего не делаем

        if (window.innerWidth < 767) {
            // Переносим содержимое message__background в его родителя перед удалением
            while (messageBackground.firstChild) {
                messageBackground.parentNode.insertBefore(messageBackground.firstChild, messageBackground);
            }
            // Удаляем пустой message__background
            messageBackground.remove();
        }
    }

    // Запускаем проверку при загрузке страницы
    checkViewport();

    // Добавляем обработчик на изменение размера окна
    window.addEventListener("resize", checkViewport);
});
