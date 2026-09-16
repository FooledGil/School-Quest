<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PiketMember extends Model
{
    protected $fillable = [
        'piket_schedule_id',
        'user_id',
    ];

    public function piketSchedule()
    {
        return $this->belongsTo(PiketSchedule::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
