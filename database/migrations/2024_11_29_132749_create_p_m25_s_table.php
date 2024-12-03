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
        Schema::create('p_m25_s', function (Blueprint $table) {
            $table->id();
            $table->timestamp('waktu');
            $table->string('kecamatan');
            $table->string('titik');
            $table->double('nilai');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('p_m25_s');
    }
};
