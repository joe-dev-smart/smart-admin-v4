<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sales', function (Blueprint $table) {
            $table->id();
            $table->foreignId('store_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('client_id')->constrained()->cascadeOnDelete();
            $table->string('code')->unique();
            $table->dateTime('sale_date');
            $table->decimal('subtotal', 12, 2)->default(0);
            $table->decimal('discount', 12, 2)->default(0);
            $table->enum('payment', ['cash', 'bank_deposit', 'card', 'qr_payment', 'check', 'payment_plan'])->default('cash');
            $table->decimal('paid', 12, 2)->default(0)->comment('Amount actually paid; if less than total a debt exists');
            $table->enum('has_debt', ['no', 'yes', 'paid'])->default('no');
            $table->text('observation')->nullable();
            $table->enum('status', ['valid', 'annulled', 'draft'])->default('valid');
            $table->timestamps();
        });

        Schema::create('sale_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sale_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->foreignId('stock_id')->nullable()->constrained()->nullOnDelete();
            $table->string('product_name')->nullable()->comment('Snapshot of name at sale time');
            $table->bigInteger('quantity');
            $table->decimal('sale_price', 12, 2);
            $table->text('detail')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sale_items');
        Schema::dropIfExists('sales');
    }
};
