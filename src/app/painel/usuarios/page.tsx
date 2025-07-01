'use client'

import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  IconButton,
  Button,
  TextField,
  InputAdornment
} from '@mui/material'
import {
  Search,
  Edit,
  Delete,
  Add,
  Person
} from '@mui/icons-material'
import { useState } from 'react'

const UsuariosPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  
  const users = [
    {
      id: 1,
      name: 'João Silva',
      email: 'joao.silva@exemplo.com',
      role: 'Admin',
      status: 'Ativo',
      lastLogin: '2025-06-30'
    },
    {
      id: 2,
      name: 'Maria Santos',
      email: 'maria.santos@exemplo.com',
      role: 'Editor',
      status: 'Ativo',
      lastLogin: '2025-06-29'
    },
    {
      id: 3,
      name: 'Pedro Costa',
      email: 'pedro.costa@exemplo.com',
      role: 'Viewer',
      status: 'Inativo',
      lastLogin: '2025-06-25'
    },
    {
      id: 4,
      name: 'Ana Oliveira',
      email: 'ana.oliveira@exemplo.com',
      role: 'Editor',
      status: 'Ativo',
      lastLogin: '2025-06-30'
    }
  ]

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'error'
      case 'Editor':
        return 'warning'
      case 'Viewer':
        return 'info'
      default:
        return 'default'
    }
  }

  const getStatusColor = (status: string) => {
    return status === 'Ativo' ? 'success' : 'default'
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
            Usuários
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Gerencie os usuários do sistema
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />}>
          Novo Usuário
        </Button>
      </Box>

      <Paper elevation={2} sx={{ p: 3 }}>
        <Box sx={{ mb: 3 }}>
          <TextField
            placeholder="Buscar usuários..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ width: { xs: '100%', md: '300px' } }}
          />
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Usuário</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Papel</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Último Login</TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <Person />
                      </Avatar>
                      <Typography variant="body2" fontWeight="medium">
                        {user.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {user.email}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.role}
                      size="small"
                      color={getRoleColor(user.role) as 'error' | 'warning' | 'info' | 'default'}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.status}
                      size="small"
                      color={getStatusColor(user.status) as 'success' | 'default'}
                      variant="filled"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {user.lastLogin}
                    </Typography>
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

        {filteredUsers.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              Nenhum usuário encontrado
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  )
}

export default UsuariosPage
