<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
    protected $fillable = [
        'day_of_week',
        'subject_id',
        'class',
        'time_start',
        'time_end',
    ];

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }
}
