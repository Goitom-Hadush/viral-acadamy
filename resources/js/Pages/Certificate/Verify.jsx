import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { useT } from '@/hooks/useT';

export default function CertificateVerify({ certificate, queryNumber, isValid }) {
    const t = useT();
    const formattedDate = certificate?.completion_date
        ? new Date(certificate.completion_date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
          })
        : '';

    return (
        <AppLayout>
            <Head>
                <title>{t('cert.verify_page_title', 'Credential Verification: {number} | Success Life Coaching Academy').replace('{number}', queryNumber)}</title>
                <meta
                    name="description"
                    content={t('cert.verify_meta_desc', 'Digital credential verification for Certificate {number} issued by Success Life Coaching Academy.').replace('{number}', queryNumber)}
                />
            </Head>

            <div className="pb-20 pt-8 sm:pt-14">
                <section className="section-shell max-w-3xl">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200/80 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.25em] text-emerald-800 mb-3">
                            <span>🛡️</span>
                            <span>{t('cert.registry', 'Digital Credential Registry')}</span>
                        </div>
                        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                            {t('cert.verification_system', 'Certificate Verification System')}
                        </h1>
                        <p className="mt-2 text-xs sm:text-sm text-slate-500">
                            {t('cert.verification_sub', 'Instant online verification for credentials issued by Success Life Coaching Academy.')}
                        </p>
                    </div>

                    {isValid && certificate ? (
                        /* ========================================================
                           1. VERIFIED SUCCESS CARD
                           ======================================================== */
                        <div className="overflow-hidden rounded-3xl sm:rounded-[36px] border border-emerald-200 bg-white shadow-xl">
                            {/* Verified Banner */}
                            <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-copper-900 p-6 sm:p-8 text-white text-center relative overflow-hidden">
                                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 border border-white/30 text-3xl mb-3 shadow-inner">
                                    ✓
                                </div>
                                <span className="inline-block rounded-full bg-white/20 px-3 py-0.5 text-[10px] font-black uppercase tracking-widest text-emerald-100 mb-1">
                                    {t('cert.record_verified', 'Official Record Verified')}
                                </span>
                                <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                                    {t('cert.authentic_confirmed', 'Authentic Credential Confirmed')}
                                </h2>
                                <p className="mt-1 text-xs sm:text-sm text-emerald-100 max-w-lg mx-auto">
                                    {t('cert.issued_by_notice', 'This certificate was officially issued by Success Life Coaching Academy. The record matches our secure registry.')}
                                </p>
                            </div>

                            {/* Detailed Credential Facts */}
                            <div className="p-6 sm:p-10 space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-copper-100 pb-6">
                                    <div>
                                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                            {t('cert.student_recipient', 'Student / Recipient')}
                                        </p>
                                        <p className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
                                            {certificate.student_name}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                            {t('cert.credential_status', 'Credential Status')}
                                        </p>
                                        <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-300 px-3 py-1 text-xs font-bold text-emerald-800">
                                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                            {t('cert.active_valid', 'Active & Valid')}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-4 text-xs sm:text-sm">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-slate-100 gap-1">
                                        <span className="text-slate-500 font-medium">{t('cert.program_completed', 'Program Completed')}</span>
                                        <span className="font-bold text-slate-900 sm:text-right">{certificate.course_title}</span>
                                    </div>

                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-slate-100 gap-1">
                                        <span className="text-slate-500 font-medium">{t('cert.certificate_number', 'Certificate Number')}</span>
                                        <span className="font-mono font-bold text-copper-700">{certificate.certificate_number}</span>
                                    </div>

                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-slate-100 gap-1">
                                        <span className="text-slate-500 font-medium">{t('cert.coach_instructor', 'Executive Coach / Instructor')}</span>
                                        <span className="font-semibold text-slate-800">{certificate.instructor_name}</span>
                                    </div>

                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-slate-100 gap-1">
                                        <span className="text-slate-500 font-medium">{t('cert.date_of_issue', 'Date of Issue')}</span>
                                        <span className="font-semibold text-slate-800">{formattedDate}</span>
                                    </div>

                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-slate-100 gap-1">
                                        <span className="text-slate-500 font-medium">{t('cert.honors', 'Honors & Performance')}</span>
                                        <span className="font-bold text-emerald-800">{certificate.grade_score}</span>
                                    </div>

                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-2 border-b border-slate-100 gap-1">
                                        <span className="text-slate-500 font-medium">{t('cert.accrediting_authority', 'Accrediting Authority')}</span>
                                        <span className="font-semibold text-slate-800">Success Life Coaching Academy Global</span>
                                    </div>
                                </div>

                                {/* Security Hash */}
                                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3.5 text-xs">
                                    <p className="font-bold text-slate-600 mb-1">{t('cert.fingerprint', 'Cryptographic Fingerprint')}</p>
                                    <p className="font-mono text-[11px] text-slate-500 break-all select-all">
                                        {certificate.verification_hash}
                                    </p>
                                </div>

                                {/* Action Button */}
                                <div className="pt-4 flex flex-col sm:flex-row gap-3">
                                    <Link
                                        href={route('certificates.show', certificate.certificate_number)}
                                        className="btn-primary w-full justify-center py-3.5 text-xs sm:text-sm font-bold shadow-md shadow-copper-900/20"
                                    >
                                        <span>{t('cert.view_full', 'View Official Full Certificate ➜')}</span>
                                    </Link>
                                    <Link
                                        href={route('courses.index')}
                                        className="btn-secondary w-full justify-center py-3.5 text-xs sm:text-sm font-bold"
                                    >
                                        {t('cert.explore_programs', 'Explore Academy Programs')}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* ========================================================
                           2. INVALID / NOT FOUND CARD
                           ======================================================== */
                        <div className="overflow-hidden rounded-3xl border border-rose-200 bg-white p-8 sm:p-12 text-center shadow-lg">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 text-3xl mb-4 border border-rose-200">
                                ⚠️
                            </div>
                            <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-700">
                                {t('cert.not_found', 'Record Not Found')}
                            </span>
                            <h2 className="mt-3 text-xl sm:text-2xl font-black text-slate-900">
                                {t('cert.unable_verify', 'Unable to Verify Certificate: {number}').replace('{number}', queryNumber)}
                            </h2>
                            <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                                {t('cert.not_found_body', 'We could not find an active certificate matching this credential number in our registry. Please check the ID or contact academy support.')}
                            </p>

                            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                                <Link href="/" className="btn-secondary text-xs">
                                    {t('cert.return_home', 'Return to Home')}
                                </Link>
                                <Link href={route('certificates.sample')} className="btn-primary text-xs">
                                    {t('cert.view_sample', 'View Sample Certificate Preview')}
                                </Link>
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </AppLayout>
    );
}
