<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Siswa extends Model
{

    use SoftDeletes;
    protected $fillable = [
        'nis',
        'nama_lengkap',
        'kelas',
        'jenis_kelamin',
        'jurusan',
        'status',
    ];

    public function mataPelajaran()
    {
        return $this->belongsToMany(Mapel::class, 'guru_siswa_mapel')
            ->withPivot('guru_id')
            ->withTimestamps();
    }
    public function gurus()
    {
        return $this->belongsToMany(User::class, 'guru_siswa_mapel', 'siswa_id', 'guru_id')
            ->withPivot(['mapel_id'])
            ->withTimestamps();
    }
}
