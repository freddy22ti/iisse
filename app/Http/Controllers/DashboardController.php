<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\DataService;
use App\Services\TableService;
use Inertia\Inertia;

class DashboardController extends Controller
{
    protected $dataService;
    protected $tableService;

    public function __construct(TableService $tableService, DataService $dataService)
    {
        $this->tableService = $tableService;
        $this->dataService = $dataService;
    }

    /**
     * Fetches all necessary data and handles errors.
     *
     * @return array
     */
    private function fetchData()
    {
        $data = [
            'pm25' => $this->dataService->fetchTableData('pm25 kecamatan', '', ''),
            'ekonomi' => $this->dataService->fetchTableData('ekonomi', '', ''),
            'kasus_penyakit' => $this->dataService->fetchTableData('kasus penyakit', '', ''),
            'sosial' => $this->dataService->fetchTableData('sosial', '', ''),
            'warga' => $this->dataService->fetchTableData('warga', '', ''),
            'demografi' => $this->dataService->fetchTableData('demografi', '', ''),
        ];

        // Collect errors
        $data['error'] = collect($data)
            ->filter(fn($item) => isset ($item['error']))
            ->pluck('error')
            ->all();

        return $data;
    }

    /**
     * Fetches list of years and territories.
     *
     * @return array
     */
    private function fetchYearAndTerritories()
    {
        $wilayahTable = $this->tableService->getModel('sosial')->getTable();

        return [
            'listYears' => $this->dataService->getListYears($wilayahTable),
            'listTerritories' => $this->dataService->getListTerritories($wilayahTable),
        ];
    }

    /**
     * Shared logic for guest and admin dashboard.
     *
     * @param string $view
     * @return \Inertia\Response
     */
    private function renderDashboard($view)
    {
        $data = $this->fetchData();
        $yearAndTerritories = $this->fetchYearAndTerritories();

        return Inertia::render($view, [
            'listYears' => $yearAndTerritories['listYears'],
            'listTerritories' => $yearAndTerritories['listTerritories'],
            'ekonomiData' => $data['ekonomi'],
            'penyakitData' => $data['kasus_penyakit'],
            'pm25Data' => $data['pm25'],
            'sosialData' => $data['sosial'],
            'wargaData' => $data['warga'],
            'demografiData' => $data['demografi'],
            'errors' => $data['error'], // Include errors if needed
        ]);
    }

    /**
     * Renders the guest dashboard.
     *
     * @return \Inertia\Response
     */
    public function guest()
    {
        return $this->renderDashboard('Home');
    }

    /**
     * Renders the admin dashboard.
     *
     * @return \Inertia\Response
     */
    public function admin()
    {
        return $this->renderDashboard('Dashboard');
    }
}
