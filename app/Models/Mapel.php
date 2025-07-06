<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Mapel extends Model
{
    protected $fillable = [
        'kode_mapel',
        'nama_mapel',
    ];

    public function guru()
    {
        return $this->belongsToMany(User::class, 'guru_mata_pelajaran');
    }

    public function siswas()
    {
        return $this->belongsToMany(Siswa::class, 'mapel_siswa');
    }

    public function jadwalKBM()
    {
        return $this->hasMany(JadwalKBM::class);
    }
}
