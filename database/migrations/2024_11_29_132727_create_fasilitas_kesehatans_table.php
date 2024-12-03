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
        Schema::create('fasilitas_kesehatans', function (Blueprint $table) {
            $table->id();
            $table->string("kecamatan")->nullable();
            $table->string("tahun")->nullable();
            $table->integer("jumlah_rumah_sakit")->nullable();
            $table->integer("jumlah_rumah_sakit_bersalin")->nullable();
            $table->integer("jumlah_puskesmas")->nullable();
            $table->integer("jumlah_puskesmas_pembantu")->nullable();
            $table->integer("jumlah_balai_pengobatan")->nullable();
            $table->integer("jumlah_posyandu")->nullable();
            $table->integer("jumlah_klinik")->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fasilitas_kesehatans');
    }
};
