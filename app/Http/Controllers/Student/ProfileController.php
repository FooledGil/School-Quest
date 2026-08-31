<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use App\Services\ExpService;

class ProfileController extends Controller
{
    public function index()
    {
        $user = Auth::user()->load(['achievements.achievement', 'questCompletions' => function($q) {
            $q->latest('completed_at')->take(10)->with('quest');
        }]);

        $user->rank_name = $user->rank_name;
        $user->next_level_exp = $user->next_level_exp;

        return Inertia::render('Student/Profile', [
            'user' => $user
        ]);
    }

    /**
     * Upload custom local image avatar to storage
     */
    public function uploadAvatar(Request $request)
    {
        $request->validate([
            'avatar_file' => 'required|image|mimes:jpeg,png,jpg,webp|max:3072',
        ], [
            'avatar_file.required' => 'Silakan pilih file gambar terlebih dahulu.',
            'avatar_file.image' => 'File harus berupa gambar.',
            'avatar_file.mimes' => 'Format file yang diperbolehkan: JPEG, PNG, JPG, WEBP.',
            'avatar_file.max' => 'Ukuran file maksimal 3 MB.',
        ]);

        $user = Auth::user();

        // Delete old custom avatar from storage if exists
        $this->deleteOldStorageAvatar($user);

        // Store new avatar file in public storage (storage/app/public/avatars)
        $path = $request->file('avatar_file')->store('avatars', 'public');

        $user->avatar = '/storage/' . $path;
        $user->avatar_seed = null;
        $user->save();

        return back()->with('success', 'Foto avatar berhasil diunggah! 📸');
    }

    /**
     * Select a DiceBear Pixel-Art Bot Seed
     */
    public function updateAvatar(Request $request)
    {
        $request->validate([
            'avatar_seed' => 'required|string|max:100',
        ]);

        $user = Auth::user();

        // Delete old custom avatar from storage if exists
        $this->deleteOldStorageAvatar($user);

        $user->avatar_seed = $request->avatar_seed;
        $user->avatar = null;
        $user->save();

        return back()->with('success', 'Avatar pixel bot berhasil disimpan! 🎨');
    }

    /**
     * Reset avatar to default silhouette with question mark
     */
    public function resetAvatar(Request $request)
    {
        $user = Auth::user();

        // Delete old custom avatar from storage if exists
        $this->deleteOldStorageAvatar($user);

        $user->avatar = null;
        $user->avatar_seed = null;
        $user->save();

        return back()->with('success', 'Avatar telah dikembalikan ke siluet default! 👤');
    }

    /**
     * Mark onboarding guide as completed for student
     */
    public function completeOnboarding(Request $request)
    {
        $user = Auth::user();
        $user->has_completed_onboarding = true;
        $user->save();

        if ($request->wantsJson()) {
            return response()->json(['status' => 'success', 'message' => 'Onboarding completed']);
        }

        return back()->with('success', 'Selamat datang di SchoolQuest! Petualanganmu dimulai sekarang. 🚀');
    }

    /**
     * Update user password
     */
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

    /**
     * Helper to remove old avatar image from public storage
     */
    private function deleteOldStorageAvatar($user)
    {
        if ($user->avatar && str_starts_with($user->avatar, '/storage/avatars/')) {
            $relativeFilePath = str_replace('/storage/', '', $user->avatar);
            if (Storage::disk('public')->exists($relativeFilePath)) {
                Storage::disk('public')->delete($relativeFilePath);
            }
        }
    }
}
