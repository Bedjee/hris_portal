<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('applications', function (Blueprint $table) {
            // Passport's oauth_clients.id, when SSO is enabled.
            // The existing `client_id` string column stays reserved for future use.
            $table->unsignedBigInteger('oauth_client_id')
                ->nullable()
                ->after('client_id');

            // Where the client wants the authorization code delivered.
            $table->string('redirect_uri', 2048)
                ->nullable()
                ->after('oauth_client_id');

            // When SSO was enabled (for auditing/UI).
            $table->timestamp('sso_enabled_at')
                ->nullable()
                ->after('redirect_uri');

            $table->index('oauth_client_id');
        });
    }

    public function down(): void
    {
        Schema::table('applications', function (Blueprint $table) {
            $table->dropIndex(['oauth_client_id']);
            $table->dropColumn(['oauth_client_id', 'redirect_uri', 'sso_enabled_at']);
        });
    }
};