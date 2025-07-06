<?php

namespace App\Imports;

use App\Models\Siswa;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class SiswaImport implements ToModel, WithHeadingRow
{
    public function model(array $row)
    {
        return new Siswa([
            'nis'           => $row['nis'],
            'nama_lengkap'    => $row['nama_lengkap'],
            'status'       => $row['status'],
            'jenis_kelamin'   => $row['jenis_kelamin'] === "null" ? null : $row['jenis_kelamin'],
            'kelas'         => $row['kelas'],
            'jurusan'        => $row['jurusan']
        ]);
    }
}
