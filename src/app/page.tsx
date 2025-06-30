'use client'

import { useEffect, useState } from 'react'
import { Box, CircularProgress, Typography } from '@mui/material'
import AuthPage from '@/components/auth-page'

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '100vh',
          gap: 2
        }}
      >
        <CircularProgress size={48} />
        <Typography variant="body1" color="text.secondary">
          Carregando...
        </Typography>
      </Box>
    )
  }

  return <AuthPage />
}