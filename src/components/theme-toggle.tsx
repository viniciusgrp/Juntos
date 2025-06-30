'use client'

import { IconButton, Tooltip } from '@mui/material'
import { DarkMode, LightMode } from '@mui/icons-material'
import { useTheme } from '@/hooks/use-theme'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <Tooltip title={`Alternar para modo ${theme === 'light' ? 'escuro' : 'claro'}`}>
      <IconButton
        onClick={toggleTheme}
        size="large"
        aria-label="Alternar tema"
        sx={{
          borderRadius: 2,
          border: 1,
          borderColor: 'divider',
          backgroundColor: 'background.paper',
          '&:hover': {
            backgroundColor: 'action.hover'
          }
        }}
      >
        {theme === 'light' ? (
          <DarkMode />
        ) : (
          <LightMode />
        )}
      </IconButton>
    </Tooltip>
  )
}
