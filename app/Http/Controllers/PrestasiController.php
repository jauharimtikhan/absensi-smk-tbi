<?php

namespace App\Http\Controllers;

use App\Services\PrestasiService;
use Illuminate\Http\Request;

class PrestasiController extends BaseController
{
    protected PrestasiService $service;

    public function __construct()
    {
        $this->service = new PrestasiService();
    }

    public function index(Request $request)
    {
        return $this->render('prestasi/index', [
            'siswas' => $this->service->getSiswaOptions(),
            'prestasis' => $this->service->searchData($request)
        ]);
    }

    public function store(Request $request)
    {
        return $this->service->storeDataPrestasi($request);
    }

    public function update(Request $request, string $id)
    {
        return $this->service->updateDataPrestasi($request, $id);
    }

    public function destroy(string $id)
    {
        return $this->service->destroy($id);
    }
}
