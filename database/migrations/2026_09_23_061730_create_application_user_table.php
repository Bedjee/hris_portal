<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('application_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('application_id')->constrained()->cascadeOnDelete();
            $table->timestamps();

            // One grant per user/application pair
            $table->unique(['user_id', 'application_id']);
            // Reverse lookup (user_id already indexed by the unique composite)
            $table->index('application_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('application_user');
    }
};