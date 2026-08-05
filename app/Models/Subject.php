<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    protected $fillable = [
        'name',
        'code',
        'icon',
        'color',
    ];

    public function schedules()
    {
        return $this->hasMany(Schedule::class);
    }
}
