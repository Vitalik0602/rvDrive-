const TOKEN = '7990942936:AAG1lRKSS2r1Q2_svd2L41ngtp43LBpFMeo';
const CHAT_ID = '-4891252892';

document.addEventListener('DOMContentLoaded', () => {
  const carSlides = document.querySelectorAll('.car-slide');
  const carSlider = document.querySelector('.car-slider');
  const prevCar = document.getElementById('prevCar');
  const nextCar = document.getElementById('nextCar');
  const form = document.getElementById('carInquiryForm');
  const formMessage = document.getElementById('formMessage');
  const fullName = document.getElementById('fullName');
  const phone = document.getElementById('phone');
  const messageText = document.getElementById('message');
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('nav');

  let carCurrent = 0;

  function updateCarSlider() {
    carSlider.style.transform = `translateX(-${carCurrent * 100}%)`;
  }

  prevCar.addEventListener('click', () => {
    carCurrent = (carCurrent - 1 + carSlides.length) % carSlides.length;
    updateCarSlider();
  });

  nextCar.addEventListener('click', () => {
    carCurrent = (carCurrent + 1) % carSlides.length;
    updateCarSlider();
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    formMessage.textContent = 'Отправка...';

    const fullNameValue = fullName.value;
    const phoneValue = phone.value;
    const messageValue = messageText.value;
    const carModel = document.querySelector('h1').textContent;

    if (!phoneValue.match(/\+7\s?\(\d{3}\)\s?\d{3}-\d{2}-\d{2}/)) {
      formMessage.textContent = 'Пожалуйста, введите телефон в формате +7 (XXX) XXX-XX-XX';
      return;
    }

    if (!fullNameValue || !phoneValue) {
      formMessage.textContent = 'Пожалуйста, заполните все обязательные поля.';
      return;
    }

    const message = `
🚗 *Заявка по модели: ${carModel}*
👤 ФИО: ${fullNameValue}
📞 Телефон: ${phoneValue}
💬 Сообщение: ${messageValue || 'Нет сообщения'}
    `;

    try {
      const response = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message,
          parse_mode: 'Markdown'
        })
      });
      const result = await response.json();
      formMessage.textContent = result.ok ? '✅ Заявка отправлена!' : '❌ Ошибка отправки!';
      if (result.ok) {
        form.reset();
      }
    } catch {
      formMessage.textContent = '❌ Ошибка отправки!';
    }
  });

  menuToggle.addEventListener('click', () => {
    nav.classList.toggle('active');
  });
});