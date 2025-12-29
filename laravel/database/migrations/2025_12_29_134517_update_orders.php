<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->date('paid_at')->nullable()->default(null)->change();

            $table->enum('status', [
                'draft',
                'pending',
                'processing',
                'shipped',
                'delivered',
                'cancelled'
            ])->default('pending')->change();
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            // rollback to previous state (adjust if your old enum was different)
            $table->date('paid_at')->nullable(false)->default(null)->change();

            $table->enum('status', [
                'pending',
                'processing',
                'shipped',
                'delivered',
                'cancelled'
            ])->default('pending')->change();
        });
    }

};
