import { Link } from 'react-router-dom';

export function HomePage() {
  return (
    <main>
      <section className="bg-gradient-to-br from-rose-700 to-orange-500 text-white">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-rose-100">
            Student e-commerce
          </p>
          <h1 className="max-w-3xl text-5xl font-black tracking-tight md:text-7xl">
            A simpler way to shop online.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-rose-50">
            Discover products, manage your cart, and track your orders in one
            place.
          </p>
          <Link
            className="mt-8 inline-block rounded-lg bg-white px-5 py-3 font-bold text-rose-700"
            to="/products"
          >
            Browse products
          </Link>
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl gap-6 px-6 py-16 md:grid-cols-3">
        {[
          ['Products', 'Browse the current product catalog.', '/products'],
          ['Shopping cart', 'Keep your selections together.', '/cart'],
          ['Orders', 'Track your customer orders.', '/orders'],
        ].map(([title, description, href]) => (
          <article
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            key={title}
          >
            <h2 className="text-xl font-bold">{title}</h2>
            <p className="mt-2 text-slate-600">{description}</p>
            <Link
              className="mt-4 inline-block font-bold text-rose-700 underline"
              to={href}
            >
              Open
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}
