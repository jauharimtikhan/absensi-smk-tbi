<?php

namespace App\Http\Controllers;

use App\Http\Requests\MapelRequest;
use App\Models\Mapel;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MapelController extends Controller
{
    public function index()
    {
        $mapels = Mapel::paginate(25);
        return Inertia::render('mapel/index', [
            'mapels' => $mapels
        ]);
    }

    public function store(MapelRequest $request)
    {
        try {
            Mapel::create($request->all());
            return $this->redirectWithAlert('mapel.index', [
                'type' => 'success',
                'message' => 'Berhasil menambahkan mata pelajaran baru!'
            ]);
        } catch (\Throwable $th) {
            throw $th;
        }
    }

    public function update(string $id, MapelRequest $request)
    {

        try {
            $mapel = Mapel::find($id);
            $mapel->update($request->all());
            return $this->redirectWithAlert('mapel.index', [
                'type' => 'success',
                'message' => 'Berhasil update mata pelajaran baru!'
            ]);
        } catch (\Throwable $th) {
            throw $th;
        }
    }

    public function destroy(string $id)
    {
        try {
            $mapel = Mapel::find($id);

            if (!$mapel) {
                return $this->redirectWithAlert('mapel.index', [
                    'type' => 'error',
                    'message' => 'Data Mata pelajaran tidak ditemukan!'
                ]);
            }
            $mapel->delete();
            return $this->redirectWithAlert('mapel.index', [
                'type' => 'success',
                'message' => 'Berhasil menghapus mata pelajaran!'
            ]);
        } catch (\Throwable $th) {
            //throw $th;
        }
    }
}
