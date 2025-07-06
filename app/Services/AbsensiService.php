<?php

namespace App\Services;

use App\CustomResponseTrait;
use App\Models\{Absensi, Kelas, User, Siswa, Mapel};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use mysqli_sql_exception;

class AbsensiService
{

    use CustomResponseTrait;
    /**
     * Create a new class instance.
     */
    public function __construct(
        protected Absensi $absensi,
        protected Mapel $mapel,
        protected Kelas $kelas,
        protected User $user,
        protected Siswa $siswa,
    ) {
        //
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

    public function getMapel()
    {
        return $this->mapel
            ->select(['nama_mapel', 'id'])
            ->get()
            ->map(function ($mapel) {
                return [
                    'label' => $mapel->nama_mapel,
                    'value' => $mapel->id
                ];
            });
    }

    public function getGuru()
    {
        return $this->user
            ->select(['username', 'id'])
            ->get()
            ->map(function ($user) {
                return [
                    'label' => $user->username,
                    'value' => $user->id
                ];
            });
    }

    public function getSiswaQuery(Request $request)
    {


        $kelas = $this->kelas->findOrFail($request->kelas);
        $mapelId = $request->mapel;
        $user = Auth::user();

        $query = $this->siswa
            ->where('kelas', 'like', "%{$kelas->nama_kelas}%")
            ->where('status', 'aktif');

        if ($request->mapel === "keseluruhan") {
            $siswaAktif = $query->get();

            return response()->json([
                'success' => true,
                'data' => $siswaAktif,
            ], 200);
        }
        if ($user->role !== 'super-admin' || $user->role !== "bk") {
            $query->whereHas('mataPelajaran', function ($q) use ($mapelId, $user) {
                $q->where('mapel_id', $mapelId)
                    ->where('guru_siswa_mapel.guru_id', $user->id); // FIXED LINE
            });
        }


        $siswaAktif = $query->get();

        return response()->json([
            'success' => true,
            'data' => $siswaAktif,
        ], 200);
    }



    public function getSiswaQueryRaw(Request $request)
    {
        $request->validate([
            'kelas' => 'required|exists:kelas,id',
            'mapel' => 'nullable', // Validasi mapel jika memang harus ada
        ], [
            'kelas.required' => 'Kode Kelas wajib diisi!',
            'kelas.exists' => 'Kode Kelas tidak ditemukan!',
        ]);

        $kelas = $this->kelas->find($request->kelas);
        $siswaAktif = $this->siswa
            ->where('kelas', $kelas->nama_kelas)
            ->where('status', 'aktif')
            ->paginate(50);

        return response()->json([
            'success' => true,
            'data' => $siswaAktif
        ], 200);
    }


    public function store(Request $request)
    {
        $request->validate([
            'kelas' => 'required|exists:kelas,id',
            'tanggal' => 'required|date',
            'selected_siswa' => 'required|array|min:1',
            'selected_siswa.*.id_siswa' => 'required|exists:siswas,id',
            'user_id' => 'nullable|exists:users,id', // optional for super-admin
        ]);
        if (!Auth::check()) {
            return $this->redirectWithAlert('login', [
                'type' => 'error',
                'message' => 'Silahkan login ulang!'
            ]);
        }

        $userId = Auth::user()->role === 'super-admin'
            ? $request->user_id
            : Auth::id();

        $data = collect($request->selected_siswa)
            ->map(function ($item) use ($request, $userId) {
                if ($userId === null) {
                    $userId = Auth::id();
                }
                return [
                    'kelas_id' => $request->kelas,
                    'siswa_id' => $item['id_siswa'],
                    'tanggal' => $request->tanggal,
                    'user_id' => $userId,
                    'created_at' => now(),
                    'updated_at' => now(),
                    'status' => $item['status_absen'],
                    'jenis_absen' => $request->jenis_absen === "keseluruhan" ? null : $request->jenis_absen,
                    'mapel_id' => !in_array(['super-admin', 'bk'], ['super-admin', 'guru', 'bk']) ? null : $request->mapel
                ];
            });

        $this->absensi->insert($data->toArray()); // mass insert for efficiency

        return $this->redirectWithAlert('absensi.index', [
            'type' => 'success',
            'message' => 'Data absensi berhasil disimpan!',
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'selected_siswa' => 'required|array|min:1',
            'selected_siswa.*.id_absensi' => 'required|exists:absensis,id',
            'selected_siswa.*.status_absen' => 'required|in:hadir,alpa,izin,sakit,telat',
        ]);

        $user = Auth::user();
        $isSuperAdmin = $user->role === 'super-admin';

        foreach ($request->selected_siswa as $item) {
            $absensi = $this->absensi->find($item['id_absensi']);

            // Jika bukan super admin, pastikan hanya boleh update milik sendiri
            if (!$isSuperAdmin && $absensi->user_id !== $user->id) {
                continue; // Skip jika bukan milik user
            }

            // Update hanya kolom status
            $absensi->update([
                'status' => $item['status_absen'],
                'updated_at' => now(),
            ]);
        }

        $this->alert([
            'type' => 'success',
            'message' => 'Data absensi berhasil diperbarui!',
        ]);
        return;
    }

    public function getDataGuru()
    {
        $userId = Auth::id();
        return $this->user->with(['profileGuru', 'kelas', 'mataPelajarans'])
            ->find($userId);
    }

    public function attachSiswaToMapel(Request $request)
    {
        $request->validate([
            'mapel_id' => 'required|exists:mapels,id',
            'kelas_id' => 'required|exists:kelas,id',
            'siswa_ids' => 'required|array',
            'siswa_ids.*' => 'exists:siswas,id',
            'guru_id' => 'nullable|exists:users,id'
        ]);

        DB::beginTransaction();

        try {
            $guru = Auth::user()->role === "super-admin" ? $request->filled('guru_id') && $request->guru_id : Auth::user()->id; // Pastikan ini adalah guru
            $mapelId = $request->mapel_id;
            $siswaIds = $request->siswa_ids;

            foreach ($siswaIds as $siswaId) {
                DB::table('guru_siswa_mapel')->updateOrInsert(
                    [
                        'guru_id' => $guru,
                        'siswa_id' => $siswaId,
                        'mapel_id' => $mapelId,
                    ],
                    ['created_at' => now(), 'updated_at' => now()]
                );
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => "Berhasil menambahkan siswa ke mapel berdasarkan guru & kelas.",
            ], 200);
        } catch (\Throwable $th) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => $th->getMessage(),
            ], 500);
        }
    }
}
