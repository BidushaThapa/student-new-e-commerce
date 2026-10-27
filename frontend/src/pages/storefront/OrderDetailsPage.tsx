import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { shopApi } from '../../api/shopApi';
import { ErrorMessage, Loading } from '../../components/ui/Feedback';

export function OrderDetailsPage() {
  const { id = '' } = useParams();
  const query = useQuery({
    queryKey: ['order', id],
    queryFn: () => shopApi.order(id),
    enabled: Boolean(id),
  });
  if (query.isLoading) return <Loading label="Loading order…" />;
  if (query.isError) return <ErrorMessage message={query.error.message} />;
  if (!query.data) return <ErrorMessage message="Order not found." />;
  const order = query.data;
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <Link className="text-sm font-bold text-rose-700 underline" to="/orders">
        ← Back to orders
      </Link>
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">Order #{order.id}</p>
            <h1 className="mt-1 text-3xl font-black">Order details</h1>
          </div>
          <span className="h-fit rounded-full bg-rose-50 px-3 py-1 font-bold capitalize text-rose-700">
            {order.status}
          </span>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm text-slate-500">Shipping address</p>
            <p className="font-semibold">{order.shippingAddress}</p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Payment method</p>
            <p className="font-semibold">
              {order.paymentMethod.replaceAll('_', ' ')}
            </p>
          </div>
        </div>
        <div className="mt-8 space-y-3">
          {order.orderItems?.map((item) => (
            <div
              className="flex justify-between border-t border-slate-100 py-3"
              key={item.id}
            >
              <span>
                {item.product?.name ?? item.productId} × {item.quantity}
              </span>
              <strong>
                ${(Number(item.price) * item.quantity).toFixed(2)}
              </strong>
            </div>
          ))}
        </div>
        <p className="mt-6 border-t border-slate-200 pt-5 text-right text-xl font-black">
          Total: ${Number(order.totalAmount).toFixed(2)}
        </p>
      </div>
    </main>
  );
}
