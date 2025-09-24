document.addEventListener("DOMContentLoaded", function () {
    if (window.location.pathname === "/imprint/") {
        const codezillaElement = document.querySelectorAll(".header__justify-content-top a")[1];

        if (codezillaElement) {
            codezillaElement.outerHTML = `
                <span class="no-index-page"><a href="/">&lt;Codezilla&gt;</a><span class="icon_arrow"></span>Impressum</span>
            `;
        }
    }

    if (window.location.pathname === "/data-protection/") {
        const codezillaElement = document.querySelectorAll(".header__justify-content-top a")[1];

        if (codezillaElement) {
            codezillaElement.outerHTML = `
                <span class="no-index-page"><a href="/">&lt;Codezilla&gt;</a><span class="icon_arrow"></span>Datenschutz</span>
            `;
        }
    }
});

document.addEventListener("DOMContentLoaded", function() {
    const infoBlocks = document.querySelectorAll('.info-block__content');

    infoBlocks.forEach(block => {
        const codeLines = block.querySelector('.code-lines');
        const lineNumbers = block.querySelector('.line-numbers');

        // Функция для обновления номеров строк
        function updateLineNumbers() {
            // Очистить текущие номера строк
            lineNumbers.innerHTML = '';

            // Получить все элементы с классом .code-line
            const codeLineElements = codeLines.querySelectorAll('.code-line');

            // Переменная для общего количества визуальных строк
            let totalLineCount = 0;

            // Обойти каждый элемент .code-line и подсчитать количество визуальных строк
            codeLineElements.forEach(line => {
                // Определить количество визуальных строк для каждого .code-line
                const computedStyle = window.getComputedStyle(line);
                const lineHeight = parseFloat(computedStyle.lineHeight);
                const height = line.offsetHeight;

                // Рассчитать количество строк, которые занимает данная строка
                const visualLines = Math.ceil(height / lineHeight);

                // Добавить соответствующее количество номеров строк
                for (let i = 0; i < visualLines; i++) {
                    const lineNumber = document.createElement('div');
                    lineNumber.textContent = (totalLineCount + 1).toString().padStart(2, '0');
                    lineNumbers.appendChild(lineNumber);
                    totalLineCount++;
                }
            });
        }

        // Изначальное обновление номеров строк
        updateLineNumbers();

        // Обновление номеров при изменении размера окна с задержкой
        let resizeTimeout;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(updateLineNumbers, 100);
        });

        // Обновление номеров после загрузки всех ресурсов
        window.addEventListener('load', updateLineNumbers);
    });
});


