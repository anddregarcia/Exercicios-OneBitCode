# Sistema de Autenticação - Despensa Pro

## Visão Geral

O aplicativo Despensa Pro utiliza **Supabase Auth** diretamente no frontend para autenticação, simplificando a arquitetura e removendo a dependência de Edge Functions para login e registro.

## Credenciais de Teste (Demo)

Para testar o aplicativo imediatamente, use as credenciais demo:

- **Email:** `demo@despensapro.com`
- **Senha:** `demo123`

O usuário demo é criado automaticamente quando você acessa a tela de login pela primeira vez.

## Arquitetura

### Frontend (Autenticação)
- Usa `@supabase/supabase-js` diretamente
- Context API (`AuthContext`) gerencia o estado de autenticação
- Supabase Auth lida com:
  - Login com email/senha
  - Registro de novos usuários
  - Gerenciamento de sessão
  - Logout

### Backend (API)
- Edge Functions validam tokens JWT do Supabase
- Cada rota protegida verifica o token do usuário
- Dados são isolados por usuário usando prefixos no KV store: `user:{userId}:*`

## Fluxos de Autenticação

### 1. Login
```typescript
await signIn(email, password);
```
- Usa `supabase.auth.signInWithPassword()`
- Retorna erro se credenciais inválidas
- Cria sessão automaticamente se sucesso

### 2. Registro
```typescript
await signUp(email, password, name);
```
- Usa `supabase.auth.signUp()`
- Pode requerer confirmação de email (dependendo da config do Supabase)
- Armazena nome no `user_metadata`

### 3. Verificação de Sessão
```typescript
const { data: { session } } = await supabase.auth.getSession();
```
- Verifica sessão ativa ao carregar o app
- Listener automático para mudanças de autenticação

### 4. Logout
```typescript
await signOut();
```
- Usa `supabase.auth.signOut()`
- Limpa sessão local e redireciona para login

## Configuração do Supabase

### Confirmação de Email

Por padrão, o Supabase requer confirmação de email. Para desenvolvimento/teste, você pode:

1. **Desabilitar confirmação de email:**
   - Vá em Authentication > Settings no Supabase Dashboard
   - Desative "Enable email confirmations"

2. **Ou configurar servidor de email:**
   - Configure SMTP nas Settings do projeto
   - Emails de confirmação serão enviados automaticamente

### Criação de Usuário Demo

O usuário demo é criado automaticamente através da rota `/create-demo-user` que:
- Verifica se o usuário já existe
- Cria usuário com email confirmado
- Popula dados iniciais (marcas, categorias, lojas, itens)

## Segurança

### Tokens
- Access tokens JWT são usados para autenticar requisições à API
- Tokens são automaticamente incluídos nos headers: `Authorization: Bearer <token>`

### Isolamento de Dados
- Cada usuário só acessa seus próprios dados
- Backend valida o token e extrai o `userId`
- Todas as chaves no KV store usam prefixo: `user:{userId}:`

### Service Role Key
- Nunca exposta ao frontend
- Usada apenas no backend para operações administrativas
- Permite criar usuários com email confirmado (demo user)

## Desenvolvimento Local

### Variáveis de Ambiente Necessárias
```
SUPABASE_URL=https://[PROJECT_ID].supabase.co
SUPABASE_ANON_KEY=[your-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[your-service-role-key]
```

### Teste Rápido
1. Acesse `/login`
2. Clique em "Usar Credenciais Demo"
3. Clique em "Entrar"
4. Você será autenticado com dados pré-populados

## Troubleshooting

### Erro: "Email not confirmed"
- Desabilite confirmação de email no Supabase Dashboard
- Ou configure servidor SMTP

### Erro: "Invalid login credentials"
- Verifique se o usuário demo foi criado
- Tente recarregar a página de login
- Verifique console do navegador para logs

### Erro: "Unauthorized" nas APIs
- Verifique se o token está sendo enviado
- Confirme que está logado
- Limpe o localStorage e faça login novamente

## Próximos Passos

Para produção:
1. Configure servidor de email no Supabase
2. Habilite confirmação de email
3. Configure políticas de senha (mínimo caracteres, etc)
4. Adicione 2FA (Two-Factor Authentication)
5. Configure rate limiting para prevenir ataques
6. Adicione recuperação de senha
