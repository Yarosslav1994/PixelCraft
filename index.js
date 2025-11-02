const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Дозволяємо доступ до всіх статичних файлів у public
app.use(express.static(path.join(__dirname, 'public')));

// Головна сторінка
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Сторінка логіну
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Сторінка реєстрації
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

// Можна додати інші HTML файли так само
// app.get('/course_blocks', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'course_blocks.html'));
// });

// Запускаємо сервер
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
