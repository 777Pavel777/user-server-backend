import express from "express";
import { createClient } from "@supabase/supabase-js";

// Налаштування Supabase
const supabaseUrl = "https://jtlcmpfxrjgonsyhvagw.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0bGNtcGZ4cmpnb25zeWh2YWd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDExMTI1NDIsImV4cCI6MjA1NjY4ODU0Mn0.5AU0rdSg-Hunh9U20hNx7iKm42FWNFakuXy44srNcPA";
const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Налаштування CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

// Отримання списку користувачів
app.get("/api/users", async (req, res) => {
  try {
    const { data, error } = await supabase.from("users").select("*");

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    console.error("Помилка при отриманні користувачів:", error);
    res.json([]);
  }
});

// Додавання нового користувача
app.post("/api/users", async (req, res) => {
  try {
    const newUser = req.body;
    const { data, error } = await supabase
      .from("users")
      .insert([newUser])
      .select();

    if (error) throw error;

    res.status(201).json({
      message: "Користувача збережено",
      user: data[0],
    });
  } catch (error) {
    console.error("Помилка при додаванні користувача:", error);
    res.status(500).json({ error: "Помилка сервера" });
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущено на порту ${PORT}`);
});

export default app;
