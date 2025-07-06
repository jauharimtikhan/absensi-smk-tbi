<?php

namespace App\Http\Controllers;

use App\Models\{Absensi, Kelas, User, Siswa, Mapel};
use App\Services\AbsensiService;
use Illuminate\Http\Request;

class AbsensiController extends BaseController
{

    protected AbsensiService $service;
    public function __construct(
        protected Absensi $absensi,
        protected Mapel $mapel,
        protected Kelas $kelas,
        protected User $user,
        protected Siswa $siswa,
    ) {
        $this->service = new AbsensiService(
            $absensi,
            $mapel,
            $kelas,
            $user,
            $siswa
        );
    }

    public function index()
    {
        return $this->render('absensi/index', [
            'kelases' => $this->service->getKelas(),
            'mapels' => $this->service->getMapel(),
            'users' => $this->service->getGuru(),
            'guruData' => $this->service->getDataGuru()
        ]);
    }

    public function getSiswa(Request $request)
    {
        return $this->service->getSiswaQuery($request);
    }

    public function getSiswaRaw(Request $request)
    {
        return $this->service->getSiswaQueryRaw($request);
    }

    public function store(Request $request)
    {
        return $this->service->store($request);
    }

    public function update(Request $request)
    {
        return $this->service->update($request);
    }

    public function attachSiswa(Request $request)
    {
        return $this->service->attachSiswaToMapel($request);
    }
}
