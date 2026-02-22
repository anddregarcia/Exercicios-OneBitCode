# Despensa Pro 🛒

Aplicativo SaaS moderno e inteligente para gerenciamento de despensa com foco em histórico de preços e controle de compras.

## 🎯 Funcionalidades

### 📊 Dashboard
- Visualização de gastos mensais
- Quantidade de compras realizadas
- Mercado mais utilizado
- Gráfico de evolução de gastos (6 meses)
- Alertas de itens com maior aumento de preço
- Destaque para itens com menor preço histórico

### 🛍️ Nova Compra (Tela Principal)
- Seleção de mercado e data
- Tabela completa de itens com:
  - Checkbox para selecionar itens comprados
  - Campos para preço unitário e quantidade
  - Exibição do último preço pago
  - Análise automática:
    - ✅ "Menor preço histórico"
    - ⚠️ "X% acima da média"
  - Botão de histórico com gráfico de evolução
- **Cadastro Rápido** sem sair da tela:
  - ➕ Novo Item (com opção de criar marca e categoria na hora)
  - ➕ Novo Mercado
- Layout responsivo (Desktop e Mobile)

### 📦 Despensa
- Visualização de estoque atual
- Quantidade disponível por item
- Data de abertura da embalagem
- Último preço pago e mercado
- Alertas visuais:
  - 🔴 Estoque baixo (≤ 0.3)
  - ⚠️ Produto aberto há mais de 30 dias
- Edição de quantidade com data de abertura

### ⚙️ Cadastros
Sistema completo de gerenciamento:
- **Itens**: Nome, marca, categoria, unidade, vegano
- **Marcas**: Nome, vegana
- **Categorias**: Nome
- **Unidades**: Nome, abreviação (kg, L, un, etc)
- **Mercados**: Nome, endereço

### 🔐 Autenticação
- Tela de Login moderna
- Tela de Registro de conta
- Sistema de planos (Gratuito/Premium)

### 💎 Página de Pricing
- Plano Gratuito (até 20 itens)
- Plano Premium (R$ 9,90/mês)
- Plano Premium Plus (R$ 19,90/mês)
- FAQ completa
- CTA para conversão

## 🎨 Design

### Paleta de Cores
- **Primária**: Verde água/petróleo (#0d9488)
- **Sucesso**: Verde (#10b981)
- **Alerta**: Laranja (#f59e0b)
- **Erro**: Vermelho suave (#ef4444)
- **Neutros**: Branco, cinza claro, cinza médio

### Características
- Minimalista e clean
- Muito espaçamento (whitespace)
- Ícones simples (Lucide React)
- Hierarquia visual clara
- Responsivo (Desktop e Mobile)

## 🔧 Tecnologias

- **Frontend**: React + TypeScript
- **Roteamento**: React Router v7
- **UI**: Radix UI + Tailwind CSS v4
- **Gráficos**: Recharts
- **Backend**: Supabase (Edge Functions + KV Store)
- **Notificações**: Sonner
- **Validação**: React Hook Form

## 🚀 Como Usar

### Primeiro Acesso
1. Ao acessar pela primeira vez, dados de exemplo serão carregados automaticamente
2. Você pode começar a usar imediatamente ou customizar conforme necessário

### Fluxo de Uso Recomendado

#### 1. Configure seus Cadastros Básicos
- Vá em **Itens** (menu lateral)
- Cadastre suas marcas favoritas
- Adicione categorias personalizadas
- Configure mercados que você frequenta

#### 2. Cadastre seus Itens
- Na aba **Itens**, clique em "Novo Item"
- Preencha: nome, marca, categoria, unidade
- Marque se é vegano (opcional)

#### 3. Registre suas Compras
- Vá em **Nova Compra**
- Selecione o mercado e data
- Marque os itens comprados
- Preencha preço e quantidade
- Clique em "Salvar Compra"

**Dica**: Se um item ou mercado não existe, clique no botão "+" ao lado do campo para cadastrar rapidamente!

#### 4. Acompanhe no Dashboard
- Visualize seus gastos mensais
- Veja quais itens aumentaram de preço
- Identifique oportunidades de economia

#### 5. Gerencie seu Estoque
- Acesse **Despensa**
- Atualize quantidades conforme consome
- Marque data de abertura para produtos perecíveis
- Receba alertas de estoque baixo

## 💡 Recursos Avançados

### Análise Inteligente de Preços
O sistema calcula automaticamente:
- Preço médio histórico
- Menor preço já registrado
- Variação percentual
- Comparação com compras anteriores

### Cadastro Rápido Durante Compras
Ideal para usar no supermercado:
1. Abra "Nova Compra"
2. Encontrou um item novo? Clique em "Cadastrar Novo Item"
3. No formulário, se a marca não existe, clique em "Nova"
4. Cadastre marca e categoria sem sair da tela
5. Volte e finalize o cadastro do item
6. Continue registrando sua compra!

### Histórico Detalhado
Ao clicar em "Histórico" de qualquer item:
- Veja gráfico de evolução de preços
- Compare preços entre mercados
- Identifique tendências de aumento/redução
- Tome decisões mais inteligentes

## 📱 Responsividade

### Desktop
- Sidebar fixa com navegação
- Tabelas completas com todas as colunas
- Gráficos em tela cheia
- Layouts de 2-3 colunas

### Mobile
- Menu hamburguer
- Tabelas transformadas em cards
- Botões maiores para fácil toque
- Layout de coluna única
- Digitação otimizada

## 🔒 Segurança

- Dados armazenados no Supabase (criptografado)
- Acesso via API autenticada
- Validação de dados no frontend e backend
- Proteção contra injeção de código

## 🎯 Casos de Uso

1. **Economia Doméstica**: Compare preços entre mercados e economize
2. **Controle de Estoque**: Nunca mais deixe faltar itens essenciais
3. **Planejamento Financeiro**: Acompanhe gastos mensais
4. **Decisão de Compra**: Saiba se o preço está bom antes de comprar
5. **Dieta Restritiva**: Filtros para produtos veganos
6. **Família**: Compartilhe listas e controle consumo

## 🚀 Próximos Passos Sugeridos

1. **Teste o Fluxo Completo**:
   - Cadastre 2-3 mercados que você frequenta
   - Adicione 10-15 itens que você compra regularmente
   - Registre uma compra completa
   - Explore o dashboard

2. **Use no Supermercado**:
   - Abra "Nova Compra" no celular
   - Selecione o mercado
   - Vá marcando itens e preços conforme compra
   - Ao finalizar, salve a compra

3. **Acompanhe por 1 Mês**:
   - Registre todas as compras
   - Ao final do mês, analise o dashboard
   - Identifique padrões e oportunidades de economia

## 🎨 Personalização

Você pode personalizar:
- Marcas e categorias conforme suas preferências
- Unidades de medida personalizadas
- Lista de mercados da sua região
- Itens específicos da sua rotina

## 📞 Suporte

Para dúvidas ou sugestões, use o sistema de feedback integrado (em desenvolvimento).

---

**Despensa Pro** - Controle inteligente de compras 🛒✨
