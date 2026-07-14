<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     * Usage in route: ->middleware('role:admin,instructor')
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        // 1. Are they logged in at all?
        if (!$request->user()) {
            return redirect()->route('login'); // Kick them to the login page
        }

        // 2. Is their role in the list of allowed roles we passed in?
        if (!in_array($request->user()->role, $roles)) {
            abort(403, 'UNAUTHORIZED: You do not have permission to access this area.'); // Show forbidden error
        }

        // 3. They passed the check, let them through to the page
        return $next($request);
    }
}