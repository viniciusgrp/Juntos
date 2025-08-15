'use client'

import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Alert
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
import { useDashboardStats } from '@/hooks/use-transactions'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const DashboardPage = () => {
  const { data: dashboardData, isLoading, error } = useDashboardStats()

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        Erro ao carregar dados do dashboard. Tente novamente.
      </Alert>
    )
  }

  if (!dashboardData) {
    return (
      <Alert severity="info" sx={{ mb: 3 }}>
        Nenhum dado disponível no momento.
      </Alert>
    )
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  const formatChange = (change: number) => {
    const prefix = change >= 0 ? '+' : ''
    return `${prefix}${change.toFixed(1)}%`
  }

  const getChangeColor = (change: number) => {
    if (change > 0) return 'success.main'
    if (change < 0) return 'error.main'
    return 'text.secondary'
  }

  const stats = [
    {
      title: 'Saldo Total',
      value: formatCurrency(dashboardData.totalBalance),
      change: 'Todas as contas',
      icon: <AttachMoney />,
      color: 'primary.main'
    },
    {
      title: 'Receitas do Mês',
      value: formatCurrency(dashboardData.currentMonthIncomes),
      change: formatChange(dashboardData.incomeChange),
      icon: <TrendingUp />,
      color: getChangeColor(dashboardData.incomeChange)
    },
    {
      title: 'Despesas do Mês',
      value: formatCurrency(dashboardData.currentMonthExpenses),
      change: formatChange(dashboardData.expenseChange),
      icon: <TrendingDown />,
      color: getChangeColor(dashboardData.expenseChange)
    },
    {
      title: 'Cartões de Crédito',
      value: formatCurrency(dashboardData.creditCardExpenses),
      change: formatChange(dashboardData.creditCardChange),
      icon: <CreditCard />,
      color: getChangeColor(dashboardData.creditCardChange)
    }
  ]

  const recentTransactions = dashboardData.recentTransactions.map(transaction => ({
    id: transaction.id,
    title: transaction.description,
    description: `${transaction.category} ${transaction.account ? `• ${transaction.account}` : ''} ${transaction.creditCard ? `• ${transaction.creditCard}` : ''}`,
    value: `${transaction.type === 'INCOME' ? '+' : '-'} ${formatCurrency(transaction.amount)}`,
    time: format(new Date(transaction.date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR }),
    type: transaction.type === 'INCOME' ? 'receita' : 'despesa',
    category: transaction.category,
    icon: transaction.type === 'INCOME' 
      ? <TrendingUp color="success" />
      : <TrendingDown color="error" />
  }))

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
          {/* Distribuição por Categoria */}
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Distribuição por Categoria
            </Typography>
            {dashboardData.categoryDistribution.slice(0, 4).map((category, index) => (
              <ProgressBar 
                key={category.name}
                label={category.name} 
                value={category.percentage} 
                color={index === 0 ? "error" : index === 1 ? "warning" : index === 2 ? "info" : "success"} 
              />
            ))}
            {dashboardData.categoryDistribution.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                Nenhuma despesa categorizada este mês
              </Typography>
            )}
          </Paper>

          {/* Resumo das Contas */}
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Resumo das Contas
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {dashboardData.accounts.map((account) => (
                <Box key={account.id} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {account.type === 'checking' && <AccountBalance color="primary" />}
                    {account.type === 'savings' && <Savings color="success" />}
                    {account.type === 'investment' && <TrendingUp color="info" />}
                    {account.type === 'cash' && <AttachMoney color="warning" />}
                    <Typography variant="body2">{account.name}</Typography>
                  </Box>
                  <Typography 
                    variant="body2" 
                    fontWeight="bold"
                    color={account.balance >= 0 ? 'text.primary' : 'error.main'}
                  >
                    {formatCurrency(account.balance)}
                  </Typography>
                </Box>
              ))}
              {dashboardData.accounts.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                  Nenhuma conta cadastrada
                </Typography>
              )}
            </Box>
          </Paper>

          {/* Cartões de Crédito */}
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Cartões de Crédito
            </Typography>
            {dashboardData.creditCards.map((creditCard) => {
              const usagePercentage = (creditCard.currentExpenses / creditCard.limit) * 100
              return (
                <Box key={creditCard.id} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">{creditCard.name}</Typography>
                    <Typography variant="body2" color="error.main">
                      {formatCurrency(creditCard.currentExpenses)}
                    </Typography>
                  </Box>
                  <ProgressBar 
                    label="Limite usado" 
                    value={usagePercentage}
                    displayValue={`${formatCurrency(creditCard.currentExpenses)} / ${formatCurrency(creditCard.limit)}`}
                    color={usagePercentage > 80 ? "error" : usagePercentage > 60 ? "warning" : "success"} 
                  />
                </Box>
              )
            })}
            {dashboardData.creditCards.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                Nenhum cartão de crédito cadastrado
              </Typography>
            )}
          </Paper>
        </Box>
      </Box>
    </Box>
  )
}

export default DashboardPage
