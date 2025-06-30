'use client'

import { createTheme, ThemeProvider, CssBaseline } from '@mui/material'
import { ptBR } from '@mui/material/locale'
import { useTheme } from '@/hooks/use-theme'

interface MaterialUIThemeProviderProps {
  children: React.ReactNode
}

export default function MaterialUIThemeProvider({ children }: MaterialUIThemeProviderProps) {
  const { theme } = useTheme()

  const muiTheme = createTheme(
    {
      palette: {
        mode: theme,
        primary: {
          main: '#f97316', // orange-500
          light: '#fb923c', // orange-400
          dark: '#ea580c', // orange-600
        },
        secondary: {
          main: '#6366f1', // indigo-500
          light: '#818cf8', // indigo-400
          dark: '#4f46e5', // indigo-600
        },
        background: {
          default: theme === 'light' ? '#ffffff' : '#0f0f0f',
          paper: theme === 'light' ? '#f9fafb' : '#1f1f1f',
        },
        text: {
          primary: theme === 'light' ? '#111827' : '#f9fafb',
          secondary: theme === 'light' ? '#6b7280' : '#9ca3af',
        },
      },
      typography: {
        fontFamily: 'var(--font-geist-sans)',
        h1: {
          fontWeight: 700,
        },
        h2: {
          fontWeight: 700,
        },
        h3: {
          fontWeight: 700,
        },
        h4: {
          fontWeight: 600,
        },
        h5: {
          fontWeight: 600,
        },
        h6: {
          fontWeight: 600,
        },
        button: {
          textTransform: 'none',
          fontWeight: 500,
        },
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: 8,
              fontWeight: 500,
              padding: '8px 16px',
            },
            contained: {
              boxShadow: 'none',
              '&:hover': {
                boxShadow: 'none',
              },
            },
          },
        },
        MuiTextField: {
          styleOverrides: {
            root: {
              '& .MuiOutlinedInput-root': {
                borderRadius: 8,
              },
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              borderRadius: 12,
              border: theme === 'light' 
                ? '1px solid rgba(0, 0, 0, 0.08)' 
                : '1px solid rgba(255, 255, 255, 0.08)',
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundImage: 'none',
            },
          },
        },
      },
      shape: {
        borderRadius: 8,
      },
    },
    ptBR
  )

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}
