<?php

namespace Database\Seeders;

use App\Models\Office;
use Illuminate\Database\Seeder;

class OfficeSeeder extends Seeder
{
    public function run(): void
    {
        $offices = [
            ['name' => "Mayor's Office",                      'code' => 'MO'],
            ['name' => 'Human Resource Management Office',    'code' => 'HRMO'],
            ['name' => 'Municipal Planning and Development Office', 'code' => 'MPDO'],
            ['name' => 'Municipal Budget Office',             'code' => 'MBO'],
            ['name' => 'Municipal Treasurer\'s Office',       'code' => 'MTO'],
            ['name' => 'Municipal Accounting Office',         'code' => 'MACCO'],
            ['name' => 'Municipal Assessor\'s Office',        'code' => 'MASSO'],
            ['name' => 'Municipal Civil Registrar',           'code' => 'MCR'],
            ['name' => 'Municipal Health Office',             'code' => 'MHO'],
            ['name' => 'Municipal Social Welfare and Development Office', 'code' => 'MSWDO'],
            ['name' => 'Municipal Agriculture Office',        'code' => 'MAO'],
            ['name' => 'Municipal Engineering Office',        'code' => 'MEO'],
            ['name' => 'Municipal Environment and Natural Resources Office', 'code' => 'MENRO'],
            ['name' => 'Bids and Awards Committee',           'code' => 'BAC'],
        ];

        foreach ($offices as $office) {
            Office::updateOrCreate(
                ['code' => $office['code']],
                ['name' => $office['name'], 'is_active' => true],
            );
        }
    }
}