<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QuestCompletion extends Model
{
    protected $fillable = [
        'user_id',
        'quest_id',
        'completed_at',
        'exp_earned',
    ];

    protected function casts(): array
    {
        return [
            'completed_at' => 'datetime',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function quest()
    {
        return $this->belongsTo(Quest::class);
    }
}
