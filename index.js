import express from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000; // Сумісність із хостингом
const DATA_FILE = path.join(__dirname, '../users.json');

// Middleware для обробки JSON
app.use(express.json());

// Налаштування CORS для конкретного домену фронтенду
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://777pavel777.github.io/test/'); // Тільки ваш фронтенд
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // Дозволені методи
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    
    // Обробка preflight-запитів (OPTIONS)
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

// Отримання списку користувачів
app.get('/api/users', async (req, res) => {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        const users = JSON.parse(data);
        res.json(users);
    } catch (error) {
        // Повертаємо порожній масив, якщо файл не існує або є помилка
        res.json([]);
    }
});

// Додавання нового користувача
app.post('/api/users', async (req, res) => {
    try {
        const newUser = req.body;
        let users = [];
        
        // Спроба зчитати існуючий файл
        try {
            const data = await fs.readFile(DATA_FILE, 'utf8');
            users = JSON.parse(data);
        } catch (error) {
            // Якщо файл не існує, залишимо users як порожній масив
        }

        // Додавання нового користувача
        users.push(newUser);
        await fs.writeFile(DATA_FILE, JSON.stringify(users, null, 2));
        
        res.status(201).json({ message: 'Користувача збережено', user: newUser });
    } catch (error) {
        console.error('Помилка:', error);
        res.status(500).json({ error: 'Помилка сервера' });
    }
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущено на порту ${PORT}`);
});

// Експорт для можливості використання в іншому файлі (опціонально)
export default app;
