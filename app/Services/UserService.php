<?php

namespace App\Services;

use App\CustomResponseTrait;
use App\Models\{Kelas, Mapel, ProfileGuru, User};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class UserService
{
  use CustomResponseTrait;
  protected User $user;
  protected Kelas $kelas;
  protected Mapel $mapel;
  protected ProfileGuru $profileGuru;
  public function __construct()
  {
    $this->user = new User();
    $this->mapel = new Mapel();
    $this->kelas = new Kelas();
    $this->profileGuru = new ProfileGuru();
  }

  public function search(Request $request)
  {
    $query = $this->user->with(['mataPelajarans', 'kelas', 'profileGuru'])->newQuery();

    return $query->orderBy('created_at', 'desc')->paginate(25);
  }

  public function store(Request $request)
  {
    $request->validate([
      'username' => 'required|unique:users,username',
      'password' => 'required|min:3',
      'nama_lengkap' => "required",
      'no_telp' => "nullable",
      'role' => 'required|in:super-admin,guru,bk',
      'mapels' => 'nullable|array',
      'mapels.*' => 'exists:mapels,id',
      'kelas' => 'nullable|array',
      'kelas.*' => 'exists:kelas,id',
    ]);

    DB::beginTransaction();

    try {
      $user = $this->user->create([
        'username' => $request->username,
        'password' => Hash::make($request->password),
        'role' => $request->role,
      ]);
      $this->profileGuru->create([
        'user_id' => $user->id,
        'nama_guru' => $request->nama_lengkap,
        'no_telp' => $request->no_telp
      ]);

      // Hanya jika role guru dan data ada
      if ($user->role === 'guru') {
        if ($request->filled('mapels') && is_array($request->mapels)) {
          $user->mataPelajarans()->attach($request->mapels);
        }

        if ($request->filled('kelas') && is_array($request->kelas)) {
          $user->kelas()->attach($request->kelas);
        }
      }

      DB::commit();

      return $this->redirectWithAlert('user.create', [
        'type' => 'success',
        'message' => 'Berhasil menambahkan data pengguna!',
      ]);
    } catch (\Throwable $th) {
      DB::rollBack();

      Log::error('Gagal menambahkan data pengguna.', [
        'error' => $th->getMessage(),
      ]);

      return $this->redirectWithAlert('user.create', [
        'type' => 'danger',
        'message' => 'Gagal menambahkan data pengguna!',
      ]);
    }
  }


  public function getDataKelas()
  {
    return $this->kelas->select(['nama_kelas', 'id'])
      ->get()
      ->map(function ($kelas) {
        return [
          'label' => $kelas->nama_kelas,
          'value' => $kelas->id
        ];
      });
  }

  public function getDataMapel()
  {
    return $this->mapel->select(['nama_mapel', 'id'])
      ->get()
      ->map(function ($kelas) {
        return [
          'label' => $kelas->nama_mapel,
          'value' => $kelas->id
        ];
      });
  }

  public function getDataUserWithRelation(string $id)
  {
    return $this->user->with(['mataPelajarans', 'kelas', 'profileGuru'])->find($id);
  }

  public function update(Request $request, string $id)
  {
    $request->validate([
      'username' => 'required|unique:users,username,' . $id,
      'role' => 'required|in:super-admin,guru,bk',
      'password' => 'nullable|min:3',
      'mapels' => 'nullable|array',
      'mapels.*' => 'exists:mapels,id',
      'kelas' => 'nullable|array',
      'kelas.*' => 'exists:kelas,id',
    ]);

    DB::beginTransaction();

    try {
      $user = $this->user->findOrFail($id);

      // Update field dasar user
      $user->username = $request->username;
      $user->role = $request->role;

      if (!empty($request->password)) {
        $user->password = Hash::make($request->password);
      }

      $user->save();

      // Ambil atau buat profile_guru jika ada data terkait
      $hasProfileFields = $request->filled(['nama_guru', 'alamat', 'no_telp']);

      if ($hasProfileFields) {
        $profileGuru = $this->profileGuru->where('user_id', $id)->first();

        if (!$profileGuru) {
          // Buat baru jika belum ada
          $profileGuru = $this->profileGuru->create([
            'user_id' => $user->id,
            'nama_guru' => $request->nama_guru,
            'alamat' => $request->alamat,
            'no_telp' => $request->no_telp,
          ]);
        } else {
          // Update jika sudah ada
          $profileGuru->nama_guru = $request->nama_guru;
          $profileGuru->alamat = $request->alamat;
          $profileGuru->no_telp = $request->no_telp;
          $profileGuru->save();
        }
      }

      // Sinkronisasi relasi guru jika role = guru
      if ($user->role === 'guru') {
        $user->mataPelajarans()->sync($request->filled('mapels') ? $request->mapels : []);
        $user->kelas()->sync($request->filled('kelas') ? $request->kelas : []);
      } else {
        $user->mataPelajarans()->detach();
        $user->kelas()->detach();
      }

      DB::commit();

      return to_route('user.show', $id)->with('alert', [
        'type' => 'success',
        'message' => 'Berhasil memperbarui data pengguna!',
      ]);
    } catch (\Throwable $th) {
      DB::rollBack();

      Log::error('Gagal memperbarui data pengguna.', [
        'error' => $th->getMessage(),
      ]);

      return to_route('user.show', $id)->with('alert', [
        'type' => 'danger',
        'message' => 'Gagal memperbarui data pengguna!',
      ]);
    }
  }

  public function getDetailGuru(string $id, string $mapelId)
  {
    $guru = $this->user
      ->with(['mataPelajarans', 'kelas', 'profileGuru', 'siswas.mataPelajaran']) // eager load
      ->findOrFail($id);

    // Ambil semua siswa yg di-attach ke guru ini
    $siswaPivotData = DB::table('guru_siswa_mapel')
      ->where('guru_id', $id)
      ->where('mapel_id', $mapelId)
      ->join('siswas', 'guru_siswa_mapel.siswa_id', '=', 'siswas.id')
      ->join('mapels', 'guru_siswa_mapel.mapel_id', '=', 'mapels.id')
      ->select(
        'siswas.id as siswa_id',
        'siswas.nama_lengkap',
        'siswas.nis',
        'siswas.kelas as kelas_nama',
        'mapels.id as mapel_id',
        'mapels.nama_mapel'
      )
      ->get();

    // Group by mapel_id → then by kelas
    $grouped = $siswaPivotData->groupBy('mapel_id')->map(function ($siswaList) {
      return $siswaList->groupBy('kelas_nama');
    });

    // Inject ke objek guru
    $guru->siswa_grouped = $grouped;

    return $guru;
  }

  public function detachSiswaFromMapelAndKelas(Request $request)
  {
    $request->validate([
      'siswa_ids' => 'required|array',
      'siswa_ids.*' => 'exists:siswas,id',
      'mapel_id' => 'required|exists:mapels,id',
      'kelas_id' => 'required|exists:kelas,id',
      'user_id' => 'required|exists:users,id', // guru
    ]);

    try {
      DB::table('guru_siswa_mapel')
        ->whereIn('siswa_id', $request->siswa_ids)
        ->where('mapel_id', $request->mapel_id)
        ->where('kelas_id', $request->kelas_id)
        ->where('guru_id', $request->user_id)
        ->delete();

      return response()->json([
        'success' => true,
        'message' => 'Berhasil menghapus siswa dari mapel dan kelas.',
      ]);
    } catch (\Throwable $th) {
      return response()->json([
        'success' => false,
        'message' => 'Gagal menghapus data siswa: ' . $th->getMessage(),
      ], 500);
    }
  }

  public function updateAndSync(Request $request, string $id)
  {
    $user = User::findOrFail($id);

    $request->validate([
      'kelases' => 'array',
      'mapels' => 'array',
      'kelases.*' => 'exists:kelas,id',
      'mapels.*' => 'exists:mapels,id',
    ]);

    $user->kelas()->sync($request->kelases ?? []);
    $user->mataPelajarans()->sync($request->mapels ?? []);
  }

  public function getDataKelasWithRelation(string $id)
  {
    $kelas = $this->user
      ->with(['kelas']) // eager load
      ->findOrFail($id);
    return $kelas->kelas()->get()->map(function ($kelas) {
      return [
        'label' => $kelas->nama_kelas,
        'value' => $kelas->id
      ];
    });
  }

  public function getDataMapelWithRelation(string $id)
  {
    $mapel = $this->user
      ->with(['mataPelajarans']) // eager load
      ->findOrFail($id);
    return $mapel->mataPelajarans()->get()->map(function ($mapel) {
      return [
        'label' => $mapel->nama_mapel,
        'value' => $mapel->id
      ];
    });
  }

  public function detachMultipleSiswaFromKelasMapel(Request $request)
  {
    $request->validate([
      'user_id' => 'required|exists:users,id',
      'mapel_id' => 'required|exists:mapels,id',
      'siswa_ids' => 'required|array|min:1',
      'siswa_ids.*' => 'exists:siswas,id',
    ]);

    try {
      $deleted = DB::table('guru_siswa_mapel')
        ->where('guru_id', $request->user_id)
        ->where('mapel_id', $request->mapel_id)
        ->whereIn('siswa_id', $request->siswa_ids)
        ->delete();

      return response()->json([
        'success' => true,
        'message' => $deleted > 0
          ? 'Siswa berhasil dihapus dari mapel dan kelas.'
          : 'Tidak ada data yang dihapus.',
      ]);
    } catch (\Throwable $th) {
      throw $th;
    }
  }

  public function attachMultipleSiswaToKelasMapel(Request $request)
  {
    $request->validate([
      'user_id' => 'required|exists:users,id',
      'mapel_id' => 'required|exists:mapels,id',
      'siswa_ids' => 'required|array|min:1',
      'siswa_ids.*' => 'exists:siswas,id',
    ]);

    $now = now();

    // Cek existing agar tidak double insert
    $existing = DB::table('guru_siswa_mapel')
      ->where('guru_id', $request->user_id)
      ->where('mapel_id', $request->mapel_id)
      ->whereIn('siswa_id', $request->siswa_ids)
      ->pluck('siswa_id')
      ->toArray();

    $newInserts = collect($request->siswa_ids)
      ->diff($existing)
      ->map(function ($siswa_id) use ($request, $now) {
        return [
          'guru_id' => $request->user_id,
          'siswa_id' => $siswa_id,
          'mapel_id' => $request->mapel_id,
          'created_at' => $now,
          'updated_at' => $now,
        ];
      })->values()->all();

    if (count($newInserts) > 0) {
      DB::table('guru_siswa_mapel')->insert($newInserts);
    }

    return response()->json([
      'success' => true,
      'message' => count($newInserts) > 0
        ? 'Siswa berhasil ditambahkan.'
        : 'Semua siswa sudah terdaftar sebelumnya.',
    ]);
  }
}
