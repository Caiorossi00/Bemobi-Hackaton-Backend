
const express = require("express");
const cors = require("cors");
const fs = require("fs/promises");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

//Ler dados do seed.json 
async function loadSeed() {
  const file = path.join(__dirname, "seed.json");
  const raw = await fs.readFile(file, "utf-8");
  return JSON.parse(raw);
}

//  Endpoints 

app.get("/usuario", async (req, res) => {
  try {
    const { cpf } = req.query;    const data = await loadSeed();
    if (!data?.usuario || data.usuario.cpf !== cpf) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }
    res.json(data.usuario);
  } catch (e) {
    console.error(e);
    res.status(500).json({ erro: "Falha ao carregar usuário" });
  }
});

app.get("/contas", async (req, res) => {
  try {
    const { cpf } = req.query;
    if (!cpf) return res.status(400).json({ erro: "Informe ?cpf=xxx.xxx.xxx-xx" });

    const data = await loadSeed();
    if (!data?.usuario || data.usuario.cpf !== cpf) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }
    res.json(Array.isArray(data.contas) ? data.contas : []);
  } catch (e) {
    console.error(e);
    res.status(500).json({ erro: "Falha ao carregar contas" });
  }
});

app.get("/analise", async (req, res) => {
  try {
    const { cpf } = req.query;
    if (!cpf) return res.status(400).json({ erro: "Informe ?cpf=xxx.xxx.xxx-xx" });

    const data = await loadSeed();
    if (!data?.usuario || data.usuario.cpf !== cpf) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    const usuario = data.usuario;
    const contas = Array.isArray(data.contas) ? data.contas : [];

    const insights = [];

    
    const contaEnergia = { nome: "Energia", valor: 120, vencimento: "2025-09-28" };
    if (contaEnergia.valor > usuario.saldo) {
      insights.push("⚡ Sua conta de energia vence amanhã e o saldo não cobre totalmente. Que tal transferir agora?");
    }

    insights.push("⚠️ Fique de olho: há risco de débito recusado na próxima cobrança!");

    const findByName = (nome) => contas.find((c) => c.nome === nome);

    const academia = findByName("Academia");
    if (academia) {
      insights.push(`💡 Que tal cortar a ${academia.nome} (R$ ${academia.valor}) este mês?`);
    }

    const netflix = findByName("Netflix");
    if (netflix) {
      if (usuario.saldo < netflix.valor) {
        insights.push(`📉 Previsão de instabilidade: pode faltar R$ ${netflix.valor - usuario.saldo} para o pagamento da Netflix nesta semana.`);
      } else {
        insights.push(`🎬 Sua assinatura da ${netflix.nome} de R$ ${netflix.valor} vence amanhã, e o saldo está garantido. Aproveite tranquilo!`);
      }
    }

    const agua = findByName("Água");
    if (agua) {
      insights.push(`🚰 Sua conta de água de R$ ${agua.valor} vence em 2 dias. Seu saldo já cobre, pode pagar sem preocupações!`);
    }

    const transporte = findByName("Transporte");
    if (transporte) {
      insights.push("🚍 Nos últimos 7 dias, você gastou R$ 60 a mais com transporte. Vale a pena ajustar essa rota?");
    }

    const mercado = findByName("Mercado");
    if (mercado) {
      insights.push("🛒 O gasto no mercado subiu 15% este mês. Quer que eu sugira onde cortar para equilibrar?");
    }

    const cartao = findByName("Cartão de Crédito");
    if (cartao && usuario.saldo < cartao.valor) {
      insights.push(`💳 Seu cartão vence em 5 dias com fatura de R$ ${cartao.valor}, mas o saldo atual é R$ ${usuario.saldo}. Precisa de um plano?`);
    }

    insights.push("🎉 Boa notícia: você pagou todas as contas da semana em dia! Continue assim! 💪");

    res.json({
      mensagem: `Oi ${usuario.nome.split(" ")[0]}! Analisei suas contas 👇`,
      insights,
      opcoes: ["Pagar agora", "Agendar", "Ver cortes", "Copiar boleto/Pix"],
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ erro: "Falha ao gerar análise" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
