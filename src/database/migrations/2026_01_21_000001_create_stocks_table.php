<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stocks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->foreignId('store_id')->constrained()->cascadeOnDelete();
            $table->bigInteger('quantity')->default(0);
            $table->string('batch')->nullable();
            $table->date('expiration_date')->nullable();
            $table->timestamps();

            // Composite unique to allow one stock record per product+store (per batch if needed)
            $table->unique(['product_id', 'store_id', 'batch'], 'stocks_product_store_batch_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stocks');
    }
};
