import { Link, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthProvider';

export function AdminLayout() {
  const { user, isLoading, logout } = useAuth();
  if (isLoading)
    return <p className="p-8 text-center">Loading your account…</p>;
  if (!user) return <Navigate replace to="/login" />;
  if (user.role !== 'admin') return <Navigate replace to="/" />;
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white p-6 md:block">
        <Link className="text-2xl font-black text-rose-700" to="/admin">
          ShopNest Admin
        </Link>
        <nav className="mt-10 space-y-2 text-sm font-semibold">
          <Link
            className="block rounded-lg px-3 py-2 hover:bg-rose-50"
            to="/admin"
          >
            Dashboard
          </Link>
          <Link
            className="block rounded-lg px-3 py-2 hover:bg-rose-50"
            to="/admin/products"
          >
            Products
          </Link>
          <Link
            className="block rounded-lg px-3 py-2 hover:bg-rose-50"
            to="/admin/categories"
          >
            Categories
          </Link>
          <Link
            className="block rounded-lg px-3 py-2 hover:bg-rose-50"
            to="/admin/orders"
          >
            Orders
          </Link>
          <Link
            className="block rounded-lg px-3 py-2 hover:bg-rose-50"
            to="/admin/users"
          >
            Users
          </Link>
          <Link className="block rounded-lg px-3 py-2 hover:bg-rose-50" to="/">
            View storefront
          </Link>
          <button
            className="block px-3 py-2 text-red-700"
            onClick={logout}
            type="button"
          >
            Logout
          </button>
        </nav>
      </aside>
      <main className="min-h-screen md:ml-64">
        <Outlet />
      </main>
    </div>
  );
}
