<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Quest extends Model
{
    protected $fillable = [
        'title',
        'description',
        'type',
        'class',
        'category',
        'exp_reward',
        'difficulty',
        'icon',
        'is_active',
        'is_daily',
        'created_by',
        'available_date',
        'deadline',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'is_daily' => 'boolean',
            'available_date' => 'date',
            'deadline' => 'date',
        ];
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function completions()
    {
        return $this->hasMany(QuestCompletion::class);
    }
}
