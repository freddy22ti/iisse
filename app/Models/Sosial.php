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
        'kualitas_udara_pengaruhi_pendapatan',
        'absen_kerja_sekolah',
        'dampak_usaha_kualitas_udara',
        'usaha_berjalan_normal_saat_kabut',

        // kesehatan
        'gangguan_kesehatan_pribadi',
        'gangguan_kesehatan_keluarga',

        // awareness
        'frekuensi_pakai_masker',
        'aksi_saat_udara_buruk',
        'intensitas_penggunaan_masker_kabut_asap',
        'penggunaan_air_purifier',
        'kondisi_ventilasi',
        'frekuensi_konsultasi_dokter',
    ];
}
