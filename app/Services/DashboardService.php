<?php

namespace App\Services;

use App\CustomResponseTrait;
use App\Models\{Absensi, JadwalKBM, Siswa, User};
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;

class DashboardService
{
    use CustomResponseTrait;
    protected Siswa $siswa;
    protected User $guru;
    protected Absensi $absensi;
    protected JadwalKBM $jadwalKBM;

    public function __construct()
    {
        $this->siswa = new Siswa();
        $this->guru = new User();
        $this->absensi = new Absensi();
        $this->jadwalKBM = new JadwalKBM();
    }

    public function getTotalSiswa()
    {
        return $this->siswa->count();
    }

    public function dashboardStats()
    {
        $today = Carbon::today()->toDateString();
        // 1. Hitung total siswa yang harus hadir
        $totalStudents = $this->siswa->where('status', 'aktif') // hanya siswa aktif
            ->count();

        // 2. Hitung siswa yang sudah absen hari ini (hadir/telat)
        $presentStudents = $this->absensi->whereDate('tanggal', $today)
            ->whereIn('status', ['hadir',  'telat'])
            ->distinct('siswa_id')
            ->count('siswa_id');

        // 3. Hitung persentase sisa hadir
        $remainingPercentage = 0;

        if ($totalStudents > 0) {
            $absentCount = $totalStudents - $presentStudents;
            $remainingPercentage = ($absentCount / $totalStudents) * 100;
        }

        return [
            'total_siswa' => $totalStudents,
            'presentase' => $presentStudents,
            'remaining_percentage' => round($remainingPercentage, 2),
            'guru_aktif' => $this->guru->with('profileGuru')->where('role', 'guru')->count()
        ];
    }
    public function guruData()
    {
        $guruId = Auth::id();
        $today = Carbon::today()->toDateString();

        // Ambil data guru dengan eager loading dan batasi kolom yang diperlukan
        $guru = $this->guru->with([
            'profileGuru',
            'mataPelajarans:id,nama_mapel',
            'kelas:id,nama_kelas,kode_kelas',
            'siswas:id,kelas'
        ])->find($guruId, ['id']);

        if (!$guru) {
            $this->alert([
                'type' => 'error',
                'message' => 'Data Guru Tidak Ditemukan!'
            ]);
            return;
        }

        // Persiapkan data kelas
        $guruKelas = $guru->kelas->map(function ($kelas) {
            return [
                'id' => $kelas->id,
                'label' => $kelas->nama_kelas,
                'value' => $kelas->kode_kelas
            ];
        });

        // Ambil semua siswa yang terkait dengan guru
        $siswaIds = $guru->siswas->pluck('id');

        // Ambil data absensi sekaligus untuk semua siswa
        $presentSiswaIds = $this->absensi
            ->whereDate('tanggal', $today)
            ->whereIn('status', ['hadir', 'telat'])
            ->whereIn('siswa_id', $siswaIds)
            ->pluck('siswa_id')
            ->unique();

        // Hitung statistik per kelas
        $statistikPerKelas = $guruKelas->map(function ($kelas) use ($guru, $presentSiswaIds) {
            $namaKelas = $kelas['label'];

            // Filter siswa berdasarkan kelas
            $siswaDiKelas = $guru->siswas->filter(function ($siswa) use ($namaKelas) {
                return str_contains($siswa->kelas, $namaKelas);
            });

            $siswaCount = $siswaDiKelas->count();
            $siswaIdsKelas = $siswaDiKelas->pluck('id');

            // Hitung siswa yang hadir di kelas ini
            $presentStudents = $siswaIdsKelas->intersect($presentSiswaIds)->count();

            // Hitung persentase
            $remainingPercentage = $siswaCount > 0
                ? round((($siswaCount - $presentStudents) / $siswaCount) * 100, 2)
                : 0;

            // Format data per mata pelajaran
            return [
                'nama_kelas' => $kelas['label'],
                'siswa' => $siswaCount,
                'presentStudent' => $presentStudents,
                'remaining_percentage' => $remainingPercentage
            ];
        });

        $namaHari  = Carbon::today();
        $jadwalKBM = $this->jadwalKBM
            ->with(['mataPelajarans', 'guru', 'kelas'])
            ->where('hari', $namaHari->locale('id')->isoFormat('dddd'))
            ->where('guru_id', Auth::id())
            ->get();


        return [
            'statistikPerKelas' => $statistikPerKelas,
            'jadwal_hari_ini' => $jadwalKBM
        ];
    }
}
