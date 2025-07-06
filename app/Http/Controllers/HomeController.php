<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\DashboardService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class HomeController extends BaseController
{

    protected DashboardService $service;

    public function __construct()
    {
        $this->service = new DashboardService();
    }
    public function index()
    {
        $role = Auth::user()->role;
        if ($role === "super-admin") {
            return $this->render(
                'dashboards/AdminPage',
                $this->service->dashboardStats()
            );
        }
        if ($role === "guru") {
            return $this->render('dashboards/GuruPage', $this->service->guruData());
        }
        if ($role === "bk") {
            return $this->render(
                'dashboards/AdminPage',
                $this->service->dashboardStats()
            );
        }
    }
}
