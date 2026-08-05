<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Achievement extends Model
{
    protected $fillable = [
        'name',
        'description',
        'icon',
        'requirement_type',
        'requirement_value',
        'exp_bonus',
    ];

    public function userAchievements()
    {
        return $this->hasMany(UserAchievement::class);
    }
}
