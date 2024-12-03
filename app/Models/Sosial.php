<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sosial extends Model
{
    protected $table = "kuisioner";

    protected $hidden = [
        // demografi
        'email',
        'jenis_kelamin',
        'umur',
        'kota',
        'kecamatan',
        'pendidikan_tertinggi',
        'pekerjaan',

        // ekonomi
        'penghasilan_per_bulan',
        'penurunan_pendapatan',
        'rata_rata_penghasilan_per_hari',
        'rata_rata_penghasilan_per_hari_ketika_kabut_asap',
        'besar_penurunan_pendapatan_akibat_kualitas_udara_buru',
    ];
}
