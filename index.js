// Підключаємо необхідні модулі
const express = require('express');
const path = require('path');

const app = express();

// Порт від Render або 3000 для локального запуску
const PORT = process.env.PORT || 3000;

// Вказуємо папку зі статичними файлами (CSS, JS, картинки, відео)
app.use(express.static(path.join(__dirname, 'public')));

// Маршрут для головної сторінки
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Маршрут для сторінки логіну
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Маршрут для сторінки реєстрації
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

// Маршрути для всіх модулів та course_blocks
app.get('/course_blocks.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'course_blocks.html'));
});
app.get('/Module1.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'Module1.html'));
});
app.get('/Module2.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'Module2.html'));
});
app.get('/Module3.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'Module3.html'));
});
app.get('/Module4.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'Module4.html'));
});
app.get('/Module5.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'Module5.html'));
});
app.get('/Module6.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'Module6.html'));
});
app.get('/Module7.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'Module7.html'));
});
app.get('/Module8.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'Module8.html'));
});

// Запускаємо сервер
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
