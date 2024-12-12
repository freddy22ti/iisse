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
        'gangguan_kesehatan_keluarga',
        'riwayat_ispa_asma_bronkitis',
        'riwayat_ispa_keluarga',
        'jumlah_fasilitas_kesehatan',
        'jumlah_kunjungan_fasilitas_kesehatan',
    ];
}
