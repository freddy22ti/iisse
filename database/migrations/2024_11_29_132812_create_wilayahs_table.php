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
        Schema::create('wilayahs', function (Blueprint $table) {
            $table->id();
            $table->string("kecamatan")->nullable();
            $table->string("ibukota_kecamatan")->nullable();
            $table->double("luas_daerah")->nullable();
            $table->double("persentase_luas_wilayah")->nullable();
            $table->integer("jumlah_kelurahan")->nullable();
            $table->integer("rt")->nullable();
            $table->integer("rw")->nullable();
            $table->integer("jumlah_laki_laki")->nullable();
            $table->integer("jumlah_perempuan")->nullable();
            $table->integer("total")->nullable();
            $table->string("tahun")->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('wilayahs');
    }
};
