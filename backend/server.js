const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "../frontend/public")));
app.use("/logos", express.static(path.join(__dirname, "../assets/logos")));
app.use("/images", express.static(path.join(__dirname, "../assets/images")));

// Exemplo de rota de API
app.get("/api/hello", (req, res) => {
  res.json({ message: "Olá da API!" });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});