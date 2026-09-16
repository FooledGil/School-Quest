<?php

namespace App\Http\Controllers\Api\Student;

use App\Http\Controllers\Controller;
use App\Models\ForumThread;
use App\Models\ForumReply;
use App\Models\ForumLike;
use App\Models\ForumReport;
use App\Models\User;
use App\Services\ExpService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CommunityApiController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $category = $request->query('category', 'all');
        $search = $request->query('search', '');
        $sort = $request->query('sort', 'latest');

        $query = ForumThread::with(['user' => function ($q) {
                $q->select('id', 'name', 'level', 'avatar', 'avatar_seed', 'class', 'role');
            }])
            ->withCount(['likes', 'allReplies'])
            ->byCategory($category)
            ->search($search);

        switch ($sort) {
            case 'popular':
                $query->orderByDesc('likes_count')->orderByDesc('created_at');
                break;
            case 'unanswered':
                $query->where('replies_count', 0)->orderByDesc('created_at');
                break;
            case 'active':
                $query->orderByRaw('COALESCE(last_reply_at, created_at) DESC');
                break;
            case 'latest':
            default:
                $query->orderByDesc('is_pinned')->orderByDesc('created_at');
                break;
        }

        $threads = $query->paginate(15);

        $userLikedThreadIds = ForumLike::where('user_id', $user->id)
            ->where('likeable_type', ForumThread::class)
            ->whereIn('likeable_id', $threads->pluck('id'))
            ->pluck('likeable_id')
            ->toArray();

        $threads->getCollection()->transform(function ($thread) use ($userLikedThreadIds) {
            $thread->is_liked = in_array($thread->id, $userLikedThreadIds);
            if ($thread->user) {
                $thread->user->rank_name = ExpService::getRankName($thread->user->level ?? 1);
            }
            return $thread;
        });

        $categoryCounts = [
            'all' => ForumThread::count(),
            'umum' => ForumThread::where('category', 'umum')->count(),
            'quest' => ForumThread::where('category', 'quest')->count(),
            'bug' => ForumThread::where('category', 'bug')->count(),
            'saran' => ForumThread::where('category', 'saran')->count(),
            'showcase' => ForumThread::where('category', 'showcase')->count(),
        ];

        $topMembers = User::where('role', 'student')
            ->withCount(['forumThreads', 'forumReplies'])
            ->orderByRaw('(forum_threads_count + forum_replies_count) DESC')
            ->take(5)
            ->get(['id', 'name', 'level', 'avatar', 'avatar_seed', 'class', 'exp'])
            ->map(function ($member) {
                $member->rank_name = ExpService::getRankName($member->level ?? 1);
                return $member;
            });

        return response()->json([
            'status' => 'success',
            'data' => [
                'threads' => $threads,
                'category_counts' => $categoryCounts,
                'top_members' => $topMembers,
                'is_muted' => (bool) $user->is_muted,
                'mute_remaining' => $user->mute_remaining_human,
            ],
        ]);
    }

    public function show(Request $request, ForumThread $thread)
    {
        $user = $request->user();

        $thread->increment('views_count');

        $thread->load(['user' => function ($q) {
            $q->select('id', 'name', 'level', 'avatar', 'avatar_seed', 'class', 'exp', 'role');
        }])->loadCount('likes');

        if ($thread->user) {
            $thread->user->rank_name = ExpService::getRankName($thread->user->level ?? 1);
        }

        $thread->is_liked = $thread->isLikedBy($user);

        $replies = ForumReply::with([
                'user' => function ($q) {
                    $q->select('id', 'name', 'level', 'avatar', 'avatar_seed', 'class', 'exp', 'role');
                },
                'replies' => function ($q) {
                    $q->with(['user' => function ($u) {
                        $u->select('id', 'name', 'level', 'avatar', 'avatar_seed', 'class', 'exp', 'role');
                    }])->withCount('likes')->oldest();
                }
            ])
            ->withCount('likes')
            ->where('forum_thread_id', $thread->id)
            ->whereNull('parent_id')
            ->oldest()
            ->get();

        $allReplyIds = [];
        foreach ($replies as $rep) {
            $allReplyIds[] = $rep->id;
            foreach ($rep->replies as $child) {
                $allReplyIds[] = $child->id;
            }
        }

        $userLikedReplyIds = ForumLike::where('user_id', $user->id)
            ->where('likeable_type', ForumReply::class)
            ->whereIn('likeable_id', $allReplyIds)
            ->pluck('likeable_id')
            ->toArray();

        foreach ($replies as $rep) {
            $rep->is_liked = in_array($rep->id, $userLikedReplyIds);
            if ($rep->user) {
                $rep->user->rank_name = ExpService::getRankName($rep->user->level ?? 1);
            }
            foreach ($rep->replies as $child) {
                $child->is_liked = in_array($child->id, $userLikedReplyIds);
                if ($child->user) {
                    $child->user->rank_name = ExpService::getRankName($child->user->level ?? 1);
                }
            }
        }

        return response()->json([
            'status' => 'success',
            'data' => [
                'thread' => $thread,
                'replies' => $replies,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        if ($user->is_muted) {
            return response()->json([
                'status' => 'error',
                'message' => 'Akun Anda sedang di-mute hingga ' . $user->mute_remaining_human . '.',
            ], 403);
        }

        $data = $request->validate([
            'title' => 'required|string|min:5|max:150',
            'category' => 'required|in:umum,quest,bug,saran,showcase',
            'body' => 'required|string|min:10|max:5000',
        ]);

        $thread = ForumThread::create([
            'user_id' => $user->id,
            'title' => $data['title'],
            'category' => $data['category'],
            'body' => $data['body'],
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Diskusi berhasil dipublikasikan!',
            'data' => ['thread_id' => $thread->id],
        ]);
    }

    public function storeReply(Request $request, ForumThread $thread)
    {
        $user = $request->user();

        if ($user->is_muted) {
            return response()->json([
                'status' => 'error',
                'message' => 'Akun Anda sedang di-mute hingga ' . $user->mute_remaining_human . '.',
            ], 403);
        }

        if ($thread->is_locked) {
            return response()->json([
                'status' => 'error',
                'message' => 'Diskusi ini telah dikunci oleh moderator.',
            ], 403);
        }

        $data = $request->validate([
            'body' => 'required|string|min:2|max:2000',
            'parent_id' => 'nullable|exists:forum_replies,id',
        ]);

        $reply = ForumReply::create([
            'forum_thread_id' => $thread->id,
            'user_id' => $user->id,
            'parent_id' => $data['parent_id'] ?? null,
            'body' => $data['body'],
        ]);

        $thread->update(['last_reply_at' => now()]);

        return response()->json([
            'status' => 'success',
            'message' => 'Balasan berhasil dikirim!',
            'data' => ['reply_id' => $reply->id],
        ]);
    }

    public function toggleLike(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'type' => 'required|in:thread,reply',
            'id' => 'required|integer',
        ]);

        $likeableType = $request->type === 'thread' ? ForumThread::class : ForumReply::class;
        $likeableId = $request->id;

        $existing = ForumLike::where('user_id', $user->id)
            ->where('likeable_type', $likeableType)
            ->where('likeable_id', $likeableId)
            ->first();

        if ($existing) {
            $existing->delete();
            $isLiked = false;
        } else {
            ForumLike::create([
                'user_id' => $user->id,
                'likeable_type' => $likeableType,
                'likeable_id' => $likeableId,
            ]);
            $isLiked = true;
        }

        $totalLikes = ForumLike::where('likeable_type', $likeableType)
            ->where('likeable_id', $likeableId)
            ->count();

        return response()->json([
            'status' => 'success',
            'data' => [
                'is_liked' => $isLiked,
                'likes_count' => $totalLikes,
            ],
        ]);
    }

    public function report(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'type' => 'required|in:thread,reply',
            'id' => 'required|integer',
            'reason' => 'required|in:spam,offensive,harassment,cheating,other',
            'details' => 'nullable|string|max:500',
        ]);

        $reportableType = $request->type === 'thread' ? ForumThread::class : ForumReply::class;

        ForumReport::create([
            'user_id' => $user->id,
            'reportable_type' => $reportableType,
            'reportable_id' => $request->id,
            'reason' => $request->reason,
            'details' => $request->details,
            'status' => 'pending',
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Laporan berhasil dikirim ke moderator. Terima kasih atas kontribusi Anda!',
        ]);
    }

    public function destroy(Request $request, ForumThread $thread)
    {
        $user = $request->user();

        if ($user->role !== 'admin' && $thread->user_id !== $user->id) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized'], 403);
        }

        $thread->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Diskusi berhasil dihapus.',
        ]);
    }

    public function destroyReply(Request $request, ForumReply $reply)
    {
        $user = $request->user();

        if ($user->role !== 'admin' && $reply->user_id !== $user->id) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized'], 403);
        }

        $reply->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Balasan berhasil dihapus.',
        ]);
    }
}
