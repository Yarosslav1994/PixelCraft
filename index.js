// Підключаємо необхідні модулі
const express = require('express');
const path = require('path');
const session = require('express-session');
const fetch = require('node-fetch');
require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const app = express();
const PORT = process.env.PORT || 3000;

// ======= НАЛАШТУВАННЯ =======
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

// Сесії
app.use(
  session({
    secret: 'unity-course-secret',
    resave: false,
    saveUninitialized: false,
  })
);

// Статичні файли
app.use(express.static(path.join(__dirname, 'public')));

// ======= МІДЛВЕАР ДЛЯ ПЕРЕВІРКИ ЛОГІНУ =======
function requireLogin(req, res, next) {
  if (req.session.user) next();
  else res.redirect('/register');
}

// ======= ГОЛОВНА =======
app.get('/', requireLogin, (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ======= TechCheck =======
app.get('/techcheck.html', requireLogin, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'techcheck.html'));
});

// ======= РЕЄСТРАЦІЯ =======

app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.json({ success: false, message: '❌ Будь ласка, заповни всі поля!' });
  }

  if (password.length < 5) {
    return res.json({ success: false, message: '❌ Пароль має бути не менше 5 символів!' });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email: username } });
    if (existingUser) {
      return res.json({ success: false, message: '❌ Користувач з таким email вже існує!' });
    }

    await prisma.user.create({
      data: { email: username, password },
    });

    req.session.user = { email: username };
    res.json({ success: true, message: '✅ Реєстрація успішна!' });
  } catch (err) {
    console.error('Prisma Error:', err);
    res.json({ success: false, message: '❌ Помилка при реєстрації.' });
  }
});




// ======= ЛОГІН =======
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (user && user.password === password) {
      req.session.user = { email };
      res.json({ success: true, message: '✅ Вхід успішний!' });
    } else {
      res.json({ success: false, message: '❌ Неправильний логін або пароль' });
    }
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: '❌ Помилка при вході.' });
  }
});

// ======= ВИХІД =======
app.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
});

// ======= КУРСИ =======
app.get('/course_blocks.html', requireLogin, (req, res) => {
  res.sendFile(path.join(__dirname, 'course_blocks.html'));
});

for (let i = 1; i <= 8; i++) {
  app.get(`/Module${i}.html`, requireLogin, (req, res) => {
    res.sendFile(path.join(__dirname, `Module${i}.html`));
  });
}

// ======= AI TechCheck =======
app.post('/api/techcheck', requireLogin, async (req, res) => {
  const userAnswer = req.body.answer;
  if (!userAnswer)
    return res.json({ feedback: "❌ Відповідь порожня!", points: 0 });

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
          {
            role: 'system',
            content: `
Ти викладач Unity. Оціни відповідь студента:
1. Що правильно, що ні.
2. Дай бали від 0 до 10.
3. Формат: {"feedback": "...", "points": число}.
`
          },
          { role: 'user', content: userAnswer }
        ],
        max_tokens: 250,
      }),
    });

    const data = await response.json();
    let aiData;
    try {
      aiData = JSON.parse(data.choices[0].message.content);
    } catch (parseError) {
      console.error('Помилка JSON:', parseError, data.choices[0].message.content);
      return res.json({ feedback: "❌ Помилка при обробці відповіді AI.", points: 0 });
    }

    res.json(aiData);
  } catch (err) {
    console.error(err);
    res.json({ feedback: "❌ Помилка при зверненні до AI.", points: 0 });
  }
});

// ======= ЗАПУСК =======
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
