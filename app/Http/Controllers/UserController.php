<?php

namespace App\Http\Controllers;

use App\Services\UserService;
use Illuminate\Http\Request;

class UserController extends BaseController
{

    protected UserService $service;
    public function __construct()
    {
        $this->service = new UserService();
    }
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return $this->render('pengguna/index', [
            'users' => $this->service->search($request),

        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return $this->render('pengguna/create', [
            'kelases' => $this->service->getDataKelas(),
            'mapels' => $this->service->getDataMapel()
        ]);
    }

    public function manageKelasMapel(string $id)
    {
        return $this->render('pengguna/newManage', [
            'kelases' => $this->service->getDataKelasWithRelation($id),
            'mapels' => $this->service->getDataMapelWithRelation($id),
            'guru_id' => $id
        ]);
    }

    public function getDetailGuru($id, Request $request)
    {
        $mapelId = $request->input('mapel_id');
        $data = $this->service->getDetailGuru($id, $mapelId);
        return response()->json([
            'success' => true,
            'data' => $data
        ], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        return $this->service->store($request);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return $this->render('pengguna/update', [
            'kelases' => $this->service->getDataKelas(),
            'mapels' => $this->service->getDataMapel(),
            'user' => $this->service->getDataUserWithRelation($id)
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        return $this->service->update($request, $id);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    public function attachSiswaFromKelasAndMapel(Request $request)
    {
        return $this->service->attachMultipleSiswaToKelasMapel($request);
    }

    public function detachSiswaFromKelasAndMapel(Request $request)
    {
        return $this->service->detachMultipleSiswaFromKelasMapel($request);
    }
}
