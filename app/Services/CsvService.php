<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class CsvService
{
    protected $tableService;

    public function __construct(TableService $tableService)
    {
        $this->tableService = $tableService;
    }

    public function import($tableName, $file)
    {
        $model = $this->tableService->getModel($tableName);
        if (!$model) {
            return ['error' => "Tabel $tableName tidak ditemukan."];
        }

        $dbTableName = $model->getTable();
        $columns = DB::getSchemaBuilder()->getColumnListing($dbTableName);
        $fillableColumns = array_diff($columns, ['id']);
        $fillableColumns = array_values($fillableColumns); // Reset indeks array


        $fileHandle = fopen($file, 'r');
        if (!$fileHandle) {
            return ['error' => 'Tidak dapat membuka file CSV.'];
        }

        $header = fgetcsv($fileHandle);
        $header = array_map(fn($col) => preg_replace('/[\x00-\x1F\x80-\xFF]/', '', $col), $header);


        if (count($header) !== count($fillableColumns)) {
            return ['error' => 'Jumlah kolom pada CSV tidak sesuai dengan tabel.'];
        }

        DB::beginTransaction();

        try {
            while ($row = fgetcsv($fileHandle)) {
                if (empty($row))
                    continue;

                $data = [];
                foreach ($fillableColumns as $index => $column) {
                    if ($column == 'waktu') {
                        $dateString = $row[$index];
                        $dateTime = \DateTime::createFromFormat('m/d/Y H:i:s', $dateString);
                        $value = $dateTime ? $dateTime?->format('Y-m-d H:i:s') : null;
                    } else {
                        $value = $row[$index] ?? null;

                    }
                    $data[$column] = ($value === '') ? null : $value; // Ubah string kosong menjadi NULL
                }
                DB::table($dbTableName)->insert($data);
            }
            DB::commit();
            return ['success' => true];
        } catch (\Exception $e) {
            DB::rollBack();
            return ['error' => $e->getMessage()];
        }
    }

    public function importPM25($file)
    {
        $model = $this->tableService->getModel('pm25');
        $dbTableName = $model->getTable();

        $fileHandle = fopen($file, 'r');
        if (!$fileHandle) {
            return ['error' => 'Tidak dapat membuka file CSV.'];
        }

        $header = fgetcsv($fileHandle);
        $header = array_map(fn($col) => preg_replace('/[\x00-\x1F\x80-\xFF]/', '', $col), $header);

        if (empty($header) || strtolower(trim($header[0])) !== 'datetime') {
            return ['error' => 'File CSV tidak valid. Kolom pertama harus "datetime".'];
        }

        DB::beginTransaction();

        try {
            while ($row = fgetcsv($fileHandle)) {
                if (empty($row))
                    continue;

                // Extract and format datetime from the first column
                $dateString = $row[0] ?? null;
                $dateTime = \DateTime::createFromFormat('m/d/Y H:i', $dateString);
                $formattedDatetime = $dateTime ? $dateTime->format('Y-m-d H:i:s') : null;

                if (!$formattedDatetime)
                    continue; // Skip invalid datetime rows
                // Loop through the remaining columns to create titik and nilai entries
                foreach ($header as $index => $column) {
                    if ($index === 0)
                        continue; // Skip the datetime column

                    $data = [
                        'waktu' => $formattedDatetime,
                        'kecamatan' => 'Rumbai',
                        'titik' => $column,
                        'nilai' => is_numeric($row[$index]) ? (float) $row[$index] : null,
                    ];

                    DB::table($dbTableName)->insert($data);
                }
            }
            DB::commit();
            return ['success' => true];
        } catch (\Exception $e) {
            DB::rollBack();
            return ['error' => $e->getMessage()];
        }
    }

    public function uploadTemplate($tableName, $file)
    {
        $fileName = "{$tableName}.csv";
        $filePath = "templates/csv/{$fileName}";

        if (Storage::disk('public')->exists($filePath)) {
            Storage::disk('public')->delete($filePath);
        }

        $file->storeAs('templates/csv', $fileName, 'public');
    }
}
