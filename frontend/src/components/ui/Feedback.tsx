export function Loading({ label = 'Loading…' }: { label?: string }) {
  return <p className="py-10 text-center text-slate-600">{label}</p>;
}

export function ErrorMessage({ message }: { message: string }) {
  return <p className="rounded-lg bg-red-50 p-4 text-red-700">{message}</p>;
}

export function EmptyState({ message }: { message: string }) {
  return (
    <p className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-slate-600">
      {message}
    </p>
  );
}
