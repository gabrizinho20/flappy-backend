const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();

app.use(cors());
app.use(express.json());

const ARQUIVO_PLACAR = 'placar.json';

// Função para carregar o placar do arquivo
function carregarPlacar() {
  try {
    if (fs.existsSync(ARQUIVO_PLACAR)) {
      const dados = fs.readFileSync(ARQUIVO_PLACAR, 'utf8');
      return JSON.parse(dados);
    }
  } catch (err) {
    console.error("Erro ao ler placar:", err);
  }
  return [];
}

// Função para salvar o placar no arquivo
function salvarPlacarArquivo(placar) {
  try {
    fs.writeFileSync(ARQUIVO_PLACAR, JSON.stringify(placar, null, 2));
  } catch (err) {
    console.error("Erro ao salvar placar:", err);
  }
}

let placar = carregarPlacar();

// Pegar o Top 5
app.get('/api/placar', (req, res) => {
  const top5 = placar.sort((a, b) => b.pontos - a.pontos).slice(0, 5);
  res.json(top5);
});

// Salvar ou Atualizar pontos
app.post('/api/placar', (req, res) => {
  const { nome, pontos } = req.body;
  if (nome && typeof pontos === 'number') {
    const nomeLimpo = String(nome).trim().substring(0, 10);
    
    // Procura se o jogador já existe na lista
    const jogadorExistente = placar.find(p => p.nome.toLowerCase() === nomeLimpo.toLowerCase());

    if (jogadorExistente) {
      // Se já existe e fez pontuação MAIOR, atualiza
      if (pontos > jogadorExistente.pontos) {
        jogadorExistente.pontos = pontos;
      }
    } else {
      // Se não existe, cria um novo
      placar.push({ nome: nomeLimpo, pontos });
    }

    if (typeof salvarPlacarArquivo === 'function') {
      salvarPlacarArquivo(placar);
    }
  }
  res.json({ ok: true });
