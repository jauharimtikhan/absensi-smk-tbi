<?php

namespace App\Http\Controllers;

use App\Models\Jurusan;
use App\Models\Kelas;
use App\Models\Siswa;
use App\Services\SiswaService;
use Illuminate\Http\Request;

class SiswaController extends BaseController
{
    protected SiswaService $service;
    public function __construct(protected Siswa $siswa)
    {
        $this->service = new SiswaService($siswa);
    }

    public function index(Request $request)
    {
        return $this->render('siswa/index', [
            'students' => $this->service->search($request),
        ]);
    }
    public function create()
    {
        return $this->render('siswa/create', [
            'kelases' => Kelas::select(['nama_kelas'])
                ->get()
                ->lazy()
                ->map(function ($kelas) {
                    return [
                        'label' => $kelas->nama_kelas,
                        'value' => $kelas->nama_kelas
                    ];
                }),
            'jurusans' => Jurusan::select(['nama_jurusan'])
                ->get()
                ->lazy()
                ->map(function ($kelas) {
                    return [
                        'label' => $kelas->nama_jurusan,
                        'value' => $kelas->nama_jurusan
                    ];
                })
        ]);
    }

    public function edit(string $id)
    {
        return $this->render('siswa/update', [
            'kelases' => Kelas::select(['nama_kelas'])
                ->get()
                ->lazy()
                ->map(function ($kelas) {
                    return [
                        'label' => $kelas->nama_kelas,
                        'value' => $kelas->nama_kelas
                    ];
                }),
            'siswa' => $this->service->find($id) ?? null,
            'jurusans' => Jurusan::select(['nama_jurusan'])
                ->get()
                ->lazy()
                ->map(function ($kelas) {
                    return [
                        'label' => $kelas->nama_jurusan,
                        'value' => $kelas->nama_jurusan
                    ];
                })
        ]);
    }

    public function import(Request $request)
    {
        $import = $this->service->import($request);
        if ($import) {
            return $this->redirectWithAlert('siswa.index', [
                'type' => 'success',
                'message' => "Berhasil mengupload data siswa"
            ]);
        } else {
            return $this->redirectWithAlert('siswa.index', [
                'type' => 'error',
                'message' => "Gagal mengupload data siswa"
            ]);
        }
    }

    public function generateRandomNis()
    {
        return response()->json([
            'success' => true,
            'nis' => $this->generateNIS()
        ], 201);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama_lengkap' => "required",
            'nis' => 'required|unique:siswas,nis',
            'no_wali' => 'nullable',
            'alamat' => 'nullable',
            'kelas' => 'nullable',
        ]);
        return $this->service->store($request);
    }

    public function update(string $id, Request $request)
    {
        $request->validate([
            'nama_lengkap' => "required",
            'no_wali' => 'nullable',
            'alamat' => 'nullable',
            'kelas' => 'nullable',
        ]);
        return $this->service->update($id, $request);
    }
    public function restoreBulk(Request $request)
    {
        return $this->service->restoreBulk($request);
    }

    public function destroy(string $id)
    {
        return $this->service->destroy($id);
    }

    public function forceDestroy(string $id)
    {
        return $this->service->forceDestroy($id);
    }
}
