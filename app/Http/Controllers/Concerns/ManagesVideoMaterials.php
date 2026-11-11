<?php

namespace App\Http\Controllers\Concerns;

use App\Models\Video;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

trait ManagesVideoMaterials
{
    /** @var list<string> */
    protected array $materialExtensions = [
        'pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx',
        'txt', 'csv', 'rtf', 'odt', 'ods', 'odp', 'epub',
        'zip', 'rar', '7z', 'gz',
        'apk', 'exe', 'msi', 'dmg', 'iso',
        'psd', 'ai', 'fig', 'sketch',
        'mp3', 'wav',
    ];

    protected function materialValidationRules(): array
    {
        $extensions = $this->materialExtensions;

        return [
            'materials' => ['nullable', 'array', 'max:20'],
            'materials.*' => [
                'file',
                'max:512000',
                function (string $attribute, mixed $value, \Closure $fail) use ($extensions) {
                    if (! $value instanceof UploadedFile) {
                        $fail('Each course material must be a file.');

                        return;
                    }

                    $ext = strtolower((string) $value->getClientOriginalExtension());

                    if (! in_array($ext, $extensions, true)) {
                        $fail('Materials can be PDF, Word, Excel, PowerPoint, ZIP, or software files (apk, exe, msi, dmg).');
                    }
                },
            ],
        ];
    }

    protected function storeMaterialFiles(Video $video, Request $request): int
    {
        $files = $request->file('materials', []);
        $saved = 0;

        foreach ($files as $file) {
            if (! $file instanceof UploadedFile) {
                continue;
            }

            $path = $file->store("courses/{$video->course_id}/materials/{$video->id}", 'private');

            $video->materials()->create([
                'original_name' => $file->getClientOriginalName(),
                'file_path' => $path,
                'mime_type' => $file->getClientMimeType(),
                'file_size' => $file->getSize() ?: 0,
            ]);

            $saved++;
        }

        return $saved;
    }

    protected function deleteVideoFiles(Video $video): void
    {
        $video->loadMissing('materials');

        foreach ($video->materials as $material) {
            if ($material->file_path) {
                Storage::disk('private')->delete($material->file_path);
            }
        }

        if ($video->video_path) {
            Storage::disk('private')->delete($video->video_path);
        }
    }
}
