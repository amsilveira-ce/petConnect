const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = 3000;

// --- Conexão com o banco de dados MongoDB ---
// pegamos a URI do banco de variáveis de ambiente ou usamos uma padrão
const mongoUri = process.env.DATABASE_URI || 'mongodb://localhost:27017/petconnect';


mongoose.connect(mongoUri).then(()=>{
  console.log('Sucessfully connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB', err.message)
})

// -------------------------


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


