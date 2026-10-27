import { Link, Route, Routes } from 'react-router-dom';
import { AdminLayout } from '../admin/AdminLayout';
import { StorefrontLayout } from '../layouts/StorefrontLayout';
import { AdminDashboardPage } from '../admin/pages/AdminDashboardPage';
import { AdminProductsPage } from '../admin/pages/AdminProductsPage';
import { AdminCategoriesPage } from '../admin/pages/AdminCategoriesPage';
import { AdminOrdersPage } from '../admin/pages/AdminOrdersPage';
import { AdminUsersPage } from '../admin/pages/AdminUsersPage';
import { HomePage } from '../pages/storefront/HomePage';
import { LoginPage } from '../pages/auth/LoginPage';
import { ProductsPage } from '../pages/storefront/ProductsPage';
import { ProductDetailsPage } from '../pages/storefront/ProductDetailsPage';
import { CartPage } from '../pages/storefront/CartPage';
import { CheckoutPage } from '../pages/storefront/CheckoutPage';
import { OrdersPage } from '../pages/storefront/OrdersPage';
import { OrderDetailsPage } from '../pages/storefront/OrderDetailsPage';
import { ProtectedRoute } from '../components/auth/ProtectedRoute';

export function App() {
  return (
    <Routes>
      <Route element={<StorefrontLayout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/:id" element={<ProductDetailsPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="orders/:id" element={<OrderDetailsPage />} />
        </Route>
      </Route>
      <Route path="admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="categories" element={<AdminCategoriesPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
        <Route path="users" element={<AdminUsersPage />} />
      </Route>
      <Route
        path="*"
        element={
          <main className="mx-auto max-w-3xl p-8">
            <h1 className="text-3xl font-bold text-slate-900">
              Page not found
            </h1>
            <Link className="mt-4 inline-block text-rose-700 underline" to="/">
              Return to ShopNest
            </Link>
          </main>
        }
      />
    </Routes>
  );
}
