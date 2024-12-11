<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PM25 extends Model
{
    protected $table = 'p_m25_s';

    protected $visible = [
        'waktu',
        'kecamatan',
        'titik',
        'nilai',
        'tahun',
    ];
}
