const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Mock de usuário
const usuario = {
  id: "user_001",
  nome: "Caio Rossi",
  saldo: 140.0,
  saldoPrevisto: 200.0,
};

// Mock de contas
const contas = [
  {
    id: "conta_001",
    nome: "Água",
    valor: 120,
    vencimento: "2025-09-30",
    tipo: "essencial",
    status: "pendente",
  },
  {
    id: "conta_002",
    nome: "Luz",
    valor: 95,
    vencimento: "2025-10-05",
    tipo: "essencial",
    status: "pendente",
  },
  {
    id: "conta_003",
    nome: "Aluguel",
    valor: 1200,
    vencimento: "2025-10-01",
    tipo: "essencial",
    status: "pendente",
  },
  {
    id: "conta_004",
    nome: "Internet",
    valor: 100,
    vencimento: "2025-10-03",
    tipo: "essencial",
    status: "pendente",
  },
  {
    id: "conta_005",
    nome: "Spotify",
    valor: 19,
    vencimento: "2025-09-28",
    tipo: "assinatura",
    status: "pendente",
  },
  {
    id: "conta_006",
    nome: "Academia",
    valor: 90,
    vencimento: "2025-10-02",
    tipo: "assinatura",
    status: "pendente",
  },
  {
    id: "conta_007",
    nome: "Restaurante",
    valor: 200,
    vencimento: "2025-09-27",
    tipo: "lazer",
    status: "pendente",
  },
];

// Rotas básicas
app.get("/usuario", (req, res) => {
  res.json(usuario);
});

app.get("/contas", (req, res) => {
  res.json(contas);
});

app.get("/analise", (req, res) => {
  const insights = [];

  contas.forEach((conta) => {
    if (conta.valor > usuario.saldo) {
      insights.push(
        `⚠️ Seu ${conta.nome} custa R$ ${conta.valor}, mas você só tem R$ ${usuario.saldo}.`
      );
    }
  });

  const assinaturaCara = contas.find(
    (c) => c.tipo === "assinatura" && c.valor > 30
  );
  if (assinaturaCara) {
    insights.push(
      `💡 Que tal cortar o ${assinaturaCara.nome} (R$ ${assinaturaCara.valor}) este mês?`
    );
  }

  res.json({
    mensagem: `Oi ${usuario.nome.split(" ")[0]}! Analisei suas contas 👇`,
    insights,
    opcoes: ["Pagar agora", "Agendar", "Ver cortes", "Copiar boleto/Pix"],
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
