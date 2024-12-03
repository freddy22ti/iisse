<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Demografi;
use App\Services\DataService;
use App\Services\TableService;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KorelasiController extends Controller
{
    protected $tableService;
    protected $dataService;

    public function __construct(TableService $tableService, DataService $dataService)
    {
        $this->tableService = $tableService;
        $this->dataService = $dataService;
    }

    public function index(Request $request)
    {
        $table1 = $request->query('table1');
        $table2 = $request->query('table2');
        $year = $request->query('year');
        $territory = $request->query('territory');
        $correlationMatrix = null;

        try {
            // Validasi input awal
            if ($table1 && $table2) {
                // Ambil model berdasarkan tabel
                [$model1, $model2] = $this->getModels($table1, $table2);

                if (!$model1 || !$model2) {
                    throw new \Exception('Tabel yang dipilih tidak ditemukan.');
                }

                // Ambil kolom numerik
                [$numericColumns1, $numericColumns2] = $this->getNumericColumnsForModels($table1, $table2);

                if (empty($numericColumns1) || empty($numericColumns2)) {
                    throw new \Exception('Tidak ada kolom numerik untuk tabel yang dipilih.');
                }

                // Ambil data gabungan
                $data = $this->getJoinedData(
                    $model1,
                    $model2,
                    $year,
                    $territory,
                    $numericColumns1,
                    $numericColumns2
                );

                // dd($data);   

                // Hitung korelasi
                if ($data->isNotEmpty()) {
                    $correlationMatrix = $this->calculateCorrelation($data, $numericColumns1, $numericColumns2);
                } else {
                    throw new \Exception('Tidak ada data yang sesuai dengan kriteria yang dipilih.');
                }
            }
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }

        return Inertia::render('Korelasi', [
            'listTables' => $this->tableService->listTables(),
            'listYears' => $this->getCachedYears(),
            'listTerritories' => $this->getCachedTerritories(),
            'data' => $correlationMatrix,
        ]);
    }

    private function getModels($table1, $table2)
    {
        $model1 = $this->tableService->getModel($table1);
        $model2 = $this->tableService->getModel($table2);

        return [$model1, $model2];
    }

    private function getNumericColumnsForModels($table1, $table2)
    {
        $numericColumns1 = $this->getNumericColumns($table1);
        $numericColumns2 = $this->getNumericColumns($table2);

        return [$numericColumns1, $numericColumns2];
    }

    private function getNumericColumns($table)
    {
        $model = $this->tableService->getModel($table);
        $columns = $this->tableService->getListColumns(tableName: $table);
        $dbTableName = $model->getTable();

        return array_filter($columns, function ($column) use ($dbTableName) {
            $type = DB::selectOne("SHOW COLUMNS FROM `$dbTableName` WHERE Field = ?", [$column])->Type ?? null;
            return $type && preg_match('/int|double|float|decimal|numeric|bigint|smallint/i', $type);
        });
    }


    private function getJoinedData($model1, $model2, $year, $territory, $numericColumns1, $numericColumns2)
    {
        $query = $model1::query();

        // Tentukan nama kolom tahun berdasarkan keberadaan timestamp
        $yearColumn1 = $this->dataService->isTableWithTimestamp($model1->getTable()) ? 'waktu' : 'tahun';
        $yearColumn2 = $this->dataService->isTableWithTimestamp($model2->getTable()) ? 'waktu' : 'tahun';

        // Join tabel
        $query->join(
            $model2->getTable(),
            function ($join) use ($model1, $model2, $yearColumn1, $yearColumn2) {
                $join->on($model1->getTable() . '.kecamatan', '=', $model2->getTable() . '.kecamatan')
                    ->on($model1->getTable() . '.' . $yearColumn1, '=', $model2->getTable() . '.' . $yearColumn2);
            }
        );

        // Tambahkan filter berdasarkan tahun dan wilayah jika tersedia
        if (!empty($year)) {
            $query->where($model1->getTable() . '.' . $yearColumn1, $year);
        }

        if (!empty($territory)) {
            $query->where($model1->getTable() . '.kecamatan', $territory);
        }

        // Pilih kolom numerik yang diperlukan dari kedua model
        $selectColumns = array_merge(
            array_map(fn($col) => $model1->getTable() . '.' . $col, $numericColumns1),
            array_map(fn($col) => $model2->getTable() . '.' . $col, $numericColumns2)
        );

        // Pastikan setidaknya ada kolom yang dipilih
        if (empty($selectColumns)) {
            throw new \InvalidArgumentException('Kolom yang dipilih tidak boleh kosong.');
        }

        return $query->select($selectColumns)->get();
    }


    private function calculateCorrelation($data, $columns1, $columns2)
    {
        if ($data->isEmpty()) {
            return [];
        }

        $values = [];
        foreach ($data as $row) {
            $entry = [];
            foreach ($columns1 as $column) {
                $entry[$column] = $row->$column ?? 0;
            }
            foreach ($columns2 as $column) {
                $entry[$column] = $row->$column ?? 0;
            }
            $values[] = $entry;
        }

        $correlation = [];
        foreach ($columns1 as $col1) {
            foreach ($columns2 as $col2) {
                $correlationValue = $this->calculatePearsonCorrelation(
                    array_column($values, $col1),
                    array_column($values, $col2)
                );
                // Periksa dan tangani nilai Inf atau NaN
                $correlationValue = is_finite($correlationValue) ? $correlationValue : 0;

                $correlation["$col1 vs $col2"] = $correlationValue;
            }
        }

        return $correlation;
    }

    private function calculatePearsonCorrelation($x, $y)
    {
        $n = count($x);
        $sum_x = array_sum($x);
        $sum_y = array_sum($y);
        $sum_x_squared = array_sum(array_map(fn($val) => $val ** 2, $x));
        $sum_y_squared = array_sum(array_map(fn($val) => $val ** 2, $y));
        $sum_xy = array_sum(array_map(fn($a, $b) => $a * $b, $x, $y));

        $numerator = $n * $sum_xy - $sum_x * $sum_y;
        $denominator = sqrt(($n * $sum_x_squared - $sum_x ** 2) * ($n * $sum_y_squared - $sum_y ** 2));

        return $denominator != 0 ? $numerator / $denominator : 0;
    }

    private function getCachedYears()
    {
        return cache()->remember('listYears', now()->addHours(1), function () {
            return $this->dataService->getListYears((new Demografi)->getTable());
        });
    }

    private function getCachedTerritories()
    {
        return cache()->remember('listTerritories', now()->addHours(1), function () {
            return $this->dataService->getListTerritories((new Demografi)->getTable());
        });
    }
}
