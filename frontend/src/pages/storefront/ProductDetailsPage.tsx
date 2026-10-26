import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { shopApi } from '../../api/shopApi';
import { ErrorMessage, Loading } from '../../components/ui/Feedback';
import { useAuth } from '../../features/auth/AuthProvider';
import { ProductImage } from '../../components/product/ProductImage';

export function ProductDetailsPage() {
  const { id = '' } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['product', id],
    queryFn: () => shopApi.product(id),
    enabled: Boolean(id),
  });

  const mutation = useMutation({
    mutationFn: () => shopApi.addToCart(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  });

  if (query.isLoading) return <Loading label="Loading product…" />;
  if (query.isError) return <ErrorMessage message={query.error.message} />;
  if (!query.data) return <ErrorMessage message="Product not found." />;

  const product = query.data;

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <Link
        className="text-sm font-semibold text-rose-700 underline"
        to="/products"
      >
        ← Back to products
      </Link>

      <div className="mt-8 grid gap-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2">
        {/* Product Image */}
        <div className="flex min-h-80 items-center justify-center overflow-hidden rounded-xl bg-rose-50">
          <ProductImage
            alt={product.name}
            className="max-h-[400px] w-full object-contain"
            src={product.imageIds?.[0]}
          />
        </div>

        {/* Product Information */}
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-rose-700">
            {product.brand}
          </p>

          <h1 className="mt-2 text-4xl font-black">{product.name}</h1>

          <p className="mt-4 text-2xl font-bold text-slate-900">
            ${Number(product.price).toFixed(2)}
          </p>

          <p className="mt-5 text-slate-600">{product.description}</p>

          {/* Product Variants */}
          <div className="mt-6 space-y-2">
            {product.variant?.map((variant) => (
              <p
                className="rounded-lg bg-slate-50 p-3 text-sm"
                key={`${variant.color}-${variant.size}`}
              >
                {variant.color} / {variant.size} · {variant.stock} available
              </p>
            ))}
          </div>

          {/* Add to Cart */}
          <button
            className="mt-8 w-full rounded-lg bg-rose-700 px-5 py-3 font-bold text-white disabled:opacity-50"
            disabled={mutation.isPending}
            onClick={() => {
              if (!user) {
                void navigate('/login', {
                  state: { from: `/products/${id}` },
                });
                return;
              }

              mutation.mutate();
            }}
            type="button"
          >
            {mutation.isPending ? 'Adding…' : 'Add to cart'}
          </button>

          {mutation.isError && (
            <p className="mt-3 text-sm text-red-700">
              {mutation.error.message}
            </p>
          )}

          {mutation.isSuccess && (
            <p className="mt-3 text-sm text-green-700">Added to your cart.</p>
          )}
        </div>
      </div>
    </main>
  );
}
