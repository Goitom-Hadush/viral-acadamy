import { Link, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { useT } from '@/hooks/useT';

function EthiopiaFlag() {
    return (
        <svg className="h-3.5 w-5 rounded-[2px] shadow-xs shrink-0" viewBox="0 0 600 300" aria-hidden>
            <rect width="600" height="100" fill="#009A44" />
            <rect y="100" width="600" height="100" fill="#FED100" />
            <rect y="200" width="600" height="100" fill="#EF3340" />
            <circle cx="300" cy="150" r="42" fill="#00205B" />
            <polygon
                points="300,118 309,142 334,142 314,157 321,180 300,165 279,180 286,157 266,142 291,142"
                fill="#FED100"
            />
        </svg>
    );
}

function UkFlag() {
    return (
        <svg className="h-3.5 w-5 rounded-[2px] shadow-xs shrink-0" viewBox="0 0 60 30" aria-hidden>
            <clipPath id="uk-clip">
                <rect width="60" height="30" />
            </clipPath>
            <g clipPath="url(#uk-clip)">
                <rect width="60" height="30" fill="#012169" />
                <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
                <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4" />
                <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
                <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
            </g>
        </svg>
    );
}

const LANGUAGES = [
    { code: 'ti', label: 'ትግርኛ', hint: 'Tigrinya', flag: <EthiopiaFlag /> },
    { code: 'am', label: 'አማርኛ', hint: 'Amharic', flag: <EthiopiaFlag /> },
    { code: 'en', label: 'English', hint: 'English', flag: <UkFlag /> },
];

export default function LanguageSwitcher({ className = '', dropUp = false }) {
    const { locale = 'en' } = usePage().props;
    const t = useT();
    const [open, setOpen] = useState(false);
    const boxRef = useRef(null);

    const current = LANGUAGES.find((lang) => lang.code === locale) || LANGUAGES[2];

    useEffect(() => {
        const close = (e) => {
            if (boxRef.current && !boxRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', close);
        return () => document.removeEventListener('mousedown', close);
    }, []);

    return (
        <div ref={boxRef} className={`relative inline-block ${className}`.trim()}>
            <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-label={t('lang.label', 'Language')}
                onClick={() => setOpen((value) => !value)}
                className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-copper-200/90 bg-white/95 px-2.5 py-1.5 text-xs font-bold text-slate-700 shadow-xs backdrop-blur-md transition hover:border-copper-400 hover:bg-copper-50/70"
            >
                {current.flag}
                <span className="font-semibold text-slate-800">{current.label}</span>
                <svg className={`h-3 w-3 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {open && (
                <ul
                    role="listbox"
                    aria-label={t('lang.label', 'Language')}
                    className={`absolute z-[80] min-w-[10.5rem] overflow-hidden rounded-2xl border border-copper-100 bg-white p-1 shadow-xl ring-1 ring-black/5 animate-fade-in ${
                        dropUp ? 'bottom-full right-0 mb-2' : 'right-0 top-full mt-2'
                    }`}
                >
                    {LANGUAGES.map((lang) => {
                        const active = lang.code === current.code;
                        return (
                            <li key={lang.code} role="option" aria-selected={active}>
                                <Link
                                    href={route('locale.switch', lang.code)}
                                    preserveScroll
                                    hrefLang={lang.code}
                                    onClick={() => setOpen(false)}
                                    className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs transition ${
                                        active
                                            ? 'bg-copper-50 font-bold text-copper-800'
                                            : 'text-slate-700 hover:bg-slate-50 font-medium'
                                    }`}
                                >
                                    {lang.flag}
                                    <div className="flex flex-col leading-tight">
                                        <span className="font-bold">{lang.label}</span>
                                        <span className="text-[10px] text-slate-400">{lang.hint}</span>
                                    </div>
                                    {active && (
                                        <span className="ml-auto text-emerald-600 font-bold text-xs">✓</span>
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
