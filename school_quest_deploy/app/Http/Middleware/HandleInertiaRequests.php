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
                    'rank_name' => $request->user()->rank_name,
                    'current_level_base_exp' => $request->user()->current_level_base_exp,
                    'next_level_exp' => $request->user()->next_level_exp,
                    'exp_in_level' => $request->user()->exp_in_level,
                    'exp_needed_in_level' => $request->user()->exp_needed_in_level,
                    'exp_percentage' => $request->user()->exp_percentage,
                    'exp_remaining' => $request->user()->exp_remaining,
                    'class' => $request->user()->class,
                    'streak_days' => $request->user()->streak_days,
                    'has_completed_onboarding' => (bool) $request->user()->has_completed_onboarding,
                    'is_muted' => (bool) $request->user()->is_muted,
                    'muted_until' => $request->user()->muted_until?->format('d M Y, H:i'),
                    'mute_remaining' => $request->user()->mute_remaining_human,
                ] : null,
                'unacknowledged_sanctions' => fn () => $request->user() && $request->user()->role === 'student'
                    ? $request->user()->sanctions()
                        ->with('admin:id,name')
                        ->where('is_acknowledged', false)
                        ->latest()
                        ->get()
                        ->map(function ($s) {
                            return [
                                'id' => $s->id,
                                'type' => $s->type,
                                'amount' => $s->amount,
                                'reason' => $s->reason,
                                'admin_name' => $s->admin?->name ?? 'Administrator',
                                'expires_at' => $s->expires_at?->format('d M Y, H:i'),
                                'created_at' => $s->created_at->format('d M Y, H:i'),
                            ];
                        })
                    : [],
                'pending_reports_count' => fn () => $request->user() && $request->user()->role === 'admin'
                    ? \App\Models\ForumReport::where('status', 'pending')->count()
                    : 0,
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
