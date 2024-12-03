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
        Schema::create('kasus_penyakits', function (Blueprint $table) {
            $table->id();
            $table->string("kecamatan")->nullable();
            $table->string("tahun")->nullable();
            $table->string("jenis_penyakit")->nullable();
            $table->integer("jumlah_kasus")->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kasus_penyakits');
    }
};
