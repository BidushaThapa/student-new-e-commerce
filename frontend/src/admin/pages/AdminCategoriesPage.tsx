import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { adminApi } from '../api/adminApi';
import { ErrorMessage, Loading } from '../../components/ui/Feedback';

export function AdminCategoriesPage() {
  const client = useQueryClient();
  const query = useQuery({
    queryKey: ['admin-categories'],
    queryFn: adminApi.categories,
  });
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const create = useMutation({
    mutationFn: () =>
      adminApi.createCategory({ name, description, isActive: true }),
    onSuccess: () => {
      setName('');
      setDescription('');
      void client.invalidateQueries({ queryKey: ['admin-categories'] });
    },
  });
  const remove = useMutation({
    mutationFn: adminApi.deleteCategory,
    onSuccess: () =>
      void client.invalidateQueries({ queryKey: ['admin-categories'] }),
  });
  if (query.isLoading) return <Loading label="Loading categories…" />;
  if (query.isError) return <ErrorMessage message={query.error.message} />;
  return (
    <section className="mx-auto max-w-6xl p-6 md:p-10">
      <h1 className="text-4xl font-black">Categories</h1>
      <form
        className="mt-8 grid gap-3 rounded-2xl bg-white p-6 sm:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault();
          void create.mutate();
        }}
      >
        <input
          className="rounded-lg border p-3"
          placeholder="Category name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="rounded-lg border p-3"
          placeholder="Description"
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button
          className="rounded-lg bg-rose-700 px-4 py-3 font-bold text-white sm:col-span-2"
          type="submit"
        >
          Create category
        </button>
      </form>
      <div className="mt-8 space-y-3">
        {query.data?.map((category) => (
          <div
            className="flex items-center justify-between rounded-xl bg-white p-5 shadow-sm"
            key={category.id}
          >
            <div>
              <h2 className="font-bold">{category.name}</h2>
              <p className="text-sm text-slate-500">{category.description}</p>
            </div>
            <button
              className="rounded bg-red-600 px-3 py-2 text-white"
              onClick={() => void remove.mutate(category.id)}
              type="button"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
