<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ekonomi extends Model
{
    protected $table = 'kuisioner';

    protected $visible = [
        'waktu',
        'kecamatan',
        'penghasilan_per_bulan',
        'penurunan_pendapatan',
        'penghasilan_per_hari',
        'penghasilan_per_hari_kabut',
    ];
}
