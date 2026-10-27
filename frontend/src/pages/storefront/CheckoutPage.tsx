import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { shopApi } from '../../api/shopApi';
import { ErrorMessage, Loading } from '../../components/ui/Feedback';
import type { PaymentMethod } from '../../types/api';
import { loadKhaltiCheckout } from './khalti';

export function CheckoutPage() {
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>('cash_on_delivery');
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const cart = useQuery({ queryKey: ['cart'], queryFn: shopApi.cart });
  const order = useMutation({
    mutationFn: () =>
      shopApi.createOrder({
        orderItems: (cart.data ?? []).map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        shippingAddress,
        paymentMethod,
      }),
    onSuccess: (created) => {
      void queryClient.invalidateQueries({ queryKey: ['cart'] });
      void queryClient.invalidateQueries({ queryKey: ['orders'] });
      if (paymentMethod === 'khalti') {
        void startKhaltiPayment(created.id, Number(created.totalAmount)).catch(
          (error: unknown) => {
            window.alert(
              error instanceof Error
                ? error.message
                : 'Unable to start Khalti checkout',
            );
          },
        );
      } else {
        void navigate(`/orders/${created.id}`);
      }
    },
  });

  async function startKhaltiPayment(orderId: string, total: number) {
    const publicKey = import.meta.env.VITE_KHALTI_PUBLIC_KEY;
    const productIdentity =
      import.meta.env.VITE_KHALTI_PRODUCT_ID || '1234567890';
    if (!publicKey) {
      throw new Error('Khalti public key is not configured');
    }

    await shopApi.createPayment(orderId);
    await loadKhaltiCheckout();
    if (!window.KhaltiCheckout) {
      throw new Error('Khalti checkout could not be loaded');
    }

    const checkout = new window.KhaltiCheckout({
      publicKey,
      productIdentity,
      productName: 'ShopNest order',
      productUrl: window.location.origin,
      paymentPreference: [
        'KHALTI',
        'EBANKING',
        'MOBILE_BANKING',
        'CONNECT_IPS',
        'SCT',
      ],
      eventHandler: {
        onSuccess: (payload) => {
          void verifyKhaltiPayment(orderId, payload.token);
        },
        onError: () => {
          window.alert('Khalti payment failed. Your order remains pending.');
        },
        onClose: () => undefined,
      },
    });
    checkout.show({ amount: Math.round(total * 100) });
  }

  async function verifyKhaltiPayment(orderId: string, token: string) {
    try {
      await shopApi.verifyKhaltiPayment(orderId, token);
      void queryClient.invalidateQueries({ queryKey: ['orders'] });
      void navigate(`/orders/${orderId}`);
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : 'Khalti payment verification failed',
      );
    }
  }

  if (cart.isLoading) return <Loading label="Preparing checkout…" />;
  if (cart.isError) return <ErrorMessage message={cart.error.message} />;
  if (!cart.data?.length)
    return (
      <main className="mx-auto max-w-3xl p-8">
        <ErrorMessage message="Your cart is empty." />
        <Link
          className="mt-4 inline-block text-rose-700 underline"
          to="/products"
        >
          Browse products
        </Link>
      </main>
    );

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-4xl font-black">Checkout</h1>
      <form
        className="mt-8 space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        onSubmit={(event) => {
          event.preventDefault();
          void order.mutate();
        }}
      >
        <label className="block text-sm font-bold">
          Shipping address
          <textarea
            className="mt-2 min-h-28 w-full rounded-lg border border-slate-300 p-3"
            minLength={10}
            onChange={(event) => setShippingAddress(event.target.value)}
            required
            value={shippingAddress}
          />
        </label>
        <label className="block text-sm font-bold">
          Payment method
          <select
            className="mt-2 w-full rounded-lg border border-slate-300 p-3"
            onChange={(event) =>
              setPaymentMethod(event.target.value as PaymentMethod)
            }
            value={paymentMethod}
          >
            <option value="cash_on_delivery">Cash on delivery</option>
            <option value="credit_card">Credit card (record only)</option>
            <option value="debit_card">Debit card (record only)</option>
            <option value="paypal">PayPal (record only)</option>
            <option value="khalti">Khalti</option>
          </select>
        </label>
        {order.isError && (
          <p className="text-sm text-red-700">{order.error.message}</p>
        )}
        <button
          className="w-full rounded-lg bg-rose-700 px-5 py-3 font-bold text-white disabled:opacity-50"
          disabled={order.isPending}
          type="submit"
        >
          {order.isPending ? 'Placing order…' : 'Place order'}
        </button>
      </form>
    </main>
  );
}
