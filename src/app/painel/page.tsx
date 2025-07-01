'use client'

import {
  Box,
  Paper,
  Typography
} from '@mui/material'
import {
  TrendingUp,
  TrendingDown,
  AccountBalance,
  CreditCard,
  Savings,
  AttachMoney
} from '@mui/icons-material'
import { 
  StatsGrid, 
  TransactionList, 
  ProgressBar 
} from '@/components/ui'

const DashboardPage = () => {
  const stats = [
    {
      title: 'Saldo Total',
      value: 'R$ 15.847,25',
      change: '+5.2%',
      icon: <AttachMoney />,
      color: 'primary.main'
    },
    {
      title: 'Receitas do Mês',
      value: 'R$ 8.547,80',
      change: '+12%',
      icon: <TrendingUp />,
      color: 'success.main'
    },
    {
      title: 'Despesas do Mês',
      value: 'R$ 3.156,40',
      change: '-8%',
      icon: <TrendingDown />,
      color: 'error.main'
    },
    {
      title: 'Cartões de Crédito',
      value: 'R$ 2.450,00',
      change: '+15%',
      icon: <CreditCard />,
      color: 'warning.main'
    }
  ]

  const recentTransactions = [
    {
      id: 1,
      title: 'Salário - Empresa XYZ',
      description: 'Depósito em conta corrente',
      value: '+ R$ 5.500,00',
      time: '2 min atrás',
      type: 'receita',
      category: 'Trabalho',
      icon: <TrendingUp color="success" />
    },
    {
      id: 2,
      title: 'Supermercado ABC',
      description: 'Compras do mês',
      value: '- R$ 245,80',
      time: '15 min atrás',
      type: 'despesa',
      category: 'Alimentação',
      icon: <TrendingDown color="error" />
    },
    {
      id: 3,
      title: 'Freelance - Design',
      description: 'Projeto de identidade visual',
      value: '+ R$ 1.200,00',
      time: '1 hora atrás',
      type: 'receita',
      category: 'Freelance',
      icon: <TrendingUp color="success" />
    },
    {
      id: 4,
      title: 'Conta de Luz',
      description: 'Fatura de janeiro',
      value: '- R$ 156,90',
      time: '2 horas atrás',
      type: 'despesa',
      category: 'Utilidades',
      icon: <TrendingDown color="error" />
    }
  ]

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Dashboard Financeiro
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Visão geral das suas finanças pessoais
        </Typography>
      </Box>

      {/* Stats Cards */}
      <StatsGrid 
        stats={stats}
        size="large"
      />

      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
        gap: 3 
      }}>
        {/* Recent Transactions */}
        <TransactionList
          title="Transações Recentes"
          transactions={recentTransactions}
        />

        {/* Quick Stats */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Distribuição por Categoria
            </Typography>
            <ProgressBar label="Alimentação" value={35} color="error" />
            <ProgressBar label="Moradia" value={28} color="warning" />
            <ProgressBar label="Transporte" value={15} color="info" />
            <ProgressBar label="Outros" value={22} color="success" />
          </Paper>

          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Resumo das Contas
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccountBalance color="primary" />
                  <Typography variant="body2">Conta Corrente</Typography>
                </Box>
                <Typography variant="body2" fontWeight="bold">R$ 3.247,80</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Savings color="success" />
                  <Typography variant="body2">Poupança</Typography>
                </Box>
                <Typography variant="body2" fontWeight="bold">R$ 12.599,45</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CreditCard color="warning" />
                  <Typography variant="body2">Cartão de Crédito</Typography>
                </Box>
                <Typography variant="body2" fontWeight="bold" color="error.main">-R$ 2.450,00</Typography>
              </Box>
            </Box>
          </Paper>

          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Metas do Mês
            </Typography>
            <ProgressBar 
              label="Economia" 
              value={1200} 
              maxValue={2000}
              displayValue="R$ 1.200 / R$ 2.000"
              color="success" 
            />
            <ProgressBar 
              label="Limite Cartão" 
              value={2450} 
              maxValue={5000}
              displayValue="R$ 2.450 / R$ 5.000"
              color="warning" 
            />
          </Paper>
        </Box>
      </Box>
    </Box>
  )
}

export default DashboardPage
