<?php

namespace App\Http\Controllers;

use App\Services\PelanggaranService;
use Illuminate\Http\Request;

class PelanggaranController extends BaseController
{
    protected PelanggaranService $service;

    public function __construct()
    {
        $this->service = new PelanggaranService();
    }

    public function index(Request $request)
    {
        return $this->render('pelanggaran/index', [
            'siswas' => $this->service->getSiswa(),
            'pelanggarans' => $this->service->getPelanggaran()
        ]);
    }

    public function store(Request $request)
    {
        return $this->service->store($request);
    }

    public function update(Request $request, string $id)
    {
        return $this->service->update($request, $id);
    }

    public function destroy(string $id)
    {
        return $this->service->destroy($id);
    }
}
