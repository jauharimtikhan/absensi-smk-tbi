<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;

abstract class Controller
{
    public function alert(array $config)
    {
        session()->flash('alert', $config);
    }

    public function redirectWithAlert(string $path, array $config)
    {
        return to_route($path)->with('alert', $config);
    }

    public  function generateNIS(): string
    {
        $prefix = date('ym'); // YYMM format, misalnya 2506
        do {
            $random = str_pad(rand(0, 9999), 4, '0', STR_PAD_LEFT); // 4 digit angka
            $nis = $prefix . $random;
            $exists = DB::table('siswas')->where('nis', $nis)->exists();
        } while ($exists);

        return $nis;
    }
}
