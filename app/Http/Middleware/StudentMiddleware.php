<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class StudentMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!Auth::check()) {
            return redirect('/login');
        }

        if (Auth::user()->role === 'student') {
            return $next($request);
        }

        if (Auth::user()->role === 'admin') {
            return redirect('/admin/dashboard');
        }

        return redirect('/login');
    }
}
