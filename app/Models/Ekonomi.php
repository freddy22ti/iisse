<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ekonomi extends Model
{
    protected $table = 'kuisioner';

    protected $visible = [
        'waktu',
        'kecamatan',
        'kualitas_udara_pengaruhi_pendapatan',
        'absen_kerja_sekolah',
        'dampak_usaha_kualitas_udara',
        'usaha_berjalan_normal_saat_kabut',
    ];
}
