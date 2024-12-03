<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'first_name' => 'admin',
            'last_name' => 'PCR',
            'email' => 'admin@pcr.ac.id',
            'password' => bcrypt('admin123'),
            'role' => 'super_admin', // Make sure to hash the password
        ]);
    }
}
