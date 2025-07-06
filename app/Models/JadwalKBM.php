<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JadwalKBM extends Model
{
    protected $table = "jadwal_kbms";
    protected $fillable = [
        'guru_id',
        'mapel_id',
        'kelas_id',
        'hari',
        'jam_mulai',
        'jam_selesai',
    ];

    protected function casts()
    {
        return [
            'jam_mulai' => 'datetime:H:i',
            'jam_selesai' => 'datetime:H:i',
        ];
    }

    public function mataPelajarans()
    {
        return $this->belongsTo(Mapel::class, 'mapel_id');
    }

    public function guru()
    {
        return $this->belongsTo(User::class);
    }

    public function kelas()
    {
        return $this->belongsTo(Kelas::class);
    }
}
