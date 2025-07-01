'use client'

import { useState } from 'react'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Button,
  Avatar,
  LinearProgress,
  TextField,
  InputAdornment
} from '@mui/material'
import {
  CreditCard,
  Edit,
  Delete,
  Add,
  Search,
  Block,
  CheckCircle,
  Receipt,
  Payment
} from '@mui/icons-material'

const CartoesPage = () => {
  const [searchTerm, setSearchTerm] = useState('')

  // Mock data for credit cards
  const stats = [
    {
      title: 'Limite Total',
      value: 'R$ 12.500,00',
      change: '+5%',
      icon: <CreditCard sx={{ fontSize: 32 }} />,
      color: 'primary.main'
    },
    {
      title: 'Utilizado',
      value: 'R$ 4.230,50',
      change: '+12%',
      icon: <Payment sx={{ fontSize: 32 }} />,
      color: 'warning.main'
    },
    {
      title: 'Disponível',
      value: 'R$ 8.269,50',
      change: '-7%',
      icon: <CheckCircle sx={{ fontSize: 32 }} />,
      color: 'success.main'
    },
    {
      title: 'Fatura Atual',
      value: 'R$ 2.450,00',
      change: '+15%',
      icon: <Receipt sx={{ fontSize: 32 }} />,
      color: 'error.main'
    }
  ]

  const creditCards = [
    {
      id: 1,
      name: 'Nubank Roxinho',
      bank: 'Nubank',
      number: '**** **** **** 1234',
      brand: 'Mastercard',
      limit: 5000.00,
      used: 2450.00,
      available: 2550.00,
      dueDate: '2024-02-15',
      currentBill: 2450.00,
      status: 'Ativo',
      type: 'Nacional',
      annualFee: 0,
      color: '#8A05BE'
    },
    {
      id: 2,
      name: 'Inter Gold',
      bank: 'Banco Inter',
      number: '**** **** **** 5678',
      brand: 'Visa',
      limit: 3500.00,
      used: 1280.50,
      available: 2219.50,
      dueDate: '2024-02-20',
      currentBill: 1280.50,
      status: 'Ativo',
      type: 'Nacional',
      annualFee: 0,
      color: '#FF7A00'
    },
    {
      id: 3,
      name: 'Santander SX',
      bank: 'Santander',
      number: '**** **** **** 9012',
      brand: 'Mastercard',
      limit: 4000.00,
      used: 500.00,
      available: 3500.00,
      dueDate: '2024-02-25',
      currentBill: 500.00,
      status: 'Ativo',
      type: 'Internacional',
      annualFee: 120.00,
      color: '#EC0000'
    },
    {
      id: 4,
      name: 'C6 Bank Carbon',
      bank: 'C6 Bank',
      number: '**** **** **** 3456',
      brand: 'Mastercard',
      limit: 0,
      used: 0,
      available: 0,
      dueDate: '-',
      currentBill: 0,
      status: 'Bloqueado',
      type: 'Nacional',
      annualFee: 0,
      color: '#000000'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativo':
        return 'success'
      case 'Inativo':
        return 'default'
      case 'Bloqueado':
        return 'error'
      case 'Vencido':
        return 'warning'
      default:
        return 'default'
    }
  }

  const getUsageColor = (percentage: number) => {
    if (percentage >= 80) return 'error'
    if (percentage >= 50) return 'warning'
    return 'success'
  }

  const calculateUsagePercentage = (used: number, limit: number) => {
    if (limit === 0) return 0
    return (used / limit) * 100
  }

  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2).replace('.', ',')}`
  }

  const filteredCards = creditCards.filter(card => {
    const matchesSearch = card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         card.bank.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         card.brand.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
            Cartões de Crédito
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gerencie seus cartões e acompanhe limites e faturas
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          size="large"
        >
          Novo Cartão
        </Button>
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
                    color={stat.change.startsWith('+') ? 'error' : 'success'}
                    variant="outlined"
                  />
                </Box>
                <Avatar sx={{ bgcolor: stat.color, width: 56, height: 56 }}>
                  {stat.icon}
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Search */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <TextField
          placeholder="Buscar cartões..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 300 }}
        />
      </Paper>

      {/* Credit Cards Grid */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
        gap: 3,
        mb: 4
      }}>
        {filteredCards.map((card) => {
          const usagePercentage = calculateUsagePercentage(card.used, card.limit)
          return (
            <Card key={card.id} elevation={3} sx={{ position: 'relative', overflow: 'visible' }}>
              <CardContent sx={{ p: 3 }}>
                {/* Card Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {card.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {card.bank} • {card.brand}
                    </Typography>
                  </Box>
                  <Chip 
                    label={card.status}
                    size="small"
                    color={getStatusColor(card.status) as 'success' | 'error' | 'warning' | 'default'}
                  />
                </Box>

                {/* Card Number */}
                <Typography variant="h6" sx={{ mb: 2, letterSpacing: 2, fontFamily: 'monospace' }}>
                  {card.number}
                </Typography>

                {/* Limit Usage */}
                {card.limit > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Limite Utilizado</Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {usagePercentage.toFixed(1)}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={usagePercentage} 
                      color={getUsageColor(usagePercentage)}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        {formatCurrency(card.used)} usado
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatCurrency(card.available)} disponível
                      </Typography>
                    </Box>
                  </Box>
                )}

                {/* Card Details */}
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mb: 2 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Limite Total
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {card.limit > 0 ? formatCurrency(card.limit) : 'Bloqueado'}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Fatura Atual
                    </Typography>
                    <Typography variant="body1" fontWeight="bold" color="error.main">
                      {formatCurrency(card.currentBill)}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Vencimento
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {card.dueDate !== '-' ? new Date(card.dueDate).toLocaleDateString('pt-BR') : card.dueDate}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Anuidade
                    </Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {card.annualFee > 0 ? formatCurrency(card.annualFee) : 'Isento'}
                    </Typography>
                  </Box>
                </Box>

                {/* Card Actions */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip 
                    label={card.type}
                    size="small"
                    variant="outlined"
                  />
                  <Box>
                    <IconButton size="small" color="primary">
                      <Edit />
                    </IconButton>
                    <IconButton size="small" color="warning">
                      <Block />
                    </IconButton>
                    <IconButton size="small" color="error">
                      <Delete />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          )
        })}
      </Box>

      {/* Upcoming Bills */}
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          Próximos Vencimentos
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Cartão</TableCell>
                <TableCell>Vencimento</TableCell>
                <TableCell align="right">Valor da Fatura</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {creditCards
                .filter(card => card.currentBill > 0)
                .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                .map((card) => (
                <TableRow key={card.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: card.color, width: 32, height: 32 }}>
                        <CreditCard sx={{ fontSize: 18 }} />
                      </Avatar>
                      <Box>
                        <Typography variant="body1" fontWeight="medium">
                          {card.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {card.number}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1">
                      {new Date(card.dueDate).toLocaleDateString('pt-BR')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {Math.ceil((new Date(card.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} dias
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body1" fontWeight="bold" color="error.main">
                      {formatCurrency(card.currentBill)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label="Pendente"
                      size="small"
                      color="warning"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Button size="small" variant="contained" color="primary">
                      Pagar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  )
}

export default CartoesPage
