// Підключаємо необхідні модулі
const express = require('express');
const path = require('path');
const session = require('express-session'); // додаємо сесії
const fetch = require('node-fetch'); // для запитів до OpenAI

const app = express();

// Порт від Render або 3000 для локального запуску
const PORT = process.env.PORT || 3000;

// ======= НАЛАШТУВАННЯ =======
app.use(express.urlencoded({ extended: true })); // щоб читати дані з форм
app.use(express.json());

// Додаємо підтримку сесій
app.use(
  session({
    secret: 'unity-course-secret', // будь-який секретний ключ
    resave: false,
    saveUninitialized: false,
  })
);



// ======= СТАТИЧНІ ФАЙЛИ =======
app.use(express.static(path.join(__dirname, 'public')));


// ======= СТАТИЧНІ ФАЙЛИ =======
app.use(express.static(path.join(__dirname, 'public')));

// ======= МІДЛВЕАР ДЛЯ ПЕРЕВІРКИ ЛОГІНУ =======
function requireLogin(req, res, next) {
  if (req.session.user) {
    next(); // якщо користувач залогінений — продовжуємо
  } else {
    res.redirect('/register'); // якщо ні — перенаправляємо на реєстрацію
  }
}

// ======= МАРШРУТИ =======

// Домашня сторінка (лише для залогінених)
app.get('/', requireLogin, (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ======= РЕЄСТРАЦІЯ =======
app.get('/register', (req, res) => {
  if (req.session.user) return res.redirect('/'); // якщо вже залогінений — на головну
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.post('/register', (req, res) => {
  const { username, password } = req.body;

  // Імітація реєстрації (запис у сесію)
  if (username && password) {
    req.session.user = { username };
    res.redirect('/');
  } else {
    res.send('❌ Будь ласка, заповни всі поля!');
  }
});

// ======= ЛОГІН =======
app.get('/login', (req, res) => {
  if (req.session.user) return res.redirect('/'); // якщо вже залогінений — на головну
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Простий приклад: студент/1234
  if (username === 'student' && password === '1234') {
    req.session.user = { username };
    res.redirect('/');
  } else {
    res.send('❌ Неправильний логін або пароль');
  }
});

// ======= ВИХІД =======
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

// ======= СТОРІНКИ КУРСУ =======
app.get('/course_blocks.html', requireLogin, (req, res) => {
  res.sendFile(path.join(__dirname, 'course_blocks.html'));
});

for (let i = 1; i <= 8; i++) {
  app.get(`/Module${i}.html`, requireLogin, (req, res) => {
    res.sendFile(path.join(__dirname, `Module${i}.html`));
  });
}

// ======= TechCheck (AI-фідбек) =======
app.post('/api/techcheck', requireLogin, async (req, res) => {
  const userAnswer = req.body.answer;
  if (!userAnswer) return res.json({ feedback: "❌ Відповідь порожня!", points: 0 });

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'Ти викладач Unity. Оціни відповідь студента та дай фідбек. Вкажи скільки балів (0-10).' },
          { role: 'user', content: userAnswer }
        ],
        max_tokens: 100
      })
    });

    const data = await response.json();
    const aiText = data.choices[0].message.content;

    // Проста логіка: шукаємо бал у відповіді
    const match = aiText.match(/(\d+)/);
    const points = match ? parseInt(match[1]) : 0;

    res.json({ feedback: aiText, points });
  } catch (err) {
    console.error(err);
    res.json({ feedback: "❌ Сталася помилка при зверненні до AI.", points: 0 });
  }
});

// ======= ЗАПУСК СЕРВЕРА =======
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
