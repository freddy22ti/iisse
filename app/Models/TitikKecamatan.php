<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TitikKecamatan extends Model
{
    use HasFactory;

    protected $fillable = [
        'lattitude',
        'longitude',
        'kelurahan',
        'kecamatan',
    ];
}
