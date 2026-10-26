import { apiFetch, jsonBody } from '../../api/client';
import type { Order, Product, User } from '../../types/api';

export type AdminStats = {
  totalUsers: number;
  totalProducts: number;
  totalCategories: number;
  totalOrders: number;
  totalRevenue: number;
};
export type Category = {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  parentCategoryId?: number;
};
export type ProductInput = {
  name: string;
  price: number;
  description: string;
  brand: string;
  variant: Array<{ color: string; size: string; stock: number }>;
};

export const adminApi = {
  dashboard: () => apiFetch<AdminStats>('/admin/dashboard'),
  users: () => apiFetch<User[]>('/admin/users'),
  products: () => apiFetch<Product[]>('/admin/products'),
  createProduct: (input: ProductInput) =>
    apiFetch<Product>('/admin/products', {
      method: 'POST',
      body: jsonBody(input),
    }),
  updateProduct: (id: string, input: Partial<ProductInput>) =>
    apiFetch<Product>(`/admin/products/${id}`, {
      method: 'PATCH',
      body: jsonBody(input),
    }),
  deleteProduct: (id: string) =>
    apiFetch<void>(`/admin/products/${id}`, { method: 'DELETE' }),
  categories: () => apiFetch<Category[]>('/admin/categories'),
  createCategory: (input: Omit<Category, 'id'>) =>
    apiFetch<Category>('/admin/categories', {
      method: 'POST',
      body: jsonBody(input),
    }),
  updateCategory: (id: number, input: Partial<Omit<Category, 'id'>>) =>
    apiFetch<Category>(`/admin/categories/${id}`, {
      method: 'PATCH',
      body: jsonBody(input),
    }),
  deleteCategory: (id: number) =>
    apiFetch<void>(`/admin/categories/${id}`, { method: 'DELETE' }),
  orders: () => apiFetch<Order[]>('/admin/orders'),
  updateOrderStatus: (id: string, status: Order['status']) =>
    apiFetch<Order>(`/admin/orders/${id}/status`, {
      method: 'PATCH',
      body: jsonBody({ status }),
    }),
};
