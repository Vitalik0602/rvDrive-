// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
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

// Form submission and Telegram integration
const form = document.getElementById('inspectionForm');
const formMessage = document.getElementById('formMessage');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const car = form.car.value;
    const service = form.service.value;
    const fullName = form.fullName.value;
    const phone = form.phone.value;

    if (!car || !service || !fullName || !phone) {
        formMessage.textContent = 'Пожалуйста, заполните все поля.';
        return;
    }

    const message = `Новая заявка на осмотр:\nАвтомобиль: ${car}\nУслуга: ${service}\nФИО: ${fullName}\nТелефон: ${phone}\nДата: ${new Date().toLocaleString('ru-RU')}`;
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
        } else {
            formMessage.textContent = 'Ошибка при отправке заявки.';
        }
    } catch (error) {
        formMessage.textContent = 'Произошла ошибка. Попробуйте позже.';
        console.error('Error:', error);
    }
});