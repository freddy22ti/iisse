<?php

namespace App\Providers;

use App\Services\CsvService;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use App\Services\DataService;
use App\Services\TableService;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Mendaftarkan DataService dan TableService sebagai singleton
        $this->app->singleton(DataService::class, function ($app) {
            return new DataService(
                $app->make(TableService::class) // Dependency injection TableService
            );
        });

        // Mendaftarkan CsvService dan TableService sebagai singleton
        $this->app->singleton(CsvService::class, function ($app) {
            return new CsvService(
                $app->make(TableService::class) // Dependency injection TableService
            );
        });

        // Mendaftarkan TableService sebagai singleton
        $this->app->singleton(TableService::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Inertia::share([
            'appName' => env('APP_NAME'),
        ]);
        Vite::prefetch(concurrency: 3);
    }
}
