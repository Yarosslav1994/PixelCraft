// Підключаємо необхідні модулі
const express = require('express');
const path = require('path');

const app = express();

// Порт від Render або 3000 для локального запуску
const PORT = process.env.PORT || 3000;

// ======= СТАТИЧНІ ФАЙЛИ =======
// Головна папка зі статичними файлами
app.use(express.static(path.join(__dirname, 'public')));

// Додатково дозволяємо читати файли з кореня (index.html, favicon тощо)
app.use(express.static(__dirname));

// Дозволяємо читати картинки з папки Image (якщо вона не всередині public)
app.use('/Image', express.static(path.join(__dirname, 'Image')));
// Якщо у тебе картинки всередині public/Image, то цей рядок не обов'язковий.

// ======= МАРШРУТИ =======

// Головна сторінка
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Сторінка логіну
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Сторінка реєстрації
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

// Інші сторінки курсу
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

// ======= ЗАПУСК СЕРВЕРА =======
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
