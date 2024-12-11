<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('kuisioner', function (Blueprint $table) {
            $table->id();
            $table->timestamp('waktu')->nullable();
            $table->string('email')->nullable();
            $table->string('nama')->nullable();
            $table->string('jenis_kelamin')->nullable(); // Laki-laki/Perempuan
            $table->string('umur')->nullable();
            $table->string('kota')->nullable();
            $table->string('kecamatan')->nullable();
            $table->string('pekerjaan')->nullable();
            $table->string('pendidikan_tertinggi')->nullable();
            $table->string('penghasilan_per_bulan')->nullable();
            $table->string('frekuensi_aktivitas_luar')->nullable();
            $table->text('jenis_aktivitas_luar')->nullable();
            $table->string('pekerjaan_di_luar_ruangan')->nullable(); // Ya/Tidak
            $table->string('jenis_pekerjaan_luar')->nullable();
            $table->string('frekuensi_keluar_saat_udara_buruk')->nullable();
            $table->text('pendapat_kualitas_lingkungan_pekanbaru')->nullable();
            $table->string('frekuensi_pakai_masker')->nullable();
            $table->text('aksi_saat_udara_buruk')->nullable();
            $table->string('intensitas_penggunaan_masker_kabut_asap')->nullable();
            $table->string('akses_informasi_kualitas_udara')->nullable(); // Ya/
            $table->string('peringatan_pemerintah_kualitas_udara')->nullable(); // Ya/Tidak
            $table->string('penggunaan_air_purifier')->nullable(); // Ya/Tidak
            $table->string('kondisi_ventilasi')->nullable();
            $table->string('ikut_sosialisasi_pencegahan')->nullable(); // Ya/Tidak
            $table->string('frekuensi_konsultasi_dokter')->nullable();
            $table->string('punya_monitor_kualitas_udara')->nullable(); // Ya/Tidak
            $table->string('ikut_komunitas_kualitas_udara')->nullable(); // Ya/Tidak
            $table->string('kualitas_udara_pengaruhi_hidup')->nullable(); // Ya/Tidak
            $table->string('kualitas_udara_pengaruhi_pendapatan')->nullable(); // Ya/Tidak
            $table->string('penurunan_pendapatan')->nullable();
            $table->string('absen_kerja_sekolah')->nullable(); // Ya/Tidak
            $table->string('dampak_usaha_kualitas_udara')->nullable(); // Ya/Tidak
            $table->string('penghasilan_per_hari')->nullable();
            $table->string('penghasilan_per_hari_kabut')->nullable();
            $table->string('pengusaha_umkm')->nullable(); // Ya/Tidak
            $table->string('usaha_berjalan_normal_saat_kabut')->nullable(); // Ya/Tidak
            $table->string('mekanisme_usaha')->nullable();
            $table->string('mekanisme_usaha_offline')->nullable(); // Ya/Tidak
            $table->text('penjelasan_usaha_offline')->nullable();
            $table->text('alasan_tidak_offline')->nullable();
            $table->string('mekanisme_usaha_online')->nullable(); // Ya/Tidak
            $table->text('penjelasan_usaha_online')->nullable();
            $table->text('alasan_tidak_online')->nullable();
            $table->string('gangguan_kesehatan_pribadi')->nullable(); // Ya/Tidak
            $table->string('gangguan_kesehatan_keluarga')->nullable(); // Ya/Tidak
            $table->string('riwayat_ispa_asma_bronkitis')->nullable(); // Ya/Tidak
            $table->string('riwayat_ispa_keluarga')->nullable(); // Ya/Tidak
            $table->string('jumlah_fasilitas_kesehatan')->nullable();
            $table->string('jumlah_kunjungan_fasilitas_kesehatan')->nullable();
            $table->string('usaha_berjalan_saat_kabut')->nullable(); // Ya/Tidak
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
