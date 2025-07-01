import { useState } from 'react'
import {
  Box,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  MenuItem
} from '@mui/material'
import {
  Search,
  FilterList,
  Clear
} from '@mui/icons-material'

interface FilterOption {
  label: string
  value: string
}

interface SearchFiltersProps {
  searchPlaceholder?: string
  onSearchChange: (value: string) => void
  filters?: {
    label: string
    options: FilterOption[]
    value: string
    onChange: (value: string) => void
  }[]
  showFilterButton?: boolean
  onFilterClick?: () => void
  children?: React.ReactNode
}

const SearchFilters = ({ 
  searchPlaceholder = "Buscar...",
  onSearchChange,
  filters = [],
  showFilterButton = false,
  onFilterClick,
  children
}: SearchFiltersProps) => {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    onSearchChange(value)
  }

  const clearSearch = () => {
    setSearchTerm('')
    onSearchChange('')
  }

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        <TextField
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
            endAdornment: searchTerm ? (
              <InputAdornment position="end">
                <IconButton size="small" onClick={clearSearch}>
                  <Clear />
                </IconButton>
              </InputAdornment>
            ) : undefined,
          }}
          sx={{ minWidth: 300 }}
        />
        
        {filters.map((filter, index) => (
          <TextField
            key={index}
            select
            label={filter.label}
            value={filter.value}
            onChange={(e) => filter.onChange(e.target.value)}
            sx={{ minWidth: 150 }}
          >
            {filter.options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        ))}

        {showFilterButton && (
          <IconButton onClick={onFilterClick}>
            <FilterList />
          </IconButton>
        )}

        {children}
      </Box>
    </Paper>
  )
}

export default SearchFilters
