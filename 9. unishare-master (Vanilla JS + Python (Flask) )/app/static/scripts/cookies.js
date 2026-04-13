const cookiesAccepted = localStorage.getItem('cookiesAccepted') === '1';
const cookiesElement = document.getElementById('cookies');
const cookiesBtn = document.getElementById('cookiesBtn');

if (cookiesAccepted) {
    cookiesElement.style.display = 'none';
} else {
    cookiesElement.style.display = 'flex';
}

cookiesBtn.addEventListener('click', function () {
    cookiesElement.style.transform = 'translateX(-50%) scale(0)';
    setTimeout(() => {
        cookiesElement.style.display = 'none';
    }, 200)
    localStorage.setItem('cookiesAccepted', '1');
});