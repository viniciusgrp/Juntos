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
  AccountBalance,
  Edit,
  Delete,
  Add,
  Search,
  Savings,
  CreditCard,
  Visibility,
  VisibilityOff
} from '@mui/icons-material'

const ContasPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [showBalance, setShowBalance] = useState(true)

  const stats = [
    {
      title: 'Total em Contas',
      value: 'R$ 15.847,25',
      change: '+3.2%',
      icon: <AccountBalance sx={{ fontSize: 32 }} />,
      color: 'primary.main'
    },
    {
      title: 'Conta Corrente',
      value: 'R$ 3.247,80',
      change: '+5%',
      icon: <AccountBalance sx={{ fontSize: 32 }} />,
      color: 'info.main'
    },
    {
      title: 'Poupança',
      value: 'R$ 12.599,45',
      change: '+2%',
      icon: <Savings sx={{ fontSize: 32 }} />,
      color: 'success.main'
    },
    {
      title: 'Cartão de Crédito',
      value: 'R$ 2.450,00',
      change: '+15%',
      icon: <CreditCard sx={{ fontSize: 32 }} />,
      color: 'warning.main'
    }
  ]

  const accounts = [
    {
      id: 1,
      name: 'Conta Corrente Principal',
      bank: 'Banco do Brasil',
      type: 'Conta Corrente',
      accountNumber: '1234-5',
      agency: '0001',
      balance: 3247.80,
      status: 'Ativa',
      lastTransaction: '2024-01-15',
      icon: <AccountBalance color="primary" />
    },
    {
      id: 2,
      name: 'Poupança Planejamento',
      bank: 'Banco do Brasil',
      type: 'Poupança',
      accountNumber: '5678-9',
      agency: '0001',
      balance: 12599.45,
      status: 'Ativa',
      lastTransaction: '2024-01-14',
      icon: <Savings color="success" />
    },
    {
      id: 3,
      name: 'Conta Digital',
      bank: 'Nubank',
      type: 'Conta Corrente',
      accountNumber: '9012-3',
      agency: '0260',
      balance: 580.30,
      status: 'Ativa',
      lastTransaction: '2024-01-15',
      icon: <AccountBalance color="secondary" />
    },
    {
      id: 4,
      name: 'Cartão Nubank',
      bank: 'Nubank',
      type: 'Cartão de Crédito',
      accountNumber: '**** 1234',
      agency: '',
      balance: -2450.00,
      status: 'Ativa',
      lastTransaction: '2024-01-15',
      icon: <CreditCard color="warning" />
    },
    {
      id: 5,
      name: 'Poupança Emergência',
      bank: 'Caixa Econômica',
      type: 'Poupança',
      accountNumber: '4567-8',
      agency: '1234',
      balance: 8500.00,
      status: 'Ativa',
      lastTransaction: '2024-01-10',
      icon: <Savings color="info" />
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativa':
        return 'success'
      case 'Inativa':
        return 'error'
      case 'Bloqueada':
        return 'warning'
      default:
        return 'default'
    }
  }

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case 'Conta Corrente':
        return 'primary'
      case 'Poupança':
        return 'success'
      case 'Cartão de Crédito':
        return 'warning'
      default:
        return 'default'
    }
  }

  const formatBalance = (balance: number) => {
    const formatted = Math.abs(balance).toFixed(2).replace('.', ',')
    return balance < 0 ? `- R$ ${formatted}` : `R$ ${formatted}`
  }

  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         account.bank.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         account.type.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
            Contas Bancárias
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gerencie suas contas e acompanhe saldos
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          size="large"
        >
          Nova Conta
        </Button>
      </Box>

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
                    {showBalance ? stat.value : '••••••'}
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
                <Avatar sx={{ bgcolor: stat.color, width: 56, height: 56 }}>
                  {stat.icon}
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            placeholder="Buscar contas..."
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
          <Button
            variant="outlined"
            startIcon={showBalance ? <VisibilityOff /> : <Visibility />}
            onClick={() => setShowBalance(!showBalance)}
          >
            {showBalance ? 'Ocultar Saldos' : 'Mostrar Saldos'}
          </Button>
        </Box>
      </Paper>

      <Paper elevation={2}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Conta</TableCell>
                <TableCell>Banco</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Agência/Conta</TableCell>
                <TableCell align="right">Saldo</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Última Movimentação</TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAccounts.map((account) => (
                <TableRow key={account.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: 'background.paper', border: 1, borderColor: 'divider', width: 40, height: 40 }}>
                        {account.icon}
                      </Avatar>
                      <Typography variant="body1" fontWeight="medium">
                        {account.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{account.bank}</TableCell>
                  <TableCell>
                    <Chip 
                      label={account.type}
                      size="small"
                      color={getAccountTypeColor(account.type) as 'primary' | 'success' | 'warning' | 'default'}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    {account.agency && `${account.agency} / `}{account.accountNumber}
                  </TableCell>
                  <TableCell align="right">
                    <Typography 
                      variant="body1" 
                      fontWeight="bold" 
                      color={account.balance < 0 ? 'error.main' : 'success.main'}
                    >
                      {showBalance ? formatBalance(account.balance) : '••••••'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={account.status}
                      size="small"
                      color={getStatusColor(account.status) as 'success' | 'warning' | 'error' | 'default'}
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(account.lastTransaction).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton size="small" color="primary">
                      <Edit />
                    </IconButton>
                    <IconButton size="small" color="error">
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          Distribuição por Tipo de Conta
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Conta Corrente</Typography>
              <Typography variant="body2">24%</Typography>
            </Box>
            <LinearProgress variant="determinate" value={24} color="primary" />
          </Box>
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Poupança</Typography>
              <Typography variant="body2">61%</Typography>
            </Box>
            <LinearProgress variant="determinate" value={61} color="success" />
          </Box>
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Cartão de Crédito</Typography>
              <Typography variant="body2">15%</Typography>
            </Box>
            <LinearProgress variant="determinate" value={15} color="warning" />
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}

export default ContasPage
