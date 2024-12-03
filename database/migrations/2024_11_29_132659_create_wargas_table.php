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
        Schema::create('wargas', function (Blueprint $table) {
            $table->id();
            $table->string("tahun")->nullable();
            $table->string("kecamatan")->nullable();
            $table->string("kelompok_umur")->nullable();
            $table->integer("laki_laki")->nullable();
            $table->integer("perempuan")->nullable();
            $table->integer("total")->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('wargas');
    }
};
