const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

const usuario = {
  id: "user_001",
  nome: "Caio Rossi",
  saldo: 250.0,
  saldoPrevisto: 200.0,
};

const contas = [
  {
    id: "conta_001",
    nome: "Água",
    valor: 85,
    vencimento: "2025-09-30",
    tipo: "essencial",
    status: "pendente",
  },
  {
    id: "conta_002",
    nome: "Aluguel",
    valor: 1200,
    vencimento: "2025-10-01",
    tipo: "essencial",
    status: "pendente",
  },
  {
    id: "conta_003",
    nome: "Internet",
    valor: 100,
    vencimento: "2025-10-03",
    tipo: "essencial",
    status: "pendente",
  },
  {
    id: "conta_004",
    nome: "Netflix",
    valor: 40,
    vencimento: "2025-09-29",
    tipo: "assinatura",
    status: "pendente",
  },
  {
    id: "conta_005",
    nome: "Academia",
    valor: 90,
    vencimento: "2025-10-02",
    tipo: "assinatura",
    status: "pendente",
  },
  {
    id: "conta_006",
    nome: "Restaurante",
    valor: 200,
    vencimento: "2025-09-27",
    tipo: "lazer",
    status: "pendente",
  },
  {
    id: "conta_007",
    nome: "Mercado",
    valor: 600,
    vencimento: "2025-09-25",
    tipo: "essencial",
    status: "pago",
  },
  {
    id: "conta_008",
    nome: "Cartão de Crédito",
    valor: 900,
    vencimento: "2025-10-05",
    tipo: "essencial",
    status: "pendente",
  },
  {
    id: "conta_009",
    nome: "Transporte",
    valor: 250,
    vencimento: "2025-09-30",
    tipo: "essencial",
    status: "pendente",
  },
];

/*
No futuro, este backend pode evoluir para usar Machine Learning e agentes de IA para analisar automaticamente o saldo do usuário e suas contas, gerando insights personalizados. 
- Cada conta e transação poderia ser armazenada em um banco de dados real (SQL ou NoSQL) em vez de dados mock, permitindo histórico e análises em tempo real. 
- Modelos de ML poderiam identificar padrões de gastos, prever risco de saldo insuficiente e sugerir cortes ou ajustes automáticos, considerando categorias, recorrência e comportamento do usuário.
- Agentes de IA poderiam executar ações automáticas seguras, como enviar notificações, agendar pagamentos ou sugerir transferências, mantendo privacidade e compliance com LGPD.
- As análises atuais (saldo insuficiente, contas vencendo, sugestões de corte) seriam derivadas de inferências do modelo, em vez de regras fixas, tornando a assistência mais inteligente e adaptativa.
*/

app.get("/usuario", (req, res) => {
  res.json(usuario);
});

app.get("/contas", (req, res) => {
  res.json(contas);
});

app.get("/analise", (req, res) => {
  const insights = [];

  const contaEnergia = {
    nome: "Energia",
    valor: 120,
    vencimento: "2025-09-28",
  };
  if (contaEnergia.valor > usuario.saldo) {
    insights.push(
      `⚡ Sua conta de energia vence amanhã e o saldo não cobre totalmente. Que tal transferir agora?`
    );
  }

  insights.push(
    `⚠️ Fique de olho: há risco de débito recusado na próxima cobrança!`
  );

  const academia = contas.find((c) => c.nome === "Academia");
  if (academia) {
    insights.push(
      `💡 Que tal cortar a ${academia.nome} (R$ ${academia.valor}) este mês?`
    );
  }

  const netflix = contas.find((c) => c.nome === "Netflix");
  if (netflix) {
    if (usuario.saldo < netflix.valor) {
      insights.push(
        `📉 Previsão de instabilidade: pode faltar R$ ${
          netflix.valor - usuario.saldo
        } para o pagamento da Netflix nesta semana.`
      );
    } else {
      insights.push(
        `🎬 Sua assinatura da ${netflix.nome} de R$ ${netflix.valor} vence amanhã, e o saldo está garantido. Aproveite tranquilo!`
      );
    }
  }

  const agua = contas.find((c) => c.nome === "Água");
  if (agua) {
    insights.push(
      `🚰 Sua conta de água de R$ ${agua.valor} vence em 2 dias. Seu saldo já cobre, pode pagar sem preocupações!`
    );
  }

  const transporte = contas.find((c) => c.nome === "Transporte");
  if (transporte) {
    insights.push(
      `🚍 Nos últimos 7 dias, você gastou R$ 60 a mais com transporte. Vale a pena ajustar essa rota?`
    );
  }

  const mercado = contas.find((c) => c.nome === "Mercado");
  if (mercado) {
    insights.push(
      `🛒 O gasto no mercado subiu 15% este mês. Quer que eu sugira onde cortar para equilibrar?`
    );
  }

  const cartao = contas.find((c) => c.nome === "Cartão de Crédito");
  if (cartao) {
    if (usuario.saldo < cartao.valor) {
      insights.push(
        `💳 Seu cartão vence em 5 dias com fatura de R$ ${cartao.valor}, mas o saldo atual é R$ ${usuario.saldo}. Precisa de um plano?`
      );
    }
  }

  insights.push(
    `🎉 Boa notícia: você pagou todas as contas da semana em dia! Continue assim! 💪`
  );

  res.json({
    mensagem: `Oi ${usuario.nome.split(" ")[0]}! Analisei suas contas 👇`,
    insights,
    opcoes: ["Pagar agora", "Agendar", "Ver cortes", "Copiar boleto/Pix"],
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
