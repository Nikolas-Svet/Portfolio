document.addEventListener('DOMContentLoaded', () => {
    const breadcrumbLabels = {
        '/imprint/': 'Impressum',
        '/data-protection/': 'Datenschutz',
    };

    const breadcrumbLabel = breadcrumbLabels[window.location.pathname];
    if (breadcrumbLabel) {
        const titleLink = document.querySelector('.header__title-link');

        if (titleLink) {
            const breadcrumb = document.createElement('span');
            breadcrumb.className = 'header__breadcrumb';

            const homeLink = document.createElement('a');
            homeLink.href = '/';
            homeLink.className = 'header__breadcrumb-link';
            homeLink.textContent = '<Codezilla>';

            const arrow = document.createElement('span');
            arrow.className = 'header__breadcrumb-icon';

            breadcrumb.append(homeLink, arrow, document.createTextNode(breadcrumbLabel));
            titleLink.replaceWith(breadcrumb);
        }
    }

    const infoBlocks = document.querySelectorAll('.info-block__content');

    infoBlocks.forEach((block) => {
        const codeLines = block.querySelector('.code-lines');
        const lineNumbers = block.querySelector('.line-numbers');

        if (!codeLines || !lineNumbers) {
            return;
        }

        const updateLineNumbers = () => {
            lineNumbers.innerHTML = '';

            const codeLineElements = codeLines.querySelectorAll('.code-line');
            let totalLineCount = 0;

            codeLineElements.forEach((line) => {
                const computedStyle = window.getComputedStyle(line);
                const lineHeight = Number.parseFloat(computedStyle.lineHeight);

                if (!Number.isFinite(lineHeight) || lineHeight <= 0) {
                    return;
                }

                const height = line.offsetHeight;
                const visualLines = Math.max(1, Math.ceil(height / lineHeight));

                for (let index = 0; index < visualLines; index += 1) {
                    const lineNumber = document.createElement('div');
                    lineNumber.textContent = String(totalLineCount + 1).padStart(2, '0');
                    lineNumbers.appendChild(lineNumber);
                    totalLineCount += 1;
                }
            });
        };

        updateLineNumbers();

        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = window.setTimeout(updateLineNumbers, 100);
        });

        window.addEventListener('load', updateLineNumbers, { once: true });
    });
});

