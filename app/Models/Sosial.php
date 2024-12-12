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
        'pendidikan_tertinggi',
        'pekerjaan',
        'penghasilan_per_bulan',

        // kesehatan
        'gangguan_kesehatan_pribadi',
        'gangguan_kesehatan_keluarga',
        'riwayat_ispa_asma_bronkitis',
        'riwayat_ispa_keluarga',
        'jumlah_fasilitas_kesehatan',
        'jumlah_kunjungan_fasilitas_kesehatan',

        // ekonomi 
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

        // awareness

    ];
}
