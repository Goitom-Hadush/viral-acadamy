<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\CourseReel;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class CourseReelSeeder extends Seeder
{
    public function run(): void
    {
        $courses = Course::query()->orderByDesc('id')->get();

        if ($courses->isEmpty()) {
            $this->command?->warn('No courses found. Create courses before seeding reels.');

            return;
        }

        CourseReel::query()->where('media_path', 'like', 'reels/seed-%')->get()->each(function (CourseReel $reel) {
            Storage::disk('public')->delete($reel->media_path);
            $reel->delete();
        });

        Storage::disk('public')->makeDirectory('reels');

        $captions = [
            'What you will learn this week',
            'A quick look inside the course',
            'New lesson drop — start here',
            'Student favorite this month',
            'From zero to first project',
            'Preview the course vibe',
        ];

        $palettes = [
            [184, 115, 51],
            [45, 90, 135],
            [90, 45, 110],
            [30, 110, 90],
            [150, 55, 70],
            [70, 70, 90],
        ];

        foreach ($captions as $index => $caption) {
            $course = $courses[$index % $courses->count()];
            $path = 'reels/seed-'.($index + 1).'.png';
            Storage::disk('public')->put($path, $this->gradientPng(360, 640, $palettes[$index]));

            CourseReel::create([
                'course_id' => $course->id,
                'media_type' => 'image',
                'media_path' => $path,
                'caption' => $caption,
                'duration' => null,
                'is_published' => true,
                'created_at' => now()->subMinutes(60 - ($index * 8)),
                'updated_at' => now()->subMinutes(60 - ($index * 8)),
            ]);
        }
    }

    private function gradientPng(int $width, int $height, array $rgb): string
    {
        $raw = '';
        for ($y = 0; $y < $height; $y++) {
            $t = $y / max($height - 1, 1);
            $r = (int) max(0, min(255, $rgb[0] * (1 - $t * 0.45) + 18));
            $g = (int) max(0, min(255, $rgb[1] * (1 - $t * 0.45) + 12));
            $b = (int) max(0, min(255, $rgb[2] * (1 - $t * 0.45) + 8));
            $raw .= "\x00";
            $raw .= str_repeat(chr($r).chr($g).chr($b), $width);
        }

        return "\x89PNG\r\n\x1a\n"
            .$this->pngChunk('IHDR', pack('N2C5', $width, $height, 8, 2, 0, 0, 0))
            .$this->pngChunk('IDAT', gzcompress($raw, 9))
            .$this->pngChunk('IEND', '');
    }

    private function pngChunk(string $type, string $data): string
    {
        return pack('N', strlen($data)).$type.$data.pack('N', crc32($type.$data));
    }
}
