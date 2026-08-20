<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use App\Services\ExpService;

class ProfileController extends Controller
{
    public function index()
    {
        $user = Auth::user()->load(['achievements.achievement', 'questCompletions' => function($q) {
            $q->latest('completed_at')->take(10)->with('quest');
        }]);

        $user->rank_name = ExpService::getRankName($user->level);
        $user->next_level_exp = pow($user->level, 2) * 100;

        return Inertia::render('Student/Profile', [
            'user' => $user
        ]);
    }

    public function updateAvatar(Request $request)
    {
        $request->validate([
            'avatar_seed' => 'required|string|max:100',
        ]);

        $user = Auth::user();
        $user->avatar_seed = $request->avatar_seed;
        $user->avatar = null; // Clear any custom avatar URL so the seed-based one is used
        $user->save();

        return back()->with('success', 'Avatar berhasil diperbarui! 🎨');
    }

    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'password' => 'required|min:6|confirmed',
        ], [
            'current_password.required' => 'Password lama wajib diisi.',
            'password.required' => 'Password baru wajib diisi.',
            'password.min' => 'Password baru minimal 6 karakter.',
            'password.confirmed' => 'Konfirmasi password tidak cocok.',
        ]);

        $user = Auth::user();

        if (!Hash::check($request->current_password, $user->password)) {
            return back()->withErrors(['current_password' => 'Password lama tidak sesuai.']);
        }

        $user->password = Hash::make($request->password);
        $user->save();

        return back()->with('success', 'Password berhasil diperbarui! 🔒');
    }
}
