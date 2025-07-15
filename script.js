// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
        // Close mobile menu after clicking a link
        if (window.innerWidth <= 768) {
            document.querySelector('nav').classList.remove('active');
        }
    });
});

// Slider functionality
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;
const slider = document.querySelector('.slider');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');

function updateSlider() {
    const offset = -currentSlide * 100;
    slider.style.transform = `translateX(${offset}%)`;
    prevBtn.disabled = currentSlide === 0;
    nextBtn.disabled = currentSlide === totalSlides - 1;
}

prevBtn.addEventListener('click', () => {
    if (currentSlide > 0) {
        currentSlide--;
        updateSlider();
    }
});

nextBtn.addEventListener('click', () => {
    if (currentSlide < totalSlides - 1) {
        currentSlide++;
        updateSlider();
    }
});

setInterval(() => {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateSlider();
}, 5000);

// Dynamic service options based on request type
const requestType = document.getElementById('requestType');
const service = document.getElementById('service');
const car = document.getElementById('car');

requestType.addEventListener('change', function() {
    const type = this.value;
    service.innerHTML = '<option value="">-- Выберите услугу --</option>';

    if (type === 'purchase') {
        service.innerHTML += '<option value="Покупка">Покупка</option>';
        service.innerHTML += '<option value="Аренда">Аренда</option>';
        car.innerHTML = '<option value="">-- Выберите модель --</option>' +
                        '<option value="Модель 1">Модель 1 - Стильный седан</option>' +
                        '<option value="Модель 2">Модель 2 - Спорткар</option>' +
                        '<option value="Модель 3">Модель 3 - SUV</option>' +
                        '<option value="Модель 4">Модель 4 - Электромобиль</option>' +
                        '<option value="Модель 5">Модель 5 - Кроссовер</option>' +
                        '<option value="Модель 6">Модель 6 - Кабриолет</option>' +
                        '<option value="Модель 7">Модель 7 - Хэтчбек</option>' +
                        '<option value="Модель 8">Модель 8 - Внедорожник</option>' +
                        '<option value="Модель 9">Модель 9 - Гибрид</option>' +
                        '<option value="Модель 10">Модель 10 - Суперкар</option>';
        car.value = ''; // Reset car selection
    } else if (type === 'commission') {
        service.innerHTML += '<option value="Оценка и выкуп">Оценка и выкуп</option>';
        car.innerHTML = '<option value="Мой автомобиль">Мой автомобиль (для комиссии)</option>';
        car.value = 'Мой автомобиль'; // Default to "My car" for commission
    }
});

// Form submission and Telegram integration
const form = document.getElementById('inspectionForm');
const formMessage = document.getElementById('formMessage');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const requestTypeValue = document.getElementById('requestType').value;
    const car = document.getElementById('car').value;
    const service = document.getElementById('service').value;
    const fullName = document.getElementById('fullName').value;
    const phone = document.getElementById('phone').value;

    if (!requestTypeValue || !car || !service || !fullName || !phone) {
        formMessage.textContent = 'Пожалуйста, заполните все поля.';
        return;
    }

    const message = `Новая заявка на осмотр:\n` +
                    `Тип заявки: ${requestTypeValue === 'purchase' ? 'Покупка' : 'Комиссия'}\n` +
                    `Автомобиль: ${car}\n` +
                    `Услуга: ${service}\n` +
                    `ФИО: ${fullName}\n` +
                    `Телефон: ${phone}\n` +
                    `Дата: ${new Date().toLocaleString('ru-RU')}`;
    const botToken = '<YOUR_BOT_TOKEN>'; // Replace with your BotFather token
    const chatId = '<YOUR_CHAT_ID>'; // Replace with your chat ID

    try {
        const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: message
            })
        });

        const data = await response.json();
        if (data.ok) {
            formMessage.textContent = 'Заявка успешно отправлена!';
            form.reset();
            requestType.value = ''; // Reset request type
            service.innerHTML = '<option value="">-- Выберите услугу --</option>'; // Reset service
            car.innerHTML = '<option value="">-- Выберите модель --</option>' + // Reset car
                            '<option value="Модель 1">Модель 1 - Стильный седан</option>' +
                            '<option value="Модель 2">Модель 2 - Спорткар</option>' +
                            '<option value="Модель 3">Модель 3 - SUV</option>' +
                            '<option value="Модель 4">Модель 4 - Электромобиль</option>' +
                            '<option value="Модель 5">Модель 5 - Кроссовер</option>' +
                            '<option value="Модель 6">Модель 6 - Кабриолет</option>' +
                            '<option value="Модель 7">Модель 7 - Хэтчбек</option>' +
                            '<option value="Модель 8">Модель 8 - Внедорожник</option>' +
                            '<option value="Модель 9">Модель 9 - Гибрид</option>' +
                            '<option value="Модель 10">Модель 10 - Суперкар</option>' +
                            '<option value="Мой автомобиль">Мой автомобиль (для комиссии)</option>';
        } else {
            formMessage.textContent = 'Ошибка при отправке заявки.';
        }
    } catch (error) {
        formMessage.textContent = 'Произошла ошибка. Попробуйте позже.';
        console.error('Error:', error);
    }
});
