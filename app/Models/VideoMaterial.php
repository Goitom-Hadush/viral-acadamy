<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VideoMaterial extends Model
{
    protected $fillable = [
        'video_id',
        'original_name',
        'file_path',
        'mime_type',
        'file_size',
    ];

    protected $casts = [
        'file_size' => 'integer',
    ];

    public function video(): BelongsTo
    {
        return $this->belongsTo(Video::class);
    }
}
