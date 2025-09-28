# Bê - A Assistente de Finanças Pessoais da Bemobi

Bê é uma assistente financeira pessoal que ajuda os usuários a monitorar suas contas, prever gastos e receber recomendações inteligentes sobre como administrar melhor seu dinheiro. Ela oferece insights personalizados sobre pagamentos, saldo disponível e cortes de gastos, tudo de maneira simples e prática.

---

## Funcionalidades Atuais

- **Calendário de Pagamentos**: Mostra as contas a vencer e os valores correspondentes.
- **Análise de Saldo**: Avalia o saldo do usuário frente aos pagamentos futuros.
- **Sugestões de Corte**: Indica despesas que podem ser ajustadas ou cortadas para equilibrar o orçamento.
- **Feedback Simples e Fácil**: Insights rápidos e claros sobre contas vencendo, riscos de saldo insuficiente e dicas de economia.
- **Notificações de Contas**: Alertas sobre pagamentos próximos ou possíveis recusas de débito.
- **Front-end Interativo**: Cards diários que destacam informações importantes com ícones e emojis para facilitar a leitura.

---

## Tecnologias Utilizadas

- **Back-end**: Node.js, Express.js
- **Front-end**: HTML, CSS
- **Comunicação**: Rotas RESTful com JSON
- **Controle de CORS**: Permite acesso seguro do front-end ao back-end

---

## Possível Evolução com Machine Learning e Agentes de IA

No futuro, este backend pode evoluir para usar **Machine Learning (ML)** e **agentes de IA** para gerar análises e recomendações mais sofisticadas:

- Cada conta e transação poderia ser armazenada em um **banco de dados real** (SQL ou NoSQL) ao invés de dados mock, permitindo histórico e análises em tempo real.

- Modelos de ML poderiam **identificar padrões de gastos**, prever risco de saldo insuficiente e sugerir cortes ou ajustes automáticos, considerando categorias, recorrência e comportamento do usuário.

- Agentes de IA poderiam executar **ações automáticas seguras**, como enviar notificações, agendar pagamentos ou sugerir transferências, mantendo privacidade e compliance com a LGPD.

- As análises atuais (saldo insuficiente, contas vencendo, sugestões de corte) seriam derivadas de **inferências do modelo**, tornando a assistência mais inteligente, personalizada e adaptativa.


## Estrutura de Dados

Exemplo de usuário mock:

```json
{
  "id": "user_001",
  "nome": "Caio Rossi",
  "saldo": 250.0,
  "saldoPrevisto": 200.0
}
