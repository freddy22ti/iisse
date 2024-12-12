<?php

namespace App\Services;

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;


class TableService
{
    /**
     * Mapping of table names to their corresponding Eloquent models.
     *
     * @var array
     */
    private static $tableMapping = [
        'awareness' => \App\Models\Awareness::class,
        'cuaca' => \App\Models\Cuaca::class,
        'demografi' => \App\Models\Demografi::class,
        'ekonomi' => \App\Models\Ekonomi::class,
        'fasilitas kesehatan' => \App\Models\FasilitasKesehatan::class,
        'kasus penyakit' => \App\Models\KasusPenyakit::class,
        'kesehatan' => \App\Models\Kesehatan::class,
        'sarana pelayanan kesehatan' => \App\Models\SaranaPelayananKesehatan::class,
        'sosial' => \App\Models\Sosial::class,
        'pm25' => \App\Models\PM25::class,
        'pm25 kecamatan' => \App\Models\PM25Kecamatan::class,
        'warga' => \App\Models\Warga::class,
        'wilayah' => \App\Models\Wilayah::class,
    ];

    /**
     * Get the Eloquent model class associated with a given table name.
     *
     * @param string $tableName
     * @return \Illuminate\Database\Eloquent\Model | null
     */
    public function getModel($tableName)
    {
        return new self::$tableMapping[$tableName] ?? null;
    }

    /**
     * Get a list of all mapped table names.
     *
     * @return array
     */
    public function listTables()
    {
        return array_keys(self::$tableMapping);
    }

    /**
     * Add new columns to a table dynamically.
     *
     * @param string $tableName The name of the table to modify.
     * @param array $columns An array of column definitions, where each item contains 'name' and 'type'.
     * @return array|string Status message or redirect in case of error (can be adjusted based on use case).
     */
    public function addColumns($tableName, $columns)
    {
        try {
            $model = $this->getModel($tableName);

            if (!$model) {
                throw new \Exception("Table $tableName does not exist.");
            }

            if (empty($columns) || !is_array($columns)) {
                throw new \Exception("Invalid columns data provided.");
            }

            $dbTableName = $model->getTable();

            Schema::table($dbTableName, function (Blueprint $table) use ($columns) {
                foreach ($columns as $column) {
                    if (!isset($column['name'], $column['type'])) {
                        continue; // Skip invalid column definitions
                    }

                    $name = $column['name'];
                    $type = strtolower($column['type']);

                    // Add columns dynamically based on type
                    switch ($type) {
                        case 'string':
                            $table->string($name)->nullable();
                            break;
                        case 'integer':
                            $table->integer($name)->nullable();
                            break;
                        case 'float':
                            $table->float($name)->nullable();
                            break;
                        case 'boolean':
                            $table->boolean($name)->nullable();
                            break;
                        case 'date':
                            $table->date($name)->nullable();
                            break;
                        default:
                            // Handle unsupported types (optional)
                            throw new \Exception("Unsupported column type: $type");
                    }
                }
            });
            return ['success' => 'Columns added successfully!'];
        } catch (\Exception $e) {
            return ['error' => $e->getMessage()];
        }
    }

    /**
     * Add new columns to a table dynamically.
     *
     * @param string $tableName The name of the table to modify.
     * @param array $columns An array of column definitions, where each item contains 'name' and 'type'.
     * @return array|null Status message or redirect in case of error (can be adjusted based on use case).
     */
    public function getListColumns($tableName)
    {
        try {
            $model = $this->getModel($tableName);

            if (!$model) {
                throw new \Exception("Table $tableName does not exist.");
            }

            $dbTableName = $model->getTable();

            // Get all columns from the table
            $columns = Schema::getColumnListing($dbTableName);

            // Get the hidden and visible properties from the model
            $hidden = $model->getHidden();
            $visible = $model->getVisible();

            // If the model has a visible property, respect it
            if ($visible) {
                $columns = array_intersect($columns, $visible);
            }

            // If the model has a hidden property, remove those columns
            if ($hidden) {
                $columns = array_diff($columns, $hidden);
            }

            // Exclude 'id' columns (and other specific columns, if needed)
            $exclude = ['id']; // Add other columns to exclude if needed
            $columns = array_diff($columns, $exclude);

            return array_values((array) $columns);

        } catch (\Exception $e) {
            return ['error' => $e->getMessage()];
        }
    }
}