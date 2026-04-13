const cookiesAccepted = localStorage.getItem('cookiesAccepted') === '1';
const cookiesElement = document.getElementById('cookies');
const cookiesBtn = document.getElementById('cookiesBtn');
const cancelBtn = document.getElementById('cancelBtn');


if (cookiesAccepted) {
    cookiesElement.style.display = 'none';
} else {
    cookiesElement.style.display = 'block';
}

cancelBtn.addEventListener('click', function () {
    cookiesElement.style.transform = 'translateX(-50%) scale(0)';
    cookiesElement.style.display = 'none';
});

cookiesBtn.addEventListener('click', function () {
    cookiesElement.style.transform = 'translateX(-50%) scale(0)';
    setTimeout(() => {
        cookiesElement.style.display = 'none';
    }, 200)
    localStorage.setItem('cookiesAccepted', '1');
});