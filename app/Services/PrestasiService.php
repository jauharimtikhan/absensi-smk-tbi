<?php

namespace App\Services;

use App\CustomResponseTrait;
use App\Models\{Siswa, Prestasi};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PrestasiService
{
    use CustomResponseTrait;
    protected Prestasi $prestasi;
    protected Siswa $siswa;
    public function __construct()
    {
        $this->prestasi = new Prestasi();
        $this->siswa = new Siswa();
    }

    public function searchData(Request $request)
    {
        $query = $this->prestasi->with('siswa');

        if ($request->filled('nis_siswa')) {
            $query->whereHas(
                'siswa',
                function ($q) use ($request) {
                    $q->where('nis', $request->nis_siswa);
                }
            );
        }

        if ($request->filled('nama_prestasi')) {
            $query->where('nama', $request->nama_prestasi);
        }
        if ($request->filled('tanggal')) {
            $query->whereDate('tanggal', $request->tanggal);
        }
        return $query->paginate(50);
    }

    public function getSiswaOptions()
    {
        return $this->siswa
            ->where('status', 'aktif')
            ->get()
            ->map(fn($siswa) => [
                'label' => $siswa->nama_lengkap,
                'value' => $siswa->id
            ]);
    }

    public function storeDataPrestasi(Request $request)
    {
        $request->validate([
            'nama_prestasi' => 'required',
            'tingkat' => 'required',
            'keterangan' => 'required',
            'tanggal' => 'required',
            'siswa_id' => 'required|exists:siswas,id',
        ]);

        try {
            $this->prestasi->create([
                'nama' => $request->nama_prestasi,
                'tingkat' => $request->tingkat,
                'keterangan' => $request->keterangan,
                'siswa_id' => $request->siswa_id,
                'tanggal' => $request->tanggal
            ]);

            return $this->redirectWithAlert('prestasi.index', [
                'type' => 'success',
                'message' => 'Berhasil menambahkan data siswa beprestasi!'
            ]);
        } catch (\Throwable $th) {
            Log::info('error add prestasi siswa', [
                'message' => $th->getMessage()
            ]);
            return $this->redirectWithAlert('prestasi.index', [
                'type' => 'error',
                'message' => 'Gagal menambahkan data siswa beprestasi!'
            ]);
            //throw $th;
        }
    }

    public function updateDataPrestasi(Request $request, string $id)
    {
        $request->validate([
            'nama_prestasi' => 'required',
            'tingkat' => 'required',
            'keterangan' => 'required',
            'tanggal' => 'required',
            'siswa_id' => 'required|exists:siswas,id',
        ]);

        try {
            $prestasi = $this->prestasi->find($id);
            $prestasi->update([
                'nama' => $request->nama_prestasi,
                'tingkat' => $request->tingkat,
                'keterangan' => $request->keterangan,
                'siswa_id' => $request->siswa_id,
                'tanggal' => $request->tanggal
            ]);

            return $this->redirectWithAlert('prestasi.index', [
                'type' => 'success',
                'message' => 'Berhasil mengupdate data siswa beprestasi!'
            ]);
        } catch (\Throwable $th) {
            Log::info('error add prestasi siswa', [
                'message' => $th->getMessage()
            ]);
            return $this->redirectWithAlert('prestasi.index', [
                'type' => 'error',
                'message' => 'Gagal mengupdate data siswa beprestasi!'
            ]);
            //throw $th;
        }
    }

    public function destroy(string $id)
    {
        $prestasi = $this->prestasi->find($id);
        if (!$prestasi) {
            return $this->redirectWithAlert('prestasi.index', [
                'type' => 'error',
                'message' => "Data prestasi tidak ditemukan!"
            ]);
        }
        $prestasi->delete();
        return $this->redirectWithAlert('prestasi.index', [
            'type' => 'success',
            'message' => "Berhasil menghapus data prestasi!"
        ]);
    }
}
