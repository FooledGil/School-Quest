<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PiketSchedule extends Model
{
    protected $fillable = [
        'day_of_week',
        'class',
        'group_name',
    ];

    public function members()
    {
        return $this->hasMany(PiketMember::class);
    }
}
