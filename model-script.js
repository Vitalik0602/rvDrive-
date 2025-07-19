const TOKEN = '7990942936:AAG1lRKSS2r1Q2_svd2L41ngtp43LBpFMeo';
const CHAT_ID = '-4891252892';

document.addEventListener('DOMContentLoaded', () => {
  const carSlides = document.querySelectorAll('.car-slide');
  const carSlider = document.querySelector('.car-slider');
  const prevCar = document.getElementById('prevCar');
  const nextCar = document.getElementById('nextCar');
  const thumbnails = document.querySelectorAll('.thumbnail');
  const indicators = document.querySelectorAll('.indicator');
  const form = document.getElementById('carInquiryForm');
  const formMessage = document.getElementById('formMessage');
  const fullName = document.getElementById('fullName');
  const phone = document.getElementById('phone');
  const messageText = document.getElementById('message');
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('nav');
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImage');
  const closeModal = document.querySelector('.modal-close');
  const prevModalImg = document.querySelector('.modal-prev');
  const nextModalImg = document.querySelector('.modal-next');

  let carCurrent = 0;
  let touchStartX = 0;
  let touchEndX = 0;

  function updateCarSlider() {
    carSlider.style.transform = `translateX(-${carCurrent * 100}%)`;
    thumbnails.forEach((thumb, index) => {
      thumb.classList.toggle('active', index === carCurrent);
    });
    indicators.forEach((ind, index) => {
      ind.classList.toggle('active', index === carCurrent);
    });
  }

  function goToSlide(index) {
    carCurrent = index;
    updateCarSlider();
  }

  prevCar.addEventListener('click', () => {
    carCurrent = (carCurrent - 1 + carSlides.length) % carSlides.length;
    updateCarSlider();
  });

  nextCar.addEventListener('click', () => {
    carCurrent = (carCurrent + 1) % carSlides.length;
    updateCarSlider();
  });

  thumbnails.forEach((thumb, index) => {
    thumb.addEventListener('click', () => goToSlide(index));
  });

  indicators.forEach((ind, index) => {
    ind.addEventListener('click', () => goToSlide(index));
  });

  carSlider.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  });

  carSlider.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].clientX;
    if (touchStartX - touchEndX > 50) {
      carCurrent = (carCurrent + 1) % carSlides.length;
      updateCarSlider();
    } else if (touchEndX - touchStartX > 50) {
      carCurrent = (carCurrent - 1 + carSlides.length) % carSlides.length;
      updateCarSlider();
    }
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

  carSlides.forEach(slide => {
    const img = slide.querySelector('img');
    img.addEventListener('click', () => {
      modal.style.display = 'flex';
      modalImg.src = img.src;
      modalImg.alt = img.alt;
      carCurrent = Array.from(carSlides).indexOf(slide);
      updateCarSlider();
    });
  });

  closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  prevModalImg.addEventListener('click', () => {
    carCurrent = (carCurrent - 1 + carSlides.length) % carSlides.length;
    modalImg.src = carSlides[carCurrent].querySelector('img').src;
    modalImg.alt = carSlides[carCurrent].querySelector('img').alt;
    updateCarSlider();
  });

  nextModalImg.addEventListener('click', () => {
    carCurrent = (carCurrent + 1) % carSlides.length;
    modalImg.src = carSlides[carCurrent].querySelector('img').src;
    modalImg.alt = carSlides[carCurrent].querySelector('img').alt;
    updateCarSlider();
  });
});