<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'nisn' => $request->user()->nisn,
                    'email' => $request->user()->email,
                    'role' => $request->user()->role,
                    'avatar_seed' => $request->user()->avatar_seed,
                    'avatar' => $request->user()->avatar,
                    'exp' => $request->user()->exp,
                    'level' => $request->user()->level,
                    'class' => $request->user()->class,
                    'streak_days' => $request->user()->streak_days,
                    'has_completed_onboarding' => (bool) $request->user()->has_completed_onboarding,
                ] : null,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'exp_gained' => fn () => $request->session()->get('exp_gained'),
                'level_up' => fn () => $request->session()->get('level_up'),
                'new_level' => fn () => $request->session()->get('new_level'),
                'achievements' => fn () => $request->session()->get('achievements'),
            ],
        ]);
    }
}
