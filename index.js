// ================== ПІДКЛЮЧАЄМО МОДУЛІ ==================
const express = require('express');
const path = require('path');
const session = require('express-session'); // додаємо для сесій

const app = express();

// ================== ПОРТ ==================
const PORT = process.env.PORT || 3000;

// ================== НАЛАШТУВАННЯ ==================
app.use(express.urlencoded({ extended: true })); // дозволяє читати дані з форм
app.use(express.json());

// Налаштування сесій
app.use(
  session({
    secret: 'unity-course-secret', // будь-який секретний ключ
    resave: false,
    saveUninitialized: false,
  })
);

// ================== СТАТИЧНІ ФАЙЛИ ==================
// Папка public для логіну/реєстрації
app.use(express.static(path.join(__dirname, 'public')));

// Також читаємо файли з кореня (index.html)
app.use(express.static(__dirname));

// Якщо є окрема папка Image — дозволяємо її
app.use('/Image', express.static(path.join(__dirname, 'Image')));

// ================== МІДЛВЕАР ДЛЯ ПЕРЕВІРКИ ЛОГІНУ ==================
function requireLogin(req, res, next) {
  if (req.session.user) {
    next(); // якщо користувач залогінений — пускаємо далі
  } else {
    res.redirect('/register'); // якщо ні — відправляємо на реєстрацію
  }
}

// ================== МАРШРУТИ ==================

// --- ГОЛОВНА СТОРІНКА ---
// (тільки для тих, хто залогінений)
app.get('/', requireLogin, (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// --- РЕЄСТРАЦІЯ ---
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.post('/register', (req, res) => {
  const { username, password } = req.body;

  // Простенька перевірка: якщо поля заповнені — створюємо сесію
  if (username && password) {
    req.session.user = { username };
    res.redirect('/'); // після реєстрації — на головну
  } else {
    res.send('❌ Будь ласка, заповни всі поля!');
  }
});

// --- ЛОГІН ---
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Імітація входу (у реальному проєкті перевіряли б у базі)
  if (username === 'student' && password === '1234') {
    req.session.user = { username };
    res.redirect('/');
  } else {
    res.send('❌ Неправильний логін або пароль');
  }
});

// --- ВИХІД ---
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

// --- ІНШІ СТОРІНКИ КУРСУ ---
app.get('/course_blocks.html', requireLogin, (req, res) => {
  res.sendFile(path.join(__dirname, 'course_blocks.html'));
});

app.get('/Module1.html', requireLogin, (req, res) => {
  res.sendFile(path.join(__dirname, 'Module1.html'));
});
app.get('/Module2.html', requireLogin, (req, res) => {
  res.sendFile(path.join(__dirname, 'Module2.html'));
});
app.get('/Module3.html', requireLogin, (req, res) => {
  res.sendFile(path.join(__dirname, 'Module3.html'));
});
app.get('/Module4.html', requireLogin, (req, res) => {
  res.sendFile(path.join(__dirname, 'Module4.html'));
});
app.get('/Module5.html', requireLogin, (req, res) => {
  res.sendFile(path.join(__dirname, 'Module5.html'));
});
app.get('/Module6.html', requireLogin, (req, res) => {
  res.sendFile(path.join(__dirname, 'Module6.html'));
});
app.get('/Module7.html', requireLogin, (req, res) => {
  res.sendFile(path.join(__dirname, 'Module7.html'));
});
app.get('/Module8.html', requireLogin, (req, res) => {
  res.sendFile(path.join(__dirname, 'Module8.html'));
});

// ================== ЗАПУСК СЕРВЕРА ==================
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
