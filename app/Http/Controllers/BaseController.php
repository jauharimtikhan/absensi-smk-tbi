<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

abstract class BaseController extends Controller
{
  protected function render(string $component, array $props = []): Response
  {
    return Inertia::render($component, $props);
  }
}
