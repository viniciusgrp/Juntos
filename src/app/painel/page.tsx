'use client'

import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Chip,
  LinearProgress
} from '@mui/material'
import {
  TrendingUp,
  TrendingDown,
  AccountBalance,
  CreditCard,
  Savings,
  AttachMoney
} from '@mui/icons-material'

const DashboardPage = () => {
  const stats = [
    {
      title: 'Saldo Total',
      value: 'R$ 15.847,25',
      change: '+5.2%',
      icon: <AttachMoney sx={{ fontSize: 40 }} />,
      color: 'primary.main'
    },
    {
      title: 'Receitas do Mês',
      value: 'R$ 8.547,80',
      change: '+12%',
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      color: 'success.main'
    },
    {
      title: 'Despesas do Mês',
      value: 'R$ 3.156,40',
      change: '-8%',
      icon: <TrendingDown sx={{ fontSize: 40 }} />,
      color: 'error.main'
    },
    {
      title: 'Cartões de Crédito',
      value: 'R$ 2.450,00',
      change: '+15%',
      icon: <CreditCard sx={{ fontSize: 40 }} />,
      color: 'warning.main'
    }
  ]

  const recentTransactions = [
    {
      title: 'Salário - Empresa XYZ',
      description: 'Depósito em conta corrente',
      value: '+ R$ 5.500,00',
      time: '2 min atrás',
      type: 'receita',
      category: 'Trabalho'
    },
    {
      title: 'Supermercado ABC',
      description: 'Compras do mês',
      value: '- R$ 245,80',
      time: '15 min atrás',
      type: 'despesa',
      category: 'Alimentação'
    },
    {
      title: 'Freelance - Design',
      description: 'Projeto de identidade visual',
      value: '+ R$ 1.200,00',
      time: '1 hora atrás',
      type: 'receita',
      category: 'Freelance'
    },
    {
      title: 'Conta de Luz',
      description: 'Fatura de janeiro',
      value: '- R$ 156,90',
      time: '2 horas atrás',
      type: 'despesa',
      category: 'Utilidades'
    }
  ]

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'receita':
        return <TrendingUp color="success" />
      case 'despesa':
        return <TrendingDown color="error" />
      default:
        return <AttachMoney color="primary" />
    }
  }

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'receita':
        return 'success'
      case 'despesa':
        return 'error'
      default:
        return 'default'
    }
  }

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
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
        gap: 3,
        mb: 4 
      }}>
        {stats.map((stat, index) => (
          <Card elevation={2} key={index}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h5" component="div" fontWeight="bold">
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {stat.title}
                  </Typography>
                  <Chip 
                    label={stat.change}
                    size="small"
                    color={stat.change.startsWith('+') ? 'success' : 'error'}
                    variant="outlined"
                  />
                </Box>
                <Avatar sx={{ bgcolor: stat.color, width: 60, height: 60 }}>
                  {stat.icon}
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
        gap: 3 
      }}>
        {/* Recent Transactions */}
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Transações Recentes
          </Typography>
          <List>
            {recentTransactions.map((transaction, index) => (
              <ListItem key={index} divider={index < recentTransactions.length - 1}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'background.paper', border: 1, borderColor: 'divider' }}>
                    {getTransactionIcon(transaction.type)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="body1" fontWeight="medium">
                        {transaction.title}
                      </Typography>
                      <Typography 
                        variant="body1" 
                        fontWeight="bold"
                        color={transaction.type === 'receita' ? 'success.main' : 'error.main'}
                      >
                        {transaction.value}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <Typography variant="body2" color="text.secondary">
                          {transaction.description}
                        </Typography>
                        <Chip 
                          label={transaction.category}
                          size="small"
                          color={getTransactionColor(transaction.type) as 'success' | 'error' | 'default'}
                          variant="outlined"
                        />
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {transaction.time}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Paper>

        {/* Quick Stats */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Distribuição por Categoria
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Alimentação</Typography>
                <Typography variant="body2">35%</Typography>
              </Box>
              <LinearProgress variant="determinate" value={35} color="error" />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Moradia</Typography>
                <Typography variant="body2">28%</Typography>
              </Box>
              <LinearProgress variant="determinate" value={28} color="warning" />
            </Box>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Transporte</Typography>
                <Typography variant="body2">15%</Typography>
              </Box>
              <LinearProgress variant="determinate" value={15} color="info" />
            </Box>
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Outros</Typography>
                <Typography variant="body2">22%</Typography>
              </Box>
              <LinearProgress variant="determinate" value={22} color="success" />
            </Box>
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
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Economia</Typography>
                  <Typography variant="body2">R$ 1.200 / R$ 2.000</Typography>
                </Box>
                <LinearProgress variant="determinate" value={60} color="success" />
              </Box>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Limite Cartão</Typography>
                  <Typography variant="body2">R$ 2.450 / R$ 5.000</Typography>
                </Box>
                <LinearProgress variant="determinate" value={49} color="warning" />
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  )
}

export default DashboardPage
