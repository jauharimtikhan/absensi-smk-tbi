<?php

namespace App\Services;

use App\CustomResponseTrait;
use App\Models\Jurusan;
use Illuminate\Http\Request;

class JurusanService
{
  use CustomResponseTrait;
  public function __construct(protected Jurusan $jurusan)
  {
    //
  }

  public function store(Request $request)
  {
    $request->validate([
      'kode_jurusan' => 'required|unique:jurusans,kode_jurusan',
      'nama_jurusan' => 'required'
    ]);

    try {
      $this->jurusan->create($request->all());
      return $this->redirectWithAlert('jurusan.index', [
        'type' => 'success',
        'message' => "Berhasil membuat data jurusan baru!"
      ]);
    } catch (\Throwable $th) {
      return $this->redirectWithAlert('jurusan.index', [
        'type' => 'error',
        'message' => "Gagal membuat data jurusan baru!"
      ]);
    }
  }

  public function update(string $id, Request $request)
  {
    try {
      $jurusan = $this->jurusan->find($id);
      if (!$jurusan) {
        return $this->redirectWithAlert('jurusan.index', [
          'type' => 'error',
          'message' => "Data jurusan tidak ditemukan!"
        ]);
      }

      $jurusan->update($request->all());
      return $this->redirectWithAlert('jurusan.index', [
        'type' => 'success',
        'message' => "Berhasil update data jurusan!"
      ]);
    } catch (\Throwable $th) {
      return $this->redirectWithAlert('jurusan.index', [
        'type' => 'error',
        'message' => "Gagal update data jurusan!"
      ]);
    }
  }
  public function destroy($id)
  {
    try {
      $jurusan = $this->jurusan->find($id);
      if (!$jurusan) {
        return $this->redirectWithAlert('jurusan.index', [
          'type' => 'error',
          'message' => "Data jurusan tidak ditemukan!"
        ]);
      }

      $jurusan->delete();
      return $this->redirectWithAlert('jurusan.index', [
        'type' => 'success',
        'message' => "Berhasil menghapus data jurusan!"
      ]);
    } catch (\Throwable $th) {
      return $this->redirectWithAlert('jurusan.index', [
        'type' => 'error',
        'message' => "Gagal menghapus data jurusan!"
      ]);
    }
  }
}
