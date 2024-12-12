<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;

class DataService
{
    protected $tableService;

    private static $tablesWithTimestamp = [
        'kuisioner',
        'p_m25_s',
    ];

    public function __construct(TableService $tableService)
    {
        $this->tableService = $tableService;
    }

    /**
     * Ambil rata-rata PM2.5 per hari dari tabel.
     *
     * @param string $tableName
     * @return \Illuminate\Support\Collection
     */
    public function getPM25AveragePerDay()
    {
        $tableName = $this->tableService->getModel('pm25')->getTable();

        return DB::table($tableName)->select(
            DB::raw('DATE(waktu) as tanggal'),
            DB::raw('AVG(nilai) as "rata_rata_nilai"'),
            'titik'
        )
            ->groupBy(
                DB::raw('DATE(waktu)'),
                'titik'
            )
            ->orderBy(
                DB::raw('DATE(waktu)'),
                'desc'
            )
            ->get();
    }


    public function getPM25AveragePerMonth()
    {
        $tableName = $this->tableService->getModel('pm25')->getTable();
        return DB::table($tableName)->select(
            DB::raw('DATE_FORMAT(waktu, "%Y-%m") as tanggal'), // Format the date as YYYY-MM
            DB::raw('AVG(nilai) as "rata_rata_nilai"'),
            'titik'
        )
            ->groupBy(
                DB::raw('DATE_FORMAT(waktu, "%Y-%m")'), // Group by the formatted date (YYYY-MM)
                'titik'
            )
            ->orderBy(
                DB::raw('DATE_FORMAT(waktu, "%Y-%m")'), // Order by the formatted date
                'desc'
            )
            ->get();
    }


    public function getPM25AveragePerYear()
    {
        $model = $this->tableService->getModel('pm25 kecamatan');
        return $model->all();
    }


    /**
     * Ambil data dari tabel menggunakan DataController.
     *
     * @param string $tableName
     * @param string $year
     * @param string $territory
     * @return array
     */
    public function fetchTableData(string $tableName, string $year, string $territory)
    {
        // Ambil model
        $model = $this->tableService->getModel($tableName);

        if (!$model) {
            return [
                'data' => null,
                'columns' => null,
                'listYears' => null,
                'listTerritories' => null,
                'error' => "Table $tableName does not exist."
            ];
        }

        // Ambil list columns
        $columns = $this->tableService->getListColumns($tableName);
        $dbTableName = $model->getTable();

        // Start building the query
        $query = DB::table($dbTableName)->select($columns);

        // Apply filters based on the table name
        if ($year) {
            $yearColumn = $this->isTableWithTimestamp($dbTableName) ? 'waktu' : 'tahun';
            $query->whereYear($yearColumn, $year);
        }

        // Add territory filter if provided
        if ($territory) {
            $query->where('kecamatan', $territory);
        }

        // Execute the query and get the data
        $data = $query->get();

        return [
            'data' => $data,
            'columns' => $columns,
            'listYears' => $this->getListYears($dbTableName),
            'listTerritories' => $this->getListTerritories($dbTableName),
            'error' => null
        ];
    }

    /**
     * Ambil daftar wilayah dari tabel.
     *
     * @param string $tableName
     * @return mixed
     */
    public function getListTerritories(string $dbTableName)
    {
        return DB::table($dbTableName)
            ->distinct()
            ->orderBy('kecamatan', 'asc')
            ->pluck('kecamatan')
            ->toArray();
    }

    /**
     * Ambil daftar tahun dari tabel.
     *
     * @param string $tableName
     * @return mixed
     */
    public function getListYears(string $dbTableName)
    {
        // Start building the query
        $query = DB::table($dbTableName)
            ->select(
                DB::raw(
                    $this->isTableWithTimestamp($dbTableName)
                    ? 'DISTINCT YEAR(waktu) as tahun'
                    : 'DISTINCT tahun'
                )
            )
            ->orderBy('tahun', 'asc');
        // Execute the query and retrieve results
        return $query->pluck('tahun')->toArray(); // Get years as an array
    }

    /**
     * Check if a table uses a timestamp column.
     *
     * @param string $dbTableName
     * @return bool
     */
    public function isTableWithTimestamp(string $dbTableName)
    {
        return in_array(
            $dbTableName,
            self::$tablesWithTimestamp,
            true
        );
    }

}