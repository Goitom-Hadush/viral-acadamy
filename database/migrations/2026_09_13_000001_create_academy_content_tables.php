<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('content_pages', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('eyebrow')->nullable();
            $table->string('headline');
            $table->text('intro')->nullable();
            $table->string('banner_title')->nullable();
            $table->text('banner_body')->nullable();
            $table->string('meta_description')->nullable();
            $table->timestamps();
        });

        Schema::create('about_highlights', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('body');
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_published')->default(true);
            $table->timestamps();
        });

        Schema::create('testimonials', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('role')->nullable();
            $table->text('quote');
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_published')->default(true);
            $table->timestamps();
        });

        Schema::create('interviews', function (Blueprint $table) {
            $table->id();
            $table->string('guest');
            $table->string('title');
            $table->string('topic')->nullable();
            $table->text('summary')->nullable();
            $table->longText('body')->nullable();
            $table->string('image_path')->nullable();
            $table->string('video_url')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_published')->default(true);
            $table->timestamps();
        });

        $now = now();

        DB::table('content_pages')->insert([
            [
                'slug' => 'about',
                'eyebrow' => 'Our story',
                'headline' => 'A focused academy for learners in Ethiopia and beyond.',
                'intro' => 'Success Life Coaching Academy helps students, instructors, and teams learn through clean video courses, simple dashboards, and a student-first experience built in Mekelle, Tigray.',
                'banner_title' => 'Based in Mekelle. Built for online learning.',
                'banner_body' => 'We design courses around real skills — programming, design, digital marketing, language, and more — so learners can study in Tigrinya, Amharic, and English without a complicated interface.',
                'meta_description' => 'Success Life Coaching Academy is an online learning platform in Mekelle, Tigray, Ethiopia offering practical video courses in Tigrinya, Amharic, and English.',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'slug' => 'testimonials',
                'eyebrow' => 'Social proof',
                'headline' => 'What learners and instructors say.',
                'intro' => 'Real feedback from people using Success Life Coaching Academy to teach, enroll, and finish video courses.',
                'banner_title' => null,
                'banner_body' => null,
                'meta_description' => 'Hear from Success Life Coaching Academy students and instructors about video courses, learning dashboards, and the academy experience.',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'slug' => 'interviews',
                'eyebrow' => 'Conversations',
                'headline' => 'Interviews from the academy.',
                'intro' => 'Stories and conversations with instructors, students, and the people shaping Success Life Coaching Academy.',
                'banner_title' => null,
                'banner_body' => null,
                'meta_description' => 'Interviews with Success Life Coaching Academy instructors, students, and the team behind the online video learning platform.',
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ]);

        DB::table('about_highlights')->insert([
            ['title' => 'Mission', 'body' => 'Make practical skills easy to learn with HD video lessons, clear course paths, and affordable access.', 'sort_order' => 1, 'is_published' => true, 'created_at' => $now, 'updated_at' => $now],
            ['title' => 'Approach', 'body' => 'Every course is video-first: watch, practice, and move through lessons at your own pace.', 'sort_order' => 2, 'is_published' => true, 'created_at' => $now, 'updated_at' => $now],
            ['title' => 'Community', 'body' => 'Students, instructors, and admins share one platform — with roles that stay simple and useful.', 'sort_order' => 3, 'is_published' => true, 'created_at' => $now, 'updated_at' => $now],
        ]);

        DB::table('testimonials')->insert([
            ['name' => 'Sara K.', 'role' => 'Student · Mekelle', 'quote' => 'The player stays focused and the lessons are easy to follow. I finished my first course without getting lost in the dashboard.', 'sort_order' => 1, 'is_published' => true, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Tewelde M.', 'role' => 'Instructor', 'quote' => 'Uploading videos and seeing students enroll is straightforward. The academy looks professional without extra clutter.', 'sort_order' => 2, 'is_published' => true, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Hanna T.', 'role' => 'Student · Design', 'quote' => 'I liked that free and paid courses sit in the same clean catalog. Filtering by category made browsing fast.', 'sort_order' => 3, 'is_published' => true, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Abel M.', 'role' => 'Student · Programming', 'quote' => 'Learning Laravel here felt practical. Short videos, a simple progress view, and I could pick up where I left off.', 'sort_order' => 4, 'is_published' => true, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Lete K.', 'role' => 'Instructor · Creative', 'quote' => 'My students find the course pages attractive and easy to share. The academy style matches how we teach on video.', 'sort_order' => 5, 'is_published' => true, 'created_at' => $now, 'updated_at' => $now],
            ['name' => 'Meron A.', 'role' => 'Student · English', 'quote' => 'The interface is calm and modern. I spend time watching lessons instead of figuring out where to click.', 'sort_order' => 6, 'is_published' => true, 'created_at' => $now, 'updated_at' => $now],
        ]);

        DB::table('interviews')->insert([
            ['guest' => 'Tewelde Mebrahtu', 'title' => 'Building a video-first academy in Mekelle', 'topic' => 'Founder conversation', 'summary' => 'Why Success Life Coaching Academy keeps dashboards simple, courses visual, and learning focused on HD lessons instead of noisy extras.', 'body' => null, 'image_path' => null, 'video_url' => null, 'sort_order' => 1, 'is_published' => true, 'created_at' => $now, 'updated_at' => $now],
            ['guest' => 'Instructor spotlight', 'title' => 'How teachers publish courses students actually finish', 'topic' => 'Teaching', 'summary' => 'A look at thumbnails, lesson order, and short videos that help students stay in the player until the last module.', 'body' => null, 'image_path' => null, 'video_url' => null, 'sort_order' => 2, 'is_published' => true, 'created_at' => $now, 'updated_at' => $now],
            ['guest' => 'Student voices', 'title' => 'Learning programming and design from Tigray', 'topic' => 'Learner stories', 'summary' => 'Students talk about studying at their own pace, mixing Tigrinya and English lessons, and using promo access to start faster.', 'body' => null, 'image_path' => null, 'video_url' => null, 'sort_order' => 3, 'is_published' => true, 'created_at' => $now, 'updated_at' => $now],
            ['guest' => 'Product walkthrough', 'title' => 'Inside the student, instructor, and admin roles', 'topic' => 'Platform', 'summary' => 'A guided tour of enrollment, progress, course publishing, and the clean tube-style browsing experience.', 'body' => null, 'image_path' => null, 'video_url' => null, 'sort_order' => 4, 'is_published' => true, 'created_at' => $now, 'updated_at' => $now],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('interviews');
        Schema::dropIfExists('testimonials');
        Schema::dropIfExists('about_highlights');
        Schema::dropIfExists('content_pages');
    }
};
