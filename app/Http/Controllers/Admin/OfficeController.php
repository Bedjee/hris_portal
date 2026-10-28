<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\OfficeRequest;
use App\Models\Office;
use App\Services\AuditLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class OfficeController extends Controller
{
    public function __construct(private readonly AuditLogger $audit)
    {
    }

    public function index(Request $request): Response
    {
        $search = trim((string) $request->query('search', ''));

        $offices = Office::query()
            ->withCount('users')
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('code', 'like', "%{$search}%");
                });
            })
            ->orderBy('name')
            ->paginate(20)
            ->withQueryString()
            ->through(fn (Office $office) => [
                'id'         => $office->id,
                'name'       => $office->name,
                'code'       => $office->code,
                'is_active'  => $office->is_active,
                'users_count' => $office->users_count,
            ]);

        return Inertia::render('Admin/Offices/Index', [
            'offices' => $offices,
            'filters' => ['search' => $search],
        ]);
    }

    public function store(OfficeRequest $request): RedirectResponse
    {
        $office = Office::create([
            'name'      => $request->validated('name'),
            'code'      => Str::upper($request->validated('code')),
            'is_active' => true,
        ]);

        $this->audit->log($request->user(), 'office.created', $office, [
            'name' => $office->name,
            'code' => $office->code,
        ]);

        return back()->with('success', 'Office created.');
    }

    public function update(OfficeRequest $request, Office $office): RedirectResponse
    {
        $newName = $request->validated('name');

        if ($newName === $office->name) {
            return back();
        }

        $oldName = $office->name;
        $office->update(['name' => $newName]);

        $this->audit->log($request->user(), 'office.renamed', $office, [
            'code'     => $office->code,
            'old_name' => $oldName,
            'new_name' => $newName,
        ]);

        return back()->with('success', 'Office renamed.');
    }

    public function toggleActive(Request $request, Office $office): RedirectResponse
    {
        $office->update(['is_active' => ! $office->is_active]);

        $this->audit->log(
            $request->user(),
            $office->is_active ? 'office.activated' : 'office.deactivated',
            $office,
            [
                'name'       => $office->name,
                'code'       => $office->code,
                'users_count' => $office->users()->count(),
            ],
        );

        return back()->with('success', 'Office status updated.');
    }
}