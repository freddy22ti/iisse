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
        'mekanisme_usaha_online',
        'penjelasan_usaha_online',
        'alasan_tidak_online',

        // awareness
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
