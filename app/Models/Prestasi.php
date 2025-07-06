<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Prestasi extends Model
{
    protected $fillable = [
        'nama',
        'tingkat',
        'keterangan',
        'tanggal',
        'siswa_id',
    ];

    public function siswa()
    {
        return $this->belongsTo(Siswa::class);
    }
}
