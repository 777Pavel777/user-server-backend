import express from "express";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Отримуємо __dirname у ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000; // Використовуємо PORT із середовища або 3000
const DATA_FILE = path.join(__dirname, "users.json"); // Файл для зберігання даних

// Middleware для парсингу JSON
app.use(express.json());

// Налаштування CORS для доступу з будь-якого джерела (змінюйте для продакшену)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Змінити на конкретний фронтенд-URL у продакшені
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Маршрут для перевірки працездатності сервера
app.get("/", (req, res) => {
  res.send("Сервер працює!");
});

// GET: Отримання всіх користувачів
app.get("/api/users", async (req, res) => {
  try {
    const data = await fs.readFile(DATA_FILE, "utf8");
    const users = JSON.parse(data);
    res.json(users);
  } catch (error) {
    // Якщо файл не існує або є помилка, повертаємо порожній масив
    res.json([]);
  }
});

// POST: Збереження нового користувача
app.post("/api/users", async (req, res) => {
  try {
    const newUser = req.body;

    // Перевірка, чи всі поля присутні
    if (!newUser.name || !newUser.age || !newUser.number || !newUser.email) {
      return res.status(400).json({ error: "Усі поля обов’язкові" });
    }

    let users = [];
    try {
      const data = await fs.readFile(DATA_FILE, "utf8");
      users = JSON.parse(data);
    } catch (error) {
      // Якщо файл не існує, створюємо порожній масив
    }

    users.push(newUser);
    await fs.writeFile(DATA_FILE, JSON.stringify(users, null, 2));
    res.status(201).json({ message: "Користувача збережено", user: newUser });
  } catch (error) {
    console.error("Помилка:", error);
    res.status(500).json({ error: "Помилка сервера" });
  }
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущено на порту ${PORT}`);
});
