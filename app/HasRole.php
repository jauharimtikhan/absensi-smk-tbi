<?php

namespace App;

use Illuminate\Support\Facades\Auth;

trait HasRole
{
    public function hasRole(string $role)
    {
        $allowedRoles = explode('|', $role);

        if (!in_array(Auth::user()->role, $allowedRoles)) {
            return false;
        }

        return true;
    }
}
