<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Drop the incorrectly-typed column, then re-add it as a UUID.
        // Two separate Schema::table calls because dropping and re-adding
        // in one call has ordering issues on some MySQL versions.
        Schema::table('applications', function (Blueprint $table) {
            $table->dropColumn('oauth_client_id');
        });

        Schema::table('applications', function (Blueprint $table) {
            $table->uuid('oauth_client_id')->nullable()->after('client_id');
            $table->index('oauth_client_id');
        });
    }

    public function down(): void
    {
        Schema::table('applications', function (Blueprint $table) {
            $table->dropIndex(['oauth_client_id']);
            $table->dropColumn('oauth_client_id');
        });

        Schema::table('applications', function (Blueprint $table) {
            $table->unsignedBigInteger('oauth_client_id')->nullable()->after('client_id');
            $table->index('oauth_client_id');
        });
    }
};