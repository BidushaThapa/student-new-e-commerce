import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthProvider';

export function StorefrontLayout() {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            className="text-2xl font-black tracking-tight text-rose-700"
            to="/"
          >
            ShopNest
          </Link>
          <div className="flex items-center gap-5 text-sm font-semibold">
            <Link className="hover:text-rose-700" to="/products">
              Products
            </Link>
            {user ? (
              <>
                <Link className="hover:text-rose-700" to="/cart">
                  Cart
                </Link>
                <Link className="hover:text-rose-700" to="/orders">
                  Orders
                </Link>
                <button
                  className="text-rose-700"
                  onClick={logout}
                  type="button"
                >
                  Logout
                </button>
                {user.role === 'admin' && (
                  <Link
                    className="rounded-lg bg-rose-700 px-4 py-2 text-white hover:bg-rose-800"
                    to="/admin"
                  >
                    Admin
                  </Link>
                )}
              </>
            ) : (
              <Link
                className="rounded-lg bg-rose-700 px-4 py-2 text-white hover:bg-rose-800"
                to="/login"
              >
                Login
              </Link>
            )}
          </div>
        </nav>
      </header>
      <Outlet />
    </div>
  );
}
