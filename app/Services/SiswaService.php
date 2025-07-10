<?php

namespace App\Services;

use App\Imports\SiswaImport;
use App\Models\Siswa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Facades\Excel;

class SiswaService
{
  public function __construct(protected Siswa $siswa)
  {
    //
  }
  public function search(Request $request)
  {
    $query = $this->siswa->newQuery();

    // Handle soft delete filters
    $trashed = $request->input('trashed');

    if ($trashed === 'with') {
      $query->withTrashed();
    } elseif ($trashed === 'only') {
      $query->onlyTrashed();
    }
    // 'trashed' === null atau 'without' => default (hanya data aktif)

    $filterableFields = [
      'nis',
      'nama_siswa',
      'status',
      'jurusan',
      'kelas',
    ];

    $type = $request->input('type');
    $value = $request->input('q');

    if ($type && $value && in_array($type, $filterableFields)) {
      if ($type === 'nama_siswa') {
        $query->where('nama_lengkap', 'like', '%' . $value . '%');
      } else {
        $query->where($type, $value);
      }
    }

    return $query->orderBy('created_at', 'desc')->paginate(25);
  }

  public function restoreBulk(Request $request)
  {
    $ids = $request->input('ids', []);
    $this->siswa->withTrashed()->whereIn('id', $ids)->restore();

    return redirect()->route('siswa.index')->with('alert', [
      'type' => 'success',
      'message' => count($ids) . ' data siswa berhasil direstore.',
    ]);
  }


  public function find(string $id)
  {
    $siswa = $this->siswa->find($id);
    if (!$siswa) {
      return null;
    } else {
      return $siswa;
    }
  }

  public function import(Request $request)
  {
    $request->validate([
      'file' => 'required|file|mimes:xlsx,xls,csv',
    ]);
    try {
      Excel::import(new SiswaImport, $request->file('file'));
      return true;
    } catch (\Exception $th) {
      Log::info('LOGGING UPLOAD DATA SISWA', [
        'message' => $th->getMessage()
      ]);
      return false;
    }
  }

  public function store(Request $request)
  {
    try {
      $this->siswa->create($request->all());

      return to_route('siswa.create')->with('alert', [
        'type' => 'success',
        'message' => 'Berhasil menambahkan data siswa baru!'
      ]);
    } catch (\Throwable $th) {
      return to_route('siswa.create')->with('alert', [
        'type' => 'error',
        'message' => $th->getMessage()
      ]);
    }
  }

  public function update(string $id, Request $request)
  {
    $siswa = $this->siswa->find($id);
    if (!$siswa) {
      return to_route('siswa.index')->with('alert', [
        'type' => 'error',
        'message' => 'Data siswa tidak ditemukan!'
      ]);
    }
    $siswa->nama_lengkap = $request->nama_lengkap;
    $siswa->nis = $request->nis;
    $siswa->jenis_kelamin = $request->jenis_kelamin;
    $siswa->kelas = $request->kelas;
    $siswa->status = $request->status;
    $siswa->jurusan = $request->jurusan;
    $siswa->save();

    return to_route('siswa.edit', $id)->with('alert', [
      'type' => 'success',
      'message' => 'Berhasil mengupdate data siswa!'
    ]);
  }

  public function destroy(string $id)
  {
    try {
      $siswa = $this->siswa->withoutTrashed()->find($id);

      if (!$siswa) {
        return to_route('siswa.index')->with('alert', [
          'type' => 'error',
          'message' => "Data siswa tidak ditemukan!"
        ]);
      }
      $siswa->delete();
      return to_route('siswa.index')->with('alert', [
        'type' => 'success',
        'message' => "Data berhasil di pindahkan ke sampah!"
      ]);
    } catch (\Throwable $th) {
      //throw $th;
    }
  }

  public function forceDestroy(string $id)
  {
    try {
      $siswa = $this->siswa->onlyTrashed()->find($id);

      if (!$siswa) {
        return to_route('siswa.index')->with('alert', [
          'type' => 'error',
          'message' => "Data siswa tidak ditemukan!"
        ]);
      }
      $siswa->forceDelete();
      return to_route('siswa.index')->with('alert', [
        'type' => 'success',
        'message' => "Data siswa berhasil di hapus permanen!"
      ]);
    } catch (\Throwable $th) {
      //throw $th;
    }
  }
}
