import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../api/adminApi';
import { ErrorMessage, Loading } from '../../components/ui/Feedback';

export function AdminUsersPage() {
  const query = useQuery({
    queryKey: ['admin-users'],
    queryFn: adminApi.users,
  });
  if (query.isLoading) return <Loading label="Loading users…" />;
  if (query.isError) return <ErrorMessage message={query.error.message} />;
  return (
    <section className="mx-auto max-w-6xl p-6 md:p-10">
      <h1 className="text-4xl font-black">Users</h1>
      <div className="mt-8 overflow-x-auto rounded-2xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-slate-50">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Phone</th>
            </tr>
          </thead>
          <tbody>
            {query.data?.map((user) => (
              <tr className="border-b last:border-0" key={user.id}>
                <td className="p-4 font-semibold">{user.name}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">{user.role}</td>
                <td className="p-4">{user.PhoneNumber || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
