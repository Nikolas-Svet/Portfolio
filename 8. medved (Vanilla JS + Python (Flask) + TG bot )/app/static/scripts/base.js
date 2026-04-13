document.addEventListener("DOMContentLoaded", function () {
    const reviewsLink = document.getElementById("go-reviews");
    const reviewsBlocks = document.querySelectorAll(".reviews__block");
    const navigationLinks = document.querySelectorAll('a[href^="#"]'); // Все якорные ссылки

    if (reviewsLink && reviewsBlocks.length > 0) {
        reviewsLink.addEventListener("click", function (event) {
            event.preventDefault();
            document.getElementById("reviews").scrollIntoView({ behavior: "smooth" });

            reviewsBlocks.forEach(block => block.classList.add("flash-effect"));
            setTimeout(() => reviewsBlocks.forEach(block => block.classList.remove("flash-effect")), 1000);
        });
    }

    navigationLinks.forEach(link => {
        link.addEventListener("click", function (event) {
            const targetId = this.getAttribute("href"); // Например, "#directions"

            if (window.location.pathname !== "/") {
                event.preventDefault();
                window.location.href = `/${targetId}`;
            }
        });
    });
});
