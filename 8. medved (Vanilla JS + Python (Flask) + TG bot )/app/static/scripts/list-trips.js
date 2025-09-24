document.addEventListener("DOMContentLoaded", () => {
    // Получаем все элементы для десктопной версии
    const rows = document.querySelectorAll(".main__block-row");
    // Получаем все элементы для мобильной версии
    const rowsMobile = document.querySelectorAll(".main-mobile__timing");

    rows.forEach(row => {
        row.addEventListener("click", () => {
            const parentBlock = row.closest(".main__block");
            const relatedInfoBlocks = parentBlock.querySelectorAll(".main__block-info");
            const arrow = row.querySelector(".icon-arrow");

            const isAnyBlockOpen = Array.from(relatedInfoBlocks).some(info => info.style.display === "flex");

            document.querySelectorAll(".main__block-info").forEach(info => {
                info.style.display = "none";
            });
            document.querySelectorAll(".icon-arrow").forEach(icon => {
                icon.style.transform = "rotate(45deg)";
                icon.style.marginTop = "-2px";
            });

            if (!isAnyBlockOpen) {
                relatedInfoBlocks.forEach(info => {
                    info.style.display = "flex";
                });
                arrow.style.transform = "rotate(-135deg)";
                arrow.style.marginTop = "4px";
            }
        });
    });

    window.addEventListener('resize', calculateInfo);

    function calculateInfo() {
        const mainBackground = document.querySelector(".main__background");
        const infoContent = document.querySelector(".info__content");
        if (window.innerWidth > 767) {
            mainBackground.style.marginBottom = "0";
            infoContent.style.paddingTop = "0";
        } else {
            if (infoContent.style.paddingTop === "0px") {
                const main_mobile_info = document.querySelectorAll(".main-mobile__info");
                main_mobile_info.forEach((info) => {
                    info.style.display = "none";
                })
                mainBackground.style.marginBottom = "-520px";
                infoContent.style.paddingTop = "370px";
            }
        }
    }

    rowsMobile.forEach(row => {
        row.addEventListener("click", () => {
            const parentBlock = row.closest(".main-mobile__trip");
            const infoBlock = parentBlock.querySelector(".main-mobile__info");
            const arrow = row.querySelectorAll(".arrow")[0];
            const buy = parentBlock.querySelector(".main-mobile__buy")
            const mainBackground = document.querySelector(".main__background");
            const infoContent = document.querySelector(".info__content");

            const isBlockOpen = infoBlock.style.display === "block";

            document.querySelectorAll(".main-mobile__info").forEach(info => {
                info.style.display = "none";
            });
            document.querySelectorAll(".main-mobile__timing .arrow").forEach(icon => {
                icon.style.transform = "rotate(0)";
            });
            document.querySelectorAll(".main-mobile__buy").forEach(buy => {
                buy.classList.remove("main-mobile__active")
            });

            mainBackground.style.marginBottom = "-520px";

            infoContent.style.paddingTop = "370px";

            if (!isBlockOpen) {
                infoBlock.style.display = "block";
                mainBackground.style.marginBottom = `calc(-520px - ${infoBlock.offsetHeight}px)`
                infoContent.style.paddingTop = `calc(370px + ${infoBlock.offsetHeight}px)`;
                arrow.style.transform = "rotate(90deg)";
                buy.classList.add("main-mobile__active");
            }
        });
    });
});
