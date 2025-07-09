const express = require("express");
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Konfiguracja połączenia z MySQL
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "password", // <-- ZMIEŃ na swoje hasło jeśli inne
  database: "trading_diary",
};

async function query(sql, params) {
  const connection = await mysql.createConnection(dbConfig);
  const [results] = await connection.execute(sql, params);
  await connection.end();
  return results;
}

// Register
app.post("/api/register", async (req, res) => {
  const { email, firstName, lastName, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    await query(
      "INSERT INTO users (email, firstName, lastName, password) VALUES (?, ?, ?, ?)",
      [email, firstName, lastName, hash]
    );
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    if (err.code === "ER_DUP_ENTRY") {
      return res
        .status(400)
        .json({ error: "Użytkownik o tym e-mailu już istnieje" });
    }
    res.status(500).json({ error: "Błąd rejestracji" });
  }
});

// Logowanie
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const users = await query("SELECT * FROM users WHERE email = ?", [email]);
    const user = users[0];
    if (!user) {
      return res.status(400).json({ error: "Błędny e-mail lub hasło" });
    }
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(400).json({ error: "Błędny e-mail lub hasło" });
    }
    res.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      balance: user.balance,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Błąd serwera" });
  }
});

// Get trades for user
app.get("/api/trades/:userId", async (req, res) => {
  try {
    const trades = await query(
      "SELECT * FROM trades WHERE user_id = ? ORDER BY date DESC",
      [req.params.userId]
    );
    res.json(trades);
  } catch (err) {
    res.status(500).json({ error: "Błąd pobierania transakcji" });
  }
});

// Add trade
app.post("/api/trades", async (req, res) => {
  const { userId, symbol, profit, date, notes } = req.body;
  try {
    await query(
      "INSERT INTO trades (user_id, symbol, profit, date, notes) VALUES (?, ?, ?, ?, ?)",
      [userId, symbol, profit, date, notes]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Błąd zapisywania transakcji" });
  }
});

// Update user balance
app.post("/api/balance", async (req, res) => {
  const { userId, balance } = req.body;
  try {
    await query("UPDATE users SET balance = ? WHERE id = ?", [balance, userId]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Błąd aktualizacji salda" });
  }
});

// Endpoint do podglądu użytkowników (tylko do testów!)
app.get("/api/users", async (req, res) => {
  try {
    const users = await query(
      "SELECT id, email, firstName, lastName, balance FROM users",
      []
    );
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Błąd pobierania użytkowników" });
  }
});

app.listen(3001, () => console.log("API działa na http://localhost:3001"));
