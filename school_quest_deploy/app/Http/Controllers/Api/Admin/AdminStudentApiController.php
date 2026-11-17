<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\ExpService;
use Illuminate\Http\Request;

class AdminStudentApiController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->get('search');
        $class = $request->get('class');

        $query = User::where('role', 'student');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('nisn', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($class && $class !== 'all') {
            $query->where('class', $class);
        }

        $students = $query->orderByDesc('exp')->get()->map(function ($s) {
            $s->rank_name = ExpService::getRankName($s->level ?: 1);
            return [
                'id' => $s->id,
                'name' => $s->name,
                'nisn' => $s->nisn,
                'email' => $s->email,
                'class' => $s->class,
                'level' => $s->level ?: 1,
                'exp' => $s->exp ?: 0,
                'weekly_exp' => $s->weekly_exp ?: 0,
                'streak_days' => $s->streak_days ?: 0,
                'rank_name' => $s->rank_name,
                'avatar' => $s->avatar,
                'avatar_seed' => $s->avatar_seed,
                'is_muted' => (bool) $s->is_muted,
                'is_banned' => (bool) $s->is_banned,
            ];
        });

        return response()->json([
            'status' => 'success',
            'data' => $students,
        ]);
    }

    public function show(User $student)
    {
        if ($student->role !== 'student') {
            return response()->json(['status' => 'error', 'message' => 'Not found'], 404);
        }

        $student->load([
            'achievements.achievement',
            'questCompletions' => function ($q) {
                $q->latest('completed_at')->with('quest');
            },
            'sanctions' => function ($q) {
                $q->latest()->with('admin');
            }
        ]);

        $student->rank_name = ExpService::getRankName($student->level ?: 1);

        return response()->json([
            'status' => 'success',
            'data' => [
                'student' => [
                    'id' => $student->id,
                    'name' => $student->name,
                    'nisn' => $student->nisn,
                    'email' => $student->email,
                    'class' => $student->class,
                    'level' => $student->level ?: 1,
                    'exp' => $student->exp ?: 0,
                    'weekly_exp' => $student->weekly_exp ?: 0,
                    'streak_days' => $student->streak_days ?: 0,
                    'rank_name' => $student->rank_name,
                    'avatar' => $student->avatar,
                    'avatar_seed' => $student->avatar_seed,
                    'is_muted' => (bool) $student->is_muted,
                    'muted_until' => $student->muted_until?->format('d M Y, H:i'),
                    'is_banned' => (bool) $student->is_banned,
                ],
                'achievements' => $student->achievements->map(function ($ua) {
                    return [
                        'id' => $ua->achievement->id,
                        'name' => $ua->achievement->name,
                        'description' => $ua->achievement->description,
                        'badge_icon' => $ua->achievement->badge_icon,
                        'unlocked_at' => $ua->unlocked_at?->format('d M Y'),
                    ];
                }),
                'quest_completions' => $student->questCompletions->map(function ($c) {
                    return [
                        'id' => $c->id,
                        'quest_title' => $c->quest?->title,
                        'category' => $c->quest?->category,
                        'exp_earned' => $c->exp_earned,
                        'status' => $c->status,
                        'completed_at' => $c->completed_at?->format('d M Y, H:i'),
                    ];
                }),
                'sanctions' => $student->sanctions->map(function ($s) {
                    return [
                        'id' => $s->id,
                        'type' => $s->type,
                        'reason' => $s->reason,
                        'admin_name' => $s->admin?->name,
                        'created_at' => $s->created_at->format('d M Y, H:i'),
                        'is_active' => $s->is_active,
                    ];
                }),
            ],
        ]);
    }

    /**
     * Direct one-click reset of student password to default ('password').
     */
    public function resetPassword(User $student)
    {
        $student->password = \Illuminate\Support\Facades\Hash::make('password');
        $student->save();

        \App\Models\PasswordResetRequest::ensureTableExists();
        \App\Models\PasswordResetRequest::where('user_id', $student->id)
            ->where('status', 'pending')
            ->update([
                'status' => 'resolved',
                'resolved_by' => auth()->id(),
                'resolved_at' => now(),
            ]);

        return response()->json([
            'status' => 'success',
            'message' => "Password siswa {$student->name} berhasil direset ke 'password'.",
        ]);
    }

    /**
     * List all pending password reset requests for admin review.
     */
    public function passwordResetRequests()
    {
        \App\Models\PasswordResetRequest::ensureTableExists();

        $requests = \App\Models\PasswordResetRequest::with('user')
            ->orderByRaw("FIELD(status, 'pending', 'resolved', 'rejected')")
            ->latest()
            ->take(50)
            ->get()
            ->map(function ($r) {
                return [
                    'id' => $r->id,
                    'identifier' => $r->identifier,
                    'notes' => $r->notes,
                    'status' => $r->status,
                    'user_id' => $r->user_id,
                    'user_name' => $r->user?->name,
                    'user_class' => $r->user?->class,
                    'user_nisn' => $r->user?->nisn,
                    'created_at' => $r->created_at->format('d M Y, H:i'),
                    'resolved_at' => $r->resolved_at?->format('d M Y, H:i'),
                ];
            });

        return response()->json([
            'status' => 'success',
            'data' => $requests,
        ]);
    }

    /**
     * Resolve or reject a password reset request.
     */
    public function resolvePasswordResetRequest(\Illuminate\Http\Request $request, $id)
    {
        \App\Models\PasswordResetRequest::ensureTableExists();

        $resetReq = \App\Models\PasswordResetRequest::findOrFail($id);
        $action = $request->input('action', 'resolve'); // 'resolve' or 'reject'

        if (!in_array($action, ['resolve', 'reject'], true)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Aksi permintaan reset tidak valid.',
            ], 422);
        }

        if ($action === 'resolve') {
            $user = $resetReq->user;
            if (!$user && $resetReq->identifier) {
                $normalized = mb_strtolower(trim($resetReq->identifier));
                $user = User::where(function ($q) use ($normalized) {
                    $q->whereRaw('LOWER(nisn) = ?', [$normalized])
                        ->orWhereRaw('LOWER(name) = ?', [$normalized])
                        ->orWhereRaw('LOWER(email) = ?', [$normalized]);
                })->first();
            }

            if (!$user) {
                return response()->json([
                    'status' => 'error',
                    'message' => "Akun dengan identitas \"{$resetReq->identifier}\" tidak ditemukan. Permintaan tidak direset — silakan tolak permintaan ini.",
                ], 422);
            }

            $user->password = \Illuminate\Support\Facades\Hash::make('password');
            $user->save();

            $resetReq->status = 'resolved';
            $resetReq->resolved_by = auth()->id();
            $resetReq->resolved_at = now();
            $resetReq->save();

            return response()->json([
                'status' => 'success',
                'message' => "Permintaan disetujui. Kata sandi akun {$resetReq->identifier} telah direset ke default ('password').",
            ]);
        } else {
            $resetReq->status = 'rejected';
            $resetReq->resolved_by = auth()->id();
            $resetReq->resolved_at = now();
            $resetReq->save();

            return response()->json([
                'status' => 'success',
                'message' => "Permintaan reset kata sandi telah ditolak.",
            ]);
        }
    }
}
