export const colors = [
    "#FF6384", // Merah muda terang
    "#36A2EB", // Biru terang
    "#FFCE56", // Kuning
    "#4BC0C0", // Teal
    "#9966FF", // Ungu
    "#FF9F40", // Oranye
    "#E7E9ED", // Abu-abu terang
    "#2C3E50", // Biru tua
    "#1ABC9C", // Hijau terang
    "#E74C3C", // Merah terang
    "#9B59B6", // Ungu tua
    "#F1C40F", // Emas
    "#34495E", // Abu-abu gelap
    "#16A085", // Hijau laut
    "#27AE60", // Hijau gelap
    "#2980B9", // Biru cerah
    "#8E44AD", // Ungu gelap
    "#C0392B", // Merah bata
    "#D35400", // Oranye tua
    "#BDC3C7", // Abu-abu muda
    "#7F8C8D", // Abu-abu sedang
];

export const EXCLUDED_COLUMNS = [
    "id",
    "tahun",
    "waktu",
    "kecamatan",
    "ibukota_kecamatan",
    "email",
    "nama",
    "kelompok_umur",
    "jenis_tenaga_medis",
    "bulan",
];

export const TABLE_WITHOUT_YEAR = [
    'demografi',
    'ekonomi',
    'sosial',
    'awareness',
    'kesehatan',
    'pm25 kecamatan',
];


export const ADDITIONAL_TABLE = ['kuisioner'];


export const CORR_MSG = [
    {
        title: 'Awareness',
        conditions: [
            {
                range: [-1.00, -0.61],
                status: 'negatif tinggi',
                description: 'Korelasi Negatif Tinggi (-1.00≤rs≤-0.61)',
                message: `Kesadaran masyarakat sangat rendah, ditandai dengan  buruknya kualitas udara yang tidak diiringi oleh upaya masyarakat  meningkatkan pemahaman atau tindakan preventif. Situasi ini mengindikasikan adanya kebutuhan mendesak untuk kampanye edukasi dan intervensi pemerintah.`
            },
            {
                range: [-0.60, -0.31],
                status: 'negatif rendah hingga sedang',
                description: 'Korelasi Negatif Rendah hingga Sedang (-0.60≤rs≤-0.31)',
                message: `Masyarakat di Kota Pekanbaru memiliki kesadaran yang rendah hingga sedang terhadap kondisi PM2.5.
                Hubungan negatif ini menunjukkan bahwa semakin buruk kondisi kualitas udara, semakin rendah tingkat kesadaran masyarakat.
                Hal ini bisa disebabkan oleh minimnya akses informasi atau pemahaman yang salah tentang dampak PM2.5 terhadap kesehatan.`
            },
            {
                range: [-0.30, 0.30],
                status: 'tidak ada korelasi',
                description: 'Tidak Ada Korelasi (-0.30≤rs≤0.30)',
                message: `Tidak ditemukan hubungan yang signifikan antara kesadaran masyarakat terhadap kondisi PM2.5 dan kualitas udara di Kota Pekanbaru. Hal ini dapat disebabkan oleh kurangnya perhatian masyarakat terhadap isu lingkungan, atau faktor lain seperti kurangnya penyebaran informasi yang efektif.`
            },
            {
                range: [0.31, 0.60],
                status: 'positif rendah hingga sedang',
                description: 'Korelasi Positif Rendah hingga Sedang (0.31≤rs≤0.60)',
                message: `Masyarakat di Kota Pekanbaru memiliki kesadaran yang cukup baik terhadap kondisi PM2.5.
                Korelasi positif sedang ini menunjukkan bahwa semakin buruk kondisi kualitas udara, sebagian masyarakat mulai lebih menyadari dampak negatif PM2.5, meskipun belum disertai dengan tindakan preventif yang optimal.`
            },
            {
                range: [0.61, 1.00],
                status: 'positif tinggi',
                description: 'Korelasi Positif Tinggi (0.61≤rs≤1.00)',
                message: `Kesadaran masyarakat sangat baik, ditandai dengan semakin buruknya kualitas udara yang diikuti oleh peningkatan pemahaman dan tindakan masyarakat dalam mengurangi paparan PM2.5, seperti menggunakan masker atau memantau kualitas udara secara rutin. Korelasi positif ini menunjukkan keberhasilan program edukasi atau intervensi informasi yang telah dilakukan.`
            }
        ],
    },
    {
        title: 'Economy',
        conditions: [
            {
                range: [-1.00, -0.61],
                status: 'negatif tinggi',
                description: 'Korelasi Negatif Tinggi (-1.00≤rs≤-0.61)',
                message: `Kondisi PM2.5 sangat berdampak negatif pada perekonomian masyarakat. Korelasi negatif tinggi ini menunjukkan bahwa peningkatan polusi udara secara signifikan menurunkan aktivitas ekonomi, seperti produktivitas kerja, kegiatan bisnis, atau daya beli masyarakat. Hal ini bisa mencerminkan dampak kesehatan yang mengurangi kapasitas kerja masyarakat.`,
            },
            {
                range: [-0.60, -0.31],
                status: 'negatif rendah hingga sedang',
                description: 'Korelasi Negatif Rendah hingga Sedang (-0.60≤rs≤-0.31)',
                message: `Kondisi PM2.5 memiliki dampak negatif moderat terhadap perekonomian masyarakat Kota Pekanbaru. Hubungan negatif ini menunjukkan bahwa semakin buruk kualitas udara, terdapat indikasi penurunan aktivitas ekonomi, tetapi pengaruhnya belum terlalu signifikan. Hal ini dapat disebabkan oleh adaptasi masyarakat atau keterbatasan data dalam mencerminkan dampak ekonomi langsung.`,
            },
            {
                range: [-0.30, 0.30],
                status: 'tidak ada korelasi',
                description: 'Tidak Ada Korelasi (-0.30≤rs≤0.30)',
                message: `Tidak ditemukan hubungan signifikan antara kondisi PM2.5 dan perekonomian masyarakat Kota Pekanbaru. Hal ini menunjukkan bahwa aktivitas ekonomi masyarakat tidak terlalu dipengaruhi oleh kualitas udara, kemungkinan karena polusi udara dianggap sebagai masalah yang kurang memengaruhi keputusan ekonomi.`,
            },
            {
                range: [0.31, 0.60],
                status: 'positif rendah hingga sedang',
                description: 'Korelasi Positif Rendah hingga Sedang (0.31≤rs≤0.60)',
                message: `Kondisi PM2.5 cukup berdampak pada kondisi perekonomian masyarakat. Korelasi positif sedang ini dapat mengindikasikan bahwa meskipun kualitas udara memburuk, aktivitas ekonomi tetap berjalan dengan beberapa adaptasi.`,
            },
            {
                range: [0.61, 1.00],
                status: 'positif tinggi',
                description: 'Korelasi Positif Tinggi (0.61≤rs≤1.00)',
                message: `Kondisi PM2.5 sangat berdampak pada perekonomian masyarakat. Hubungan positif ini menunjukkan bahwa aktivitas ekonomi meningkat meskipun kualitas udara memburuk.`,
            },
        ]
    },
    {
        title: 'Health',
        conditions: [
            {
                range: [-1.00, -0.61],
                status: 'negatif tinggi',
                description: 'Korelasi Negatif Tinggi (-1.00≤rs≤-0.61)',
                message: `Kondisi PM2.5 menunjukkan hubungan negatif yang signifikan dengan penyakit pernapasan. Hal ini mengindikasikan bahwa kasus penyakit pernapasan menurun secara drastis meskipun kualitas udara memburuk. Fenomena ini mungkin mencerminkan bias data atau intervensi kesehatan yang sangat efektif.`,
            },
            {
                range: [-0.60, -0.31],
                status: 'negatif rendah hingga sedang',
                description: 'Korelasi Negatif Rendah hingga Sedang (-0.60≤rs≤-0.31)',
                message: `Kondisi PM2.5 memiliki hubungan negatif moderat dengan kasus penyakit pernapasan di Kota Pekanbaru. Hubungan ini menunjukkan bahwa meskipun kualitas udara memburuk, kejadian penyakit pernapasan cenderung tetap rendah atau bahkan menurun. Hal ini dapat disebabkan oleh adaptasi masyarakat atau langkah preventif yang berhasil, seperti peningkatan penggunaan alat pelindung diri.`,
            },
            {
                range: [-0.30, 0.30],
                status: 'tidak ada korelasi',
                description: 'Tidak Ada Korelasi (-0.30≤rs≤0.30)',
                message: `Tidak ditemukan hubungan yang signifikan antara kondisi PM2.5 dan penyakit pernapasan di masyarakat Kota Pekanbaru.`,
            },
            {
                range: [0.31, 0.60],
                status: 'positif rendah hingga sedang',
                description: 'Korelasi Positif Rendah hingga Sedang (0.31≤rs≤0.60)',
                message: `Kondisi PM2.5 cukup mempengaruhi penyakit pernapasan di Kota Pekanbaru. Korelasi positif sedang ini menunjukkan bahwa semakin buruk kualitas udara, terdapat peningkatan moderat dalam jumlah kasus penyakit pernapasan, seperti asma atau infeksi saluran pernapasan atas. Pengaruh ini mungkin belum konsisten di seluruh wilayah atau kelompok masyarakat.`,
            },
            {
                range: [0.61, 1.00],
                status: 'positif tinggi',
                description: 'Korelasi Positif Tinggi (0.61≤rs≤1.00)',
                message: `Kondisi PM2.5 sangat mempengaruhi penyakit pernapasan di Kota Pekanbaru. Hubungan ini menunjukkan bahwa semakin buruk kualitas udara, semakin signifikan peningkatan kasus penyakit pernapasan di masyarakat. Hal ini mencerminkan dampak langsung dari paparan PM2.5 terhadap kesehatan, khususnya pada kelompok rentan seperti anak-anak atau lansia.`,
            },
        ],
    }
];