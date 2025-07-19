document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('inspectionForm');
  const requestType = document.getElementById('requestType');
  const carSelect = document.getElementById('car');
  const uploadField = document.getElementById('uploadField');
  const fullNameField = document.getElementById('fullName');
  const phoneField = document.getElementById('phone');
  const photoField = document.getElementById('photo');
  const formMessage = document.getElementById('formMessage');
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('nav');

  let budgetLabel, budgetInput, desiredCarLabel, desiredCarInput;

  requestType.addEventListener('change', () => {
    const value = requestType.value;
    carSelect.disabled = false;
    uploadField.style.display = 'none';
    fullNameField.disabled = false;
    phoneField.disabled = false;
    photoField.disabled = false;

    // Remove budget and desiredCar fields if they exist
    if (budgetLabel) budgetLabel.remove();
    if (budgetInput) budgetInput.remove();
    if (desiredCarLabel) desiredCarLabel.remove();
    if (desiredCarInput) desiredCarInput.remove();

    if (value === 'Комиссия' || value === 'Автоломбард') {
      carSelect.disabled = true;
      uploadField.style.display = 'block';
    } else if (value === 'Автоподбор') {
      // Create and insert budget field
      budgetLabel = document.createElement('label');
      budgetLabel.setAttribute('for', 'budget');
      budgetLabel.textContent = 'Бюджет:';
      budgetInput = document.createElement('input');
      budgetInput.type = 'text';
      budgetInput.id = 'budget';
      budgetInput.required = true;

      // Create and insert desiredCar field
      desiredCarLabel = document.createElement('label');
      desiredCarLabel.setAttribute('for', 'desiredCar');
      desiredCarLabel.textContent = 'Желаемая машина:';
      desiredCarInput = document.createElement('input');
      desiredCarInput.type = 'text';
      desiredCarInput.id = 'desiredCar';
      desiredCarInput.required = true;

      // Insert before fullName field
      const fullNameLabel = form.querySelector('label[for="fullName"]');
      form.insertBefore(budgetLabel, fullNameLabel);
      form.insertBefore(budgetInput, fullNameLabel);
      form.insertBefore(desiredCarLabel, fullNameLabel);
      form.insertBefore(desiredCarInput, fullNameLabel);

      carSelect.disabled = true;
      uploadField.style.display = 'none';
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const requestTypeValue = requestType.value;
    let message = `Новая заявка:\nТип: ${requestTypeValue}\n`;

    if (!phoneField.value.match(/\+7\s?\(\d{3}\)\s?\d{3}-\d{2}-\d{2}/)) {
      formMessage.textContent = 'Пожалуйста, введите телефон в формате +7 (XXX) XXX-XX-XX';
      return;
    }

    if (requestTypeValue === 'Автоподбор') {
      const budget = budgetInput ? budgetInput.value : '';
      const desiredCar = desiredCarInput ? desiredCarInput.value : '';
      const fullName = fullNameField.value;
      const phone = phoneField.value;
      if (!budget || !desiredCar || !fullName || !phone) {
        formMessage.textContent = 'Пожалуйста, заполните все обязательные поля.';
        return;
      }
      message += `Бюджет: ${budget}\nЖелаемая машина: ${desiredCar}\nФИО: ${fullName}\nТелефон: ${phone}\n`;
    } else {
      const car = carSelect.value;
      const fullName = fullNameField.value;
      const phone = phoneField.value;
      if (!car || !fullName || !phone) {
        formMessage.textContent = 'Пожалуйста, заполните все обязательные поля.';
        return;
      }
      message += `Автомобиль: ${car}\nФИО: ${fullName}\nТелефон: ${phone}\n`;
      if (requestTypeValue === 'Комиссия' || requestTypeValue === 'Автоломбард') {
        message += photoField.files.length ? `Фото: прикреплено\n` : `Фото: отсутствует\n`;
      }
    }

    try {
      // TODO: Replace YOUR_BOT_TOKEN and YOUR_CHAT_ID with actual Telegram Bot Token and Chat ID
      const response = await fetch('https://api.telegram.org/botYOUR_BOT_TOKEN/sendMessage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: 'YOUR_CHAT_ID',
          text: message
        })
      });
      if (response.ok) {
        formMessage.textContent = 'Заявка отправлена!';
        form.reset();
        // Remove budget and desiredCar fields after submission
        if (budgetLabel) budgetLabel.remove();
        if (budgetInput) budgetInput.remove();
        if (desiredCarLabel) desiredCarLabel.remove();
        if (desiredCarInput) desiredCarInput.remove();
        uploadField.style.display = 'none';
        carSelect.disabled = false;
        fullNameField.disabled = false;
        phoneField.disabled = false;
        photoField.disabled = false;
      } else {
        formMessage.textContent = 'Ошибка при отправке заявки.';
      }
    } catch (error) {
      formMessage.textContent = 'Ошибка при отправке заявки.';
    }
  });

  menuToggle.addEventListener('click', () => {
    nav.classList.toggle('active');
  });
});