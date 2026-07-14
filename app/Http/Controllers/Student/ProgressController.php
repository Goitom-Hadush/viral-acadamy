<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Video;
use App\Models\VideoProgress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProgressController extends Controller
{
    public function update(Request $request)
    {
        $validated = $request->validate([
            'video_id' => 'required|exists:videos,id',
            'watched_seconds' => 'required|integer|min:0',
        ]);

        $user = Auth::user();
        
        $progress = VideoProgress::updateOrCreate(
            [
                'user_id' => $user->id,
                'video_id' => $validated['video_id'],
            ],
            [
                'watched_seconds' => $validated['watched_seconds'],
                'completed' => $validated['watched_seconds'] >= Video::find($validated['video_id'])->duration ? true : false,
            ]
        );

        return response()->json(['success' => true]);
    }
}
