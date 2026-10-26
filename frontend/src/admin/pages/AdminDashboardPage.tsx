import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { adminApi } from '../api/adminApi';
import { ErrorMessage, Loading } from '../../components/ui/Feedback';

export function AdminDashboardPage() {
  const query = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: adminApi.dashboard,
  });
  if (query.isLoading) return <Loading label="Loading admin dashboard…" />;
  if (query.isError) return <ErrorMessage message={query.error.message} />;
  if (!query.data)
    return <ErrorMessage message="Dashboard data is unavailable." />;
  const stats = query.data;
  return (
    <section className="mx-auto max-w-6xl p-6 md:p-10">
      <p className="text-sm font-bold uppercase tracking-[0.2em] text-rose-700">
        Administration
      </p>
      <h1 className="mt-2 text-4xl font-black">Dashboard</h1>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ['Products', stats.totalProducts, '/admin/products'],
          ['Categories', stats.totalCategories, '/admin/categories'],
          ['Orders', stats.totalOrders, '/admin/orders'],
          ['Users', stats.totalUsers, '/admin/users'],
        ].map(([label, value, href]) => (
          <Link
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-rose-300"
            key={String(label)}
            to={String(href)}
          >
            <p className="text-sm font-semibold text-slate-500">{label}</p>
            <p className="mt-2 text-4xl font-black">{value}</p>
          </Link>
        ))}
      </div>
      <div className="mt-8 rounded-2xl bg-slate-900 p-6 text-white">
        <p className="text-sm text-slate-300">Revenue</p>
        <p className="mt-1 text-3xl font-black">
          ${Number(stats.totalRevenue).toFixed(2)}
        </p>
      </div>
    </section>
  );
}
