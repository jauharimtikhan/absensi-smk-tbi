<?php

namespace App\Http\Controllers;

use App\CustomResponseTrait;
use App\Http\Requests\StoreScheduleRequest;
use App\Services\JadwalKBMService;
use Illuminate\Http\Request;

class JadwalKBMController extends BaseController
{
    protected JadwalKBMService $service;

    public function __construct()
    {
        $this->service = new JadwalKBMService();
    }

    public function index(Request $request)
    {
        return $this->render('jadwalKbm/index', $this->service->index($request));
    }

    public function store(StoreScheduleRequest $request)
    {
        return $this->service->store($request);
    }
}
