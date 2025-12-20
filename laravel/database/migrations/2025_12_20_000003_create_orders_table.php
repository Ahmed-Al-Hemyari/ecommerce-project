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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained();
            // Shipping
            $table->string('address1');
            $table->string('address2')->nullable();
            $table->string('city');
            $table->string('zip');
            $table->string('country');
            $table->string('paymentMethod');
            $table->decimal('totalAmount', 10, 2);
            $table->enum('status', ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"])->default("Pending");
            $table->boolean('payed')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
