import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import CertificateQrCode from '@/Components/CertificateQrCode';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { useT } from '@/hooks/useT';

export default function CertificateShow({ certificate, verificationUrl, isSample = false, signature = null }) {
    const t = useT();
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(verificationUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    const handlePrint = () => {
        window.print();
    };

    // Format date nicely
    const formattedDate = certificate.completion_date
        ? new Date(certificate.completion_date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
          })
        : new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
          });

    const statusParts = t('cert.status_line', 'Status: {status}').split('{status}');
    const verifyLineParts = t('cert.verify_line', 'Anyone can verify this credential instantly by scanning the QR code or visiting {url}').split('{url}');

    return (
        <div className="min-h-screen bg-slate-100/90 py-6 sm:py-10 px-3 sm:px-6 font-sans text-slate-800">
            <Head>
                <title>{t('cert.page_title', 'Certificate of Completion - {name} | Success Life Coaching').replace('{name}', certificate.student_name)}</title>
                <meta
                    name="description"
                    content={t('cert.meta_desc', 'Official Verifiable Completion Certificate for {name} in {course}. Credential ID: {id}.').replace('{name}', certificate.student_name).replace('{course}', certificate.course_title).replace('{id}', certificate.certificate_number)}
                />
            </Head>

            {/* Print CSS Styles to ensure flawless A4 Landscape output */}
            <style>{`
                @media print {
                    * {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    body {
                        background: white !important;
                        padding: 0 !important;
                        margin: 0 !important;
                    }
                    .no-print {
                        display: none !important;
                    }
                    .print-certificate {
                        width: 100% !important;
                        max-width: 100% !important;
                        box-shadow: none !important;
                        border: none !important;
                        margin: 0 !important;
                        page-break-inside: avoid;
                    }
                    .watermark-logo {
                        opacity: 0.10 !important;
                    }
                    @page {
                        size: landscape;
                        margin: 6mm;
                    }
                }
            `}</style>

            {/* Top Action Bar (Hidden when printing) */}
            <div className="no-print mx-auto max-w-5xl mb-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow-sm border border-copper-100">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/"
                            className="flex h-10 w-10 items-center justify-center rounded-xl bg-copper-50 text-copper-700 hover:bg-copper-100 transition"
                            title={t('cert.return_home', 'Return to Home')}
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </Link>
                        <div>
                            <h2 className="text-sm sm:text-base font-black text-slate-900 leading-tight">
                                {t('cert.official_verifiable', 'Official Verifiable Certificate')}
                            </h2>
                            <p className="text-xs text-slate-500">
                                {t('cert.credential_id', 'Credential ID:')} <span className="font-mono font-bold text-copper-700">{certificate.certificate_number}</span>
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        <button
                            type="button"
                            onClick={handleCopy}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition active:scale-95 shadow-xs"
                        >
                            <span>{copied ? t('cert.copied', '✓ Copied') : t('cert.copy_link', '🔗 Copy Link')}</span>
                        </button>

                        <Link
                            href={route('certificates.verify', certificate.certificate_number)}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition active:scale-95 shadow-xs"
                        >
                            <span>🛡️ {t('cert.verify', 'Verify Credential')}</span>
                        </Link>

                        <button
                            type="button"
                            onClick={handlePrint}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-copper-700 to-copper-900 px-4 py-2 text-xs font-bold text-white hover:shadow-copper-glow transition active:scale-95 shadow-md"
                        >
                            <span>🖨️ {t('cert.print_pdf', 'Print / Save PDF')}</span>
                        </button>
                    </div>
                </div>

                {isSample && (
                    <div className="mt-3 rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900 flex items-center gap-2">
                        <span>💡</span>
                        <span>
                            {t('cert.sample_notice', 'This is an official demonstration certificate preview. Students enrolled in courses receive their own personalized credential with active QR code upon 100% completion.')}
                        </span>
                    </div>
                )}
            </div>

            {/* ========================================================
                MAIN LUXURY CERTIFICATE FRAME (PRINT & SCREEN)
               ======================================================== */}
            <div className="mx-auto max-w-5xl print-certificate">
                <div
                    className="relative overflow-hidden rounded-[20px] sm:rounded-[28px] p-2 sm:p-3 shadow-[0_30px_90px_-30px_rgba(0,65,1,0.5)]"
                    style={{ background: 'linear-gradient(135deg, #F3E5AB 0%, #D4AF37 25%, #996515 50%, #D4AF37 75%, #F3E5AB 100%)' }}
                >
                    {/* Deep emerald band */}
                    <div className="relative overflow-hidden rounded-[14px] sm:rounded-[22px] bg-gradient-to-br from-[#003301] via-[#004101] to-[#002a01] p-2.5 sm:p-4">

                    {/* Inner Ornate Gold / Emerald Filigree Border */}
                    <div
                        className="relative overflow-hidden rounded-xl border-2 border-[#D4AF37] p-5 sm:p-9 md:p-12"
                        style={{
                            backgroundColor: '#FFFFFF',
                            backgroundImage: 'none',
                        }}
                    >
                        {/* Thin inner gold keyline */}
                        <div className="pointer-events-none absolute inset-1.5 sm:inset-2.5 rounded-lg border border-[#B8860B]/50"></div>

                        {/* Decorative Corner Ornaments */}
                        {[
                            'top-1 left-1',
                            'top-1 right-1 rotate-90',
                            'bottom-1 right-1 rotate-180',
                            'bottom-1 left-1 -rotate-90',
                        ].map((pos) => (
                            <svg key={pos} className={`absolute ${pos} h-10 w-10 sm:h-16 sm:w-16 text-[#B8860B] select-none pointer-events-none`} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                                <path d="M4 60V18C4 10 10 4 18 4h42" />
                                <path d="M12 60V24c0-6 6-12 12-12h36" strokeOpacity="0.55" />
                                <circle cx="18" cy="18" r="3.5" fill="currentColor" stroke="none" />
                                <path d="M26 18c6 0 8-6 14-6M18 26c0 6-6 8-6 14" strokeOpacity="0.7" />
                            </svg>
                        ))}

                        {/* Official Success Life Coaching Logo Watermark in Background */}
                        <div className="pointer-events-none select-none absolute inset-0 flex items-center justify-center overflow-hidden z-0">
                            <img
                                src="/logo-transparent.png"
                                alt={t('cert.watermark_alt', 'Success Life Coaching Watermark')}
                                className="watermark-logo w-72 h-72 sm:w-96 sm:h-96 md:w-[460px] md:h-[460px] object-contain opacity-[0.09] transition-opacity"
                            />
                        </div>

                        {/* Certificate Header */}
                        <div className="relative z-10 text-center">
                            {/* Logo */}
                            <div className="flex justify-center mb-3">
                                <div className="flex h-14 w-14 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-white p-2 border border-copper-200 shadow-sm">
                                    <ApplicationLogo className="h-full w-full object-contain" />
                                </div>
                            </div>

                            <p className="font-serif text-[11px] sm:text-sm font-bold uppercase tracking-[0.3em] sm:tracking-[0.35em] text-[#004101]">
                                Success Life Coaching Academy
                            </p>
                            <p className="text-[9px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] text-[#B8860B] mt-0.5">
                                {t('cert.directorate', 'Directorate of Executive Accreditation & Personal Leadership')}
                            </p>

                            <div className="my-3 sm:my-5 flex items-center justify-center gap-3">
                                <div className="h-px w-16 sm:w-28 bg-gradient-to-r from-transparent via-[#B8860B] to-transparent"></div>
                                <span className="text-[#B8860B] text-xs">★ ★ ★</span>
                                <div className="h-px w-16 sm:w-28 bg-gradient-to-r from-transparent via-[#B8860B] to-transparent"></div>
                            </div>

                            {/* Headline */}
                            <h1
                                className="font-serif text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-[0.08em] text-transparent bg-clip-text"
                                style={{ backgroundImage: 'linear-gradient(180deg, #006b02 0%, #004101 55%, #002a01 100%)' }}
                            >
                                {t('cert.title', 'Certificate of Completion')}
                            </h1>
                            <div className="mt-2 flex items-center justify-center gap-2 text-[#B8860B]">
                                <span className="h-px w-10 sm:w-20 bg-[#B8860B]/60"></span>
                                <span className="text-sm">◆</span>
                                <span className="h-px w-10 sm:w-20 bg-[#B8860B]/60"></span>
                            </div>

                            <p className="mt-3 sm:mt-5 text-xs sm:text-sm font-medium uppercase tracking-[0.25em] text-slate-500">
                                {t('cert.awarded_to', 'This is proudly awarded to')}
                            </p>

                            {/* Recipient Name */}
                            <div className="mt-2 sm:mt-4 inline-block border-b-2 border-[#B8860B] pb-1 sm:pb-2 px-6 sm:px-14">
                                <h2 className="font-serif italic text-3xl sm:text-5xl md:text-6xl font-bold text-slate-900 tracking-tight">
                                    {certificate.student_name}
                                </h2>
                            </div>

                            {/* Award Description */}
                            <p className="mx-auto mt-4 sm:mt-6 max-w-2xl text-xs sm:text-sm md:text-base leading-relaxed text-slate-700">
                                {t('cert.award_desc', 'for successfully completing all required video masterclasses, practical exercises, and executive frameworks in the accredited program:')}
                            </p>

                            {/* Course Title */}
                            <div className="mt-3 sm:mt-4">
                                <p className="font-serif text-lg sm:text-2xl md:text-3xl font-extrabold text-[#004101] leading-tight">
                                    {certificate.course_title}
                                </p>
                                <p className="mt-1.5 text-xs sm:text-sm font-semibold text-emerald-800">
                                    {certificate.grade_score || t('cert.default_grade', 'Distinction • 100% Course Completion')} • {t('cert.accredited_hours', '{hours} Accredited Hours').replace('{hours}', certificate.hours_completed || 15)}
                                </p>
                            </div>
                        </div>

                        {/* Certificate Bottom Block: QR (left) • Signature (center) • Seal (right) */}
                        <div className="relative z-10 mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-[#B8860B]/40 grid grid-cols-1 sm:grid-cols-3 items-end gap-8 sm:gap-4 text-center">

                            {/* 1. Left: Scannable QR Code */}
                            <div className="flex flex-col items-center sm:items-start order-3 sm:order-1">
                                <div className="flex items-center gap-3 bg-white p-2.5 rounded-2xl border border-[#D4AF37]/60 shadow-sm">
                                    <CertificateQrCode
                                        value={verificationUrl}
                                        size={76}
                                        fgColor="#004101"
                                        bgColor="#ffffff"
                                    />
                                    <div className="text-left">
                                        <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                                            {t('cert.scan_verify', 'Scan to Verify')}
                                        </p>
                                        <p className="font-mono text-[11px] font-black text-[#004101]">
                                            {certificate.certificate_number}
                                        </p>
                                        <p className="text-[8px] text-slate-500 mt-0.5">
                                            {statusParts[0]}<span className="font-bold text-emerald-700">{t('cert.authentic', '✓ Authentic')}</span>{statusParts[1]}
                                        </p>
                                        <a
                                            href={verificationUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[9px] font-bold text-copper-700 hover:underline mt-1 block"
                                        >
                                            {t('cert.verify_online', 'verify online ➜')}
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* 2. Center: Signature */}
                            <div className="flex flex-col items-center justify-end order-1 sm:order-2">
                                <div className="flex h-16 sm:h-20 w-full items-end justify-center">
                                    {signature?.signature_url ? (
                                        <img src={signature.signature_url} alt={signature.signer_name} className="max-h-16 sm:max-h-20 max-w-[220px] mx-auto object-contain select-none pointer-events-none mix-blend-multiply" draggable={false} onContextMenu={(e) => e.preventDefault()} />
                                    ) : (
                                        <div className="font-serif italic text-2xl sm:text-3xl font-bold text-[#004101] select-none tracking-wide">
                                            {signature?.signer_name || 'Tewelde Mebrahtu'}
                                        </div>
                                    )}
                                </div>
                                <div className="h-px w-48 sm:w-56 bg-gradient-to-r from-transparent via-[#B8860B] to-transparent my-1.5"></div>
                                <p className="text-sm sm:text-base font-black text-slate-900">
                                    {signature?.signer_name || 'Tewelde Mebrahtu'}
                                </p>
                                <p className="text-[10px] sm:text-xs font-semibold text-[#B8860B] uppercase tracking-[0.18em]">
                                    {signature?.signer_title || 'Executive Coach & Founder'}
                                </p>
                                <p className="text-[10px] text-emerald-800 font-semibold mt-0.5">
                                    {signature?.organization || 'Success Life Coaching'}
                                </p>
                            </div>

                            {/* 3. Right: Official Gold Security Seal */}
                            <div className="flex flex-col items-center sm:items-end order-2 sm:order-3">
                                <div className="flex flex-col items-center">
                                    <div className="relative flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-gradient-to-tr from-[#996515] via-[#D4AF37] to-[#F3E5AB] p-1 shadow-lg border-2 border-white">
                                        <div className="flex h-full w-full flex-col items-center justify-center rounded-full border border-dashed border-[#5C3A00] bg-gradient-to-br from-[#D4AF37] to-[#AA7C11] text-white p-1">
                                            <span className="text-xs sm:text-sm">★</span>
                                            <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-center leading-tight">
                                                {t('cert.seal_official', 'OFFICIAL')}<br />{t('cert.seal_word', 'SEAL')}
                                            </span>
                                            <span className="text-[7px] font-bold text-amber-100">{t('cert.seal_verified', 'VERIFIED')}</span>
                                        </div>
                                    </div>
                                    <span className="text-[10px] sm:text-xs font-bold text-slate-600 mt-2">
                                        {t('cert.issued', 'Issued: {date}').replace('{date}', formattedDate)}
                                    </span>
                                </div>
                            </div>
                        </div>
                        {/* Footer Cryptographic Footprint */}
                        <div className="relative z-10 mt-6 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[8px] sm:text-[9px] text-slate-400">
                            <p>{t('cert.record_footer', 'Accredited Credential Record • Success Life Coaching Global Certification System')}</p>
                            <p className="font-mono truncate max-w-xs mt-1 sm:mt-0">
                                {t('cert.hash_label', 'HASH:')} {certificate.verification_hash ? certificate.verification_hash.substring(0, 32) : '7f8a32b91c0e4d6f8a2b3c4d5e6f7a8b'}...
                            </p>
                        </div>
                    </div>
                    </div>
                </div>
            </div>

            {/* Bottom Sharing & Verification Links (Hidden on print) */}
            <div className="no-print mx-auto max-w-5xl mt-8 text-center text-xs text-slate-500 space-y-2">
                <p>
                    {verifyLineParts[0]}
                    <a href={verificationUrl} className="font-bold text-copper-700 hover:underline">
                        {verificationUrl}
                    </a>
                    {verifyLineParts[1]}
                </p>
                <div className="flex justify-center gap-4 pt-2">
                    <Link href="/" className="hover:text-copper-700 font-semibold">
                        {t('nav.home', 'Home')}
                    </Link>
                    <span>•</span>
                    <Link href="/courses" className="hover:text-copper-700 font-semibold">
                        {t('cert.browse_courses', 'Browse Courses')}
                    </Link>
                    <span>•</span>
                    <Link href="/seminars" className="hover:text-copper-700 font-semibold">
                        {t('cert.live_seminars', 'Live Seminars')}
                    </Link>
                </div>
            </div>
        </div>
    );
}
