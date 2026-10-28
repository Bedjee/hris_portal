<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();

            // Actor — nullable so system-initiated events can be recorded.
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();

            // Namespaced action, e.g. "auth.login", "user.deactivated".
            $table->string('action', 100);

            // Polymorphic subject — the thing that was acted upon.
            $table->nullableMorphs('subject');

            // Request context. Kept short; never stores passwords or raw bodies.
            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent', 500)->nullable();

            // Free-form structured detail (old/new values, counts, slugs).
            $table->json('context')->nullable();

            $table->timestamp('created_at')->useCurrent();

            $table->index('action');
            $table->index('created_at');
            // user_id and (subject_type, subject_id) already indexed by FK/morphs
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
    }
};