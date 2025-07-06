<?php

namespace App\Services;

use App\Models\{Absensi, Siswa, Kelas};
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Carbon;

class LaporanService
{
    protected Kelas $kelas;
    protected Absensi $absensi;
    protected Siswa $siswa;
    public function __construct()
    {
        $this->kelas = new Kelas();
        $this->absensi = new Absensi();
        $this->siswa = new Siswa();
    }


    public function getKelas()
    {
        return $this->kelas
            ->select(['nama_kelas', 'id'])
            ->get()
            ->map(function ($kelas) {
                return [
                    'label' => $kelas->nama_kelas,
                    'value' => $kelas->id
                ];
            });
    }

    public function searchDataByDay(Request $request)
    {

        $inputTanggal = $request->input('tanggal');
        $inputKelas = $request->input('kelas');

        $tanggal = Carbon::parse($inputTanggal)->toDateString(); // Pastikan formatnya yyyy-mm-dd

        $data = $this->absensi
            ->withoutTrashed()
            ->with(['siswa', 'guru.profileGuru', 'mapel', 'kelas'])
            ->whereDate('tanggal', $tanggal);

        if ($inputKelas !== 'semua_kelas') {
            $data->where('kelas_id', $inputKelas);
        }

        if ($data->paginate(50)->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Data Absensi Kosong!',
            ], 404);
        }
        return response()->json([
            'success' => true,
            'data' => $data->paginate(50),
        ]);
    }
    public function searchDataBySemester(Request $request)
    {
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');
        $kelasId = $request->input('kelas');

        // Validasi input
        if (!$startDate || !$endDate || !$kelasId) {
            return response()->json([
                'success' => false,
                'message' => 'Tanggal mulai, tanggal akhir, dan kelas wajib diisi',
            ], 400);
        }

        // Query dasar
        $query = Absensi::withoutTrashed()
            ->with(['siswa', 'guru.profileGuru', 'mapel', 'kelas'])
            ->whereBetween('tanggal', [$startDate, $endDate]);

        // Filter kelas jika bukan 'semua_kelas'
        if ($kelasId !== 'semua_kelas') {
            $query->where('kelas_id', $kelasId);
        }
        if ($request->filled('mapel') && $request->input('mapel') !== 'semua_mapel') {
            $query->where('mapel_id', $request->input('mapel'));
        }

        // Pagination dengan 50 item per halaman
        $absensiData = $query->paginate(50);

        // Jika data kosong
        if ($absensiData->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Data absensi tidak ditemukan untuk periode ini',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $absensiData
        ], 200);
    }

    public function searchDataByWeek(Request $request)
    {
        $rawDate = $request->input('tanggal');
        $startDate = $rawDate['start']; // format: yyyy-mm-dd
        $endDate = $rawDate['end'];     // format: yyyy-mm-dd
        $inputKelas = $request->input('kelas');
        if (!$startDate || !$endDate) {
            return response()->json([
                'success' => false,
                'message' => 'Rentang tanggal tidak valid!',
            ], 400);
        }

        $data = $this->absensi
            ->withoutTrashed()
            ->with(['siswa', 'guru.profileGuru', 'mapel', 'kelas'])
            ->whereBetween('tanggal', [$startDate, $endDate]);

        if ($inputKelas !== 'semua_kelas') {
            $data->where('kelas_id', $inputKelas);
        }

        $result = $data->orderBy('tanggal')->paginate(50);

        if ($result->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Data Absensi Kosong!',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $result,
        ]);
    }
    public function searchDataByMonth(Request $request)
    {
        $inputTanggal = $request->input('tanggal'); // format: YYYY-MM-DD
        $inputKelas = $request->input('kelas');

        $parsedDate = Carbon::parse($inputTanggal);

        $startOfMonth = $parsedDate->copy()->startOfMonth()->toDateString();
        $endOfMonth = $parsedDate->copy()->endOfMonth()->toDateString();

        $data = $this->absensi
            ->withoutTrashed()
            ->with(['siswa', 'guru.profileGuru', 'mapel', 'kelas'])
            ->whereBetween('tanggal', [$startOfMonth, $endOfMonth]);

        if ($inputKelas !== 'semua_kelas') {
            $data->where('kelas_id', $inputKelas);
        }

        if ($data->paginate(50)->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Data Absensi Kosong!',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $data->paginate(50),
        ]);
    }

    public function getExportedDataExcelSmt(Request $request)
    {
        $startDate = $request->input('start_date'); // format: YYYY-MM-DD
        $endDate = $request->input('end_date');     // format: YYYY-MM-DD
        $kelasId = $request->input('kelas');

        // Validasi input
        if (!$startDate || !$endDate || !$kelasId) {
            return response()->json([
                'success' => false,
                'message' => 'Tanggal mulai, tanggal akhir, dan kelas wajib diisi',
            ], 400);
        }

        // Query dasar dengan eager loading
        $query = Absensi::withoutTrashed()
            ->with([
                'siswa:id,nama_lengkap,nis',
                'kelas:id,nama_kelas',
                'mapel:id,nama_mapel',
                'guru.profileGuru:user_id,nama_guru'
            ])
            ->whereBetween('tanggal', [$startDate, $endDate]);

        // Filter kelas jika bukan 'semua_kelas'
        if ($kelasId !== 'semua_kelas') {
            $query->where('kelas_id', $kelasId);
        }
        if ($request->filled('mapel') && $request->input('mapel') !== 'semua_mapel') {
            $query->where('mapel_id', $request->input('mapel'));
        }

        // Ambil data dengan optimasi select
        $absensiData = $query->get([
            'id',
            'siswa_id',
            'kelas_id',
            'mapel_id',
            'user_id',
            'status',
            'jenis_absen'
        ]);

        // Handle data kosong
        if ($absensiData->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Data Absensi Kosong!',
            ], 404);
        }

        // Preload data siswa untuk mengurangi query N+1
        $siswaIds = $absensiData->pluck('siswa_id')->unique();
        $siswas = Siswa::whereIn('id', $siswaIds)
            ->get(['id', 'nama_lengkap', 'nis'])
            ->keyBy('id');

        // Kelompokkan data per siswa dan hitung statistik
        $resultData = $absensiData->groupBy('siswa_id')->map(function ($items) use ($siswas) {
            $siswa = $siswas[$items[0]->siswa_id] ?? null;

            if (!$siswa) {
                return null;
            }

            return [
                'nama_siswa' => $siswa->nama_lengkap,
                'nis' => $siswa->nis,
                'jml' => [
                    'sakit' => $items->where('status', 'sakit')->count(),
                    'izin' => $items->where('status', 'izin')->count(),
                    'alpa' => $items->where('status', 'alpa')->count(),
                    'telat' => $items->where('status', 'telat')->count(),
                ],
                'guru' => $items[0]->guru,
                'mapel' => $items[0]->mapel,
                'kelas' => $items[0]->kelas,
                'jenis_absen' => $items[0]->jenis_absen,
            ];
        })->filter()->values();

        return response()->json([
            'success' => true,
            'data' => $resultData,
        ]);
    }

    public function getExportedDataWeek(Request $request)
    {
        $rawDate = $request->input('tanggal');
        $startDate = $rawDate['start']; // format: yyyy-mm-dd
        $endDate = $rawDate['end'];    // format: yyyy-mm-dd
        $inputKelas = $request->input('kelas');

        if (!$startDate || !$endDate) {
            return response()->json([
                'success' => false,
                'message' => 'Rentang tanggal tidak valid!',
            ], 400);
        }

        $data = $this->absensi
            ->withoutTrashed()
            ->with(['siswa', 'guru.profileGuru', 'mapel', 'kelas'])
            ->whereBetween('tanggal', [$startDate, $endDate]);

        if ($inputKelas !== 'semua_kelas') {
            $data->where('kelas_id', $inputKelas);
        }

        $absensiData = $data->get();

        if ($absensiData->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Data Absensi Kosong!',
            ], 404);
        }

        // Grouping by siswa_id
        $grouped = $absensiData->groupBy('siswa_id');

        $resultData = $grouped->map(function ($items, $siswaId) {
            /** @var \Illuminate\Support\Collection $items */
            $siswa = $items->first()->siswa;
            $kelas = $items->first()->kelas;
            $mapel = $items->first()->mapel;
            $guru = $items->first()->guru;

            return [
                'nama_siswa' => $siswa->nama_lengkap,
                'nis' => $siswa->nis,
                'jml' => [
                    'sakit' => $items->where('status', 'sakit')->count(),
                    'izin' => $items->where('status', 'izin')->count(),
                    'alpa' => $items->where('status', 'alpa')->count(),
                    'telat' => $items->where('status', 'telat')->count(),
                ],
                'guru' => $guru,
                'mapel' => $mapel,
                'kelas' => $kelas,
                'jenis_absen' => null, // optional; kamu bisa isi dengan status terakhir atau total
            ];
        })->values(); // Remove key indexes

        return response()->json([
            'success' => true,
            'data' => $resultData,
        ]);
    }
    public function getExportedDataMonth(Request $request)
    {
        $inputTanggal = $request->input('tanggal'); // format: YYYY-MM-DD
        $inputKelas = $request->input('kelas');

        $parsedDate = Carbon::parse($inputTanggal);
        $startOfMonth = $parsedDate->startOfMonth()->toDateString();
        $endOfMonth = $parsedDate->endOfMonth()->toDateString();

        // Query absensi sekali saja
        $query = $this->absensi
            ->withoutTrashed()
            ->with(['siswa', 'guru.profileGuru', 'mapel', 'kelas'])
            ->whereBetween('tanggal', [$startOfMonth, $endOfMonth]);

        if ($inputKelas !== 'semua_kelas') {
            $query->where('kelas_id', $inputKelas);
        }

        $absensiData = $query->get();

        if ($absensiData->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Data Absensi Kosong!',
            ], 404);
        }

        // Grouping by siswa_id
        $grouped = $absensiData->groupBy('siswa_id');

        $resultData = $grouped->map(function ($items, $siswaId) {
            /** @var \Illuminate\Support\Collection $items */
            $siswa = $items->first()->siswa;
            $kelas = $items->first()->kelas;
            $mapel = $items->first()->mapel;
            $guru = $items->first()->guru;

            return [
                'nama_siswa' => $siswa->nama_lengkap,
                'nis' => $siswa->nis,
                'jml' => [
                    'sakit' => $items->where('status', 'sakit')->count(),
                    'izin' => $items->where('status', 'izin')->count(),
                    'alpa' => $items->where('status', 'alpa')->count(),
                    'telat' => $items->where('status', 'telat')->count(),
                ],
                'guru' => $guru,
                'mapel' => $mapel,
                'kelas' => $kelas,
                'jenis_absen' => null, // optional; kamu bisa isi dengan status terakhir atau total
            ];
        })->values(); // Remove key indexes

        return response()->json([
            'success' => true,
            'data' => $resultData,
        ]);
    }

    public function getSemesterOptions()
    {
        $currentYear = Carbon::now()->year;
        $years = range($currentYear - 2, $currentYear + 2); // 5 tahun: 2 tahun sebelumnya, tahun sekarang, 2 tahun mendatang
        $semesters = [];

        foreach ($years as $year) {
            // Semester Ganjil (Juli - Desember)
            $semesters[] = [
                'label' => "Semester Ganjil {$year}/" . ($year + 1),
                'value' => "ganjil_{$year}",
                'start_date' => Carbon::create($year, 7, 1)->startOfDay()->toDateString(),
                'end_date' => Carbon::create($year, 12, 31)->endOfDay()->toDateString(),
            ];

            // Semester Genap (Januari - Juni)
            $semesters[] = [
                'label' => "Semester Genap {$year}/" . ($year + 1),
                'value' => "genap_{$year}",
                'start_date' => Carbon::create($year + 1, 1, 1)->startOfDay()->toDateString(),
                'end_date' => Carbon::create($year + 1, 6, 30)->endOfDay()->toDateString(),
            ];
        }

        return $semesters;
    }
}
