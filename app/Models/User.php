<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'nisn',
        'name',
        'gender',
        'email',
        'password',
        'role',
        'avatar_seed',
        'avatar',
        'exp',
        'level',
        'streak_days',
        'last_activity_date',
        'class',
        'has_completed_onboarding',
        'muted_until',
        'is_banned',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
            'last_activity_date' => 'date',
            'has_completed_onboarding' => 'boolean',
            'muted_until' => 'datetime',
            'is_banned' => 'boolean',
        ];
    }

    public function questCompletions()
    {
        return $this->hasMany(QuestCompletion::class);
    }

    public function achievements()
    {
        return $this->hasMany(UserAchievement::class);
    }

    public function piketMemberships()
    {
        return $this->hasMany(PiketMember::class);
    }

    public function createdQuests()
    {
        return $this->hasMany(Quest::class, 'created_by');
    }

    public function forumThreads()
    {
        return $this->hasMany(ForumThread::class);
    }

    public function forumReplies()
    {
        return $this->hasMany(ForumReply::class);
    }

    public function forumLikes()
    {
        return $this->hasMany(ForumLike::class);
    }

    public function forumReports()
    {
        return $this->hasMany(ForumReport::class);
    }

    public function sanctions()
    {
        return $this->hasMany(UserSanction::class);
    }

    public function issuedSanctions()
    {
        return $this->hasMany(UserSanction::class, 'admin_id');
    }

    public function getIsMutedAttribute(): bool
    {
        return $this->muted_until !== null && $this->muted_until->isFuture();
    }

    public function getMuteRemainingHumanAttribute(): ?string
    {
        if (!$this->is_muted) {
            return null;
        }
        return $this->muted_until->diffForHumans(['parts' => 2, 'syntax' => \Carbon\CarbonInterface::DIFF_RELATIVE_TO_NOW]);
    }

    public function getRankNameAttribute(): string
    {
        return \App\Services\ExpService::getRankName($this->level ?? 1);
    }

    public function getNextLevelExpAttribute(): int
    {
        return \App\Services\ExpService::getNextLevelExp($this->level ?? 1);
    }

    public function getCurrentLevelBaseExpAttribute(): int
    {
        return \App\Services\ExpService::getCurrentLevelBaseExp($this->level ?? 1);
    }

    public function getExpInLevelAttribute(): int
    {
        return \App\Services\ExpService::getExpInCurrentLevel($this->exp ?? 0, $this->level ?? 1);
    }

    public function getExpNeededInLevelAttribute(): int
    {
        return \App\Services\ExpService::getExpRequiredForNextLevel($this->level ?? 1);
    }

    public function getExpPercentageAttribute(): float
    {
        return \App\Services\ExpService::getLevelPercentage($this->exp ?? 0, $this->level ?? 1);
    }

    public function getExpRemainingAttribute(): int
    {
        return max(0, $this->next_level_exp - ($this->exp ?? 0));
    }
}
