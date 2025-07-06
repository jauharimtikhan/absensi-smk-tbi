<?php

namespace App\Http\Controllers;

use App\Services\LaporanService;
use Illuminate\Http\Request;

class LaporanController extends BaseController
{

    protected LaporanService $service;

    public function __construct()
    {
        $this->service = new LaporanService();
    }

    public function semester()
    {
        return $this->render('laporan/semester', [
            'kelases' => $this->service->getKelas(),
            'semesters' => $this->service->getSemesterOptions()
        ]);
    }

    public function mingguan()
    {
        return $this->render('laporan/mingguan', [
            'kelases' => $this->service->getKelas()
        ]);
    }

    public function bulanan()
    {
        return $this->render('laporan/bulanan', [
            'kelases' => $this->service->getKelas()
        ]);
    }

    public function searchSemester(Request $request)
    {
        return $this->service->searchDataBySemester($request);
    }

    public function searchMingguan(Request $request)
    {
        return $this->service->searchDataByWeek($request);
    }

    public function searchBulanan(Request $request)
    {
        return $this->service->searchDataByMonth($request);
    }

    public function queryExportExcelSemester(Request $request)
    {
        return $this->service->getExportedDataExcelSmt($request);
    }

    public function queryExportMingguan(Request $request)
    {
        return $this->service->getExportedDataWeek($request);
    }

    public function queryExportBulanan(Request $request)
    {
        return $this->service->getExportedDataMonth($request);
    }
    public function rest(Request $request)
    {
        return $this->service->getExportedDataMonth($request);
    }
}
