<?php

namespace App\Services;

use App\CustomResponseTrait;
use App\Models\Pelanggaran;
use App\Models\Siswa;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PelanggaranService
{

    use CustomResponseTrait;
    protected Pelanggaran $pelanggaran;
    protected Siswa $siswa;
    protected User $user;
    public function __construct()
    {
        $this->pelanggaran = new Pelanggaran();
        $this->siswa = new Siswa();
        $this->user = new User();
    }

    public function getpelanggaran()
    {
        return $this->pelanggaran->with(['user', 'siswa'])->paginate(50);
    }

    public function getSiswa()
    {
        return  $this->siswa->where('status', 'aktif')->get()->map(function ($siswa) {
            return [
                'label' => $siswa->nama_lengkap,
                'value' => $siswa->id
            ];
        });
    }

    public function getGuru()
    {
        return $this->user->with('profileGuru')->get()->map(function ($guru) {
            return [
                'label' => $guru?->profileGuru->nama_guru ?? $guru->username,
                'value' => $guru->id
            ];
        });
    }

    public function store(Request $request)
    {
        $request->validate([
            'siswa_id' => 'required|exists:siswas,id',
            'keterangan_pelanggaran' => "required",
            'tindakan_pelanggaran' => "required",
            'tanggal' => "required|date",
        ]);

        try {
            $this->pelanggaran->create([
                'siswa_id' => $request->siswa_id,
                'guru_id' => Auth::id(),
                'keterangan_pelanggaran' => $request->keterangan_pelanggaran,
                'tindakan_pelanggaran' => $request->tindakan_pelanggaran,
                'tanggal' => $request->tanggal
            ]);

            return $this->redirectWithAlert('pelanggaran.index', [
                'type' => 'success',
                'message' => 'Berhasil membuat data pelanggaran siswa!'
            ]);
        } catch (\Throwable $th) {
            return $this->redirectWithAlert('pelanggaran.index', [
                'type' => 'error',
                'message' => 'Gagal membuat data pelanggaran siswa!'
            ]);
        }
    }

    public function update(Request $request, string $id)
    {
        $pelanggaran = $this->pelanggaran->find($id);

        if (!$pelanggaran) {
            return $this->redirectWithAlert('pelanggaran.index', [
                'type' => 'error',
                'message' => "Data Pelanggaran Tidak Ditemukan!"
            ]);
        }

        try {
            $pelanggaran->update([
                'siswa_id' => $request->siswa_id,
                'guru_id' => Auth::id(),
                'keterangan_pelanggaran' => $request->keterangan_pelanggaran,
                'tindakan_pelanggaran' => $request->tindakan_pelanggaran,
                'tanggal' => $request->tanggal
            ]);

            return $this->redirectWithAlert('pelanggaran.index', [
                'type' => 'success',
                'message' => 'Berhasil mengupdate data pelanggaran siswa!'
            ]);
        } catch (\Throwable $th) {
            return $this->redirectWithAlert('pelanggaran.index', [
                'type' => 'error',
                'message' => 'Gagal mengupdate data pelanggaran siswa!'
            ]);
        }
    }

    public function destroy(string $id)
    {
        $pelanggaran = $this->pelanggaran->find($id);

        if (!$pelanggaran) {
            return $this->redirectWithAlert('pelanggaran.index', [
                'type' => 'error',
                'message' => "Data Pelanggaran Tidak Ditemukan!"
            ]);
        }

        try {
            $pelanggaran->delete();

            return $this->redirectWithAlert('pelanggaran.index', [
                'type' => 'success',
                'message' => 'Berhasil menghapus data pelanggaran siswa!'
            ]);
        } catch (\Throwable $th) {
            return $this->redirectWithAlert('pelanggaran.index', [
                'type' => 'error',
                'message' => 'Gagal menghapus data pelanggaran siswa!'
            ]);
        }
    }
}
