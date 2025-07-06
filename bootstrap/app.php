<?php

use App\Http\Middleware\ApiTokenMiddleware;
use App\Http\Middleware\AuthMiddleware;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Jauhar\Support\Facades\JoeSupport as FacadesJoeSupport;
use Jauhar\Support\JoeSupport;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [
            HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);
        $middleware->trustProxies('*');
        $middleware->validateCsrfTokens(['*']);
        $middleware->redirectGuestsTo('/');
        $middleware->redirectUsersTo('/beranda');
        $middleware->alias([
            'role' => AuthMiddleware::class,
            'api_token_auth' => ApiTokenMiddleware::class
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // 
    })
    ->create();
