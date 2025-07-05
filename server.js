const express = require("express");
const path = require("path");
const app = express();
const port = 3000;

// Serwuj pliki statyczne z folderu pin
app.use(express.static(path.join(__dirname, "pin")));

// Główna strona
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "pin", "index.html"));
});

app.listen(port, () => {
  console.log(`Gra Pig dostępna na http://localhost:${port}`);
  console.log("Naciśnij Ctrl+C aby zamknąć");
});
