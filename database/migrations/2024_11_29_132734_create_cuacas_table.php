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
        Schema::create('cuacas', function (Blueprint $table) {
            $table->id();
            $table->string("kecamatan")->nullable();
            $table->string("bulan")->nullable();
            $table->string("tahun")->nullable();
            $table->double("min_suhu_udara")->nullable();
            $table->double("rata_suhu_udara")->nullable();
            $table->double("max_suhu_udara")->nullable();
            $table->double("min_kelembapan")->nullable();
            $table->double("rata_kelembapan")->nullable();
            $table->double("max_kelembapan")->nullable();
            $table->double("min_tekanan_udara")->nullable();
            $table->double("rata_tekanan_udara")->nullable();
            $table->double("max_tekanan_udara")->nullable();
            $table->integer("jumlah_hari_hujan")->nullable();
            $table->integer("banyak_curah_hujan")->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cuacas');
    }
};
