<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
            \App\Http\Middleware\SecurityHeadersMiddleware::class,
        ]);

        $middleware->alias([
            'admin' => \App\Http\Middleware\AdminMiddleware::class,
            'student' => \App\Http\Middleware\StudentMiddleware::class,
        ]);

        $middleware->redirectTo(
            guests: '/login',
            users: function ($request) {
                if ($request->user()?->role === 'admin') {
                    return '/admin/dashboard';
                }
                return '/dashboard';
            }
        );
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
