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
2. Rode o SQL em `supabase/schema.sql` para criar as tabelas no schema `budget`.
3. No painel do Supabase, exponha o schema `budget` em **Settings > API > Exposed schemas**. Se preferir usar o backend com privilégios de servidor, defina `SUPABASE_SERVICE_ROLE_KEY`.
4. Instale dependências e inicie:

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
