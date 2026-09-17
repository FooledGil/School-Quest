<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\ExpService;
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
            ->get();

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

        return back()->with('success', "Password siswa {$student->name} berhasil direset ke 'password'.");
    }

    public function resolveResetRequest(\Illuminate\Http\Request $request, $id)
    {
        \App\Models\PasswordResetRequest::ensureTableExists();
        $resetReq = \App\Models\PasswordResetRequest::findOrFail($id);
        $action = $request->input('action', 'resolve');

        if ($action === 'resolve') {
            $user = $resetReq->user;
            if (!$user && $resetReq->identifier) {
                $user = User::where('nisn', $resetReq->identifier)
                    ->orWhere('name', $resetReq->identifier)
                    ->orWhere('email', $resetReq->identifier)
                    ->first();
            }

            if ($user) {
                $user->password = \Illuminate\Support\Facades\Hash::make('password');
                $user->save();
            }

            $resetReq->status = 'resolved';
            $resetReq->resolved_by = auth()->id();
            $resetReq->resolved_at = now();
            $resetReq->save();

            return back()->with('success', "Permintaan disetujui. Akun {$resetReq->identifier} telah direset ke 'password'.");
        } else {
            $resetReq->status = 'rejected';
            $resetReq->resolved_by = auth()->id();
            $resetReq->resolved_at = now();
            $resetReq->save();

            return back()->with('success', "Permintaan reset kata sandi telah ditolak.");
        }
    }
}
