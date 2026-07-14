import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 sm:px-6 lg:px-8">
            <div className="absolute inset-0">
                <div className="absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-copper-500/25 blur-3xl" />
                <div className="absolute bottom-0 left-0 h-[320px] w-[320px] rounded-full bg-accent/20 blur-3xl" />
                <div className="absolute right-0 top-20 h-[320px] w-[320px] rounded-full bg-bronze/20 blur-3xl" />
            </div>

            <div className="relative grid w-full max-w-6xl overflow-hidden rounded-[32px] border border-copper-200 bg-white/80 shadow-copper-glow backdrop-blur-xl lg:grid-cols-[1.05fr_0.95fr]">
                <div className="hidden border-r border-copper-100 bg-gradient-to-br from-copper-700 via-accent to-bronze p-10 text-white lg:flex lg:flex-col lg:justify-between">
                    <div>
                        <Link href="/" className="inline-flex items-center gap-4">
                            <div className="flex h-16 w-40 items-center justify-center rounded-2xl bg-white/15 px-2 ring-1 ring-white/25">
                                <ApplicationLogo className="h-full w-full object-contain" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-copper-100">Learning Platform</p>
                                <h1 className="mt-1 text-2xl font-bold">Viral Acadamy</h1>
                            </div>
                        </Link>
                        <div className="mt-14 max-w-xl">
                            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-copper-100">Modern Video Learning</p>
                            <h2 className="mt-4 text-5xl font-bold leading-tight text-balance">
                                Learn faster with a clean and focused academy experience.
                            </h2>
                            <p className="mt-5 text-lg leading-8 text-copper-50">
                                Stream lessons, manage courses, track progress, and enjoy a simpler design built for students, instructors, and admins.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="rounded-2xl bg-white/15 p-4 backdrop-blur-sm">
                            <p className="text-2xl font-bold">HD</p>
                            <p className="mt-1 text-sm text-copper-50">Video-focused layout</p>
                        </div>
                        <div className="rounded-2xl bg-white/15 p-4 backdrop-blur-sm">
                            <p className="text-2xl font-bold">3</p>
                            <p className="mt-1 text-sm text-copper-50">User roles supported</p>
                        </div>
                        <div className="rounded-2xl bg-white/15 p-4 backdrop-blur-sm">
                            <p className="text-2xl font-bold">24/7</p>
                            <p className="mt-1 text-sm text-copper-50">Accessible dashboard flow</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white/95 p-6 backdrop-blur-xl sm:p-8 lg:p-10">
                    <div className="mx-auto w-full max-w-md">
                    {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
