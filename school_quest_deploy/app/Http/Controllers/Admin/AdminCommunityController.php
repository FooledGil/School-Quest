<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ForumThread;
use App\Models\ForumReply;
use App\Models\ForumReport;
use App\Models\User;
use App\Models\UserSanction;
use App\Services\SanctionService;
use App\Services\ExpService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AdminCommunityController extends Controller
{
    public function index(Request $request)
    {
        $activeTab = $request->get('tab', 'reports');
        $search = $request->get('search');
        $category = $request->get('category');
        $reportStatus = $request->get('report_status', 'pending');

        // Reports Queue
        $reportsQuery = ForumReport::with(['user', 'resolver', 'reportable'])
            ->latest();

        if ($reportStatus && $reportStatus !== 'all') {
            $reportsQuery->where('status', $reportStatus);
        }

        $reports = $reportsQuery->get()->map(function ($report) {
            $target = $report->reportable;
            $targetAuthor = null;
            $contentSnippet = null;
            $threadId = null;

            if ($target instanceof ForumThread) {
                $targetAuthor = $target->user;
                $contentSnippet = $target->title . ' — ' . \Illuminate\Support\Str::limit($target->body, 120);
                $threadId = $target->id;
            } elseif ($target instanceof ForumReply) {
                $targetAuthor = $target->user;
                $contentSnippet = \Illuminate\Support\Str::limit($target->body, 140);
                $threadId = $target->forum_thread_id;
            }

            return [
                'id' => $report->id,
                'reporter' => [
                    'id' => $report->user?->id,
                    'name' => $report->user?->name ?? 'Pengguna Dihapus',
                    'nisn' => $report->user?->nisn,
                    'avatar' => $report->user?->avatar,
                    'avatar_seed' => $report->user?->avatar_seed,
                ],
                'target_author' => $targetAuthor ? [
                    'id' => $targetAuthor->id,
                    'name' => $targetAuthor->name,
                    'nisn' => $targetAuthor->nisn,
                    'level' => $targetAuthor->level,
                    'exp' => $targetAuthor->exp,
                    'rank_name' => $targetAuthor->rank_name,
                    'streak_days' => $targetAuthor->streak_days,
                    'is_muted' => $targetAuthor->is_muted,
                    'muted_until' => $targetAuthor->muted_until?->format('d M Y, H:i'),
                    'avatar' => $targetAuthor->avatar,
                    'avatar_seed' => $targetAuthor->avatar_seed,
                ] : null,
                'type' => $report->reportable_type === ForumThread::class ? 'thread' : 'reply',
                'target_id' => $report->reportable_id,
                'thread_id' => $threadId,
                'content_snippet' => $contentSnippet ?: '(Konten sudah dihapus)',
                'reason' => $report->reason,
                'details' => $report->details,
                'status' => $report->status,
                'action_taken' => $report->action_taken,
                'resolved_by' => $report->resolver?->name,
                'created_at_human' => $report->created_at->diffForHumans(),
                'created_at_full' => $report->created_at->format('d M Y, H:i'),
            ];
        });

        // All Threads list
        $threadsQuery = ForumThread::with(['user', 'likes', 'reports'])
            ->withCount(['allReplies', 'reports', 'likes'])
            ->byCategory($category)
            ->search($search)
            ->latest('is_pinned')
            ->latest();

        $threads = $threadsQuery->paginate(15)->withQueryString()->through(function ($t) {
            return [
                'id' => $t->id,
                'title' => $t->title,
                'body' => $t->body,
                'category' => $t->category,
                'is_pinned' => (bool) $t->is_pinned,
                'is_locked' => (bool) $t->is_locked,
                'views_count' => $t->views_count,
                'replies_count' => $t->all_replies_count,
                'likes_count' => $t->likes_count,
                'reports_count' => $t->reports_count,
                'created_at_human' => $t->created_at->diffForHumans(),
                'author' => [
                    'id' => $t->user?->id,
                    'name' => $t->user?->name ?? 'Anonim',
                    'nisn' => $t->user?->nisn,
                    'level' => $t->user?->level ?? 1,
                    'exp' => $t->user?->exp ?? 0,
                    'rank_name' => $t->user?->rank_name ?? 'Novice',
                    'is_muted' => $t->user?->is_muted ?? false,
                    'muted_until' => $t->user?->muted_until?->format('d M Y, H:i'),
                    'avatar' => $t->user?->avatar,
                    'avatar_seed' => $t->user?->avatar_seed,
                ],
            ];
        });

        // Recent Sanctions log
        $sanctions = UserSanction::with(['user', 'admin'])
            ->latest()
            ->limit(30)
            ->get()
            ->map(function ($s) {
                return [
                    'id' => $s->id,
                    'student' => [
                        'id' => $s->user?->id,
                        'name' => $s->user?->name ?? 'Siswa Dihapus',
                        'nisn' => $s->user?->nisn,
                        'level' => $s->user?->level,
                        'exp' => $s->user?->exp,
                        'is_muted' => $s->user?->is_muted,
                    ],
                    'admin_name' => $s->admin?->name ?? 'Administrator',
                    'type' => $s->type,
                    'amount' => $s->amount,
                    'reason' => $s->reason,
                    'expires_at' => $s->expires_at?->format('d M Y, H:i'),
                    'is_active' => $s->is_active,
                    'created_at_human' => $s->created_at->diffForHumans(),
                ];
            });

        // Summary metrics
        $metrics = [
            'total_threads' => ForumThread::count(),
            'total_replies' => ForumReply::count(),
            'pending_reports' => ForumReport::where('status', 'pending')->count(),
            'active_mutes' => User::where('muted_until', '>', now())->count(),
        ];

        return Inertia::render('Admin/Community/Index', [
            'activeTab' => $activeTab,
            'reports' => $reports,
            'threads' => $threads,
            'sanctions' => $sanctions,
            'metrics' => $metrics,
            'filters' => [
                'search' => $search,
                'category' => $category,
                'report_status' => $reportStatus,
            ],
        ]);
    }

    public function destroyThread(ForumThread $thread)
    {
        $title = $thread->title;
        $authorName = $thread->user?->name ?? 'Siswa';

        // Auto mark related reports as resolved
        $thread->reports()->update([
            'status' => 'resolved',
            'action_taken' => 'Thread dihapus oleh admin',
            'resolved_by' => Auth::id(),
            'resolved_at' => now(),
        ]);

        $thread->delete();

        return back()->with('success', "Thread \"{$title}\" oleh {$authorName} berhasil dihapus.");
    }

    public function destroyReply(ForumReply $reply)
    {
        $thread = $reply->thread;

        // Auto mark related reports as resolved
        $reply->reports()->update([
            'status' => 'resolved',
            'action_taken' => 'Komentar dihapus oleh admin',
            'resolved_by' => Auth::id(),
            'resolved_at' => now(),
        ]);

        $reply->delete();

        if ($thread) {
            $thread->decrement('replies_count');
        }

        return back()->with('success', 'Balasan komentar berhasil dihapus oleh admin.');
    }

    public function togglePin(ForumThread $thread)
    {
        $thread->is_pinned = !$thread->is_pinned;
        $thread->save();

        $status = $thread->is_pinned ? 'disematkan (PINNED)' : 'dilepas sematannya';
        return back()->with('success', "Thread \"{$thread->title}\" berhasil {$status}.");
    }

    public function toggleLock(ForumThread $thread)
    {
        $thread->is_locked = !$thread->is_locked;
        $thread->save();

        $status = $thread->is_locked ? 'dikunci (LOCKED)' : 'dibuka kuncinya';
        return back()->with('success', "Thread \"{$thread->title}\" berhasil {$status}.");
    }

    public function resolveReport(Request $request, ForumReport $report)
    {
        $data = $request->validate([
            'status' => 'required|in:resolved,dismissed',
            'action_taken' => 'nullable|string|max:255',
        ]);

        $report->update([
            'status' => $data['status'],
            'action_taken' => $data['action_taken'] ?? ($data['status'] === 'dismissed' ? 'Laporan ditolak / diabaikan' : 'Selesai'),
            'resolved_by' => Auth::id(),
            'resolved_at' => now(),
        ]);

        $msg = $data['status'] === 'resolved' ? 'Laporan berhasil ditandai selesai.' : 'Laporan telah diabaikan.';
        return back()->with('success', $msg);
    }

    public function punishStudent(Request $request, User $user, SanctionService $sanctionService)
    {
        $data = $request->validate([
            'sanction_type' => 'required|in:exp_deduction,mute,streak_reset,warning',
            'amount' => 'nullable|integer',
            'duration_minutes' => 'nullable|integer',
            'reason' => 'required|string|max:1000',
        ], [
            'reason.required' => 'Alasan hukuman wajib diisi dengan jelas.',
        ]);

        $admin = Auth::user();
        $reason = $data['reason'];

        switch ($data['sanction_type']) {
            case 'exp_deduction':
                $amount = $data['amount'] ?: 100;
                $sanctionService->applyExpDeduction($user, $amount, $reason, $admin);
                $msg = "Denda -{$amount} EXP berhasil diterapkan kepada {$user->name}.";
                break;

            case 'mute':
                $minutes = $data['duration_minutes'] ?: 1440; // Default 24 hours
                $sanctionService->applyMute($user, $minutes, $reason, $admin);
                $humanDuration = $minutes === -1 ? 'Permanen' : round($minutes / 60) . ' Jam';
                $msg = "Siswa {$user->name} berhasil disenyapkan (Mute) selama {$humanDuration}.";
                break;

            case 'streak_reset':
                $sanctionService->applyStreakReset($user, $reason, $admin);
                $msg = "Daily streak siswa {$user->name} telah direset ke 0.";
                break;

            case 'warning':
                $sanctionService->applyWarning($user, $reason, $admin);
                $msg = "Surat teguran resmi telah dikirimkan kepada {$user->name}.";
                break;
        }

        return back()->with('success', $msg);
    }

    public function unmuteStudent(User $user, SanctionService $sanctionService)
    {
        $sanctionService->unmute($user, Auth::user());
        return back()->with('success', "Status mute untuk {$user->name} telah dicabut.");
    }
}
