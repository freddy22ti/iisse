<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Awareness extends Model
{
    protected $table = "kuisioner";

    protected $visible = [
        'waktu',
        'kecamatan',
        'frekuensi_pakai_masker',
        'aksi_saat_udara_buruk',
        'intensitas_penggunaan_masker_kabut_asap',
        'penggunaan_air_purifier',
        'kondisi_ventilasi',
        'frekuensi_konsultasi_dokter',

    ];
}
