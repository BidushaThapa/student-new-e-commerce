import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { shopApi } from '../../api/shopApi';
import {
  ErrorMessage,
  Loading,
  EmptyState,
} from '../../components/ui/Feedback';
import { useAuth } from '../../features/auth/AuthProvider';
import { ProductImage } from '../../components/product/ProductImage';

export function ProductsPage() {
  const { user } = useAuth();
  const query = useQuery({ queryKey: ['products'], queryFn: shopApi.products });

  if (query.isLoading) return <Loading label="Loading products…" />;
  if (query.isError) return <ErrorMessage message={query.error.message} />;
  if (!query.data?.length)
    return <EmptyState message="No products are available yet." />;

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-rose-700">
            Shop
          </p>
          <h1 className="mt-2 text-4xl font-black">Featured products</h1>
        </div>
        {user && (
          <Link
            className="text-sm font-bold text-rose-700 underline"
            to="/cart"
          >
            View cart
          </Link>
        )}
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {query.data.map((product) => (
          <article
            className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            key={product.id}
          >
            <div className="h-40 bg-rose-50">
              <ProductImage
                alt={product.name}
                className="h-full w-full object-contain"
                src={product.imageIds?.[0]}
              />
            </div>
            <div className="p-5">
              <p className="text-sm font-semibold text-slate-500">
                {product.brand}
              </p>
              <h2 className="mt-1 text-xl font-bold">{product.name}</h2>
              <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                {product.description}
              </p>
              <div className="mt-5 flex items-center justify-between">
                <strong className="text-lg text-rose-700">
                  ${Number(product.price).toFixed(2)}
                </strong>
                <Link
                  className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-bold text-white"
                  to={`/products/${product.id}`}
                >
                  View product
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
