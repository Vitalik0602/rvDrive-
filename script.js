// Мобильное меню
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('nav');
menuToggle.addEventListener('click', () => nav.classList.toggle('active'));

// Скрытие/показ загрузки фото
document.getElementById('requestType').addEventListener('change', function () {
  const uploadField = document.getElementById('uploadField');
  uploadField.style.display = this.value === 'commission' ? 'block' : 'none';
});

// Обработка формы (можно заменить fetch на реальную отправку в Telegram)
document.getElementById('inspectionForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const formMessage = document.getElementById('formMessage');
  formMessage.textContent = 'Заявка отправлена (демо).';
});

// Слайдер
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const slider = document.querySelector('.slider');
const totalSlides = slides.length;

function updateSlider() {
  slider.style.transform = `translateX(-${currentSlide * 100}%)`;
}
document.querySelector('.prev').addEventListener('click', () => {
  if (currentSlide > 0) {
    currentSlide--;
    updateSlider();
  }
});
document.querySelector('.next').addEventListener('click', () => {
  if (currentSlide < totalSlides - 1) {
    currentSlide++;
    updateSlider();
  }
});

// Автопрокрутка (по желанию)
setInterval(() => {
  currentSlide = (currentSlide + 1) % totalSlides;
  updateSlider();
}, 6000);
