<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        $response->headers->set('X-Frame-Options', 'DENY');
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('Referrer-Policy', 'no-referrer-when-downgrade');
        $response->headers->set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

        $response->headers->set('Content-Security-Policy', $this->contentSecurityPolicy());

        if ($request->isSecure()) {
            $response->headers->set(
                'Strict-Transport-Security',
                'max-age=63072000; includeSubDomains; preload'
            );
        }

        return $response;
    }

    /**
     * Local / Vite HMR needs http://127.0.0.1:5173 (and ws).
     * Production only serves built assets from the same origin.
     */
    private function contentSecurityPolicy(): string
    {
        $viteDev = $this->viteDevOrigins();

        if ($viteDev !== []) {
            $viteHosts = implode(' ', $viteDev);
            $wsHosts = str_replace(['http://', 'https://'], ['ws://', 'wss://'], $viteHosts);

            return implode('; ', [
                "default-src 'self'",
                "script-src 'self' 'unsafe-inline' 'unsafe-eval' {$viteHosts} https:",
                "style-src 'self' 'unsafe-inline' {$viteHosts} https:",
                "font-src 'self' https: data:",
                "img-src 'self' data: blob: https:",
                "media-src 'self' blob: https:",
                "connect-src 'self' {$viteHosts} {$wsHosts} https: wss:",
                "frame-ancestors 'none'",
            ]);
        }

        // Production / built assets only
        return implode('; ', [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https:",
            "style-src 'self' 'unsafe-inline' https:",
            "font-src 'self' https: data:",
            "img-src 'self' data: blob: https:",
            "media-src 'self' blob: https:",
            "connect-src 'self' https:",
            "frame-ancestors 'none'",
        ]);
    }

    /**
     * @return list<string>
     */
    private function viteDevOrigins(): array
    {
        if (! app()->environment(['local', 'development', 'dev'])) {
            // Still honour an active Vite hot file (npm run dev) so login/UI never go blank
            if (! File::exists(public_path('hot'))) {
                return [];
            }
        }

        $origins = [
            'http://127.0.0.1:5173',
            'http://localhost:5173',
            'http://[::1]:5173',
        ];

        $hotPath = public_path('hot');
        if (File::exists($hotPath)) {
            $hot = trim((string) File::get($hotPath));
            if ($hot !== '' && filter_var($hot, FILTER_VALIDATE_URL)) {
                $parts = parse_url($hot);
                if (! empty($parts['scheme']) && ! empty($parts['host'])) {
                    $origin = $parts['scheme'].'://'.$parts['host'];
                    if (! empty($parts['port'])) {
                        $origin .= ':'.$parts['port'];
                    }
                    $origins[] = $origin;
                }
            }
        }

        return array_values(array_unique($origins));
    }
}
