'use client'

import {
  Box,
  Typography,
  Avatar,
  Button,
  TextField,
  Paper,
  Divider,
  Alert,
  CircularProgress,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  IconButton
} from '@mui/material'
import {
  Person,
  Edit,
  Save,
  Cancel,
  VpnKey,
  Visibility,
  VisibilityOff
} from '@mui/icons-material'
import { useState, useEffect } from 'react'
import { useUserProfile, useUpdateProfile } from '@/hooks/use-users'

const PerfilPage = () => {
  const [editing, setEditing] = useState(false)
  const [userData, setUserData] = useState({
    name: '',
    email: '',
  })
  
  const [changePasswordOpen, setChangePasswordOpen] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  const [passwordLoading, setPasswordLoading] = useState(false)
  
  const { data: profile, isLoading, error } = useUserProfile()
  const updateProfileMutation = useUpdateProfile()
  
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  // Atualizar os dados locais quando o perfil for carregado
  useEffect(() => {
    if (profile) {
      setUserData({
        name: profile.name || '',
        email: profile.email || '',
      })
    }
  }, [profile])

  const showSnackbar = (message: string, severity: 'success' | 'error' = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const closeSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleSave = async () => {
    try {
      await updateProfileMutation.mutateAsync(userData)
      setEditing(false)
      showSnackbar('Perfil atualizado com sucesso!')
    } catch (error: any) {
      showSnackbar(error.response?.data?.error || 'Erro ao atualizar perfil', 'error')
    }
  }

  const handleCancel = () => {
    if (profile) {
      setUserData({
        name: profile.name || '',
        email: profile.email || '',
      })
    }
    setEditing(false)
  }

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showSnackbar('Nova senha e confirmação não coincidem', 'error')
      return
    }

    if (passwordData.newPassword.length < 6) {
      showSnackbar('Nova senha deve ter pelo menos 6 caracteres', 'error')
      return
    }

    setPasswordLoading(true)
    try {
      const api = (await import('@/lib/api')).default
      
      await api.patch('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword
      })

      showSnackbar('Senha alterada com sucesso!')
      setChangePasswordOpen(false)
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (error: any) {
      const message = error?.response?.data?.error || 'Erro ao alterar senha'
      showSnackbar(message, 'error')
    } finally {
      setPasswordLoading(false)
    }
  }

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 3 }}>
          Erro ao carregar perfil. Tente novamente.
        </Alert>
      </Box>
    )
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
              {userData.email}
            </Typography>
          </Box>
          <Button
            variant={editing ? "outlined" : "contained"}
            startIcon={editing ? <Cancel /> : <Edit />}
            onClick={editing ? handleCancel : () => setEditing(true)}
            sx={{ mr: editing ? 1 : 0 }}
            disabled={updateProfileMutation.isPending}
          >
            {editing ? 'Cancelar' : 'Editar'}
          </Button>
          {editing && (
            <Button
              variant="contained"
              startIcon={updateProfileMutation.isPending ? <CircularProgress size={16} /> : <Save />}
              onClick={handleSave}
              disabled={updateProfileMutation.isPending}
            >
              {updateProfileMutation.isPending ? 'Salvando...' : 'Salvar'}
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
            type="email"
          />
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box>
          <Typography variant="h6" gutterBottom>
            Segurança
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Gerencie sua senha e configurações de segurança
          </Typography>
          <Button
            variant="outlined"
            startIcon={<VpnKey />}
            onClick={() => setChangePasswordOpen(true)}
            sx={{ mt: 1 }}
          >
            Alterar Senha
          </Button>
        </Box>
      </Paper>

      {/* Modal de Mudança de Senha */}
      <Dialog
        open={changePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <VpnKey />
            Alterar Senha
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
            <TextField
              label="Senha atual"
              type={showPasswords.current ? 'text' : 'password'}
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => togglePasswordVisibility('current')}
                      edge="end"
                    >
                      {showPasswords.current ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Nova senha"
              type={showPasswords.new ? 'text' : 'password'}
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              fullWidth
              helperText="Mínimo de 6 caracteres"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => togglePasswordVisibility('new')}
                      edge="end"
                    >
                      {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Confirmar nova senha"
              type={showPasswords.confirm ? 'text' : 'password'}
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              fullWidth
              error={passwordData.confirmPassword !== '' && passwordData.newPassword !== passwordData.confirmPassword}
              helperText={
                passwordData.confirmPassword !== '' && passwordData.newPassword !== passwordData.confirmPassword
                  ? 'As senhas não coincidem'
                  : ''
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => togglePasswordVisibility('confirm')}
                      edge="end"
                    >
                      {showPasswords.confirm ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setChangePasswordOpen(false)
              setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
              })
            }}
            disabled={passwordLoading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleChangePassword}
            variant="contained"
            disabled={
              passwordLoading ||
              !passwordData.currentPassword ||
              !passwordData.newPassword ||
              !passwordData.confirmPassword ||
              passwordData.newPassword !== passwordData.confirmPassword
            }
            startIcon={passwordLoading ? <CircularProgress size={16} /> : <Save />}
          >
            {passwordLoading ? 'Alterando...' : 'Alterar Senha'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={closeSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default PerfilPage
