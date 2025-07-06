<?php

namespace App\Http\Controllers;

use App\Http\Requests\KelasRequest;
use App\Models\Kelas;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KelasController extends Controller
{
    public function __construct(protected Kelas $kelas)
    {
        //
    }
    public function index()
    {
        $kelases = $this->kelas->paginate(25);
        return Inertia::render('kelas/index', [
            'kelases' => $kelases
        ]);
    }

    public function store(KelasRequest $request)
    {
        try {
            $this->kelas->create($request->all());
            return $this->redirectWithAlert('kelas.index', [
                'type' => 'success',
                'message' => 'Berhasil menambahkan kelas baru!'
            ]);
        } catch (\Throwable $th) {
            throw $th;
        }
    }

    public function update(string $id, KelasRequest $request)
    {

        try {
            $kelas = $this->kelas->find($id);
            $kelas->update($request->all());
            return $this->redirectWithAlert('kelas.index', [
                'type' => 'success',
                'message' => 'Berhasil update data kelas baru!'
            ]);
        } catch (\Throwable $th) {
            throw $th;
        }
    }

    public function destroy(string $id)
    {
        try {
            $kelas = $this->kelas->find($id);

            if (!$kelas) {
                return $this->redirectWithAlert('kelas.index', [
                    'type' => 'error',
                    'message' => 'Data kelas tidak ditemukan!'
                ]);
            }
            $kelas->delete();
            return $this->redirectWithAlert('kelas.index', [
                'type' => 'success',
                'message' => 'Berhasil menghapus kelas!'
            ]);
        } catch (\Throwable $th) {
            throw $th;
        }
    }
}
