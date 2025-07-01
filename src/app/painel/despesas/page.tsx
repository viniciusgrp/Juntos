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
  MenuItem,
  TextField,
  InputAdornment
} from '@mui/material'
import {
  Edit,
  Delete,
  Add,
  Search,
  FilterList,
  MoneyOff,
  ShoppingCart,
  Home,
  DirectionsCar,
  Restaurant,
  LocalHospital
} from '@mui/icons-material'

const DespesasPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')

  const stats = [
    {
      title: 'Total do Mês',
      value: 'R$ 3.156,40',
      change: '-8%',
      icon: <MoneyOff sx={{ fontSize: 32 }} />,
      color: 'error.main'
    },
    {
      title: 'Alimentação',
      value: 'R$ 1.105,30',
      change: '+5%',
      icon: <Restaurant sx={{ fontSize: 32 }} />,
      color: 'warning.main'
    },
    {
      title: 'Moradia',
      value: 'R$ 884,20',
      change: '-2%',
      icon: <Home sx={{ fontSize: 32 }} />,
      color: 'info.main'
    },
    {
      title: 'Transporte',
      value: 'R$ 473,90',
      change: '-15%',
      icon: <DirectionsCar sx={{ fontSize: 32 }} />,
      color: 'secondary.main'
    }
  ]

  const expenses = [
    {
      id: 1,
      description: 'Supermercado ABC',
      category: 'Alimentação',
      amount: 245.80,
      date: '2024-01-15',
      paymentMethod: 'Cartão de Débito',
      status: 'Pago',
      icon: <Restaurant />
    },
    {
      id: 2,
      description: 'Conta de Luz',
      category: 'Moradia',
      amount: 156.90,
      date: '2024-01-14',
      paymentMethod: 'Débito Automático',
      status: 'Pago',
      icon: <Home />
    },
    {
      id: 3,
      description: 'Combustível',
      category: 'Transporte',
      amount: 120.00,
      date: '2024-01-13',
      paymentMethod: 'Cartão de Crédito',
      status: 'Pago',
      icon: <DirectionsCar />
    },
    {
      id: 4,
      description: 'Farmácia Central',
      category: 'Saúde',
      amount: 89.50,
      date: '2024-01-12',
      paymentMethod: 'Dinheiro',
      status: 'Pago',
      icon: <LocalHospital />
    },
    {
      id: 5,
      description: 'Restaurante Italiano',
      category: 'Alimentação',
      amount: 180.00,
      date: '2024-01-11',
      paymentMethod: 'Cartão de Crédito',
      status: 'Pendente',
      icon: <Restaurant />
    },
    {
      id: 6,
      description: 'Mercado Online',
      category: 'Alimentação',
      amount: 320.40,
      date: '2024-01-10',
      paymentMethod: 'PIX',
      status: 'Pago',
      icon: <ShoppingCart />
    }
  ]

  const categories = ['Todas', 'Alimentação', 'Moradia', 'Transporte', 'Saúde', 'Educação', 'Lazer']

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pago':
        return 'success'
      case 'Pendente':
        return 'warning'
      case 'Atrasado':
        return 'error'
      default:
        return 'default'
    }
  }

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === '' || categoryFilter === 'Todas' || expense.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
            Despesas
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gerencie e acompanhe suas despesas mensais
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          size="large"
        >
          Nova Despesa
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

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            placeholder="Buscar despesas..."
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
          <TextField
            select
            label="Categoria"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            sx={{ minWidth: 150 }}
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>
          <IconButton>
            <FilterList />
          </IconButton>
        </Box>
      </Paper>

      <Paper elevation={2}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Descrição</TableCell>
                <TableCell>Categoria</TableCell>
                <TableCell align="right">Valor</TableCell>
                <TableCell>Data</TableCell>
                <TableCell>Forma de Pagamento</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredExpenses.map((expense) => (
                <TableRow key={expense.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: 'background.paper', border: 1, borderColor: 'divider', width: 40, height: 40 }}>
                        {expense.icon}
                      </Avatar>
                      <Typography variant="body1" fontWeight="medium">
                        {expense.description}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={expense.category}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body1" fontWeight="bold" color="error.main">
                      - R$ {expense.amount.toFixed(2).replace('.', ',')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {new Date(expense.date).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>{expense.paymentMethod}</TableCell>
                  <TableCell>
                    <Chip 
                      label={expense.status}
                      size="small"
                      color={getStatusColor(expense.status) as 'success' | 'warning' | 'error' | 'default'}
                    />
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
    </Box>
  )
}

export default DespesasPage
