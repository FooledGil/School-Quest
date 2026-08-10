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
        'status',
        'proof_text',
        'rejection_reason',
        'validated_by',
        'validated_at',
    ];

    protected function casts(): array
    {
        return [
            'completed_at' => 'datetime',
            'validated_at' => 'datetime',
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

    public function validator()
    {
        return $this->belongsTo(User::class, 'validated_by');
    }

    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    public function isApproved(): bool
    {
        return $this->status === 'approved';
    }

    public function isRejected(): bool
    {
        return $this->status === 'rejected';
    }
}
