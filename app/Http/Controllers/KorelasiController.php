<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Demografi;
use App\Services\DataService;
use App\Services\TableService;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Arr;

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
            $dataJawaban = $this->mappingJawaban();

            // Cek apakah data tidak kosong
            if (!empty($dataJawaban)) {
                // Ambil 1 data teratas
                $limitedDataJawaban = collect($dataJawaban)->slice(0, 10); 
                //\Log::info("data jawaban: " . $dataJawaban->toJson());
            } else {
                \Log::info("data jawaban kosong");
            }
            
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
                $pm25Model = $this->tableService->getModel('pm25 kecamatan');
                if (!$pm25Model) {
                    throw new \Exception('Model p_m25_s tidak ditemukan.');
                }
                $pm25Data = $pm25Model->all();
            } catch (\Exception $e) {
                \Log::error('Error saat mengambil data p_m25_s: ' . $e->getMessage());
                $pm25Data = collect(); // Jika gagal, buat koleksi kosong
            }

            $limitedData = $pm25Data->slice(0, 10); // Menampilkan 5 data teratas

            //\Log::info("data encode dari pm 25".$limitedData);
            // Proses merge data

            // Menggabungkan data menjadi koleksi per kecamatan dan tahun
            // Menggabungkan data menjadi koleksi per kecamatan dan tahun
            // $groupedData = $mergedData->groupBy(function ($item) {
            //     if (!isset($item['waktu']) || !isset($item['kecamatan'])) {
            //         \Log::error('Data tidak memiliki kolom waktu atau kecamatan:', $item);
            //         return 'Tidak Diketahui_Tidak Diketahui';
            //     }
            //     return $item['kecamatan'] . '_' . date('Y', strtotime($item['waktu']));
            // });

            // // Menghitung rata-rata per kecamatan dan tahun
            // $averagedData = $groupedData->map(function ($items, $key) {
            //     [$kecamatan, $tahun] = explode('_', $key);
            //     $avgAwareness = $items->avg('Awareness');
            //     $avgEkonomi = $items->avg('Ekonomi');
            //     $avgKesehatan = $items->avg('Kesehatan');

            //     return [
            //         'tahun' => $tahun,
            //         'kecamatan' => $kecamatan ?: 'Tidak Diketahui',
            //         'avg_awareness' => round($avgAwareness, 4),
            //         'avg_ekonomi' => round($avgEkonomi, 4),
            //         'avg_kesehatan' => round($avgKesehatan, 4),
            //     ];
            // });

            // // Tampilkan hasil untuk verifikasi
            // \Log::info('Rata-rata per kecamatan dan tahun:', $averagedData->values()->all());

            $mergedData = $dataEkonomi->map(function ($ekonomi) use ($dataAwareness, $dataKesehatan, $pm25Data) {
                $tahunEkonomi = date('Y', strtotime($ekonomi['waktu']));
                $kecamatanEkonomi = $ekonomi['kecamatan'];
            
                // Cari data terkait
                $awareness = $dataAwareness->first(function ($item) use ($tahunEkonomi, $kecamatanEkonomi) {
                    return date('Y', strtotime($item['waktu'])) == $tahunEkonomi && 
                           $item['kecamatan'] == $kecamatanEkonomi;
                });
            
                $kesehatan = $dataKesehatan->first(function ($item) use ($tahunEkonomi, $kecamatanEkonomi) {
                    return date('Y', strtotime($item['waktu'])) == $tahunEkonomi && 
                           $item['kecamatan'] == $kecamatanEkonomi;
                });
            
                $pm25 = $pm25Data->first(function ($item) use ($tahunEkonomi, $kecamatanEkonomi) {
                    return $item['tahun'] == $tahunEkonomi && $item['kecamatan'] == $kecamatanEkonomi;
                });
            
                // Abaikan data jika pm25 null
                if (!$pm25 || !$awareness || !$kesehatan) {
                    return null;  // Jika data tidak lengkap, abaikan
                }
            
                // Gabungkan data
                return [
                    'nilai_pm25' => $pm25['rata_rata_pm25'] ?? null,
                    'Awareness' => $awareness['Awarness'] ?? null,
                    'Ekonomi' => $ekonomi['Ekonomi'] ?? null,
                    'Kesehatan' => $kesehatan['Kesehatan'] ?? null,
     
                ];
            })->filter();  // Hapus data null
    
            
            

            // Tampilkan data gabungan untuk verifikasi
            //\Log::info('Data Gabungan:', $mergedData->slice(0, 5)->values()->all());
            
            

            // // Tampilkan data teratas hasil gabungan


            // Mengonversi koleksi menjadi array biasa (jika $mergedData adalah koleksi)
            $mergedDataArray = $mergedData->toArray();  // Jika $mergedData adalah koleksi
            //\Log::info('Array mergedData:', $mergedDataArray);


            $columns = array_keys(reset($mergedDataArray));

            //\Log::info('kolom:', $columns);


            // Mengambil daftar kolom (keys) dari objek pertama
            // $columns = array_keys($mergedDataArray[0]);                                                                                          


            // // Log kolom yang ditemukan
            // \Log::info('Kolom yang ditemukan:', $columns);

            //\Log::info('Daftar Kolom:', $columns);

            $correlationMatrix = $this->calculateCorrelation($mergedData, $columns);

            //\Log::info('nilai korelasi matrix:', $correlationMatrix);


            \Log::info("-------------------------------------------------------");
            return Inertia::render('Korelasi', [
                'listTables' => $this->tableService->listTables(),
                'listYears' => $this->getCachedYears(),
                'listTerritories' => $this->getCachedTerritories(),
                'data' => $correlationMatrix,
                'dataJawaban' => $dataJawaban,
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

    // Buat array untuk menyimpan rangking setiap kolom
    $rankedData = [];

    foreach ($columns as $col) {
        $rankedData[$col] = $this->getRank($data->pluck($col)->toArray());
    }

    $correlation = [];

    foreach ($columns as $col1) {
        foreach ($columns as $col2) {
            $correlationValue = $this->calculatePearsonCorrelation($rankedData[$col1], $rankedData[$col2]);
            $correlationValue = is_finite($correlationValue) ? round($correlationValue, 6) : 0;

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

    $cleanValues = array_map(function ($value) {
        return $value ?? 0;
    }, $values);

    $sorted = $cleanValues;
    sort($sorted);

    $ranks = array_map(function ($value) use ($sorted) {
        $indices = array_keys($sorted, $value, true);
        return (array_sum($indices) / count($indices)) + 1;
    }, $cleanValues);

    return $ranks;
}

private function calculatePearsonCorrelation($rank1, $rank2)
{
    $n = count($rank1);

    if ($n === 0 || count($rank2) !== $n) {
        return 0;
    }

    $mean1 = array_sum($rank1) / $n;
    $mean2 = array_sum($rank2) / $n;

    $numerator = array_sum(array_map(function ($a, $b) use ($mean1, $mean2) {
        return ($a - $mean1) * ($b - $mean2);
    }, $rank1, $rank2));

    $denominator = sqrt(
        array_sum(array_map(fn($a) => pow($a - $mean1, 2), $rank1)) *
        array_sum(array_map(fn($b) => pow($b - $mean2, 2), $rank2))
    );

    return $denominator == 0 ? 0 : $numerator / $denominator;
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
                if ($columns = 'usaha_berjalan_normal_saat_kabut'){
                    $row->$column = 1; // Bobot default
                }else{
                    $row->$column = 0; // Bobot default
                }
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

        // Hitung rata-rata jika jumlah kolom lebih dari 0
        $average = count($columns) > 0 ? $total / count($columns) : 0;

        // Mengembalikan array yang berisi waktu, kecamatan, dan total rata-rata
        return [
            'waktu' => $row->waktu ?? 'N/A',  // Mengambil nilai kolom waktu
            'kecamatan' => $row->kecamatan ?? 'N/A',  // Mengambil nilai kolom kecamatan
            $name => $average,  // Kolom dinamis dengan nama yang diberikan di $name
        ];
    });
}

    private function mappingJawaban()
    {
        //ekonomi
        $ekonomiModel = $this->tableService->getModel('ekonomi');
        // Ambil semua data dari tabel 'ekonomi'
        $data = $ekonomiModel->all();
        $data = $ekonomiModel::select('waktu', 'kecamatan', 'kualitas_udara_pengaruhi_pendapatan','absen_kerja_sekolah',
        'dampak_usaha_kualitas_udara', 'usaha_berjalan_normal_saat_kabut' )->get();

        //\Log::info("sebelum diencode dari ekonomi".$data);


        $weightMapping = [
            'kualitas_udara_pengaruhi_pendapatan' => [
                'Ya, Pendapatan Menurun' => 3,
                'Tidak, Pendapatan Tetap' => 2,
                'Tidak Tahu' => 1,
            ],
            'absen_kerja_sekolah' => [
                'Ya' => 2,
                'Tidak' => 1,
            ],
            'dampak_usaha_kualitas_udara' => [
                'Ya, Sangat Berdampak' => 4,
                'Cukup Berdampak' => 3,
                'Tidak Berdampak' => 2,
                'Tidak Relevan (Saya Tidak Memiliki Bisnis\/Usaha' => 1
            ],
            'usaha_berjalan_normal_saat_kabut' => [
                'Ya' => 2,
                'Tidak' => 1,
                NULL => 1,  // Menambahkan kondisi untuk NULL
            ],
        ];

        // Panggil fungsi encode dengan mapping bobot
        $encodedEkonomi = $this->encodeTextDataWithMapping($data, $weightMapping);
        
        \Log::info("setelah diencode dari ekonomi".$encodedEkonomi);



        //awarness
        $awarenessModel = $this->tableService->getModel('awareness');
        // Ambil semua data dari tabel 'awareness'
        $data = $awarenessModel::select('waktu', 'kecamatan', 'frekuensi_pakai_masker','aksi_saat_udara_buruk',
        'intensitas_penggunaan_masker_kabut_asap', 'penggunaan_air_purifier', 'kondisi_ventilasi', 'frekuensi_konsultasi_dokter' )->get();    

        $weightMapping = [
            'frekuensi_pakai_masker' => [
                'Selalu' => 5,
                'Sering' => 4,
                'Kadang-kadang' => 3,
                'Jarang' => 2,
                'Tidak Pernah' => 1,
            ],
            'aksi_saat_udara_buruk' => [
                'Mengurangi Aktivitas Di Luar Ruangan' => 4,
                'Menyalakan Air Purifier Di Rumah' => 3,
                'Menggunakan Masker' => 2,
                'Tidak Melakukan Tindakan Khusus' => 1,
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
        $encodedAwarness = $this->encodeTextDataWithMapping($data, $weightMapping);
        //\Log::info("setelah diencode dari Awarness".$encodedAwarness);

        //kesehatan
        $kesehatanModel = $this->tableService->getModel('kesehatan');
        // Ambil semua data dari tabel 'kesehatan'
        $data = $kesehatanModel::select('waktu', 'kecamatan', 'gangguan_kesehatan_pribadi','gangguan_kesehatan_keluarga')->get();
        
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
        $endodedKesehatan = $this->encodeTextDataWithMapping($data, $weightMapping);
        //\Log::info("setelah diencode dari Kesehatan".$endodedKesehatan);


        //pm25
        $pm25Model = $this->tableService->getModel('pm25 kecamatan');
        $pm25Data = $pm25Model->all();


        //merge data jawaban
        $mergedData = $encodedEkonomi->map(function ($ekonomi) use ($encodedAwarness, $endodedKesehatan, $pm25Data) {
            $tahunEkonomi = date('Y', strtotime($ekonomi['waktu']));
            $kecamatanEkonomi = $ekonomi['kecamatan'];
        
            // Cari data terkait
            $awareness = $encodedAwarness->first(function ($item) use ($tahunEkonomi, $kecamatanEkonomi) {
                return date('Y', strtotime($item['waktu'])) == $tahunEkonomi && 
                       $item['kecamatan'] == $kecamatanEkonomi;
            });
        
            $kesehatan = $endodedKesehatan->first(function ($item) use ($tahunEkonomi, $kecamatanEkonomi) {
                return date('Y', strtotime($item['waktu'])) == $tahunEkonomi && 
                       $item['kecamatan'] == $kecamatanEkonomi;
            });
        
            $pm25 = $pm25Data->first(function ($item) use ($tahunEkonomi, $kecamatanEkonomi) {
                return $item['tahun'] == $tahunEkonomi && $item['kecamatan'] == $kecamatanEkonomi;
            });
        
            // Abaikan data jika pm25 null
            if (!$pm25 || !$awareness || !$kesehatan) {
                return null;  // Jika data tidak lengkap, abaikan
            }
        
            // Gabungkan data
            return [
                'waktu' => $ekonomi ['waktu'] ,
                'kecamatan' => $ekonomi ['kecamatan'] ,
                'nilai_pm25' => $pm25['rata_rata_pm25'] ?? null,
                'frekuensi_pakai_masker' => $awareness['frekuensi_pakai_masker'] ?? null,
                'aksi_saat_udara_buruk' => $awareness['aksi_saat_udara_buruk'] ?? null,
                'intensitas_penggunaan_masker_kabut_asap' => $awareness['intensitas_penggunaan_masker_kabut_asap'] ?? null,
                'penggunaan_air_purifier' => $awareness['penggunaan_air_purifier'] ?? null,
                'kondisi_ventilasi' => $awareness['kondisi_ventilasi'] ?? null,
                'frekuensi_konsultasi_dokter' => $awareness['frekuensi_konsultasi_dokter'] ?? null,
                'kualitas_udara_pengaruhi_pendapatan' => $ekonomi['kualitas_udara_pengaruhi_pendapatan'] ?? null,
                'absen_kerja_sekolah' => $ekonomi['absen_kerja_sekolah'] ?? null,
                'dampak_usaha_kualitas_udara' => $ekonomi['dampak_usaha_kualitas_udara'] ?? null,
                'usaha_berjalan_normal_saat_kabut' => $ekonomi['usaha_berjalan_normal_saat_kabut'] ?? null,
                'gangguan_kesehatan_pribadi' => $kesehatan['gangguan_kesehatan_pribadi'] ?? null,
                'gangguan_kesehatan_keluarga' => $kesehatan['gangguan_kesehatan_keluarga'] ?? null,
            ];
        })->filter();  // Hapus data null

        return $mergedData;
    }

private function mappingEkonomi()
{
    try {
        $ekonomiModel = $this->tableService->getModel('ekonomi');
        // Ambil semua data dari tabel 'ekonomi'
        $data = $ekonomiModel->all();
        $data = $ekonomiModel::select('waktu', 'kecamatan', 'kualitas_udara_pengaruhi_pendapatan','absen_kerja_sekolah',
        'dampak_usaha_kualitas_udara', 'usaha_berjalan_normal_saat_kabut' )->get();
        //\Log::info("data dari ekonomi".$data);

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
        //\Log::info("setelah diencode dari ekonomi".$encodedData);
        // Buat variabel baru dengan hanya kolom yang sesuai dengan mapping

        // $filteredData = $data->map(function ($item) use ($weightMapping) {
        //     return collect($item)->only(array_keys($weightMapping));
        // });
        // \Log::info("data dari ekonomi".$filteredData);

        // Ambil nama kolom yang perlu dihitung (sesuai dengan mapping)
        $columns = array_keys($weightMapping);
        $name = "Ekonomi";
        // Jumlahkan nilai dari tiap kolom per baris
        $rowTotals = $this->sumColumnsPerRowWithColumnName($encodedData, $columns, $name);
        $limitedData = $rowTotals->slice(0, 5); // Menampilkan 5 data teratas

        //\Log::info("data encode dari Ekonomi".$limitedData);

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
        $limitedData = $rowTotals->slice(0, 5); // Menampilkan 5 data teratas

        //\Log::info("data encode dari Awarness".$limitedData);

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
        $limitedData = $rowTotals->slice(0, 5); // Menampilkan 5 data teratas

        //\Log::info("data encode dari Kesehatan".$limitedData);

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
