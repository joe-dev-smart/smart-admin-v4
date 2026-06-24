<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('movements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->foreignId('store_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('stock_id')->nullable()->constrained()->nullOnDelete();
            $table->enum('type', ['entry', 'entry_transfer', 'sale_return', 'remove', 'out_transfer', 'sale']);
            $table->bigInteger('quantity');
            $table->text('system_description')->nullable();
            $table->text('user_description')->nullable();
            // Links the paired movement when doing a store-to-store transfer
            $table->foreignId('transfer_movement_id')->nullable()->constrained('movements')->nullOnDelete();
            // Polymorphic reference to the source document (Purchase, Transfer, Sale)
            $table->nullableMorphs('movable');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('movements');
    }
};
