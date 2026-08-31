<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\ForumThread;
use App\Models\ForumReply;
use App\Models\ForumLike;
use App\Models\ForumReport;
use App\Models\User;
use App\Services\ExpService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CommunityController extends Controller
{
    /**
     * Display community thread listing with categories and search.
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $category = $request->query('category', 'all');
        $search = $request->query('search', '');
        $sort = $request->query('sort', 'latest');

        // Query builder for threads
        $query = ForumThread::with(['user' => function ($q) {
                $q->select('id', 'name', 'level', 'avatar', 'avatar_seed', 'class', 'role');
            }])
            ->withCount(['likes', 'allReplies'])
            ->byCategory($category)
            ->search($search);

        // Sorting
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

        $threads = $query->paginate(12)->withQueryString();

        // Get thread IDs the current user has liked
        $userLikedThreadIds = ForumLike::where('user_id', $user->id)
            ->where('likeable_type', ForumThread::class)
            ->whereIn('likeable_id', $threads->pluck('id'))
            ->pluck('likeable_id')
            ->toArray();

        // Transform threads to include rank name and user like state
        $threads->getCollection()->transform(function ($thread) use ($userLikedThreadIds) {
            $thread->is_liked = in_array($thread->id, $userLikedThreadIds);
            if ($thread->user) {
                $thread->user->rank_name = ExpService::getRankName($thread->user->level ?? 1);
            }
            return $thread;
        });

        // Category counts for quick stats
        $categoryCounts = [
            'all' => ForumThread::count(),
            'umum' => ForumThread::where('category', 'umum')->count(),
            'quest' => ForumThread::where('category', 'quest')->count(),
            'bug' => ForumThread::where('category', 'bug')->count(),
            'saran' => ForumThread::where('category', 'saran')->count(),
            'showcase' => ForumThread::where('category', 'showcase')->count(),
        ];

        // Active community members (top thread & reply creators)
        $topMembers = User::where('role', 'student')
            ->withCount(['forumThreads', 'forumReplies'])
            ->orderByRaw('(forum_threads_count + forum_replies_count) DESC')
            ->take(5)
            ->get(['id', 'name', 'level', 'avatar', 'avatar_seed', 'class', 'exp'])
            ->map(function ($member) {
                $member->rank_name = ExpService::getRankName($member->level ?? 1);
                return $member;
            });

        return Inertia::render('Student/Community', [
            'threads' => $threads,
            'filters' => [
                'category' => $category,
                'search' => $search,
                'sort' => $sort,
            ],
            'categoryCounts' => $categoryCounts,
            'topMembers' => $topMembers,
            'isMuted' => (bool) $user->is_muted,
            'muteRemaining' => $user->mute_remaining_human,
        ]);
    }

    /**
     * Display a specific thread with nested replies.
     */
    public function show(Request $request, ForumThread $thread)
    {
        $user = Auth::user();

        // Increment view count if not viewed yet in this session
        $sessionKey = 'viewed_thread_' . $thread->id;
        if (!$request->session()->has($sessionKey)) {
            $thread->increment('views_count');
            $request->session()->put($sessionKey, true);
        }

        // Load author with rank
        $thread->load(['user' => function ($q) {
            $q->select('id', 'name', 'level', 'avatar', 'avatar_seed', 'class', 'exp', 'role');
        }])->loadCount('likes');

        if ($thread->user) {
            $thread->user->rank_name = ExpService::getRankName($thread->user->level ?? 1);
        }

        $thread->is_liked = $thread->isLikedBy($user);

        // Fetch top-level replies and their nested replies
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

        // Collect all reply IDs for user like check
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

        // Transform replies with like states and rank names
        $replies->transform(function ($rep) use ($userLikedReplyIds) {
            $rep->is_liked = in_array($rep->id, $userLikedReplyIds);
            if ($rep->user) {
                $rep->user->rank_name = ExpService::getRankName($rep->user->level ?? 1);
            }

            if ($rep->replies) {
                $rep->replies->transform(function ($child) use ($userLikedReplyIds) {
                    $child->is_liked = in_array($child->id, $userLikedReplyIds);
                    if ($child->user) {
                        $child->user->rank_name = ExpService::getRankName($child->user->level ?? 1);
                    }
                    return $child;
                });
            }
            return $rep;
        });

        return Inertia::render('Student/CommunityThread', [
            'thread' => $thread,
            'replies' => $replies,
            'isMuted' => (bool) $user->is_muted,
            'muteRemaining' => $user->mute_remaining_human,
        ]);
    }

    /**
     * Store a new thread.
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        if ($user->is_muted) {
            return back()->with('error', "Akun Anda sedang disenyapkan (Mute) hingga {$user->muted_until?->format('d M Y, H:i')}. Anda tidak dapat membuat thread baru.");
        }

        $validated = $request->validate([
            'category' => 'required|string|in:umum,quest,bug,saran,showcase',
            'title' => 'required|string|min:4|max:200',
            'body' => 'required|string|min:10|max:10000',
        ], [
            'category.required' => 'Pilih kategori topik.',
            'category.in' => 'Kategori yang dipilih tidak valid.',
            'title.required' => 'Judul topik wajib diisi.',
            'title.min' => 'Judul topik minimal 4 karakter.',
            'title.max' => 'Judul topik maksimal 200 karakter.',
            'body.required' => 'Isi topik wajib diisi.',
            'body.min' => 'Isi topik minimal 10 karakter.',
            'body.max' => 'Isi topik maksimal 10.000 karakter.',
        ]);

        $thread = ForumThread::create([
            'user_id' => $user->id,
            'category' => $validated['category'],
            'title' => $validated['title'],
            'body' => $validated['body'],
            'views_count' => 0,
            'replies_count' => 0,
        ]);

        return redirect()->route('community.show', $thread->id)->with('success', 'Topik diskusi berhasil diterbitkan!');
    }

    /**
     * Store a reply or nested reply in a thread.
     */
    public function storeReply(Request $request, ForumThread $thread)
    {
        $user = Auth::user();

        if ($user->is_muted) {
            return back()->with('error', "Akun Anda sedang disenyapkan (Mute) hingga {$user->muted_until?->format('d M Y, H:i')}. Anda tidak dapat mengirim balasan.");
        }

        if ($thread->is_locked) {
            return back()->with('error', 'Topik ini telah dikunci dan tidak dapat menerima balasan.');
        }

        $validated = $request->validate([
            'body' => 'required|string|min:2|max:5000',
            'parent_id' => 'nullable|exists:forum_replies,id',
        ], [
            'body.required' => 'Balasan tidak boleh kosong.',
            'body.min' => 'Balasan minimal 2 karakter.',
            'body.max' => 'Balasan maksimal 5.000 karakter.',
        ]);

        // If parent_id provided, ensure parent belongs to this thread
        if (!empty($validated['parent_id'])) {
            $parent = ForumReply::find($validated['parent_id']);
            if (!$parent || $parent->forum_thread_id !== $thread->id) {
                return back()->with('error', 'Komentar yang dibalas tidak valid.');
            }
        }

        ForumReply::create([
            'forum_thread_id' => $thread->id,
            'user_id' => $user->id,
            'parent_id' => $validated['parent_id'] ?? null,
            'body' => $validated['body'],
        ]);

        // Update thread reply count and last reply timestamp
        $thread->increment('replies_count');
        $thread->update(['last_reply_at' => now()]);

        return back()->with('success', 'Balasan berhasil dikirim!');
    }

    /**
     * Submit a report for a thread or reply.
     */
    public function report(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:thread,reply',
            'id' => 'required|integer',
            'reason' => 'required|string|in:spam,harassment,toxic,cheat,inappropriate,other',
            'details' => 'nullable|string|max:1000',
        ], [
            'reason.required' => 'Pilih alasan pelaporan.',
        ]);

        $userId = Auth::id();
        $modelClass = $validated['type'] === 'thread' ? ForumThread::class : ForumReply::class;
        $target = $modelClass::find($validated['id']);

        if (!$target) {
            return back()->with('error', 'Konten yang dilaporkan tidak ditemukan.');
        }

        // Prevent reporting own content
        if ($target->user_id === $userId) {
            return back()->with('error', 'Anda tidak dapat melaporkan konten milik Anda sendiri.');
        }

        // Check if already reported
        $existing = ForumReport::where('user_id', $userId)
            ->where('reportable_type', $modelClass)
            ->where('reportable_id', $target->id)
            ->where('status', 'pending')
            ->exists();

        if ($existing) {
            return back()->with('error', 'Anda sudah melaporkan konten ini sebelumnya dan sedang menunggu ditinjau oleh Admin.');
        }

        ForumReport::create([
            'user_id' => $userId,
            'reportable_type' => $modelClass,
            'reportable_id' => $target->id,
            'reason' => $validated['reason'],
            'details' => $validated['details'] ?? null,
            'status' => 'pending',
        ]);

        return back()->with('success', 'Laporan Anda telah dikirim ke Admin untuk ditinjau. Terima kasih atas partisipasi Anda menjaga The Realm!');
    }

    /**
     * Toggle like on thread or reply.
     */
    public function toggleLike(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:thread,reply',
            'id' => 'required|integer',
        ]);

        $userId = Auth::id();
        $modelClass = $validated['type'] === 'thread' ? ForumThread::class : ForumReply::class;
        $target = $modelClass::find($validated['id']);

        if (!$target) {
            return back()->with('error', 'Konten tidak ditemukan.');
        }

        $existingLike = ForumLike::where('user_id', $userId)
            ->where('likeable_type', $modelClass)
            ->where('likeable_id', $target->id)
            ->first();

        if ($existingLike) {
            $existingLike->delete();
        } else {
            ForumLike::create([
                'user_id' => $userId,
                'likeable_type' => $modelClass,
                'likeable_id' => $target->id,
            ]);
        }

        return back();
    }

    /**
     * Delete a thread (author or admin).
     */
    public function destroy(ForumThread $thread)
    {
        $user = Auth::user();

        if ($user->id !== $thread->user_id && $user->role !== 'admin') {
            return back()->with('error', 'Anda tidak memiliki izin untuk menghapus topik ini.');
        }

        $thread->delete();

        return redirect()->route('community.index')->with('success', 'Topik berhasil dihapus.');
    }

    /**
     * Delete a reply (author or admin).
     */
    public function destroyReply(ForumReply $reply)
    {
        $user = Auth::user();

        if ($user->id !== $reply->user_id && $user->role !== 'admin') {
            return back()->with('error', 'Anda tidak memiliki izin untuk menghapus balasan ini.');
        }

        $thread = $reply->thread;
        
        // Count deleted replies (this reply + any children)
        $childCount = ForumReply::where('parent_id', $reply->id)->count();
        $totalDeleted = 1 + $childCount;

        $reply->delete();

        if ($thread) {
            $thread->decrement('replies_count', min($thread->replies_count, $totalDeleted));
        }

        return back()->with('success', 'Balasan berhasil dihapus.');
    }
}
