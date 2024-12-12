<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Demografi extends Model
{
    protected $table = 'kuisioner';

    protected $visible = [
        'waktu',
        'kecamatan',
        'email',
        'jenis_kelamin',
        'umur',
        'kota',
        'pendidikan_tertinggi',
        'pekerjaan',
        'penghasilan_per_bulan'
    ];
}
