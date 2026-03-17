# athome.orcamentos

SaaS web para geração de orçamentos de manutenção residencial.

## Stack
- Next.js App Router + React
- Tailwind CSS
- React Query
- Supabase Auth + PostgreSQL (schema `budget`)
- API routes Node.js
- PDF com Puppeteer

## Como rodar
1. Copie `.env.example` para `.env.local` e preencha as chaves do Supabase.
2. Rode o SQL em `supabase/schema.sql`.
3. Instale dependências e inicie:

```bash
npm install
npm run dev
```

## Entregas implementadas
- Login sem auto cadastro.
- Dashboard com filtros e ordenação por status/data/cliente.
- Criação/edição/duplicação de orçamento.
- Rascunho automático.
- CRUD de clientes, materiais e configurações.
- Geração de PDF e botão para compartilhar no WhatsApp.
- RLS com isolamento por usuário (`user_id`).
