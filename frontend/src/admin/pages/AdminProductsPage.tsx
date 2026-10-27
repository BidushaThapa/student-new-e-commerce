import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { adminApi, type ProductInput } from '../api/adminApi';
import { ErrorMessage, Loading } from '../../components/ui/Feedback';

const empty: ProductInput = {
  name: '',
  price: 0,
  description: '',
  brand: '',
  variant: [{ color: '', size: '', stock: 0 }],
};
export function AdminProductsPage() {
  const client = useQueryClient();
  const query = useQuery({
    queryKey: ['admin-products'],
    queryFn: adminApi.products,
  });
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<string | null>(null);
  const save = useMutation({
    mutationFn: () =>
      editing
        ? adminApi.updateProduct(editing, form)
        : adminApi.createProduct(form),
    onSuccess: () => {
      void client.invalidateQueries({ queryKey: ['admin-products'] });
      setForm(empty);
      setEditing(null);
    },
  });
  const remove = useMutation({
    mutationFn: adminApi.deleteProduct,
    onSuccess: () =>
      void client.invalidateQueries({ queryKey: ['admin-products'] }),
  });
  if (query.isLoading) return <Loading label="Loading products…" />;
  if (query.isError) return <ErrorMessage message={query.error.message} />;
  return (
    <section className="mx-auto max-w-6xl p-6 md:p-10">
      <h1 className="text-4xl font-black">Products</h1>
      <form
        className="mt-8 grid gap-3 rounded-2xl bg-white p-6 shadow-sm sm:grid-cols-2"
        onSubmit={(event) => {
          event.preventDefault();
          void save.mutate();
        }}
      >
        <input
          className="rounded-lg border p-3"
          placeholder="Name"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          className="rounded-lg border p-3"
          min="0"
          placeholder="Price"
          required
          type="number"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
        />
        <input
          className="rounded-lg border p-3"
          placeholder="Brand"
          required
          value={form.brand}
          onChange={(e) => setForm({ ...form, brand: e.target.value })}
        />
        <textarea
          className="rounded-lg border p-3 sm:col-span-2"
          placeholder="Description"
          required
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <button
          className="rounded-lg bg-rose-700 px-4 py-3 font-bold text-white"
          type="submit"
        >
          {editing ? 'Update product' : 'Create product'}
        </button>
        {editing && (
          <button
            className="rounded-lg border px-4 py-3 font-bold"
            onClick={() => {
              setEditing(null);
              setForm(empty);
            }}
            type="button"
          >
            Cancel
          </button>
        )}
      </form>
      <div className="mt-8 space-y-3">
        {query.data?.map((product) => (
          <div
            className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-white p-5 shadow-sm"
            key={product.id}
          >
            <div>
              <h2 className="font-bold">{product.name}</h2>
              <p className="text-sm text-slate-500">
                {product.brand} · ${Number(product.price).toFixed(2)}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                className="rounded border px-3 py-2"
                onClick={() => {
                  setEditing(product.id);
                  setForm({
                    name: product.name,
                    price: Number(product.price),
                    description: product.description,
                    brand: product.brand,
                    variant: product.variant ?? [],
                  });
                }}
                type="button"
              >
                Edit
              </button>
              <button
                className="rounded bg-red-600 px-3 py-2 text-white"
                onClick={() => void remove.mutate(product.id)}
                type="button"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
