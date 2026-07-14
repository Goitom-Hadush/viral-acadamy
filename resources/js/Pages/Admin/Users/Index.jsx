import AdminLayout from '@/Layouts/AdminLayout';
import { router } from '@inertiajs/react';

export default function UserIndex({ users = [], auth }) {
    const handleRoleChange = (e, userId) => {
        const newRole = e.target.value;
        router.patch(route('admin.users.role', userId), {
            role: newRole
        }, {
            preserveScroll: true,
        });
    };

    return (
        <AdminLayout>
            {/* Hero Section */}
            <div className="mb-8 rounded-3xl hero-gradient p-8 text-white shadow-xl shadow-indigo-500/25 sm:p-10 animate-fade-in">
                <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    </div>
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-100">User Management</p>
                </div>
                <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Manage Users</h1>
                <p className="mt-3 max-w-2xl text-lg leading-relaxed text-indigo-100">
                    View all registered users and assign roles. You have {users.length} user{users.length !== 1 ? 's' : ''}.
                </p>
            </div>

            <div className="surface-card overflow-hidden animate-slide-up">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                                <th className="p-6">Name</th>
                                <th className="p-6">Email</th>
                                <th className="p-6">Status</th>
                                <th className="p-6 text-right">Assign Role</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="p-12 text-center text-slate-500 text-lg">
                                        No users found.
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-lg shadow-md">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-900">{user.name}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6 text-slate-600">{user.email}</td>
                                        <td className="p-6">
                                            <span className={`badge ${
                                                user.status === 'active' 
                                                    ? 'badge-success' 
                                                    : 'badge-danger'
                                            }`}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="p-6 text-right">
                                            <select 
                                                value={user.role}
                                                onChange={(e) => handleRoleChange(e, user.id)}
                                                className="input-modern text-sm font-semibold"
                                            >
                                                <option value="student">Student</option>
                                                <option value="instructor">Instructor</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
