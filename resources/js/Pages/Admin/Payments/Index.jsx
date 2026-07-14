import AdminLayout from '@/Layouts/AdminLayout';
import { router } from '@inertiajs/react';

export default function PaymentIndex({ payments = [], auth }) {
    const handleApprove = (paymentId) => {
        if (confirm('Are you sure you want to approve this payment? This will unlock the course for the student.')) {
            router.post(route('admin.payments.approve', paymentId));
        }
    };

    return (
        <AdminLayout>
            {/* Hero Section */}
            <div className="mb-8 rounded-3xl hero-gradient p-8 text-white shadow-xl shadow-indigo-500/25 sm:p-10 animate-fade-in">
                <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                    </div>
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-100">Payment Management</p>
                </div>
                <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Pending Payments</h1>
                <p className="mt-3 max-w-2xl text-lg leading-relaxed text-indigo-100">
                    Review and approve student payments to unlock courses. You have {payments.length} pending payment{payments.length !== 1 ? 's' : ''}.
                </p>
            </div>

            {payments.length === 0 ? (
                <div className="surface-card p-16 text-center animate-slide-up">
                    <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
                        <svg className="h-10 w-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="mb-2 text-2xl font-bold text-slate-900">No pending payments</h3>
                    <p className="text-slate-500 text-lg">All payments have been processed!</p>
                </div>
            ) : (
                <div className="space-y-6 animate-slide-up">
                    {payments.map((payment) => {
                    const safePayment = {
                        ...payment,
                        user: payment.user || { name: 'Unknown', email: 'Unknown' },
                        course: payment.course || { title: 'Unknown Course' }
                    };
                    return (
                        <div key={safePayment.id} className="surface-card card-hover p-8">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-1">
                                    {safePayment.receipt_image && (
                                        <img 
                                            src={`/storage/${safePayment.receipt_image}`} 
                                            alt="Receipt" 
                                            className="w-full h-64 object-cover rounded-2xl border border-slate-200 cursor-pointer shadow-md hover:shadow-lg transition-all"
                                            onClick={() => window.open(`/storage/${safePayment.receipt_image}`, '_blank')}
                                        />
                                    )}
                                </div>

                                <div className="lg:col-span-2 flex flex-col justify-between">
                                    <div className="space-y-4">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div>
                                                <h3 className="text-2xl font-black text-slate-900">{safePayment.course.title}</h3>
                                                <p className="text-slate-600 mt-1">
                                                    Student: <span className="font-semibold text-slate-800">{safePayment.user.name}</span> ({safePayment.user.email})
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-3xl font-black text-emerald-600">{safePayment.amount} ETB</p>
                                                <p className="text-sm text-slate-500 mt-1">
                                                    {safePayment.created_at ? new Date(safePayment.created_at).toLocaleString() : 'Unknown date'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-8 flex flex-col sm:flex-row gap-4">
                                        <button 
                                            onClick={() => handleApprove(safePayment.id)}
                                            className="btn-primary"
                                        >
                                            Approve Payment & Unlock Course
                                        </button>
                                        {safePayment.receipt_image && (
                                            <button 
                                                onClick={() => window.open(`/storage/${safePayment.receipt_image}`, '_blank')}
                                                className="rounded-2xl bg-slate-100 px-8 py-4 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-200 hover:shadow-md"
                                            >
                                                View Receipt
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
                </div>
            )}
        </AdminLayout>
    );
}
