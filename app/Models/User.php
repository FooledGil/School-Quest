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
}
