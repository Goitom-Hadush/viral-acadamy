<?php

namespace Database\Seeders;

use App\Models\Advertisement;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;

class AdvertisementSeeder extends Seeder
{
    public function run(): void
    {
        if (! Schema::hasTable('advertisements')) {
            $this->command?->warn('advertisements table missing. Run migrations first.');

            return;
        }

        Advertisement::query()
            ->where('image_path', 'like', 'advertisements/seed-%')
            ->get()
            ->each(function (Advertisement $ad) {
                if ($ad->image_path) {
                    Storage::disk('public')->delete($ad->image_path);
                }
                $ad->delete();
            });

        Storage::disk('public')->makeDirectory('advertisements');

        $sponsors = [
            [
                'title' => 'Nile Bank',
                'tier' => 'platinum',
                'link_url' => 'https://example.com/nile-bank',
                'sort_order' => 1,
                'colors' => [226, 232, 240],
                'text' => [30, 41, 59],
            ],
            [
                'title' => 'Habesha Telecom',
                'tier' => 'platinum',
                'link_url' => 'https://example.com/habesha-telecom',
                'sort_order' => 2,
                'colors' => [203, 213, 225],
                'text' => [15, 23, 42],
            ],
            [
                'title' => 'Axum Coffee',
                'tier' => 'gold',
                'link_url' => 'https://example.com/axum-coffee',
                'sort_order' => 1,
                'colors' => [251, 191, 36],
                'text' => [69, 26, 3],
            ],
            [
                'title' => 'Addis Soft',
                'tier' => 'gold',
                'link_url' => 'https://example.com/addis-soft',
                'sort_order' => 2,
                'colors' => [245, 158, 11],
                'text' => [69, 26, 3],
            ],
            [
                'title' => 'Mekelle Media',
                'tier' => 'silver',
                'link_url' => 'https://example.com/mekelle-media',
                'sort_order' => 1,
                'colors' => [148, 163, 184],
                'text' => [30, 41, 59],
            ],
            [
                'title' => 'Tigray Foods',
                'tier' => 'silver',
                'link_url' => 'https://example.com/tigray-foods',
                'sort_order' => 2,
                'colors' => [100, 116, 139],
                'text' => [248, 250, 252],
            ],
            [
                'title' => 'Blue Nile Shop',
                'tier' => 'bronze',
                'link_url' => 'https://example.com/blue-nile-shop',
                'sort_order' => 1,
                'colors' => [180, 83, 9],
                'text' => [255, 247, 237],
            ],
            [
                'title' => 'Unity Motors',
                'tier' => 'bronze',
                'link_url' => 'https://example.com/unity-motors',
                'sort_order' => 2,
                'colors' => [154, 52, 18],
                'text' => [255, 247, 237],
            ],
        ];

        foreach ($sponsors as $index => $sponsor) {
            $path = 'advertisements/seed-'.($index + 1).'-'.$sponsor['tier'].'.png';
            Storage::disk('public')->put(
                $path,
                $this->logoPng(280, 80, $sponsor['colors'], $sponsor['text'], $sponsor['title'])
            );

            Advertisement::create([
                'title' => $sponsor['title'],
                'tier' => $sponsor['tier'],
                'image_path' => $path,
                'video_path' => null,
                'link_url' => $sponsor['link_url'],
                'is_active' => true,
                'sort_order' => $sponsor['sort_order'],
                'start_at' => null,
                'end_at' => null,
            ]);
        }

        $this->command?->info('Seeded '.count($sponsors).' fake sponsor logos (Platinum / Gold / Silver / Bronze).');
    }

    private function logoPng(int $width, int $height, array $bg, array $fg, string $label): string
    {
        // Solid background PNG — enough to look like a logo tile in the strip
        $raw = '';
        for ($y = 0; $y < $height; $y++) {
            $raw .= "\x00";
            $edge = $y < 2 || $y >= $height - 2;
            for ($x = 0; $x < $width; $x++) {
                $border = $edge || $x < 2 || $x >= $width - 2;
                if ($border) {
                    $raw .= chr(max(0, $bg[0] - 40)).chr(max(0, $bg[1] - 40)).chr(max(0, $bg[2] - 40));
                } else {
                    $shade = 1 - (abs(($x / $width) - 0.5) * 0.12);
                    $raw .= chr((int) min(255, $bg[0] * $shade))
                        .chr((int) min(255, $bg[1] * $shade))
                        .chr((int) min(255, $bg[2] * $shade));
                }
            }
        }

        // Draw a simple centered bar as a "logo mark" using fg color blocks
        $markW = (int) ($width * 0.55);
        $markH = 18;
        $markX = (int) (($width - $markW) / 2);
        $markY = (int) (($height - $markH) / 2);
        $rows = str_split($raw, 1 + ($width * 3));

        for ($y = $markY; $y < $markY + $markH; $y++) {
            if (! isset($rows[$y])) {
                continue;
            }
            $row = $rows[$y];
            for ($x = $markX; $x < $markX + $markW; $x++) {
                $offset = 1 + ($x * 3);
                $row[$offset] = chr($fg[0]);
                $row[$offset + 1] = chr($fg[1]);
                $row[$offset + 2] = chr($fg[2]);
            }
            $rows[$y] = $row;
        }

        // Tiny accent square (fake emblem)
        $sq = 14;
        $sx = $markX - $sq - 8;
        $sy = (int) (($height - $sq) / 2);
        if ($sx > 4) {
            for ($y = $sy; $y < $sy + $sq; $y++) {
                if (! isset($rows[$y])) {
                    continue;
                }
                $row = $rows[$y];
                for ($x = $sx; $x < $sx + $sq; $x++) {
                    $offset = 1 + ($x * 3);
                    $row[$offset] = chr($fg[0]);
                    $row[$offset + 1] = chr($fg[1]);
                    $row[$offset + 2] = chr($fg[2]);
                }
                $rows[$y] = $row;
            }
        }

        $raw = implode('', $rows);

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
