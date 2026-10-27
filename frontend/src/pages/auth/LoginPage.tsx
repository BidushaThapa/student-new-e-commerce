import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthProvider';

export function LoginPage() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      if (mode === 'register') {
        await register({
          name: form.name,
          email: form.email,
          password: form.password,
          PhoneNumber: form.phone || undefined,
          address: form.address,
        });
        setMode('login');
        setError('Account created. You can now sign in.');
      } else {
        const user = await login({
          email: form.email,
          password: form.password,
        });
        const from = (location.state as { from?: { pathname?: string } } | null)
          ?.from?.pathname;
        void navigate(
          from || (user.role === 'admin' ? '/admin' : '/products'),
          {
            replace: true,
          },
        );
      }
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : 'Unable to complete request.',
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-3xl font-black">
        {mode === 'login' ? 'Welcome back' : 'Create your account'}
      </h1>
      <p className="mt-2 text-slate-600">
        {mode === 'login'
          ? 'Sign in to shop and manage your orders.'
          : 'Registration creates a standard customer account.'}
      </p>
      <form
        className="mt-8 space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        onSubmit={(event) => {
          void submit(event);
        }}
      >
        {mode === 'register' && (
          <>
            <label className="block text-sm font-semibold">
              Name
              <input
                className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2"
                onChange={(event) =>
                  setForm({ ...form, name: event.target.value })
                }
                required
                value={form.name}
              />
            </label>
            <label className="block text-sm font-semibold">
              Address
              <input
                className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2"
                onChange={(event) =>
                  setForm({ ...form, address: event.target.value })
                }
                required
                value={form.address}
              />
            </label>
          </>
        )}
        <label className="block text-sm font-semibold">
          Email
          <input
            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2"
            onChange={(event) =>
              setForm({ ...form, email: event.target.value })
            }
            required
            type="email"
            value={form.email}
          />
        </label>
        <label className="block text-sm font-semibold">
          Password
          <input
            className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2"
            minLength={8}
            onChange={(event) =>
              setForm({ ...form, password: event.target.value })
            }
            required
            type="password"
            value={form.password}
          />
        </label>
        {mode === 'register' && (
          <label className="block text-sm font-semibold">
            Phone (optional)
            <input
              className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2"
              onChange={(event) =>
                setForm({ ...form, phone: event.target.value })
              }
              value={form.phone}
            />
          </label>
        )}
        {error && <p className="text-sm text-rose-700">{error}</p>}
        <button
          className="w-full rounded-lg bg-rose-700 px-4 py-2 font-bold text-white disabled:opacity-50"
          disabled={busy}
          type="submit"
        >
          {busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Register'}
        </button>
      </form>
      <button
        className="mt-5 text-sm font-semibold text-rose-700 underline"
        onClick={() => {
          setError('');
          setMode(mode === 'login' ? 'register' : 'login');
        }}
        type="button"
      >
        {mode === 'login' ? 'Need an account?' : 'Already have an account?'}
      </button>
      <Link className="mt-4 block text-sm text-slate-600 underline" to="/">
        Back to storefront
      </Link>
    </main>
  );
}
