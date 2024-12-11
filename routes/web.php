<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use App\Http\Middleware\CheckIsSuperAdmin;

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\VisualisasiController;
use App\Http\Controllers\InputDataController;
use App\Http\Controllers\KorelasiController;
use App\Http\Controllers\PanduanController;
use App\Http\Controllers\UserManagementController;


Route::get('/', [DashboardController::class, 'guest']);


Route::middleware(['auth'])->group(function () {
    Route::get(
        '/dashboard',
        [DashboardController::class, 'admin']
    )->name('dashboard');

    Route::prefix('input-data')->group(function () {
        Route::get(
            '/',
            [InputDataController::class, 'index']
        )->name('input-data');
        Route::get(
            '/{tableName}',
            [InputDataController::class, 'index']
        )->name('input-data.with-table'); // mengambil data berdasarkan nama tabel
        Route::post(
            '/add-data',
            [InputDataController::class, 'uploadCSV']
        )->name('input-data.add-data');
        Route::post(
            '/add-columns',
            [InputDataController::class, 'addColumns']
        )->name('input-data.add-columns');
        Route::post(
            '/add-templates',
            [InputDataController::class, 'uploadTemplateCSV']
        )->name('input-data.upload-template');
    });

    Route::get(
        '/visualisasi',
        [VisualisasiController::class, 'index']
    )->name('visualisasi');
    Route::get(
        '/visualisasi/{tableName}',
        [VisualisasiController::class, 'index']
    )->name('visualisasi.kategori');

    Route::get(
        '/korelasi',
        [KorelasiController::class, 'index']
    )->name('korelasi');
});


Route::middleware(['auth', CheckIsSuperAdmin::class])->group(function () {
    Route::prefix('manage-user')->group(function () {
        Route::get(
            '/',
            [UserManagementController::class, 'index']
        )->name('manage-user.index');
        Route::post(
            '/',
            [UserManagementController::class, 'addUser']
        )->name('manage-user.add');
        Route::delete(
            '/{id}',
            [UserManagementController::class, 'deleteUser']
        )->name('manage-user.delete');
    });
});


Route::middleware('auth')->group(function () {
    // Rute untuk pengelolaan profil
    Route::prefix('profile')->group(function () {
        Route::get('/', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/', [ProfileController::class, 'destroy'])->name('profile.destroy');
    });

    // Rute untuk pengelolaan gambar profil
    Route::prefix('profile-image')->group(function () {
        Route::post('/', [ProfileController::class, 'update_profile_picture'])->name('profile.add-profile-image');
        Route::delete('/', [ProfileController::class, 'delete_profile_picture'])->name('profile.remove-profile-image');
    });
});


require __DIR__ . '/auth.php';
