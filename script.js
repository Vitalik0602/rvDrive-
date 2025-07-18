// Мобильное меню
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('nav');
menuToggle.addEventListener('click', () => nav.classList.toggle('active'));

// Скрытие/показ загрузки фото
document.getElementById('requestType').addEventListener('change', function () {
  const uploadField = document.getElementById('uploadField');
  uploadField.style.display = this.value === 'commission' ? 'block' : 'none';
});

// Настройки Telegram
const TOKEN = '7990942936:AAG1lRKSS2r1Q2_svd2L41ngtp43LBpFMeo'; // ← замени на свой токен
const CHAT_ID = '-4891252892';    // ← замени на свой chat_id
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TOKEN}`;

// Обработка формы
document.getElementById('inspectionForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const formMessage = document.getElementById('formMessage');
  formMessage.textContent = 'Отправка...';

  const requestType = document.getElementById('requestType').value;
  const car = document.getElementById('car').value;
  const service = document.getElementById('service').value;
  const fullName = document.getElementById('fullName').value;
  const phone = document.getElementById('phone').value;
  const photoFile = document.getElementById('photo').files[0];

  const message = `
🚗 *Новая заявка с сайта*  
Тип: ${requestType}  
Авто: ${car}  
Услуга: ${service}  
ФИО: ${fullName}  
Телефон: ${phone}
  `;

  if (photoFile) {
    // Если есть фото, отправляем его с подписью
    const formData = new FormData();
    formData.append('chat_id', CHAT_ID);
    formData.append('photo', photoFile);
    formData.append('caption', message);
    formData.append('parse_mode', 'Markdown');

    fetch(`${TELEGRAM_API_URL}/sendPhoto`, {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(result => {
      if (result.ok) {
        formMessage.textContent = '✅ Заявка отправлена!';
      } else {
        formMessage.textContent = '❌ Ошибка отправки фото!';
      }
    })
    .catch(() => {
      formMessage.textContent = '❌ Ошибка отправки!';
    });
  } else {
    // Если фото нет, отправляем просто текст
    fetch(`${TELEGRAM_API_URL}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'Markdown'
      })
    })
    .then(response => response.json())
    .then(result => {
      if (result.ok) {
        formMessage.textContent = '✅ Заявка отправлена!';
      } else {
        formMessage.textContent = '❌ Ошибка отправки!';
      }
    })
    .catch(() => {
      formMessage.textContent = '❌ Ошибка отправки!';
    });
  }
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

// Автопрокрутка
setInterval(() => {
  currentSlide = (currentSlide + 1) % totalSlides;
  updateSlider();
}, 6000);
