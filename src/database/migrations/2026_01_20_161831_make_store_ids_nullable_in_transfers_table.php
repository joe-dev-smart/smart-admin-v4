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
        Schema::table('transfers', function (Blueprint $table) {
            // Drop foreign key constraints first
            $table->dropForeign(['from_store_id']);
            $table->dropForeign(['to_store_id']);

            // Make columns nullable
            $table->unsignedBigInteger('from_store_id')->nullable()->change();
            $table->unsignedBigInteger('to_store_id')->nullable()->change();

            // Re-add foreign key constraints with nullable support
            $table->foreign('from_store_id')->references('id')->on('stores')->onDelete('restrict');
            $table->foreign('to_store_id')->references('id')->on('stores')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transfers', function (Blueprint $table) {
            // Drop foreign key constraints
            $table->dropForeign(['from_store_id']);
            $table->dropForeign(['to_store_id']);

            // Make columns required again
            $table->unsignedBigInteger('from_store_id')->nullable(false)->change();
            $table->unsignedBigInteger('to_store_id')->nullable(false)->change();

            // Re-add foreign key constraints
            $table->foreign('from_store_id')->references('id')->on('stores')->onDelete('restrict');
            $table->foreign('to_store_id')->references('id')->on('stores')->onDelete('restrict');
        });
    }
};
