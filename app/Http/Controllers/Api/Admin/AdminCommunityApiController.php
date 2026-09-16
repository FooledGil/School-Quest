<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ForumThread;
use App\Models\ForumReply;
use App\Models\ForumReport;
use App\Models\User;
use App\Models\UserSanction;
use App\Services\SanctionService;
use App\Services\ExpService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminCommunityApiController extends Controller
{
    public function index(Request $request)
    {
        $category = $request->get('category');
        $search = $request->get('search');
        $reportStatus = $request->get('report_status', 'pending');

        // Reports Queue
        $reportsQuery = ForumReport::with(['user', 'resolver', 'reportable'])->latest();

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
                $contentSnippet = $target->title . ' — ' . Str::limit($target->body, 120);
                $threadId = $target->id;
            } elseif ($target instanceof ForumReply) {
                $targetAuthor = $target->user;
                $contentSnippet = Str::limit($target->body, 140);
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
                    'is_muted' => (bool) $targetAuthor->is_muted,
                    'muted_until' => $targetAuthor->muted_until?->format('d M Y, H:i'),
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
            ];
        });

        // Threads list
        $threadsQuery = ForumThread::with(['user'])
            ->withCount(['allReplies', 'reports', 'likes'])
            ->byCategory($category)
            ->search($search)
            ->latest('is_pinned')
            ->latest();

        $threads = $threadsQuery->paginate(15)->through(function ($t) {
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
                    'avatar' => $t->user?->avatar,
                    'avatar_seed' => $t->user?->avatar_seed,
                ],
            ];
        });

        // Sanctions log
        $sanctions = UserSanction::with(['user', 'admin'])
            ->latest()
            ->limit(30)
            ->get()
            ->map(function ($s) {
                return [
                    'id' => $s->id,
                    'student_name' => $s->user?->name ?? 'Siswa Dihapus',
                    'student_nisn' => $s->user?->nisn,
                    'admin_name' => $s->admin?->name ?? 'Administrator',
                    'type' => $s->type,
                    'amount' => $s->amount,
                    'reason' => $s->reason,
                    'expires_at' => $s->expires_at?->format('d M Y, H:i'),
                    'is_active' => $s->is_active,
                    'created_at_human' => $s->created_at->diffForHumans(),
                ];
            });

        // Metrics
        $metrics = [
            'total_threads' => ForumThread::count(),
            'total_replies' => ForumReply::count(),
            'pending_reports' => ForumReport::where('status', 'pending')->count(),
            'active_mutes' => User::where('muted_until', '>', now())->count(),
        ];

        return response()->json([
            'status' => 'success',
            'data' => [
                'metrics' => $metrics,
                'reports' => $reports,
                'threads' => $threads,
                'sanctions' => $sanctions,
            ],
        ]);
    }

    public function resolveReport(Request $request, ForumReport $report)
    {
        $request->validate([
            'action' => 'required|in:resolved,dismissed',
            'action_taken' => 'nullable|string|max:255',
        ]);

        $report->update([
            'status' => $request->action,
            'action_taken' => $request->action_taken,
            'resolved_by' => $request->user()->id,
            'resolved_at' => now(),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Laporan berhasil diselesaikan.',
        ]);
    }

    public function togglePin(ForumThread $thread)
    {
        $thread->update(['is_pinned' => !$thread->is_pinned]);

        return response()->json([
            'status' => 'success',
            'message' => $thread->is_pinned ? 'Thread berhasil di-pin.' : 'Thread berhasil di-unpin.',
            'is_pinned' => (bool) $thread->is_pinned,
        ]);
    }

    public function toggleLock(ForumThread $thread)
    {
        $thread->update(['is_locked' => !$thread->is_locked]);

        return response()->json([
            'status' => 'success',
            'message' => $thread->is_locked ? 'Diskusi dikunci.' : 'Kunci diskusi dibuka.',
            'is_locked' => (bool) $thread->is_locked,
        ]);
    }

    public function destroyThread(ForumThread $thread)
    {
        $thread->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Thread berhasil dihapus.',
        ]);
    }

    public function destroyReply(ForumReply $reply)
    {
        $reply->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Balasan berhasil dihapus.',
        ]);
    }

    public function punishStudent(Request $request, User $user, SanctionService $sanctionService)
    {
        $request->validate([
            'type' => 'required|in:warning,mute,temp_ban,ban',
            'amount' => 'nullable|integer|min:1',
            'reason' => 'required|string|max:500',
        ]);

        $sanction = $sanctionService->applySanction(
            $user,
            $request->type,
            $request->reason,
            $request->user(),
            $request->amount
        );

        return response()->json([
            'status' => 'success',
            'message' => "Tindakan disiplin ({$request->type}) berhasil diterapkan pada {$user->name}.",
            'sanction_id' => $sanction->id,
        ]);
    }

    public function unmuteStudent(User $user)
    {
        $user->update(['muted_until' => null]);
        UserSanction::where('user_id', $user->id)
            ->where('type', 'mute')
            ->where('is_active', true)
            ->update(['is_active' => false]);

        return response()->json([
            'status' => 'success',
            'message' => "Mute untuk {$user->name} telah dicabut.",
        ]);
    }
}
