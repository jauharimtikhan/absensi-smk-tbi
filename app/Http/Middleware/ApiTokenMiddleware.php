<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class ApiTokenMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->query('token') ?? $request->bearerToken();

        if (!$token || !$user = User::where('api_token', $token)->first()) {
            Log::info('TEST', [
                'user' => User::where('api_token', $token)->first()
            ]);
            return response('Unauthorized', 401);
        }

        Auth::login($user);
        return $next($request);
    }
}
