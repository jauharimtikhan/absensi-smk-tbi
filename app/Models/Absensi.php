<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Absensi extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'jenis_absen',
        'siswa_id',
        'user_id',
        'kelas_id',
        'mapel_id',
        'status',
        'tanggal',
    ];

    protected function casts()
    {
        return [
            'tanggal' => 'date'
        ];
    }

    /**
     * Relasi ke model Siswa.
     */
    public function siswa()
    {
        return $this->belongsTo(Siswa::class);
    }

    /**
     * Relasi ke model User (Guru).
     */
    public function guru()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Relasi ke model Kelas.
     */
    public function kelas()
    {
        return $this->belongsTo(Kelas::class);
    }

    /**
     * Relasi ke model Mapel (mata pelajaran).
     */
    public function mapel()
    {
        return $this->belongsTo(Mapel::class);
    }
}
