import api from '@/lib/api';
import { ApiResponse } from '@/types';
import { 
  AuthResponse, 
  RegisterData, 
  LoginData, 
  RefreshTokenResponse 
} from '@/types/auth';

export const authService = {
  async register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { error: 'Erro ao registrar usuário' };
    }
  },

  async login(data: LoginData): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', data);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { error: 'Erro ao fazer login' };
    }
  },

  async refresh(refreshToken: string): Promise<ApiResponse<RefreshTokenResponse>> {
    try {
      const response = await api.post<ApiResponse<RefreshTokenResponse>>('/auth/refresh', {
        refreshToken,
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { error: 'Erro ao renovar token' };
    }
  },

  async forgotPassword(email: string): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await api.post<ApiResponse<{ message: string }>>('/auth/forgot-password', {
        email,
      });
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { error: 'Erro ao enviar nova senha' };
    }
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  },

  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  saveAuthData(authResponse: AuthResponse): void {
    localStorage.setItem('token', authResponse.token);
    localStorage.setItem('refreshToken', authResponse.refreshToken);
    localStorage.setItem('user', JSON.stringify(authResponse.user));
  },
};
