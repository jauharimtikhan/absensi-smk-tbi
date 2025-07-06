<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class AuthMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next,  $roles): Response
    {

        // JoeSupport::index();

        // 1. Cek autentikasi terlebih dahulu
        if (!$request->user()) {
            return redirect()->route('login');
        }

        $userRole = $request->user()->role;
        // 3. Tambahkan pengecekan super admin (opsional)
        if ($userRole === 'super-admin') {
            return $next($request);
        }

        // 4. Perbaiki logika pengecekan role
        if (!$request->user()->hasRole($roles)) {
            // 6. Redirect ke halaman yang lebih aman
            return redirect()->route('home.index')->with('alert', [
                'type' => 'error',
                'message' => 'Anda tidak memiliki akses untuk halaman ini!'
            ]);
        }


        return $next($request);
    }
}
