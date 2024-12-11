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

    public function index()
    {
        try {
            \Log::info("---------------------------Debug Dimulai-------------------------");

            $dataEkonomi = $this->mappingEkonomi();
            $dataAwareness = $this->mappingAwareness();
            $dataKesehatan = $this->mappingKesehatan();

            \Log::info("---------------------------Data didapatkan-------------------------");
            // $limitedDataEkonomi = $dataEkonomi->slice(0, 1); // Menampilkan 5 data teratas
            // \Log::info("dataEkonomi".$limitedDataEkonomi);
            // $limitedDataAwarness = $dataAwareness->slice(0, 1); // Menampilkan 5 data teratas
            // \Log::info("dataAwareness".$limitedDataAwarness);
            // $limitedDataKesehatan = $dataKesehatan->slice(0, 1); // Menampilkan 5 data teratas
            // \Log::info("dataKesehatan".$limitedDataKesehatan);

            // Menampilkan data teratas (1 item pertama) dari setiap koleksi
            // \Log::info('Data Ekonomi:', [$dataEkonomi->slice(0, 1)]);
            // \Log::info('Data Awareness:', [$dataAwareness->slice(0, 1)]);
            // \Log::info('Data Kesehatan:', [$dataKesehatan->slice(0, 1)]);

            // Misalnya, kita akan gabungkan data berdasarkan 'waktu' dan 'kecamatan'
            // Tambahkan data dari tabel p_m25_s
            // Tambahkan data dari tabel p_m25_s
            try {
                $pm25Model = $this->tableService->getModel('pm25');
                if (!$pm25Model) {
                    throw new \Exception('Model p_m25_s tidak ditemukan.');
                }
                $pm25Data = $pm25Model->all();
            } catch (\Exception $e) {
                \Log::error('Error saat mengambil data p_m25_s: ' . $e->getMessage());
                $pm25Data = collect(); // Jika gagal, buat koleksi kosong
            }

            $limitedData = $pm25Data->slice(0, 1); // Menampilkan 5 data teratas

            \Log::info("data encode dari pm 25".$limitedData);
            // Proses merge data
            $mergedData = $dataEkonomi->map(function ($ekonomi) use ($dataAwareness, $dataKesehatan, $pm25Data) {
                // Cari data yang memiliki 'waktu' dan 'kecamatan' yang sama
                $awareness = $dataAwareness->firstWhere('waktu', $ekonomi['waktu']);
                $kesehatan = $dataKesehatan->firstWhere('waktu', $ekonomi['waktu']);
                $pm25 = $pm25Data->firstWhere('waktu', $ekonomi['waktu']);

                // Gabungkan data dari keempat tabel
                return [
                    'nilai_pm25' => $pm25['nilai'] ?? null,
                    'Ekonomi' => $ekonomi['Ekonomi'],
                    'Awareness' => $awareness['Awarness'] ?? null,
                    'Kesehatan' => $kesehatan['Kesehatan'] ?? null,
                ];
            });
            

            // // Tampilkan data teratas hasil gabungan
            \Log::info('Data Gabungan:', $mergedData->slice(0, 1)->values()->all());

            $columns = array_keys($mergedData[0] ?? []);

            if (empty($columns)) {
                throw new \Exception('Tidak ada data yang tersedia untuk dihitung.');
            }
            //\Log::info('Daftar Kolom:', $columns);

            $correlationMatrix = $this->calculateCorrelation($mergedData, $columns);

            \Log::info("-------------------------------------------------------");
            return Inertia::render('Korelasi', [
                'listTables' => $this->tableService->listTables(),
                'listYears' => $this->getCachedYears(),
                'listTerritories' => $this->getCachedTerritories(),
                'data' => $correlationMatrix,
            ]);

        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }


    private function calculateCorrelation($data, $columns)
{
    if ($data->isEmpty() || empty($columns)) {
        return [];
    }

    $correlation = [];

    foreach ($columns as $col1) {
        foreach ($columns as $col2) {
            $rank1 = $this->getRank($data->pluck($col1)->toArray());
            $rank2 = $this->getRank($data->pluck($col2)->toArray());

            $correlationValue = $this->calculateSpearmanCorrelation($rank1, $rank2);
            $correlationValue = is_finite($correlationValue) ? $correlationValue : 0;

            $correlation["$col1 vs $col2"] = $correlationValue;
        }
    }
    
    return $correlation;
}

private function getRank($values)
{
    if (empty($values)) {
        return [];
    }

    $sorted = $values;
    sort($sorted);
    
    $ranks = array_map(function ($value) use ($sorted) {
        $indices = array_keys($sorted, $value, true);
        return array_sum($indices) / count($indices) + 1;
    }, $values);

    return $ranks;
}

private function calculateSpearmanCorrelation($rank1, $rank2)
{
    $n = count($rank1);

    if ($n === 0 || count($rank2) !== $n) {
        return 0; // Return 0 untuk data tidak valid
    }

    $dSquaredSum = array_sum(
        array_map(fn($a, $b) => pow($a - $b, 2), $rank1, $rank2)
    );

    return 1 - ((6 * $dSquaredSum) / ($n * ($n * $n - 1)));
}


    private function encodeTextDataWithMapping($data, $weightMapping)
{
    // Ambil kolom yang perlu diproses dari data
    $columns = array_keys($weightMapping);  // Ambil nama kolom dari pemetaan bobot

    // Ubah data dengan encoding sesuai ketentuan bobot
    return $data->map(function ($row) use ($columns, $weightMapping) {
        foreach ($columns as $column) {
            // Periksa jika kolom ada dalam baris dan memiliki nilai dalam pemetaan bobot
            if (isset($row->$column) && isset($weightMapping[$column][$row->$column])) {
                // Map jawaban ke bobot yang sesuai
                $row->$column = $weightMapping[$column][$row->$column];
            } else {
                // Jika tidak ada pemetaan, set bobot default
                $row->$column = 0; // Bobot default
            }
        }
        return $row;
    });
}

private function sumColumnsPerRowWithColumnName($encodedData, $columns, $name)
{
    return $encodedData->map(function ($row) use ($columns, $name) {  // Tangkap $name dengan 'use'
        // Mulai dengan nilai total 0
        $total = 0;

        // Menjumlahkan nilai untuk setiap kolom pada baris tersebut
        foreach ($columns as $column) {
            $total += $row->$column ?? 0;  // Pastikan kolom ada, jika tidak, set nilai 0
        }

        // Mengembalikan array yang berisi waktu, kecamatan, dan total
        return [
            'waktu' => $row->waktu ?? 'N/A',  // Mengambil nilai kolom waktu
            'kecamatan' => $row->kecamatan ?? 'N/A',  // Mengambil nilai kolom kecamatan
            $name => $total,  // Kolom dinamis dengan nama yang diberikan di $name
        ];
    });
}







private function mappingEkonomi()
{
    try {
        $ekonomiModel = $this->tableService->getModel('ekonomi');
        // Ambil semua data dari tabel 'ekonomi'
        $data = $ekonomiModel->all();
        \Log::info("data dari ekonomi".$data);

        // Definisikan pemetaan bobot untuk setiap kolom
        $weightMapping = [
            'kualitas_udara_pengaruhi_pendapatan' => [
                'Ya, pendapatan menurun' => 3,
                'Tidak, pendapatan tetap' => 2,
                'Tidak tahu' => 1,
            ],
            'absen_kerja_sekolah' => [
                'Ya' => 2,
                'Tidak' => 1,
            ],
            'dampak_usaha_kualitas_udara' => [
                'Ya, sangat berdampak' => 4,
                'Cukup berdampak' => 3,
                'Tidak berdampak' => 2,
                'Tidak relevan (saya tidak memiliki bisnis/usaha)' => 1
            ],
            'usaha_berjalan_normal_saat_kabut' => [
                'Ya' => 2,
                'Tidak' => 1,
            ],
        ];

        // Panggil fungsi encode dengan mapping bobot
        $encodedData = $this->encodeTextDataWithMapping($data, $weightMapping);
        \Log::info("setelah diencode dari ekonomi".$encodedData);
   
        // Ambil nama kolom yang perlu dihitung (sesuai dengan mapping)
        $columns = array_keys($weightMapping);
        $name = "Ekonomi";
        // Jumlahkan nilai dari tiap kolom per baris
        $rowTotals = $this->sumColumnsPerRowWithColumnName($encodedData, $columns, $name);
        $limitedData = $rowTotals->slice(0, 1); // Menampilkan 5 data teratas

        \Log::info("data encode dari Ekonomi".$limitedData);

        return $rowTotals;
    } catch (\Exception $e) {
        return redirect()->back()->withErrors(['error' => $e->getMessage()]);
    }
}




private function mappingAwareness()
{
    try {
        $awarenessModel = $this->tableService->getModel('awareness');
        // Ambil semua data dari tabel 'awareness'
        $data = $awarenessModel->all();
        

        $weightMapping = [
            'frekuensi_pakai_masker' => [
                'Selalu' => 5,
                'Sering' => 4,
                'Kadang-kadang' => 3,
                'Jarang' => 2,
                'Tidak Pernah' => 1,
            ],
            'aksi_saat_udara_buruk' => [
                'Mengurangi aktivitas di luar ruangan' => 4,
                'Menyalakan air purifier di rumah' => 3,
                'Menggunakan masker' => 2,
                'Tidak melakukan tindakan khusus' => 1,
            ],
            'intensitas_penggunaan_masker_kabut_asap' => [
                'Selalu' => 4,
                'Sering' => 3,
                'Jarang' => 2,
                'Tidak Pernah' => 1,
            ],
            'penggunaan_air_purifier' => [
                'Ya' => 2,
                'Tidak' => 1,
            ],
            'kondisi_ventilasi' => [
                'Kurang baik' => 1,
                'Cukup baik' => 2,
                'Baik' => 3,
                'Sangat Baik' => 4,
            ],
            'frekuensi_konsultasi_dokter' => [
                'Sering' => 4,
                'Kadang-kadang' => 3,
                'Jarang' => 2,
                'Tidak pernah' => 1,
            ],
        ];

        // Panggil fungsi mapping dan simpan hasilnya
        $encodedData = $this->encodeTextDataWithMapping($data, $weightMapping);
             // Ambil nama kolom yang perlu dihitung (sesuai dengan mapping)
        $columns = array_keys($weightMapping);
        $name = "Awarness";
        // Jumlahkan nilai dari tiap kolom per baris
        $rowTotals = $this->sumColumnsPerRowWithColumnName($encodedData, $columns, $name);
        $limitedData = $rowTotals->slice(0, 1); // Menampilkan 5 data teratas

        \Log::info("data encode dari Awarness".$limitedData);

        return $rowTotals;
    } catch (\Exception $e) {
        return redirect()->back()->withErrors(['error' => $e->getMessage()]);
    }
}

private function mappingKesehatan()
{
    try {
        $kesehatanModel = $this->tableService->getModel('kesehatan');
        // Ambil semua data dari tabel 'kesehatan'
        $data = $kesehatanModel->all();
        
        $weightMapping = [
            'gangguan_kesehatan_pribadi' => [
                'Ya' => 2,
                "Tidak" => 1,
            ],
            'gangguan_kesehatan_keluarga' => [
                'Ya' => 2,
                "Tidak" => 1,
            ],
        ];

        // Panggil fungsi mapping dan simpan hasilnya
        $encodedData = $this->encodeTextDataWithMapping($data, $weightMapping);
        
     // Ambil nama kolom yang perlu dihitung (sesuai dengan mapping)
        $columns = array_keys($weightMapping);
        $name = "Kesehatan";
        // Jumlahkan nilai dari tiap kolom per baris
        $rowTotals = $this->sumColumnsPerRowWithColumnName($encodedData, $columns, $name);
        $limitedData = $rowTotals->slice(0, 1); // Menampilkan 5 data teratas

        \Log::info("data encode dari Kesehatan".$limitedData);

        return $rowTotals;
    } catch (\Exception $e) {
        return redirect()->back()->withErrors(['error' => $e->getMessage()]);
    }
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
