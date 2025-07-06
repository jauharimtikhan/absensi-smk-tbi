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
        Schema::create('siswas', function (Blueprint $table) {
            $table->id();
            $table->string('nama_lengkap');
            $table->string('nis')->unique();
            $table->string('kelas')->nullable();
            $table->enum('jenis_kelamin', [
                'L',
                'P'
            ])->nullable();
            $table->enum('status', [
                'aktif',
                'do',
                'tanpa_keterangan'
            ])->default('aktif');
            $table->string('jurusan')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('siswas');
    }
};
