import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../api/adminApi';
import { ErrorMessage, Loading } from '../../components/ui/Feedback';
import type { Order } from '../../types/api';

const statuses: Order['status'][] = [
  'pending',
  'confirmed',
  'shipped',
  'delivered',
  'cancelled',
];
export function AdminOrdersPage() {
  const client = useQueryClient();
  const query = useQuery({
    queryKey: ['admin-orders'],
    queryFn: adminApi.orders,
  });
  const update = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Order['status'] }) =>
      adminApi.updateOrderStatus(id, status),
    onSuccess: () =>
      void client.invalidateQueries({
        queryKey: ['admin-orders', 'admin-dashboard'],
      }),
  });
  if (query.isLoading) return <Loading label="Loading orders…" />;
  if (query.isError) return <ErrorMessage message={query.error.message} />;
  return (
    <section className="mx-auto max-w-6xl p-6 md:p-10">
      <h1 className="text-4xl font-black">Orders</h1>
      <div className="mt-8 space-y-3">
        {query.data?.map((order) => (
          <div
            className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-white p-5 shadow-sm"
            key={order.id}
          >
            <div>
              <h2 className="font-bold">Order {order.id.slice(0, 8)}</h2>
              <p className="text-sm text-slate-500">
                ${Number(order.totalAmount).toFixed(2)} ·{' '}
                {order.shippingAddress}
              </p>
            </div>
            <select
              className="rounded-lg border p-2"
              value={order.status}
              onChange={(e) =>
                void update.mutate({
                  id: order.id,
                  status: e.target.value as Order['status'],
                })
              }
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </section>
  );
}
