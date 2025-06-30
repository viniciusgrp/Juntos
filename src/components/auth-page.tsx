'use client'

import { useState } from 'react'
import { 
  Box, 
  Container, 
  Typography, 
  Avatar,
  Fade,
  useTheme
} from '@mui/material'
import { Bolt } from '@mui/icons-material'
import LoginForm from '@/components/login-form'
import RegisterForm from '@/components/register-form'
import ThemeToggle from '@/components/theme-toggle'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const theme = useTheme()

  const toggleMode = () => {
    setIsLogin(!isLogin)
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`,
        position: 'relative',
        p: 2
      }}
    >
      {/* Theme Toggle */}
      <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }}>
        <ThemeToggle />
      </Box>

      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          {/* Logo/Brand */}
          <Avatar
            sx={{
              width: 64,
              height: 64,
              bgcolor: 'primary.main',
              margin: '0 auto 16px',
              borderRadius: 3
            }}
          >
            <Bolt sx={{ fontSize: 32 }} />
          </Avatar>
          
          <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
            Juntos
          </Typography>
          
          <Typography variant="body1" color="text.secondary">
            O companheiro das suas finanças
          </Typography>
        </Box>

        {/* Auth Forms */}
        <Fade in={true} timeout={300}>
          <Box>
            {isLogin ? (
              <LoginForm onToggleMode={toggleMode} />
            ) : (
              <RegisterForm onToggleMode={toggleMode} />
            )}
          </Box>
        </Fade>

        {/* Footer */}
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="body2" color="text.secondary">
            © 2025 Juntos. Todos os direitos reservados.
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}
