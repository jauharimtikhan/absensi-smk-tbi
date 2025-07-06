<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kelas extends Model
{
    protected $fillable = [
        'kode_kelas',
        'nama_kelas',
    ];

    public function guru()
    {
        return $this->belongsToMany(User::class, 'guru_kelas');
    }

    public function jadwalKBM()
    {
        return $this->hasMany(JadwalKBM::class);
    }
}
