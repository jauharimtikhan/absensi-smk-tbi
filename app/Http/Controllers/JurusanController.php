<?php

namespace App\Http\Controllers;

use App\Models\Jurusan;
use App\Services\JurusanService;
use Illuminate\Http\Request;

class JurusanController extends BaseController
{

    protected JurusanService $service;

    public function __construct(protected Jurusan $jurusan)
    {
        $this->service = new JurusanService($jurusan);
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return $this->render('jurusan/index', [
            'jurusans' => $this->jurusan->paginate(25)
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        return $this->service->store($request);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        return $this->service->update($id, $request);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        return $this->service->destroy($id);
    }
}
