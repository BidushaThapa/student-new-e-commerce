import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { shopApi } from '../../api/shopApi';
import {
  EmptyState,
  ErrorMessage,
  Loading,
} from '../../components/ui/Feedback';

export function OrdersPage() {
  const query = useQuery({ queryKey: ['orders'], queryFn: shopApi.orders });
  if (query.isLoading) return <Loading label="Loading your orders…" />;
  if (query.isError) return <ErrorMessage message={query.error.message} />;
  if (!query.data?.length)
    return (
      <main className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="text-4xl font-black">Your orders</h1>
        <div className="mt-8">
          <EmptyState message="You have not placed an order yet." />
        </div>
      </main>
    );
  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-4xl font-black">Your orders</h1>
      <div className="mt-8 space-y-4">
        {query.data.map((order) => (
          <Link
            className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-rose-300"
            key={order.id}
            to={`/orders/${order.id}`}
          >
            <div>
              <p className="font-bold">Order #{order.id.slice(0, 8)}</p>
              <p className="text-sm text-slate-600">
                {new Date(order.orderDate).toLocaleDateString()}
              </p>
            </div>
            <span className="rounded-full bg-rose-50 px-3 py-1 text-sm font-bold capitalize text-rose-700">
              {order.status}
            </span>
            <strong>${Number(order.totalAmount).toFixed(2)}</strong>
          </Link>
        ))}
      </div>
    </main>
  );
}
