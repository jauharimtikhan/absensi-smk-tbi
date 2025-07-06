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
        Schema::create('absensis', function (Blueprint $table) {
            $table->id();

            $table->string('jenis_absen')->nullable(); // contoh: absen pagi, absen siang

            $table->foreignId('siswa_id')
                ->constrained('siswas')
                ->onDelete('cascade');

            $table->foreignId('user_id') // guru
                ->constrained('users')
                ->onDelete('cascade');

            $table->foreignId('kelas_id')
                ->constrained('kelas')
                ->onDelete('cascade');

            $table->foreignId('mapel_id')
                ->nullable()
                ->constrained('mapels')
                ->onDelete('set null');

            $table->enum('status', ['hadir', 'alpa', 'izin', 'sakit', 'telat']);

            $table->date('tanggal');

            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('absensis');
    }
};
