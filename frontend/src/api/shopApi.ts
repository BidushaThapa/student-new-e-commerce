import { apiFetch, jsonBody } from './client';
import type { CartItem, Order, OrderInput, Product } from '../types/api';

export const shopApi = {
  products: () => apiFetch<Product[]>('/products'),
  product: (id: string) => apiFetch<Product>(`/products/${id}`),
  cart: () => apiFetch<CartItem[]>('/shopping-cart'),
  addToCart: (productId: string, quantity = 1) =>
    apiFetch<CartItem>('/shopping-cart', {
      method: 'POST',
      body: jsonBody({ productId, quantity }),
    }),
  updateCartItem: (id: string, quantity: number) =>
    apiFetch<CartItem>(`/shopping-cart/${id}`, {
      method: 'PUT',
      body: jsonBody({ quantity }),
    }),
  removeCartItem: (id: string) =>
    apiFetch<void>(`/shopping-cart/${id}`, { method: 'DELETE' }),
  clearCart: () => apiFetch<void>('/shopping-cart/clear', { method: 'DELETE' }),
  orders: () => apiFetch<Order[]>('/orders'),
  order: (id: string) => apiFetch<Order>(`/orders/${id}`),
  createOrder: (input: OrderInput) =>
    apiFetch<Order>('/orders', { method: 'POST', body: jsonBody(input) }),
  createPayment: (orderId: string) =>
    apiFetch<{ id: string }>('/payments/create', {
      method: 'POST',
      body: jsonBody({ orderId }),
    }),
  verifyKhaltiPayment: (orderId: string, token: string) =>
    apiFetch('/payments/khalti/verify', {
      method: 'POST',
      body: jsonBody({ orderId, token }),
    }),
};
