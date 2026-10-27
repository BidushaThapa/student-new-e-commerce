import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { shopApi } from '../../api/shopApi';
import {
  EmptyState,
  ErrorMessage,
  Loading,
} from '../../components/ui/Feedback';

export function CartPage() {
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: ['cart'], queryFn: shopApi.cart });
  const update = useMutation({
    mutationFn: ({ id, quantity }: { id: string; quantity: number }) =>
      shopApi.updateCartItem(id, quantity),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  });
  const remove = useMutation({
    mutationFn: shopApi.removeCartItem,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  });
  const clear = useMutation({
    mutationFn: shopApi.clearCart,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  });

  if (query.isLoading) return <Loading label="Loading your cart…" />;
  if (query.isError) return <ErrorMessage message={query.error.message} />;
  const items = query.data ?? [];
  const total = items.reduce(
    (sum, item) => sum + Number(item.product?.price ?? 0) * item.quantity,
    0,
  );

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-black">Your cart</h1>
        {items.length > 0 && (
          <button
            className="text-sm font-semibold text-red-700"
            onClick={() => clear.mutate()}
            type="button"
          >
            Clear cart
          </button>
        )}
      </div>
      {!items.length ? (
        <div className="mt-8">
          <EmptyState message="Your cart is empty." />
          <Link
            className="mt-5 inline-block font-bold text-rose-700 underline"
            to="/products"
          >
            Browse products
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-8 space-y-4">
            {items.map((item) => (
              <div
                className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5"
                key={item.id}
              >
                <div>
                  <h2 className="font-bold">
                    {item.product?.name ?? 'Product'}
                  </h2>
                  <p className="text-sm text-slate-600">
                    ${Number(item.product?.price ?? 0).toFixed(2)} each
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    className="rounded border px-3 py-1"
                    onClick={() =>
                      item.quantity > 1 &&
                      update.mutate({
                        id: item.id,
                        quantity: item.quantity - 1,
                      })
                    }
                    type="button"
                  >
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    className="rounded border px-3 py-1"
                    onClick={() =>
                      update.mutate({
                        id: item.id,
                        quantity: item.quantity + 1,
                      })
                    }
                    type="button"
                  >
                    +
                  </button>
                </div>
                <strong>
                  $
                  {(Number(item.product?.price ?? 0) * item.quantity).toFixed(
                    2,
                  )}
                </strong>
                <button
                  className="text-sm font-semibold text-red-700"
                  onClick={() => remove.mutate(item.id)}
                  type="button"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-slate-900 p-6 text-white">
            <strong className="text-xl">Total: ${total.toFixed(2)}</strong>
            <Link
              className="rounded-lg bg-rose-500 px-5 py-3 font-bold"
              to="/checkout"
            >
              Checkout
            </Link>
          </div>
        </>
      )}
    </main>
  );
}
