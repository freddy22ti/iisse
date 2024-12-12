<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Awareness extends Model
{
    protected $table = "kuisioner";

    protected $visible = [
        'waktu',
        'kecamatan',
        'pendapat_kualitas_lingkungan_pekanbaru',
        'frekuensi_pakai_masker',
        'aksi_saat_udara_buruk',
        'intensitas_penggunaan_masker_kabut_asap',
        'akses_informasi_kualitas_udara',
        'peringatan_pemerintah_kualitas_udara',
        'penggunaan_air_purifier',
        'kondisi_ventilasi',
        'frekuensi_konsultasi_dokter',
        'ikut_sosialisasi_pencegahan',
        'frekuensi_konsultasi_dokter',
        'punya_monitor_kualitas_udara',
        'ikut_komunitas_kualitas_udara',
    ];
}
