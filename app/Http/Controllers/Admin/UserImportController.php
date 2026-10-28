<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ImportUsersRequest;
use App\Models\Office;
use App\Services\UserImportService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class UserImportController extends Controller
{
    public function __construct(private readonly UserImportService $importer)
    {
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Users/Import', [
            'offices' => Office::query()->active()->ordered()->get(['id', 'name', 'code']),
            'roles'   => config('portal.roles'),
            'defaultPassword' => UserImportService::DEFAULT_PASSWORD,
        ]);
    }

    public function store(ImportUsersRequest $request): RedirectResponse
    {
        $created = $this->importer->import($request->user(), $request->file('file'));

        return redirect()
            ->route('admin.users.index')
            ->with('success', count($created).' user(s) imported.')
            ->with('imported_users', $created);
    }
}