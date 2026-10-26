export type UserRole = 'user' | 'admin';

export type User = {
  id: string;
  name: string;
  email: string;
  PhoneNumber?: string;
  address: string;
  role: UserRole;
};

export type ProductVariant = {
  color: string;
  size: string;
  stock: number;
};

export type Product = {
  id: string;
  name: string;
  price: number | string;
  description: string;
  brand: string;
  imageIds: string[];
  variant: ProductVariant[];
};

export type CartItem = {
  id: string;
  quantity: number;
  productId: string;
  product: Product;
};

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'shipped'
  | 'delivered'
  | 'cancelled';
export type PaymentMethod =
  | 'credit_card'
  | 'debit_card'
  | 'paypal'
  | 'cash_on_delivery'
  | 'khalti';

export type OrderItem = {
  id: string;
  productId: string;
  quantity: number;
  price: number | string;
  product?: Product;
};

export type Order = {
  id: string;
  userId: string;
  totalAmount: number | string;
  totalPrice: number | string;
  status: OrderStatus;
  shippingAddress: string;
  paymentMethod: PaymentMethod;
  orderDate: string;
  orderItems: OrderItem[];
};

export type OrderInput = {
  orderItems: Array<{ productId: string; quantity: number }>;
  shippingAddress: string;
  paymentMethod: PaymentMethod;
};
