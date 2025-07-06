<?php

namespace App\Services;

use App\CustomResponseTrait;
use App\Http\Requests\StoreScheduleRequest;
use App\Models\{JadwalKBM, Kelas, Mapel, User};
use Illuminate\Http\Request;

class JadwalKBMService
{
    use CustomResponseTrait;
    protected JadwalKBM $jadwalKBM;
    public function __construct()
    {
        $this->jadwalKBM = new JadwalKBM();
    }

    public function index(Request $request)
    {
        $query = $this->jadwalKBM->with(['mataPelajarans', 'guru', 'kelas'])
            ->orderByRaw("FIELD(hari, 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'ahad')")
            ->orderBy('jam_mulai');

        // Filter berdasarkan hari
        if ($request->has('hari') && $request->hari !== 'all') {
            $query->where('hari', $request->hari);
        }

        // Filter berdasarkan kelas
        if ($request->has('kelas_id') && $request->kelas_id !== 'all') {
            $query->where('kelas_id', $request->kelas_id);
        }

        // Filter berdasarkan guru
        if ($request->has('guru_id') && $request->guru_id !== 'all') {
            $query->where('guru_id', $request->guru_id);
        }

        // Filter berdasarkan mata pelajaran
        if ($request->has('mapel_id') && $request->mapel_id !== 'all') {
            $query->where('mapel_id', $request->mapel_id);
        }

        // Pagination atau semua data
        $perPage = $request->get('per_page', 10);
        $schedules = $query->paginate($perPage);
        return [
            'schedules' => $schedules,
            'filterOptions' => [
                'hari' => ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', "Ahad"],
                'kelas' => Kelas::select('id', 'nama_kelas')->get(),
                'guru' => User::with('profileGuru')->select('id', 'username as nama')->get(),
                'mapel' => Mapel::select('id', 'nama_mapel')->get(),
            ]
        ];
    }

    public function store(StoreScheduleRequest $request)
    {
        // Validasi konflik jadwal
        $conflict = $this->jadwalKBM->where('hari', $request->hari)
            ->where('kelas_id', $request->kelas_id)
            ->where(function ($query) use ($request) {
                $query->whereBetween('jam_mulai', [$request->jam_mulai, $request->jam_selesai])
                    ->orWhereBetween('jam_selesai', [$request->jam_mulai, $request->jam_selesai])
                    ->orWhere(function ($q) use ($request) {
                        $q->where('jam_mulai', '<', $request->jam_mulai)
                            ->where('jam_selesai', '>', $request->jam_selesai);
                    });
            })
            ->exists();

        if ($conflict) {
            return response()->json([
                'message' => 'Konflik jadwal: Kelas sudah memiliki jadwal pada waktu tersebut',
                'errors' => ['jam_mulai' => ['Konflik jadwal']]
            ], 422);
        }

        $schedule = $this->jadwalKBM->create($request->validated());

        return $this->redirectWithAlert('jadwalkbm.index', [
            'type' => "success",
            'message' =>  'Jadwal berhasil ditambahkan'
        ]);
    }

    public function update(Request $request, JadwalKBM $schedule)
    {
        // Validasi konflik jadwal (kecuali jadwal itu sendiri)
        $conflict = $this->jadwalKBM->where('hari', $request->hari)
            ->where('kelas_id', $request->kelas_id)
            ->where('id', '!=', $schedule->id)
            ->where(function ($query) use ($request) {
                $query->whereBetween('jam_mulai', [$request->jam_mulai, $request->jam_selesai])
                    ->orWhereBetween('jam_selesai', [$request->jam_mulai, $request->jam_selesai])
                    ->orWhere(function ($q) use ($request) {
                        $q->where('jam_mulai', '<', $request->jam_mulai)
                            ->where('jam_selesai', '>', $request->jam_selesai);
                    });
            })
            ->exists();

        if ($conflict) {
            return response()->json([
                'message' => 'Konflik jadwal: Kelas sudah memiliki jadwal pada waktu tersebut',
                'errors' => ['jam_mulai' => ['Konflik jadwal']]
            ], 422);
        }

        $schedule->update($request->validated());

        return response()->json([
            'message' => 'Jadwal berhasil diperbarui',
            'data' => $schedule->load(['mata_pelajaran', 'guru', 'kelas'])
        ]);
    }
    public function destroy(JadwalKBM $schedule)
    {
        $schedule->delete();

        return response()->json([
            'message' => 'Jadwal berhasil dihapus'
        ], 204);
    }
}
