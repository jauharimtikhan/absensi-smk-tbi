<?php

namespace App;

trait CustomResponseTrait
{
    public function alert(array $config)
    {
        session()->flash('alert', $config);
    }

    public function redirectWithAlert(string $path, array $config)
    {
        return to_route($path)->with('alert', $config);
    }
}
