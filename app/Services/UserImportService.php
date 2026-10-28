<?php

namespace App\Services;

use App\Models\Office;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class UserImportService
{
    public const DEFAULT_PASSWORD = 'ahappierwayforward';

    public function __construct(private readonly AuditLogger $audit)
    {
    }

    /**
     * Parse and import users from a CSV file.
     *
     * Expected columns (header row required): name, department, role
     *   - name:       full name, e.g. "Juan Dela Cruz Santos"
     *   - department: office CODE, e.g. "HRMO"
     *   - role:       one of config('portal.roles')
     *
     * @return array<int, array{name:string, username:string, office:string, role:string}>
     */
    public function import(User $actor, UploadedFile $file): array
    {
        $rows = $this->parseCsv($file);

        if ($rows === []) {
            throw ValidationException::withMessages([
                'file' => 'The file contains no data rows.',
            ]);
        }

        $this->validateRows($rows);

        $offices = Office::query()->active()->get()->keyBy(fn ($o) => Str::upper($o->code));
        $taken   = array_flip(User::query()->pluck('username')->all());

        return DB::transaction(function () use ($actor, $file, $rows, $offices, &$taken) {
            $created = [];

            foreach ($rows as $row) {
                /** @var Office $office */
                $office = $offices[Str::upper($row['department'])];

                $username = $this->generateUsername($row['name'], $taken);
                $taken[$username] = true;

                $user = new User();
                $user->name                 = $row['name'];
                $user->username             = $username;
                $user->password             = self::DEFAULT_PASSWORD;
                $user->role                 = $row['role'];
                $user->employment_status = $row['employment_status'];
                $user->office_id            = $office->id;
                $user->is_active            = true;
                $user->must_change_password = true;
                $user->save();

               $created[] = [
    'name'              => $user->name,
    'username'          => $user->username,
    'office'            => $office->name,
    'role'              => $user->role,
    'employment_status' => $user->employmentStatusLabel(),
];
            }

            $this->audit->log($actor, 'users.bulk_imported', null, [
                'filename'  => $file->getClientOriginalName(),
                'count'     => count($created),
                'usernames' => array_column($created, 'username'),
            ]);

            return $created;
        });
    }

    /**
     * @return array<int, array{name:string, department:string, role:string, _line:int}>
     */
    private function parseCsv(UploadedFile $file): array
    {
        $handle = fopen($file->getRealPath(), 'r');
        if ($handle === false) {
            throw ValidationException::withMessages(['file' => 'Could not read the uploaded file.']);
        }

        // Strip UTF-8 BOM (Excel likes to add one)
        $first = fgets($handle);
        if ($first !== false && str_starts_with($first, "\xEF\xBB\xBF")) {
            $first = substr($first, 3);
        }
        rewind($handle);

        $header = fgetcsv($handle);
        if ($header === false) {
            fclose($handle);
            throw ValidationException::withMessages(['file' => 'The file appears to be empty.']);
        }

        $header = array_map(fn ($h) => Str::lower(trim((string) $h)), $header);
       $required = ['name', 'department', 'role', 'employment_status'];

        foreach ($required as $col) {
            if (! in_array($col, $header, true)) {
                fclose($handle);
                throw ValidationException::withMessages([
                    'file' => "Missing required column: {$col}. Expected header: name, department, role.",
                ]);
            }
        }

        $index = array_flip($header);
        $rows  = [];
        $line  = 1;

        while (($data = fgetcsv($handle)) !== false) {
            $line++;

            // Skip fully-blank rows
            if (count(array_filter($data, fn ($v) => trim((string) $v) !== '')) === 0) {
                continue;
            }

            $rows[] = [
                'name'       => trim((string) ($data[$index['name']] ?? '')),
                'department' => trim((string) ($data[$index['department']] ?? '')),
                'role'       => trim((string) ($data[$index['role']] ?? '')),
                'employment_status' => trim((string) ($data[$index['employment_status']] ?? '')),
                '_line'      => $line,
            ];
        }

        fclose($handle);

        return $rows;
    }

    /**
     * @param array<int, array{name:string, department:string, role:string, _line:int}> $rows
     */
    private function validateRows(array $rows): void
    {
        $activeCodes = Office::query()->active()->pluck('code')
            ->map(fn ($c) => Str::upper($c))->all();

        $validRoles  = config('portal.roles');
        $errors      = [];
        $validStatuses = array_keys(config('portal.employment_statuses'));

        foreach ($rows as $row) {
            $line = $row['_line'];

            if ($row['name'] === '' || Str::length($row['name']) < 2) {
                $errors[] = "Line {$line}: name is required.";
                continue;
            }

            if ($row['department'] === '') {
                $errors[] = "Line {$line}: department is required.";
            } elseif (! in_array(Str::upper($row['department']), $activeCodes, true)) {
                $errors[] = "Line {$line}: department code '{$row['department']}' is not an active office.";
            }

            if ($row['role'] === '') {
                $errors[] = "Line {$line}: role is required.";
            } elseif (! in_array($row['role'], $validRoles, true)) {
                $errors[] = "Line {$line}: role '{$row['role']}' is not valid. Allowed: ".implode(', ', $validRoles).'.';
            }

            if ($row['employment_status'] === '') {
    $errors[] = "Line {$line}: employment_status is required.";
} elseif (! in_array($row['employment_status'], $validStatuses, true)) {
    $errors[] = "Line {$line}: employment_status '{$row['employment_status']}' is not valid. Allowed: ".implode(', ', $validStatuses).'.';
}
        }

        if ($errors !== []) {
            throw ValidationException::withMessages([
                'file' => $errors,
            ]);
        }
    }

    /**
     * Derive a username from the full name. Collisions are suffixed: 2, 3, ...
     *
     * @param array<string, int> $taken  username => true, mutated as we allocate
     */
    private function generateUsername(string $fullName, array $taken): string
    {
        // Lowercase, strip anything that isn't a letter or space
        $clean = preg_replace('/[^a-z\s]/u', '', Str::lower(Str::ascii($fullName)));
        $parts = preg_split('/\s+/', trim((string) $clean));
        $parts = array_values(array_filter($parts, fn ($p) => $p !== ''));

        if ($parts === []) {
            $parts = ['user'];
        }

        $first = $parts[0];
        $last  = count($parts) > 1 ? $parts[count($parts) - 1] : '';

        $base = $last !== '' ? "{$first}.{$last}" : $first;
        $base = Str::limit($base, 50, '');

        // alpha_dash rule in StoreUserRequest requires letters, numbers, dash, underscore.
        // '.' isn't allowed there, so we replace with '_' — but that's uglier.
        // Instead: allow dots in usernames and relax the rule? No. Use underscore.
        $base = str_replace('.', '.', $base); // keep the dot — we'll relax the validator

        $username = $base;
        $suffix   = 2;

        while (isset($taken[$username])) {
            $username = $base.$suffix;
            $suffix++;
        }

        return $username;
    }
}