'use client';

import {
  Modal,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Chip,
  IconButton,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { 
  Add, Edit, Delete, Close, Palette,
  Restaurant, DirectionsCar, Home, Work, School, LocalHospital,
  ShoppingCart, LocalGasStation, Phone, Flight, Train, LocalTaxi,
  Movie, SportsEsports, FitnessCenter, Spa, LibraryBooks,
  AttachMoney, AccountBalance, CreditCard, Savings, TrendingUp,
  Fastfood, Coffee, LocalBar, Cake, Store, ShoppingBag,
  Pets, ChildCare, Elderly, MedicalServices, LocalPharmacy,
  ElectricBolt, Water, Wifi, Tv, Security,
  Checkroom, Diamond, Watch, Redeem, CardGiftcard,
  Laptop, Build
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useState, useEffect } from 'react';
import { Category } from '../../types/category';
import { useCategories } from '../../hooks/use-categories';

const schema = yup.object({
  name: yup.string().required('Nome é obrigatório'),
  description: yup.string(),
  type: yup.string().oneOf(['INCOME', 'EXPENSE']).required('Tipo é obrigatório'),
  color: yup.string(),
  icon: yup.string()
});

const availableIcons = [
  { name: 'Restaurant', icon: Restaurant, label: 'Restaurante' },
  { name: 'DirectionsCar', icon: DirectionsCar, label: 'Carro' },
  { name: 'Home', icon: Home, label: 'Casa' },
  { name: 'Work', icon: Work, label: 'Trabalho' },
  { name: 'School', icon: School, label: 'Escola' },
  { name: 'LocalHospital', icon: LocalHospital, label: 'Hospital' },
  { name: 'ShoppingCart', icon: ShoppingCart, label: 'Compras' },
  { name: 'LocalGasStation', icon: LocalGasStation, label: 'Combustível' },
  { name: 'Phone', icon: Phone, label: 'Telefone' },
  { name: 'Flight', icon: Flight, label: 'Viagem' },
  { name: 'Train', icon: Train, label: 'Transporte' },
  { name: 'LocalTaxi', icon: LocalTaxi, label: 'Taxi' },
  { name: 'Movie', icon: Movie, label: 'Entretenimento' },
  { name: 'SportsEsports', icon: SportsEsports, label: 'Games' },
  { name: 'FitnessCenter', icon: FitnessCenter, label: 'Academia' },
  { name: 'Spa', icon: Spa, label: 'Beleza' },
  { name: 'LibraryBooks', icon: LibraryBooks, label: 'Educação' },
  { name: 'AttachMoney', icon: AttachMoney, label: 'Dinheiro' },
  { name: 'AccountBalance', icon: AccountBalance, label: 'Banco' },
  { name: 'CreditCard', icon: CreditCard, label: 'Cartão' },
  { name: 'Savings', icon: Savings, label: 'Investimentos' },
  { name: 'TrendingUp', icon: TrendingUp, label: 'Crescimento' },
  { name: 'Fastfood', icon: Fastfood, label: 'Fast Food' },
  { name: 'Coffee', icon: Coffee, label: 'Café' },
  { name: 'LocalBar', icon: LocalBar, label: 'Bar' },
  { name: 'Cake', icon: Cake, label: 'Sobremesa' },
  { name: 'Store', icon: Store, label: 'Loja' },
  { name: 'ShoppingBag', icon: ShoppingBag, label: 'Shopping' },
  { name: 'Pets', icon: Pets, label: 'Pets' },
  { name: 'ChildCare', icon: ChildCare, label: 'Crianças' },
  { name: 'Elderly', icon: Elderly, label: 'Idosos' },
  { name: 'MedicalServices', icon: MedicalServices, label: 'Médico' },
  { name: 'LocalPharmacy', icon: LocalPharmacy, label: 'Farmácia' },
  { name: 'ElectricBolt', icon: ElectricBolt, label: 'Energia' },
  { name: 'Water', icon: Water, label: 'Água' },
  { name: 'Wifi', icon: Wifi, label: 'Internet' },
  { name: 'Tv', icon: Tv, label: 'TV' },
  { name: 'Security', icon: Security, label: 'Segurança' },
  { name: 'Checkroom', icon: Checkroom, label: 'Roupas' },
  { name: 'Diamond', icon: Diamond, label: 'Joias' },
  { name: 'Watch', icon: Watch, label: 'Relógio' },
  { name: 'Redeem', icon: Redeem, label: 'Presente' },
  { name: 'CardGiftcard', icon: CardGiftcard, label: 'Gift Card' },
  { name: 'Laptop', icon: Laptop, label: 'Laptop' },
  { name: 'Build', icon: Build, label: 'Serviços' }
];

interface CategoryFormModalProps {
  open: boolean;
  onClose: () => void;
  category?: Category;
}

function CategoryFormModal({ open, onClose, category }: CategoryFormModalProps) {
  const { createCategory, updateCategory } = useCategories();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [iconModalOpen, setIconModalOpen] = useState(false);

  const isEditing = !!category;

  const colors = [
    '#F44336', '#E91E63', '#9C27B0', '#673AB7',
    '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4',
    '#009688', '#4CAF50', '#8BC34A', '#CDDC39',
    '#FFEB3B', '#FFC107', '#FF9800', '#FF5722',
    '#795548', '#9E9E9E', '#607D8B'
  ];

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      type: 'EXPENSE',
      color: '#2196F3',
      icon: ''
    }
  });

  // Atualizar o formulário quando a categoria mudar
  useEffect(() => {
    if (category) {
      reset({
        name: category.name || '',
        description: category.description || '',
        type: category.type || 'EXPENSE',
        color: category.color || '#2196F3',
        icon: category.icon || ''
      });
    } else {
      reset({
        name: '',
        description: '',
        type: 'EXPENSE',
        color: '#2196F3',
        icon: ''
      });
    }
  }, [category, reset]);

  const handleFormSubmit = async (data: any) => {
    try {
      setLoading(true);
      setError(null);

      if (isEditing) {
        await updateCategory(category.id, data);
      } else {
        await createCategory(data);
      }

      reset({
        name: '',
        description: '',
        type: 'EXPENSE',
        color: '#2196F3',
        icon: ''
      });
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    reset({
      name: '',
      description: '',
      type: 'EXPENSE',
      color: '#2196F3',
      icon: ''
    });
    setError(null);
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Paper
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '95%', sm: 500 },
          maxHeight: '90vh',
          overflow: 'auto',
          p: 3
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5">
            {isEditing ? 'Editar Categoria' : 'Nova Categoria'}
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <Close />
          </IconButton>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <Box display="flex" flexDirection="column" gap={3}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nome"
                  fullWidth
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  placeholder="Ex: Alimentação, Salário"
                />
              )}
            />

            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Descrição (Opcional)"
                  fullWidth
                  multiline
                  rows={2}
                  placeholder="Descreva esta categoria"
                />
              )}
            />

            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.type}>
                  <InputLabel>Tipo</InputLabel>
                  <Select {...field} label="Tipo">
                    <MenuItem value="INCOME">Receita</MenuItem>
                    <MenuItem value="EXPENSE">Despesa</MenuItem>
                  </Select>
                  {errors.type && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, mx: 1.75 }}>
                      {errors.type.message}
                    </Typography>
                  )}
                </FormControl>
              )}
            />

            <Controller
              name="color"
              control={control}
              render={({ field }) => (
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Cor
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {colors.map((color) => (
                      <Box
                        key={color}
                        sx={{
                          width: 32,
                          height: 32,
                          backgroundColor: color,
                          borderRadius: '50%',
                          cursor: 'pointer',
                          border: field.value === color ? '3px solid #000' : '1px solid #ddd',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        onClick={() => field.onChange(color)}
                      >
                        {field.value === color && <Palette sx={{ color: 'white', fontSize: 16 }} />}
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            />

            <Controller
              name="icon"
              control={control}
              render={({ field }) => (
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Ícone
                  </Typography>
                  <Box display="flex" gap={2} alignItems="center">
                    <Button
                      variant="outlined"
                      onClick={() => setIconModalOpen(true)}
                      sx={{ 
                        minWidth: 120,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      {field.value ? (
                        <>
                          {(() => {
                            const iconData = availableIcons.find(icon => icon.name === field.value);
                            const IconComponent = iconData?.icon;
                            return IconComponent ? <IconComponent /> : null;
                          })()}
                          {availableIcons.find(icon => icon.name === field.value)?.label || field.value}
                        </>
                      ) : (
                        'Selecionar ícone'
                      )}
                    </Button>
                    {field.value && (
                      <Button
                        size="small"
                        onClick={() => field.onChange('')}
                        color="secondary"
                      >
                        Remover
                      </Button>
                    )}
                  </Box>

                  {/* Modal de seleção de ícones */}
                  <Dialog
                    open={iconModalOpen}
                    onClose={() => setIconModalOpen(false)}
                    maxWidth="md"
                    fullWidth
                  >
                    <DialogTitle>Selecionar Ícone</DialogTitle>
                    <DialogContent>
                      <Box 
                        sx={{ 
                          display: 'grid', 
                          gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                          gap: 1,
                          mt: 1
                        }}
                      >
                        {availableIcons.map((iconData) => {
                          const IconComponent = iconData.icon;
                          return (
                            <Button
                              key={iconData.name}
                              variant={field.value === iconData.name ? "contained" : "outlined"}
                              onClick={() => {
                                field.onChange(iconData.name);
                                setIconModalOpen(false);
                              }}
                              sx={{
                                height: 80,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 0.5,
                                fontSize: '0.7rem',
                                color: 'text.primary',
                                borderColor: field.value === iconData.name ? 'primary.main' : 'divider',
                                '&:hover': {
                                  borderColor: 'primary.main',
                                  backgroundColor: 'action.hover'
                                }
                              }}
                            >
                              <IconComponent sx={{ 
                                fontSize: 24,
                                color: 'text.primary'
                              }} />
                              <Typography variant="caption" sx={{ 
                                fontSize: '0.6rem', 
                                textAlign: 'center',
                                color: 'text.primary'
                              }}>
                                {iconData.label}
                              </Typography>
                            </Button>
                          );
                        })}
                      </Box>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={() => setIconModalOpen(false)}>
                        Cancelar
                      </Button>
                    </DialogActions>
                  </Dialog>
                </Box>
              )}
            />

            <Box display="flex" gap={2} justifyContent="flex-end" mt={2}>
              <Button
                variant="outlined"
                onClick={handleClose}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={16} /> : undefined}
              >
                {loading ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Criar')}
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Modal>
  );
}

export default function CategoriesManagement() {
  const { categories, loading, error, deleteCategory, createDefaultCategories } = useCategories();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>();
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      setDeleteLoading(id);
      await deleteCategory(id);
    } catch (err: any) {
      console.error('Erro ao deletar categoria:', err);
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleCreateDefault = async () => {
    try {
      await createDefaultCategories();
    } catch (err: any) {
      console.error('Erro ao criar categorias padrão:', err);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingCategory(undefined);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Categorias</Typography>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            onClick={handleCreateDefault}
            startIcon={<Add />}
          >
            Criar Padrão
          </Button>
          <Button
            variant="contained"
            onClick={() => setModalOpen(true)}
            startIcon={<Add />}
          >
            Nova Categoria
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box 
        display="grid" 
        gridTemplateColumns="repeat(auto-fill, minmax(300px, 1fr))" 
        gap={2}
      >
        {categories.map((category) => (
          <Card key={category.id}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    backgroundColor: category.color || '#2196F3',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {category.icon && (() => {
                    const iconData = availableIcons.find(icon => icon.name === category.icon);
                    const IconComponent = iconData?.icon;
                    return IconComponent ? <IconComponent sx={{ color: 'white', fontSize: 18 }} /> : null;
                  })()}
                </Box>
                <Typography variant="h6">{category.name}</Typography>
                <Chip
                  label={category.type === 'INCOME' ? 'Receita' : 'Despesa'}
                  size="small"
                  color={category.type === 'INCOME' ? 'success' : 'error'}
                />
              </Box>
              {category.description && (
                <Typography variant="body2" color="text.secondary">
                  {category.description}
                </Typography>
              )}
            </CardContent>
            <CardActions>
              <Button
                size="small"
                startIcon={<Edit />}
                onClick={() => handleEdit(category)}
              >
                Editar
              </Button>
              <Button
                size="small"
                color="error"
                startIcon={deleteLoading === category.id ? <CircularProgress size={16} /> : <Delete />}
                onClick={() => handleDelete(category.id)}
                disabled={deleteLoading === category.id}
              >
                Excluir
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>

      {categories.length === 0 && !loading && (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary" mb={2}>
            Nenhuma categoria encontrada
          </Typography>
          <Button
            variant="contained"
            onClick={handleCreateDefault}
            startIcon={<Add />}
          >
            Criar Categorias Padrão
          </Button>
        </Box>
      )}

      <CategoryFormModal
        open={modalOpen}
        onClose={handleCloseModal}
        category={editingCategory}
      />
    </Box>
  );
}
