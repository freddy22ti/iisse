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
        Schema::create('sarana_pelayanan_kesehatans', function (Blueprint $table) {
            $table->id();
            $table->string('kecamatan')->nullable();
            $table->string('tahun')->nullable();
            $table->string('jenis_tenaga_medis')->nullable();
            $table->integer('puskesmas')->nullable();
            $table->integer('instalasi_farmasi')->nullable();
            $table->integer('pka')->nullable();
            $table->integer('dinkes')->nullable();
            $table->integer('rumah_sakit')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sarana_pelayanan_kesehatans');
    }
};
