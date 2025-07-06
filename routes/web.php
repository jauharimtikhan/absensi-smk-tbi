<?php

use App\Http\Controllers\{
    JadwalKBMController,
    UserController,
    SiswaController,
    MapelController,
    LaporanController,
    KelasController,
    JurusanController,
    HomeController,
    AuthController,
    AbsensiController
};
use App\Http\Controllers\PelanggaranController;
use App\Http\Controllers\PrestasiController;
use App\Http\Middleware\AuthMiddleware;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;

Route::middleware('guest')->group(function () {
    Route::controller(AuthController::class)
        ->group(function () {
            Route::get('/', 'login')->name('login');
            Route::post('/login', 'loginProcess')->name('login.post');
        });
});


Route::middleware('auth')->group(function () {
    Route::delete('/logout', [AuthController::class, 'logout'])->name('logout')->middleware('auth');
    Route::controller(HomeController::class)
        ->as('home.')
        ->prefix('/beranda')
        ->middleware(['role:guru|super-admin|bk'])
        ->group(function () {
            Route::get('/', 'index')->name('index');
        });

    Route::controller(MapelController::class)
        ->as('mapel.')
        ->middleware('role:super-admin')
        ->prefix('/mapel')
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::post('/', 'store')->name('store');
            Route::put('/{id}', 'update')->name('update');
            Route::delete('/{id}', 'destroy')->name('destroy');
        });

    Route::controller(KelasController::class)
        ->as('kelas.')
        ->middleware('role:super-admin')
        ->prefix('/kelas')
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::post('/', 'store')->name('store');
            Route::put('/update/{id}', 'update')->name('update');
            Route::delete('/delete/{id}', 'destroy')->name('destroy');
        });

    Route::controller(JurusanController::class)
        ->as('jurusan.')
        ->prefix('/jurusan')
        ->middleware('role:super-admin')
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::post('/', 'store')->name('store');
            Route::put('/update/{id}', 'update')->name('update');
            Route::delete('/delete/{id}', 'destroy')->name('destroy');
        });

    Route::controller(UserController::class)
        ->as('user.')
        ->prefix('/pengguna')
        ->middleware('role:super-admin')
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('/create', 'create')->name('create');
            Route::get('/show/{id}', 'show')->name('show');
            Route::get('/kelola-kelas-mapel/{id}', 'manageKelasMapel')
                ->name('manage.kelas.mapel');
            Route::get('/cari/detail/guru/{id}', 'getDetailGuru')
                ->name('get.detailguru');
            Route::post('/', 'store')->name('store');
            Route::post('/attach', 'attachSiswaFromKelasAndMapel')
                ->name('siswa.attach');
            Route::post('/detach', 'detachSiswaFromKelasAndMapel')
                ->name('siswa.detach');
            Route::put('/update/{id}', 'update')->name('update');
            Route::delete('/delete/{id}', 'destroy')->name('destroy');
        });

    Route::controller(SiswaController::class)
        ->as('siswa.')
        ->prefix('/siswa')
        ->middleware('role:super-admin|bk')
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('/create', 'create')->name('create');
            Route::get('/edit/{id}', 'edit')->name('edit');
            Route::get('/generate-nis-random', 'generateRandomNis')
                ->name('generate.nis');
            Route::post('/create/store', 'store')->name('store');
            Route::post('/import-data-excel', 'import')->name('import');
            Route::post('/restore-bulk', 'restoreBulk')->name('restore-bulk');
            Route::put('/update/{id}', 'update')->name('update');
            Route::delete('/delete/{id}', 'destroy')->name('destroy');
            Route::delete('/delete/{id}/force', 'forceDestroy')
                ->name('force.destroy');
        });


    Route::controller(AbsensiController::class)
        ->as('absensi.')
        ->prefix('/absensi')
        ->middleware(['role:guru|super-admin|bk'])
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('/search-siswa', 'getSiswa')->name('search.siswa');
            Route::get('/search-siswa/raw', 'getSiswaRaw')->name('search.siswa.raw');
            Route::post('/', 'store')->name('store');
            Route::post('/attach-siswa', 'attachSiswa')->name('attachSiswa');
            Route::put('/update/absen', 'update')->name('update');
            Route::delete('/delete/{id}', 'destroy')->name('destroy');
        });

    Route::controller(LaporanController::class)
        ->as('laporan.')
        ->prefix('/laporan')
        ->middleware("role:super-admin|guru|bk")
        ->group(function () {
            Route::get('/semester', 'semester')->name('semester');
            Route::get('/mingguan', 'mingguan')->name('mingguan');
            Route::get('/bulanan', 'bulanan')->name('bulanan');
            Route::get('/search-data-absensi/semeter', 'searchSemester')
                ->name('search.semester');
            Route::get('/search-data-absensi/mingguan', 'searchMingguan')
                ->name('search.mingguan');
            Route::get('/search-data-absensi/bulanan', 'searchBulanan')
                ->name('search.bulanan');
            Route::get('/search-data-exported-excel-absensi/semester', 'queryExportExcelSemester')
                ->name('export.semester.all');
            Route::get('/search-data-exported-excel-absensi/harian', 'queryExportMingguan')
                ->name('export.mingguan.all');
            Route::get('/search-data-exported-excel-absensi/bulanan', 'queryExportBulanan')
                ->name('export.bulanan.all');
        });

    Route::controller(JadwalKBMController::class)
        ->prefix('jadwal-kbm')
        ->as('jadwalkbm.')
        ->middleware('role:super-admin|bk')
        ->group(function () {
            Route::get('/',  'index')->name('index');
            Route::get('/filter-options',  'filterOptions')->name('filter');
            Route::post('/',  'store')->name('store');
            Route::get('/{jadwalkbm}',  'show')->name('show');
            Route::put('/{jadwalkbm}',  'update')->name('update');
            Route::delete('/{jadwalkbm}',  'destroy')->name('destroy');
        });

    Route::controller(PrestasiController::class)
        ->as('prestasi.')
        ->prefix('prestasi')
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::post('/', 'store')->name('store');
            Route::put('/{id}', 'update')->name('update');
            Route::delete('/{id}', 'destroy')->name('destroy');
        });

    Route::controller(PelanggaranController::class)
        ->as('pelanggaran.')
        ->prefix('pelanggaran')
        ->group(function () {
            Route::get('/', 'index')->name('index');
            Route::post('/', 'store')->name('store');
            Route::put('/{id}', 'update')->name('update');
            Route::delete('/{id}', 'destroy')->name('destroy');
        });


    Route::get('/download/template-format-data-siswa', function () {
        return response()->download(public_path('storage/template_excel/template-format-data-siswa.xlsx'));
    })->name('download.excel.format');
});


Route::get('_generate_token', function () {
    $randomToken = Str::random(12);
    return response()->json([
        'token' => $randomToken
    ]);
});
