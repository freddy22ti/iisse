<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\TableService;
use App\Services\DataService;
use Inertia\Inertia;

class VisualisasiController extends Controller
{
    protected $dataService;
    protected $tableService;

    public function __construct(TableService $tableService, DataService $dataService)
    {
        $this->dataService = $dataService;
        $this->tableService = $tableService;
    }

    public function index(Request $request, $tableName = "demografi")
    {
        // Get query parameters for year and territory
        $year = $request->query('year') ?? "";
        $territory = $request->query('territory') ?? "";

        $data = [];
        $error = [];
        $tableMappings = [
            'demografi' => ['demografi', 'warga', 'wilayah', 'cuaca'],
            'pm25' => ['pm25 kecamatan'],
            'ekonomi' => ['ekonomi'],
            'kesehatan' => [
                'awareness',
                'kesehatan',
                'kasus penyakit',
                'fasilitas kesehatan',
                'sarana pelayanan kesehatan'
            ],
            'sosial' => ['sosial']
        ];

        if (!array_key_exists($tableName, $tableMappings)) {
            abort(404);
        }

        // Fetch data for the specified table
        foreach ($tableMappings[$tableName] as $table) {
            $result = $this->dataService->fetchTableData(
                $table,
                $year,
                $territory
            );
            if ($result['error']) {
                $error[] = $result['error'];
            }
            $data[$table] = $result;
        }

        return Inertia::render('Visualisasi', [
            'data' => $data,
            'error' => $error,
        ]);
    }

}
