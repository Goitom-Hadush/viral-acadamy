<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('purchases', function (Blueprint $table) {
            $table->timestamp('expires_at')->nullable()->after('status');
        });

        // Backfill existing purchases with 6-month validity from created_at
        $purchases = DB::table('purchases')->get();
        foreach ($purchases as $p) {
            $createdAt = $p->created_at ? Carbon::parse($p->created_at) : Carbon::now();
            $expiresAt = $createdAt->copy()->addMonths(6);
            DB::table('purchases')->where('id', $p->id)->update([
                'expires_at' => $expiresAt,
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('purchases', function (Blueprint $table) {
            $table->dropColumn('expires_at');
        });
    }
};
