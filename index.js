// Підключаємо необхідні модулі
const express = require('express');
const path = require('path');

const app = express();

// Порт від Render або 3000 для локального запуску
const PORT = process.env.PORT || 3000;

// Вказуємо папку зі статичними файлами (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Маршрут для головної сторінки
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Маршрут для сторінки логіну
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Маршрут для сторінки реєстрації
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

// Запускаємо сервер
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
