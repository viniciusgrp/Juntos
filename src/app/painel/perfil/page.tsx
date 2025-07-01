'use client'

import {
  Box,
  Typography,
  Avatar,
  Button,
  TextField,
  Paper,
  Divider
} from '@mui/material'
import {
  Person,
  Edit,
  Save,
  Cancel
} from '@mui/icons-material'
import { useState } from 'react'

const PerfilPage = () => {
  const [editing, setEditing] = useState(false)
  const [userData, setUserData] = useState({
    name: 'João Silva',
    email: 'joao.silva@exemplo.com',
    phone: '(11) 99999-9999',
    position: 'Desenvolvedor Frontend',
    company: 'Juntos Tech'
  })

  const handleSave = () => {
    setEditing(false)
  }

  const handleCancel = () => {
    setEditing(false)
  }

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Meu Perfil
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gerencie suas informações pessoais
        </Typography>
      </Box>

      <Paper elevation={2} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Avatar 
            sx={{ 
              width: 80, 
              height: 80, 
              bgcolor: 'primary.main',
              fontSize: '2rem',
              mr: 3
            }}
          >
            <Person sx={{ fontSize: '3rem' }} />
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" fontWeight="bold">
              {userData.name}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {userData.position}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {userData.company}
            </Typography>
          </Box>
          <Button
            variant={editing ? "outlined" : "contained"}
            startIcon={editing ? <Cancel /> : <Edit />}
            onClick={editing ? handleCancel : () => setEditing(true)}
            sx={{ mr: editing ? 1 : 0 }}
          >
            {editing ? 'Cancelar' : 'Editar'}
          </Button>
          {editing && (
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSave}
            >
              Salvar
            </Button>
          )}
        </Box>

        <Divider sx={{ mb: 4 }} />

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
          <TextField
            label="Nome completo"
            value={userData.name}
            onChange={(e) => setUserData({ ...userData, name: e.target.value })}
            disabled={!editing}
            fullWidth
          />
          <TextField
            label="Email"
            value={userData.email}
            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
            disabled={!editing}
            fullWidth
          />
          <TextField
            label="Telefone"
            value={userData.phone}
            onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
            disabled={!editing}
            fullWidth
          />
          <TextField
            label="Cargo"
            value={userData.position}
            onChange={(e) => setUserData({ ...userData, position: e.target.value })}
            disabled={!editing}
            fullWidth
          />
        </Box>

        <Box sx={{ mt: 4 }}>
          <TextField
            label="Empresa"
            value={userData.company}
            onChange={(e) => setUserData({ ...userData, company: e.target.value })}
            disabled={!editing}
            fullWidth
          />
        </Box>
      </Paper>
    </Box>
  )
}

export default PerfilPage
