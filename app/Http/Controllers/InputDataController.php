<?php

namespace App\Http\Controllers;

use App\Services\DataService;
use Illuminate\Http\Request;
use App\Services\TableService;
use App\Services\CsvService;
use Inertia\Inertia;


class InputDataController extends Controller
{
    protected $tableService;
    protected $csvService;
    protected $dataService;

    public function __construct(TableService $tableService, CsvService $csvService, DataService $dataService)
    {
        $this->tableService = $tableService;
        $this->csvService = $csvService;
        $this->dataService = $dataService;
    }

    public function index($tableName = 'demografi')
    {
        $model = $this->tableService->getModel($tableName);

        if (!$model) {
            abort(404, "Tabel tidak ditemukan.");
        }

        $columns = $this->tableService->getListColumns($tableName);
        if (isset($columns['error'])) {
            return Inertia::render('InputData', [
                'data' => [],
                'tableColumns' => [],
                'listTables' => $this->tableService->listTables(),
                'listYears' => [],
                'listTerritories' => [],
                'error' => $columns['error'],
            ]);
        }

        return Inertia::render('InputData', [
            'data' => $model::all(),
            'tableColumns' => $columns,
            'listTables' => $this->tableService->listTables(),
            'listYears' => $this->dataService->getListYears($model->getTable()),
            'listTerritories' => $this->dataService->getListTerritories($model->getTable()),
            'error' => null,
        ]);
    }

    public function uploadCSV(Request $request)
    {
        $request->validate([
            'table_name' => 'required|string',
            'file' => 'required|file|mimes:csv,txt|max:2048',
        ]);

        try {
            $result = [];
            if($request->input('table_name') === 'pm25 kecamatan') {
                $result = $this->csvService->importSummaryPM25($request->file('file'));
            } else {
                $result = $this->csvService->import($request->input('table_name'), $request->file('file'));
            }

            if (isset($result['error'])) {
                return response()->json(['message' => $result['error']], 400);
            }
            return response()->json(['message' => 'Data CSV berhasil diunggah'], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function uploadTemplateCSV(Request $request)
    {
        $request->validate([
            'table_name' => 'required|string',
            'file' => 'required|file|mimes:csv,txt|max:2048',
        ]);

        try {
            $this->csvService->uploadTemplate($request->input('table_name'), $request->file('file'));
            return response()->json(['message' => 'Template CSV berhasil diunggah'], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    public function addColumns(Request $request)
    {
        $validatedData = $request->validate([
            'table_name' => 'required|string',
            'columns' => 'required|array',
            'columns.*.name' => 'required|string',
            'columns.*.type' => 'required|string|in:string,integer',
        ]);

        try {
            $result = $this->tableService->addColumns($validatedData['table_name'], $validatedData['columns']);

            if (isset($result['error'])) {
                return response()->json(['message' => $result['error']], 400);
            }

            return response()->json(['message' => $result['success']], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
}
