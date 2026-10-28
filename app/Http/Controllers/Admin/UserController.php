<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreUserRequest;
use App\Http\Requests\Admin\SyncUserApplicationsRequest;
use App\Http\Requests\Admin\UpdateUserRequest;
use App\Models\Application;
use App\Models\Office;
use App\Models\User;
use App\Services\UserImportService;
use App\Services\UserService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function __construct(private readonly UserService $users)
    {
    }

    public function index(Request $request): Response
    {
        $search = trim((string) $request->query('search', ''));

        $users = User::query()
            ->with(['office:id,name', 'applications:id'])
            ->withCount('applications')
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('username', 'like', "%{$search}%");
                });
            })
            ->orderBy('name')
            ->paginate(20)
            ->withQueryString()
            ->through(fn (User $user) => [
                'id'                 => $user->id,
                'name'               => $user->name,
                'username'           => $user->username,
                'email'              => $user->email,
                'employment_status' => $user->employment_status,
                'employment_label'  => $user->employmentStatusLabel(),
                'role'               => $user->role,
                'office'             => $user->office?->name,
                'is_active'          => $user->is_active,
                'applications_count' => $user->applications_count,
                'application_ids'    => $user->applications->pluck('id')->all(),
            ]);

        return Inertia::render('Admin/Users/Index', [
            'users'            => $users,
            'filters'          => ['search' => $search],
            'offices'          => Office::query()->active()->ordered()->get(['id', 'name']),
            'roles'            => config('portal.roles'),
            'employment_statuses' => config('portal.employment_statuses'),
            'apps'             => Application::query()->ordered()->get(['id', 'name', 'is_active']),
            'default_password' => UserImportService::DEFAULT_PASSWORD,
        ]);
    }

    public function store(StoreUserRequest $request): RedirectResponse
    {
        $this->users->create($request->user(), $request->validated());

        return back()->with('success', 'User created.');
    }

    public function update(UpdateUserRequest $request, User $user): RedirectResponse
    {
        $this->users->update($request->user(), $user, $request->validated());

        return back()->with('success', 'User updated.');
    }

    public function toggleActive(Request $request, User $user): RedirectResponse
    {
        $this->users->toggleActive($request->user(), $user);

        return back()->with('success', 'User status updated.');
    }

    public function syncApplications(SyncUserApplicationsRequest $request, User $user): RedirectResponse
    {
        $this->users->syncApplications(
            $request->user(),
            $user,
            $request->validated('applications'),
        );

        return back()->with('success', 'Application access updated.');
    }
}