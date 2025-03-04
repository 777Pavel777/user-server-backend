import express from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'users.json');

app.use(express.json());

// Налаштування CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
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
        res.json([]);
    }
});

// Додавання нового користувача
app.post('/api/users', async (req, res) => {
    try {
        const newUser = req.body; // Очікуємо { name, email, phone, country }
        let users = [];
        try {
            const data = await fs.readFile(DATA_FILE, 'utf8');
            users = JSON.parse(data);
        } catch (error) {
            // Файл не існує
        }
        users.push(newUser);
        await fs.writeFile(DATA_FILE, JSON.stringify(users, null, 2));
        res.status(201).json({ message: 'Користувача збережено', user: newUser });
    } catch (error) {
        console.error('Помилка:', error);
        res.status(500).json({ error: 'Помилка сервера' });
    }
});

app.listen(PORT, () => {
    console.log(`Сервер запущено на порту ${PORT}`);
});

export default app;
