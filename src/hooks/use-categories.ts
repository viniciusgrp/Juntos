'use client';

import { useState, useEffect, useMemo } from 'react';
import { categoryService, CategoryFilters } from '../services/category.service';
import { Category } from '../types/category';

export const useCategories = (filters?: CategoryFilters) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const memoizedFilters = useMemo(() => filters, [
    filters?.type,
    filters?.isActive,
    filters?.search,
  ]);

  const createCategory = async (data: any) => {
    try {
      setError(null);
      const newCategory = await categoryService.createCategory(data);
      setCategories(prev => [...prev, newCategory]);
      return newCategory;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Erro ao criar categoria';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const updateCategory = async (id: string, data: any) => {
    try {
      setError(null);
      const updatedCategory = await categoryService.updateCategory(id, data);
      setCategories(prev => 
        prev.map(cat => cat.id === id ? updatedCategory : cat)
      );
      return updatedCategory;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Erro ao atualizar categoria';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      setError(null);
      await categoryService.deleteCategory(id);
      setCategories(prev => prev.filter(cat => cat.id !== id));
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Erro ao deletar categoria';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const createDefaultCategories = async () => {
    try {
      setError(null);
      const response = await categoryService.createDefaultCategories();
      const updatedResponse = await categoryService.getCategories(memoizedFilters);
      setCategories(updatedResponse.categories);
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Erro ao criar categorias padrão';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await categoryService.getCategories(memoizedFilters);
        setCategories(response.categories);
      } catch (err: any) {
        console.error('Error fetching categories:', err);
        setError(err.response?.data?.error || 'Erro ao carregar categorias');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [memoizedFilters]);

  return {
    categories,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    createDefaultCategories,
    setError
  };
};
