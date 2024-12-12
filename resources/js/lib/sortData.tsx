const activityFrequency = [
    'Tidak pernah',
    '1 - 2 jam',
    '3 - 4 jam',
    'Lebih dari 4 jam',
];

const influenceLevels = [
    'Tidak Memengaruhi',
    'Sedikit Memengaruhi',
    'Cukup Memengaruhi',
    'Sangat Memengaruhi',
];

const incomeImpactOptions = [
    'Tidak tahu',
    'Tidak, pendapatan tetap',
    'Ya, pendapatan menurun',
];

const incomeReductionLevels = [
    '< 10%',
    '10% - 20%',
    '21% - 30%',
    '> 30%',
];

const yesNoOptions = [
    'Tidak',
    'Ya',
];

const businessImpactLevels = [
    'Tidak relevan (saya tidak memiliki bisnis/usaha)',
    'Tidak berdampak',
    'Cukup berdampak',
    'Ya, sangat berdampak',
];

const activityTypes = [
    'Bekerja',
    'Berkendara motor',
    'Berolahraga',
    'Berjalan kaki',
    'Aktivitas pekerjaan rumah tangga',
];

const frequencyDescriptors = [
    'Sering',
    'Jarang',
];

const qualityRatings = [
    'Buruk',
    'Cukup',
    'Baik',
];

const generalFrequencyOptions = [
    'Tidak Pernah',
    'Jarang',
    'Kadang-kadang',
    'Sering',
    'Selalu',
];

const actionsDuringPoorAirQuality = [
    'Tidak melakukan tindakan khusus',
    'Menggunakan masker',
    'Menyalakan air purifier di rumah',
    'Mengurangi aktivitas di luar ruangan',
];

const easeOfActionOptions = [
    'Tidak Mudah',
    'Kurang Mudah',
    'Cukup Mudah',
    'Ya, sangat mudah',
];

const warningAcknowledgmentOptions = [
    'Tidak tahu',
    'Tidak',
    'Ya',
];

const everNeverOptions = [
    'Tidak pernah',
    'Pernah'
];

const incomeRanges = [
    '< Rp 1.000.000',
    'Rp 1.000.000 - Rp 3.000.000',
    'Rp 3.000.001 - Rp 5.000.000',
    'Rp 5.000.001 - Rp 10.000.000',
    '> Rp 10.000.000',
];

const ventilationCondition = [
    'Kurang Baik',
    'Cukup Baik',
    'Baik',
    'Sangat Baik',
]


export const ekonomiColumns = {
    'kualitas_udara_pengaruhi_hidup': influenceLevels,
    'kualitas_udara_pengaruhi_pendapatan': incomeImpactOptions,
    'penurunan_pendapatan': incomeReductionLevels,
    'absen_kerja_sekolah': yesNoOptions,
    'dampak_usaha_kualitas_udara': businessImpactLevels,
    'pengusaha_umkm': yesNoOptions,
    'usaha_berjalan_normal_saat_kabut': yesNoOptions,
    'mekanisme_usaha': null,
    'mekanisme_usaha_offline': null,
    'penjelasan_usaha_offline': null,
    'alasan_tidak_offline': null,
    'penjelasan_usaha_online': null,
    'alasan_tidak_online': null
}

export const sosialColumns = {
    'frekuensi_aktivitas_luar': activityFrequency,
    'jenis_aktivitas_luar': activityTypes,
    'pekerjaan_di_luar_ruangan': yesNoOptions,
    'jenis_pekerjaan_luar': null,
    'frekuensi_keluar_saat_udara_buruk': generalFrequencyOptions,
    'pendapat_kualitas_lingkungan_pekanbaru': qualityRatings,
    'frekuensi_pakai_masker': generalFrequencyOptions,
    'aksi_saat_udara_buruk': actionsDuringPoorAirQuality,
    'intensitas_penggunaan_masker_kabut_asap': generalFrequencyOptions,
    'akses_informasi_kualitas_udara': easeOfActionOptions,
    'peringatan_pemerintah_kualitas_udara': warningAcknowledgmentOptions,
    'penggunaan_air_purifier': yesNoOptions,
    'kondisi_ventilasi': ventilationCondition,
    'ikut_sosialisasi_pencegahan': everNeverOptions,
    'frekuensi_konsultasi_dokter': generalFrequencyOptions,
    'punya_monitor_kualitas_udara': yesNoOptions,
    'ikut_komunitas_kualitas_udara': yesNoOptions,
    'penghasilan_per_hari': incomeRanges,
    'penghasilan_per_hari_kabut': incomeRanges,
    'usaha_berjalan_saat_kabut': yesNoOptions
}

export const demografiColumns = {
    'penghasilan_per_bulan': incomeRanges,

}