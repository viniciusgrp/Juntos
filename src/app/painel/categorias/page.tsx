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
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Fab
} from '@mui/material'
import {
  Category,
  Edit,
  Delete,
  Add,
  Search,
  Restaurant,
  Home,
  DirectionsCar,
  LocalHospital,
  School,
  SportsEsports,
  ShoppingCart,
  Flight,
  Pets,
  Work,
  AccountBalance,
  TrendingUp,
  TrendingDown
} from '@mui/icons-material'

const CategoriasPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [openDialog, setOpenDialog] = useState(false)

  const stats = [
    {
      title: 'Total de Categorias',
      value: '24',
      change: '+2',
      icon: <Category sx={{ fontSize: 32 }} />,
      color: 'primary.main'
    },
    {
      title: 'Receitas',
      value: '8',
      change: '+1',
      icon: <TrendingUp sx={{ fontSize: 32 }} />,
      color: 'success.main'
    },
    {
      title: 'Despesas',
      value: '16',
      change: '+1',
      icon: <TrendingDown sx={{ fontSize: 32 }} />,
      color: 'error.main'
    },
    {
      title: 'Mais Usada',
      value: 'Alimentação',
      change: '35%',
      icon: <Restaurant sx={{ fontSize: 32 }} />,
      color: 'warning.main'
    }
  ]

  const categories = [
    {
      id: 1,
      name: 'Salário',
      type: 'Receita',
      icon: <Work />,
      color: '#2196F3',
      description: 'Salário fixo mensal',
      transactionCount: 12,
      totalAmount: 60000.00,
      isActive: true
    },
    {
      id: 2,
      name: 'Freelance',
      type: 'Receita',
      icon: <AccountBalance />,
      color: '#4CAF50',
      description: 'Trabalhos freelance',
      transactionCount: 8,
      totalAmount: 15600.00,
      isActive: true
    },
    {
      id: 3,
      name: 'Investimentos',
      type: 'Receita',
      icon: <TrendingUp />,
      color: '#FF9800',
      description: 'Rendimentos de investimentos',
      transactionCount: 5,
      totalAmount: 2400.00,
      isActive: true
    },
    
    {
      id: 4,
      name: 'Alimentação',
      type: 'Despesa',
      icon: <Restaurant />,
      color: '#F44336',
      description: 'Gastos com alimentação',
      transactionCount: 45,
      totalAmount: 3200.00,
      isActive: true
    },
    {
      id: 5,
      name: 'Moradia',
      type: 'Despesa',
      icon: <Home />,
      color: '#9C27B0',
      description: 'Aluguel, financiamento, contas',
      transactionCount: 18,
      totalAmount: 2800.00,
      isActive: true
    },
    {
      id: 6,
      name: 'Transporte',
      type: 'Despesa',
      icon: <DirectionsCar />,
      color: '#607D8B',
      description: 'Combustível, transporte público',
      transactionCount: 22,
      totalAmount: 980.00,
      isActive: true
    },
    {
      id: 7,
      name: 'Saúde',
      type: 'Despesa',
      icon: <LocalHospital />,
      color: '#E91E63',
      description: 'Medicamentos, consultas',
      transactionCount: 12,
      totalAmount: 650.00,
      isActive: true
    },
    {
      id: 8,
      name: 'Educação',
      type: 'Despesa',
      icon: <School />,
      color: '#3F51B5',
      description: 'Cursos, livros, materiais',
      transactionCount: 6,
      totalAmount: 1200.00,
      isActive: true
    },
    {
      id: 9,
      name: 'Lazer',
      type: 'Despesa',
      icon: <SportsEsports />,
      color: '#FF5722',
      description: 'Entretenimento e diversão',
      transactionCount: 15,
      totalAmount: 800.00,
      isActive: true
    },
    {
      id: 10,
      name: 'Compras',
      type: 'Despesa',
      icon: <ShoppingCart />,
      color: '#795548',
      description: 'Roupas, acessórios, diversos',
      transactionCount: 20,
      totalAmount: 1500.00,
      isActive: true
    },
    {
      id: 11,
      name: 'Viagens',
      type: 'Despesa',
      icon: <Flight />,
      color: '#00BCD4',
      description: 'Viagens e hospedagens',
      transactionCount: 3,
      totalAmount: 2500.00,
      isActive: false
    },
    {
      id: 12,
      name: 'Pet',
      type: 'Despesa',
      icon: <Pets />,
      color: '#CDDC39',
      description: 'Gastos com animais de estimação',
      transactionCount: 8,
      totalAmount: 450.00,
      isActive: true
    }
  ]

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Receita':
        return 'success'
      case 'Despesa':
        return 'error'
      default:
        return 'default'
    }
  }

  const formatCurrency = (value: number) => {
    return `R$ ${value.toFixed(2).replace('.', ',')}`
  }

  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === '' || typeFilter === 'Todas' || category.type === typeFilter
    return matchesSearch && matchesType
  })

  const typeOptions = ['Todas', 'Receita', 'Despesa']

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
            Categorias
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Organize suas receitas e despesas por categorias
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          size="large"
          onClick={() => setOpenDialog(true)}
        >
          Nova Categoria
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
                    color="primary"
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
            placeholder="Buscar categorias..."
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
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Tipo</InputLabel>
            <Select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              label="Tipo"
            >
              {typeOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Paper>

      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' },
        gap: 3,
        mb: 4
      }}>
        {filteredCategories.map((category) => (
          <Card key={category.id} elevation={2} sx={{ position: 'relative' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Avatar sx={{ bgcolor: category.color, width: 48, height: 48 }}>
                  {category.icon}
                </Avatar>
                <Chip 
                  label={category.type}
                  size="small"
                  color={getTypeColor(category.type) as 'success' | 'error' | 'default'}
                />
              </Box>
              
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {category.name}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: 40 }}>
                {category.description}
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Total Movimentado
                </Typography>
                <Typography variant="h6" fontWeight="bold" color={category.type === 'Receita' ? 'success.main' : 'error.main'}>
                  {formatCurrency(category.totalAmount)}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  {category.transactionCount} transações
                </Typography>
                <Chip 
                  label={category.isActive ? 'Ativa' : 'Inativa'}
                  size="small"
                  color={category.isActive ? 'success' : 'default'}
                  variant="outlined"
                />
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <IconButton size="small" color="primary">
                  <Edit />
                </IconButton>
                <IconButton size="small" color="error">
                  <Delete />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Paper elevation={2} sx={{ display: { xs: 'none', md: 'block' } }}>
        <Typography variant="h6" sx={{ p: 3, pb: 0 }} fontWeight="bold">
          Resumo Detalhado
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Categoria</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Descrição</TableCell>
                <TableCell align="right">Transações</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCategories.map((category) => (
                <TableRow key={category.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: category.color, width: 32, height: 32 }}>
                        {category.icon}
                      </Avatar>
                      <Typography variant="body1" fontWeight="medium">
                        {category.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={category.type}
                      size="small"
                      color={getTypeColor(category.type) as 'success' | 'error' | 'default'}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{category.description}</TableCell>
                  <TableCell align="right">{category.transactionCount}</TableCell>
                  <TableCell align="right">
                    <Typography 
                      variant="body1" 
                      fontWeight="bold" 
                      color={category.type === 'Receita' ? 'success.main' : 'error.main'}
                    >
                      {formatCurrency(category.totalAmount)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={category.isActive ? 'Ativa' : 'Inativa'}
                      size="small"
                      color={category.isActive ? 'success' : 'default'}
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

      <Fab
        color="primary"
        aria-label="add"
        sx={{ 
          position: 'fixed', 
          bottom: 16, 
          right: 16,
          display: { xs: 'flex', md: 'none' }
        }}
        onClick={() => setOpenDialog(true)}
      >
        <Add />
      </Fab>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Nova Categoria</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Nome da Categoria"
              variant="outlined"
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Tipo</InputLabel>
              <Select label="Tipo">
                <MenuItem value="Receita">Receita</MenuItem>
                <MenuItem value="Despesa">Despesa</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Descrição"
              variant="outlined"
              fullWidth
              multiline
              rows={3}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={() => setOpenDialog(false)}>
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default CategoriasPage
