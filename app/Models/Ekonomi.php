<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ekonomi extends Model
{
    protected $table = 'kuisioner';

    protected $visible = [
        'waktu',
        'kecamatan',
        'kualitas_udara_pengaruhi_hidup',       
        'kualitas_udara_pengaruhi_pendapatan',
        'penurunan_pendapatan',
        'absen_kerja_sekolah',
        'dampak_usaha_kualitas_udara',
        'pengusaha_umkm',
        'usaha_berjalan_normal_saat_kabut',
        'mekanisme_usaha',
        'mekanisme_usaha_offline',
        'penjelasan_usaha_offline',
        'alasan_tidak_offline',
        'alasan_tidak_offline',
        'penjelasan_usaha_online',
        'alasan_tidak_online',
    ];
}
