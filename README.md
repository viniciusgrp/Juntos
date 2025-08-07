# Juntos - Gestão Financeira Pessoal - EM DESENVOLVIMENTO - Funcional: Criar usuário, sistema de autenticação, criação de contas bancárias e transações entre contas.

Uma plataforma moderna e intuitiva para gerenciar suas finanças pessoais, criada com foco na simplicidade e funcionalidade.

🌐 **Acesse a aplicação**: [juntos.viniciusgrp.com.br](https://juntos.viniciusgrp.com.br/)

## 📋 Sobre o Projeto

O Juntos é um sistema completo de gestão financeira que permite controlar contas, receitas, despesas, categorias e muito mais. A interface foi desenvolvida pensando na experiência do usuário, com design responsivo e componentes reutilizáveis.

### ✨ Principais Funcionalidades

- **Gestão de Contas**: Criação e gerenciamento de contas bancárias, poupanças, investimentos e carteiras
- **Controle de Receitas e Despesas**: Acompanhamento detalhado do fluxo financeiro
- **Categorização**: Organização das transações por categorias personalizáveis
- **Cartões de Crédito**: Controle específico para cartões e suas faturas
- **Transferências**: Sistema de transferência entre contas próprias
- **Dashboard**: Visão geral com estatísticas e gráficos informativos
- **Filtros Avançados**: Busca e filtragem inteligente de dados
- **Responsividade**: Interface adaptada para desktop, tablet e mobile

## 🛠️ Tecnologias Utilizadas

- **Framework**: Next.js 15.3.4 (React 19)
- **UI/UX**: Material-UI (MUI) v7 + Custom Components
- **Estado Global**: Zustand
- **Consultas**: TanStack Query (React Query)
- **Formulários**: React Hook Form + Yup
- **HTTP Client**: Axios
- **Estilização**: CSS-in-JS (Emotion) + Material-UI
- **TypeScript**: Tipagem completa para maior segurança

## 🚀 Rodando Localmente

### Pré-requisitos
- Node.js 18+ instalado
- Gerenciador de pacotes npm ou yarn

### Configuração

1. Clone o repositório:
```bash
git clone [url-do-repositorio]
cd Juntos
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env.local
```

4. Configure a URL da API no `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

5. Execute o projeto em desenvolvimento:
```bash
npm run dev
```

6. Abra [http://localhost:3000](http://localhost:3000) no seu navegador

### Scripts Disponíveis

- `npm run dev` - Executa em modo desenvolvimento
- `npm run build` - Gera build de produção
- `npm run start` - Executa build de produção
- `npm run lint` - Executa verificação de código

## 📁 Estrutura do Projeto

```
src/
├── app/                    # App Router (Next.js 13+)
│   ├── painel/            # Páginas do dashboard
│   │   ├── contas/        # Gestão de contas
│   │   ├── receitas/      # Controle de receitas
│   │   ├── despesas/      # Controle de despesas
│   │   └── ...
│   └── layout.tsx
├── components/            # Componentes reutilizáveis
│   ├── accounts/         # Componentes específicos de contas
│   ├── ui/               # Componentes base da UI
│   └── ...
├── hooks/                # Custom hooks
├── services/             # Serviços de API
├── types/                # Definições TypeScript
├── stores/               # Estados globais (Zustand)
└── lib/                  # Utilitários e configurações
```

## 🎨 Design System

O projeto utiliza um design system consistente baseado no Material-UI, com:

- **Componentes Base**: Botões, inputs, cards, modais padronizados
- **Grid System**: Layout responsivo com CSS Grid
- **Tema**: Sistema de cores e tipografia consistente
- **Máscaras**: Formatação automática de valores monetários
- **Feedback Visual**: Snackbars, loading states e validações

## 🔗 Integração com Backend

A aplicação consome dados da API hospedada em: [apijuntos.viniciusgrp.com.br](https://apijuntos.viniciusgrp.com.br/)

- Autenticação via JWT
- Cache inteligente com React Query
- Tratamento de erros padronizado
- Estados de loading e erro

## 📱 Recursos de UX

- **Filtros Inteligentes**: Mantém visibilidade durante a digitação
- **Feedback Imediato**: Validações em tempo real
- **Estados de Loading**: Indicadores visuais para todas as operações
- **Mensagens Contextuais**: Diferentes feedbacks baseados no estado
- **Navegação Fluida**: Transições suaves entre páginas

## 🚀 Deploy

A aplicação está hospedada na **Vercel** com deploy automático a cada push na branch principal.

**URL de Produção**: [juntos.viniciusgrp.com.br](https://juntos.viniciusgrp.com.br/)

## 📧 Contato

Para dúvidas ou sugestões sobre o frontend, entre em contato através dos canais disponíveis no projeto.
