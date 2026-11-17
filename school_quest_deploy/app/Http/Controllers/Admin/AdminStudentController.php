<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\ExpService;
use App\Services\IdentityResolver;
use Inertia\Inertia;

class AdminStudentController extends Controller
{
    public function index()
    {
        \App\Models\PasswordResetRequest::ensureTableExists();

        $students = User::where('role', 'student')->get()->map(function($s) {
            $s->rank_name = ExpService::getRankName($s->level);
            return $s;
        });

        $passwordResetRequests = \App\Models\PasswordResetRequest::with('user')
            ->orderByRaw("FIELD(status, 'pending', 'resolved', 'rejected')")
            ->latest()
            ->take(50)
            ->get()
            ->each(function ($resetReq) {
                // Old requests may have been stored with user_id = NULL. Resolve the
                // account again so the admin card shows the correct name/details.
                if (!$resetReq->user && $resetReq->identifier) {
                    $resolved = IdentityResolver::find($resetReq->identifier);
                    if ($resolved) {
                        $resetReq->setRelation('user', $resolved);
                        $resetReq->user_id = $resolved->id;
                    }
                }
            });

        return Inertia::render('Admin/Students/Index', [
            'students' => $students,
            'passwordResetRequests' => $passwordResetRequests,
        ]);
    }

    public function show(User $student)
    {
        if ($student->role !== 'student') abort(404);

        $student->load(['achievements.achievement', 'questCompletions' => function($q) {
            $q->latest('completed_at')->with('quest');
        }]);
        $student->rank_name = ExpService::getRankName($student->level);

        return Inertia::render('Admin/Students/Show', [
            'student' => $student
        ]);
    }

    public function resetPassword(User $student)
    {
        $student->resetPasswordToDefault();

        \App\Models\PasswordResetRequest::ensureTableExists();
        \App\Models\PasswordResetRequest::where('user_id', $student->id)
            ->where('status', 'pending')
            ->update([
                'status' => 'resolved',
                'resolved_by' => auth()->id(),
                'resolved_at' => now(),
            ]);

        $default = $student->defaultPassword();
        $label = trim((string) $student->nisn) !== '' ? 'NISN' : 'kata sandi default';

        return back()->with('success', "Kata sandi siswa {$student->name} berhasil direset ke {$label} ({$default}).");
    }

    public function resolveResetRequest(\Illuminate\Http\Request $request, $id)
    {
        \App\Models\PasswordResetRequest::ensureTableExists();
        $resetReq = \App\Models\PasswordResetRequest::findOrFail($id);
        $action = $request->input('action', 'resolve');

        if (!in_array($action, ['resolve', 'reject'], true)) {
            return back()->with('error', 'Aksi permintaan reset tidak valid.');
        }

        if ($action === 'resolve') {
            $user = $resetReq->user;
            if (!$user && $resetReq->identifier) {
                $user = IdentityResolver::find($resetReq->identifier);
            }

            if (!$user) {
                return back()->with('error', "Akun dengan identitas \"{$resetReq->identifier}\" tidak ditemukan. Permintaan tidak direset — silakan tolak permintaan ini.");
            }

            $user->resetPasswordToDefault();

            // Link orphaned requests to the resolved account for future reference.
            $resetReq->user_id = $user->id;
            $resetReq->status = 'resolved';
            $resetReq->resolved_by = auth()->id();
            $resetReq->resolved_at = now();
            $resetReq->save();

            $default = $user->defaultPassword();
            $label = trim((string) $user->nisn) !== '' ? 'NISN' : 'kata sandi default';

            return back()->with('success', "Permintaan disetujui. Akun {$user->name} telah direset ke {$label} ({$default}).");
        } else {
            $resetReq->status = 'rejected';
            $resetReq->resolved_by = auth()->id();
            $resetReq->resolved_at = now();
            $resetReq->save();

            return back()->with('success', "Permintaan reset kata sandi telah ditolak.");
        }
    }
}
