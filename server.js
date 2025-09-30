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
    const data = await loadSeed();
    if (!data?.usuario) {
      return res.status(404).json({ erro: "Usuário não encontrado no seed" });
    }
    // retorna o usuário do seed sem checar cpf (chumbado para mockup)
    res.json(data.usuario);
  } catch (e) {
    console.error(e);
    res.status(500).json({ erro: "Falha ao carregar usuário" });
  }
});

app.get("/contas", async (req, res) => {
  try {
    const { cpf } = req.query;
    if (!cpf)
      return res.status(400).json({ erro: "Informe ?cpf=xxx.xxx.xxx-xx" });

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
    const data = await loadSeed();
    if (!data?.usuario) {
      return res.status(404).json({ erro: "Usuário não encontrado no seed" });
    }

    const usuario = data.usuario;
    const contas = Array.isArray(data.contas) ? data.contas : [];

    const insights = [];

    // Gera insights dinamicamente a partir das contas do seed
    contas.forEach((conta) => {
      switch (conta.nome) {
        case "Energia":
        case "Água":
        case "Cartão de Crédito":
        case "Netflix":
          if (usuario.saldo < conta.valor) {
            let emoji = "";
            if (conta.nome === "Energia") emoji = "⚡";
            if (conta.nome === "Água") emoji = "🚰";
            if (conta.nome === "Cartão de Crédito") emoji = "💳";
            if (conta.nome === "Netflix") emoji = "📉";

            insights.push(
              `${emoji} Sua conta de ${conta.nome} de R$ ${conta.valor} vence em ${conta.vencimento} e o saldo não cobre totalmente.`
            );
          } else {
            if (conta.nome === "Netflix") {
              insights.push(
                `🎬 Sua assinatura da ${conta.nome} de R$ ${conta.valor} vence em ${conta.vencimento}. Saldo garantido!`
              );
            } else if (conta.nome === "Cartão de Crédito") {
              insights.push(
                `💳 Seu cartão de crédito de R$ ${conta.valor} vence em ${conta.vencimento}. Saldo disponível.`
              );
            } else {
              insights.push(
                `✅ Sua conta de ${conta.nome} de R$ ${conta.valor} vence em ${conta.vencimento}. Saldo suficiente!`
              );
            }
          }
          break;

        case "Academia":
          insights.push(
            `💡 Que tal revisar o gasto com ${conta.nome} de R$ ${conta.valor}?`
          );
          break;

        case "Transporte":
          insights.push(
            `🚍 Nos últimos dias, você gastou R$ ${conta.valor} com ${conta.nome}. Vale a pena ajustar?`
          );
          break;

        case "Mercado":
          insights.push(
            `🛒 Gasto no ${conta.nome}: R$ ${conta.valor}. Considere reduzir para equilibrar o orçamento.`
          );
          break;

        default:
          insights.push(`ℹ️ Conta ${conta.nome}: R$ ${conta.valor}`);
      }
    });

    // Insight genérico
    insights.push(
      "🎉 Boa notícia: você pagou todas as contas da semana em dia! Continue assim! 💪"
    );

    // Resposta JSON
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
