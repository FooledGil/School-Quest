<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ForumReply extends Model
{
    use HasFactory;

    protected $fillable = [
        'forum_thread_id',
        'user_id',
        'parent_id',
        'body',
    ];

    public function thread()
    {
        return $this->belongsTo(ForumThread::class, 'forum_thread_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function parent()
    {
        return $this->belongsTo(ForumReply::class, 'parent_id');
    }

    public function replies()
    {
        return $this->hasMany(ForumReply::class, 'parent_id')->with(['user', 'likes'])->oldest();
    }

    public function likes()
    {
        return $this->morphMany(ForumLike::class, 'likeable');
    }

    public function reports()
    {
        return $this->morphMany(ForumReport::class, 'reportable');
    }

    public function isLikedBy(?User $user): bool
    {
        if (!$user) return false;
        return $this->likes()->where('user_id', $user->id)->exists();
    }
}
