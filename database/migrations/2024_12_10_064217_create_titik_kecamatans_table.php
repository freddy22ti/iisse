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
        Schema::create('titik_kecamatans', function (Blueprint $table) {
            $table->id();
            $table->double('lattitude');
            $table->double('longitude');
            $table->string('kelurahan');
            $table->string('kecamatan');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('titik_kecamatans');
    }
};
