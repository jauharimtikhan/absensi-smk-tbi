<?php

namespace Database\Seeders;

use App\Models\Jurusan;
use App\Models\Kelas;
use App\Models\Siswa;
use App\Models\User;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Buat user super-admin
        User::create([
            'username' => 'super_admin',
            'password' => Hash::make('super_admin'),
            'role' => 'super-admin',
        ]);

        // Buat user guru
        User::create([
            'username' => 'guru',
            'password' => Hash::make('guru'),
            'role' => 'guru',
        ]);

        Kelas::create([
            'kode_kelas' => '10-mm',
            'nama_kelas' => '10-MM'
        ]);
        Kelas::create([
            'kode_kelas' => '10-dkv',
            'nama_kelas' => '10-DKV'
        ]);
        Kelas::create([
            'kode_kelas' => '11-mm',
            'nama_kelas' => '11-MM'
        ]);
        Kelas::create([
            'kode_kelas' => '11-dkv',
            'nama_kelas' => '11-DKV'
        ]);
        Kelas::create([
            'kode_kelas' => '12-mm',
            'nama_kelas' => '12-MM'
        ]);
        Kelas::create([
            'kode_kelas' => '12-dkv',
            'nama_kelas' => '12-DKV'
        ]);

        Jurusan::create([
            'kode_jurusan' => "dkv",
            'nama_jurusan' => "DKV"
        ]);

        Jurusan::create([
            'kode_jurusan' => "mm",
            'nama_jurusan' => "MM"
        ]);

        // $faker = Faker::create();

        // $this->command->info('⏳ Menambahkan 1000 data siswa...');
        // $this->command->getOutput()->progressStart(1000);
        // $existingNis = [];
        // for ($i = 0; $i < 1000; $i++) {
        //     $nis = null;

        //     // Loop sampai dapet NIS yang unik (tidak ada di array dan tidak ada di database)
        //     do {
        //         $yearMonth = now()->format('ym');
        //         $randomNumber = str_pad(mt_rand(0, 9999), 4, '0', STR_PAD_LEFT);
        //         $nis = $yearMonth . $randomNumber;
        //     } while (in_array($nis, $existingNis) || Siswa::where('nis', $nis)->exists());

        //     $existingNis[] = $nis;

        //     Siswa::create([
        //         'nis' => $nis,
        //         'nama_lengkap' => $faker->name,
        //         'kelas' => null,
        //         'jenis_kelamin' => null,
        //         'jurusan' => null
        //     ]);

        //     $this->command->getOutput()->progressAdvance();
        // }

        // $this->command->getOutput()->progressFinish();
        // $this->command->info('✅ 1000 data siswa berhasil ditambahkan.');
    }
}
