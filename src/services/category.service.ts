'use client';

import api from '../lib/api';
import { Category, CreateCategoryData, UpdateCategoryData } from '../types/category';

export interface CategoryFilters {
  type?: 'INCOME' | 'EXPENSE';
  isActive?: boolean;
  search?: string;
}

export interface CategoryResponse {
  categories: Category[];
  total: number;
}

export interface CategoryStats {
  totalCategories: number;
  incomeCategories: number;
  expenseCategories: number;
  activeCategories: number;
  inactiveCategories: number;
}

export const categoryService = {
  async createCategory(data: CreateCategoryData): Promise<Category> {
    const response = await api.post('/categories', data);
    return response.data.data;
  },

  async getCategories(filters?: CategoryFilters): Promise<CategoryResponse> {
    const params = new URLSearchParams();
    
    if (filters?.type) params.append('type', filters.type);
    if (filters?.isActive !== undefined) params.append('isActive', filters.isActive.toString());
    if (filters?.search) params.append('search', filters.search);

    const response = await api.get(`/categories?${params.toString()}`);
    return response.data.data;
  },

  async getCategoryById(id: string): Promise<Category> {
    const response = await api.get(`/categories/${id}`);
    return response.data.data;
  },

  async updateCategory(id: string, data: UpdateCategoryData): Promise<Category> {
    const response = await api.put(`/categories/${id}`, data);
    return response.data.data;
  },

  async deleteCategory(id: string): Promise<void> {
    await api.delete(`/categories/${id}`);
  },

  async getCategoryStats(): Promise<CategoryStats> {
    const response = await api.get('/categories/stats');
    return response.data.data;
  },

  async createDefaultCategories(): Promise<{ categories: Category[]; count: number }> {
    const response = await api.post('/categories/default');
    return response.data.data;
  }
};
