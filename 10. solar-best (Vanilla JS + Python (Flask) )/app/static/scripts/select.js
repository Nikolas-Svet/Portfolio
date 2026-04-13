document.querySelectorAll('.select select').forEach(function (select) {
    select.addEventListener('change', function () {
        if (select.value !== "") {
            select.classList.add('filled');
        } else {
            select.classList.remove('filled');
        }
    });

    if (select.value !== "") {
        select.classList.add('filled');
    }
});