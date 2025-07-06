<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProfileGuru extends Model
{
    protected $fillable = [
        'user_id',
        'nama_guru',
        'alamat',
        'no_telp',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
