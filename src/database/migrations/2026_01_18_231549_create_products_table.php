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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained()->onDelete('restrict');
            $table->foreignId('brand_id')->constrained()->onDelete('restrict');
            $table->string('name');
            $table->string('code')->unique()->comment('SKU code');
            $table->string('barcode')->nullable();
            $table->enum('type', ['product', 'perishable_product', 'service'])->default('product');
            $table->enum('unit_of_measurement', ['unit', 'piece', 'meter', 'package', 'kilo', 'litre'])->default('unit');
            $table->decimal('sale_price_1', 12, 2)->default(0);
            $table->decimal('sale_price_2', 12, 2)->default(0);
            $table->decimal('sale_price_3', 12, 2)->default(0);
            $table->decimal('sale_price_4', 12, 2)->default(0);
            $table->unsignedBigInteger('minimum_stock')->default(0);
            $table->string('model')->nullable();
            $table->string('size')->nullable();
            $table->string('color')->nullable();
            $table->text('description')->nullable();
            $table->enum('status', ['enabled', 'disabled'])->default('enabled');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
