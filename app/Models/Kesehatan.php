<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kesehatan extends Model
{
    protected $table = "kuisioner";

    protected $visible = [
        'waktu',
        'kecamatan',
        'gangguan_kesehatan_pribadi',
        'gangguan_kesehatan_keluarga'
    ];
}
