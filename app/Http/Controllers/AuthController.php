<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class AuthController extends Controller
{
    public function login()
    {
        return Inertia::render('auth/login');
    }

    public function loginProcess(Request $request)
    {
        $request->validate([
            'username' => "required|exists:users,username",
            'password' => "required|min:3"
        ]);
        try {
            $user = User::with('profileGuru')->where('username', $request->username)->first();
            if (!$user) {
                $this->alert([
                    'message' => "Username {$request->username} belum terdaftar",
                    'type' => "error"
                ]);
            }
            if (!Hash::check($request->password, strval($user->password))) {
                $this->alert([
                    'message' => "Password salah!",
                    'type' => "error"
                ]);
            }
            if (!Auth::attempt($request->only(['username', 'password']))) {
                $this->alert([
                    'message' => "Kredensial tidak sah!",
                    'type' => "error"
                ]);
            }
            Auth::login($user);
            return $this->redirectWithAlert('home.index', [
                'message' => "Selamat Datang {$user->username}",
                'type' => "success"
            ]);
        } catch (\Throwable $th) {
            throw $th;
        }
    }

    public function logout()
    {
        Auth::logout();

        return to_route('login')->with('alert', [
            'type' => "success",
            'message' => 'Berhasil logout!'
        ]);
    }
}
