const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let placar = [
  { nome: "Gabriel", pontos: 10 }
];

// Pegar o Top 5
app.get('/api/placar', (req, res) => {
  const top5 = placar.sort((a, b) => b.pontos - a.pontos).slice(0, 5);
  res.json(top5);
});

// Salvar novos pontos
app.post('/api/placar', (req, res) => {
  const { nome, pontos } = req.body;
  if (nome && typeof pontos === 'number') {
    placar.push({ nome: nome.substring(0, 10), pontos });
  }
  res.json({ ok: true });
});

app.listen(process.env.PORT || 3000);
