<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\HasRole;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasRole;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'username',
        'role',
        'password',
        'api_token'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'password' => 'hashed',
        ];
    }

    protected static function booted()
    {
        static::addGlobalScope('withDefaults', function ($query) {
            $query->with(['profileGuru', 'kelas', 'mataPelajarans']); // relasi default
        });
    }

    public function mataPelajarans()
    {
        return $this->belongsToMany(Mapel::class, 'guru_mata_pelajaran');
    }

    public function kelas()
    {
        return $this->belongsToMany(Kelas::class, 'guru_kelas');
    }

    public function profileGuru()
    {
        return $this->hasOne(ProfileGuru::class, 'user_id')->withDefault();
    }

    public function siswas()
    {
        return $this->belongsToMany(Siswa::class, 'guru_siswa_mapel', 'guru_id', 'siswa_id')
            ->withPivot(['mapel_id'])
            ->withTimestamps()
            ->with(['mataPelajaran']);
    }

    public function jadwalKBM()
    {
        return $this->hasMany(JadwalKBM::class, 'guru_id');
    }
}
