<?php

namespace Database\Seeders;

use App\Models\TitikKecamatan;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TitikKecamatanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            ['lattitude' => 0.658523, 'longitude' => 101.4001, 'kelurahan' => 'Muara Fajar', 'kecamatan' => 'Rumbai Barat'],
            ['lattitude' => 0.607523, 'longitude' => 101.3756, 'kelurahan' => 'Rumbai Bukit', 'kecamatan' => 'Rumbai Barat'],
            ['lattitude' => 0.62574, 'longitude' => 101.4213, 'kelurahan' => 'Muara Fajar', 'kecamatan' => 'Rumbai Barat'],
            ['lattitude' => 0.56993, 'longitude' => 101.4508, 'kelurahan' => 'Lembah Sari', 'kecamatan' => 'Rumbai Timur'],
            ['lattitude' => 0.596325, 'longitude' => 101.4756, 'kelurahan' => 'Lembah Damai', 'kecamatan' => 'Rumbai'],
            ['lattitude' => 0.593742, 'longitude' => 101.5085, 'kelurahan' => 'Tebing Tinggi Okura', 'kecamatan' => 'Rumbai Timur'],
            ['lattitude' => 0.551818, 'longitude' => 101.5252, 'kelurahan' => 'Bencah Lesung', 'kecamatan' => 'Tenayan Raya'],
            ['lattitude' => 0.533671, 'longitude' => 101.3985, 'kelurahan' => 'Air Hitam', 'kecamatan' => 'Payung Sekaki'],
            ['lattitude' => 0.535228, 'longitude' => 101.4259, 'kelurahan' => 'Tampan', 'kecamatan' => 'Payung Sekaki'],
            ['lattitude' => 0.536982, 'longitude' => 101.4831, 'kelurahan' => 'Rejosari', 'kecamatan' => 'Tenayan Raya'],
            ['lattitude' => 0.535439, 'longitude' => 101.5573, 'kelurahan' => 'Bencah Lesung', 'kecamatan' => 'Tenayan Raya'],
            ['lattitude' => 0.491436, 'longitude' => 101.3945, 'kelurahan' => 'Simpang Baru', 'kecamatan' => 'Binawidya'],
            ['lattitude' => 0.49961, 'longitude' => 101.4389, 'kelurahan' => 'Tangkerang', 'kecamatan' => 'Bukit Raya'],
            ['lattitude' => 0.473543, 'longitude' => 101.4989, 'kelurahan' => 'Tangkerang', 'kecamatan' => 'Bukit Raya'],
            ['lattitude' => 0.476352, 'longitude' => 101.5417, 'kelurahan' => 'Kulim', 'kecamatan' => 'Kulim'],
            ['lattitude' => 0.459713, 'longitude' => 101.388, 'kelurahan' => 'Tuah Karya', 'kecamatan' => 'Tuahmadani'],
            ['lattitude' => 0.447659, 'longitude' => 101.4394, 'kelurahan' => 'Perhentian Marpoyan', 'kecamatan' => 'Marpoyan Damai'],
            ['lattitude' => 0.464458, 'longitude' => 101.4541, 'kelurahan' => 'Simpang Tiga', 'kecamatan' => 'Bukit Raya'],
        ];

        foreach ($data as $item) {
            TitikKecamatan::create($item);
        }
    }
}
