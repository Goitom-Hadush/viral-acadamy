import InstructorLayout from '@/Layouts/InstructorLayout';
import { useForm, router } from '@inertiajs/react';
import { useState } from 'react';

export default function CourseIndex({ categories = [], courses = [], auth }) {
    
    const [expandedCourse, setExpandedCourse] = useState(null);
    
    // ---------------------------------------------------------
    // FORM 1: Create New Course
    // ---------------------------------------------------------
    const { data, setData, post, processing, reset, errors } = useForm({
        title: '',
        category_id: '',
        description: '',
        price: '',
        thumbnail: null, 
    });

    const handleCourseSubmit = (e) => {
        e.preventDefault();
        post(route('instructor.courses.store'), {
            onSuccess: () => reset('title', 'category_id', 'description', 'price', 'thumbnail'),
            forceFormData: true, 
        });
    };

    // ---------------------------------------------------------
    // FORM 2: Upload Video
    // ---------------------------------------------------------
    const { data: videoData, setData: setVideoData, post: postVideo, processing: videoProcessing, reset: resetVideo, errors: videoErrors } = useForm({
        course_id: '',
        title: '',
        video_file: null,
        sequence: 1,
    });

    const handleVideoSubmit = (e) => {
        e.preventDefault();
        postVideo(route('instructor.videos.store', videoData.course_id), {
            forceFormData: true,
            onSuccess: () => resetVideo('title', 'video_file', 'sequence'),
        });
    };

    // ---------------------------------------------------------
    // PAGE RENDER
    // ---------------------------------------------------------
    return (
        <InstructorLayout>
            {/* Hero Section */}
            <div className="mb-8 rounded-3xl hero-gradient p-8 text-white shadow-xl shadow-indigo-500/25 sm:p-10 animate-fade-in">
                <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-100">Instructor Studio</p>
                </div>
                <h1 className="text-3xl font-black tracking-tight sm:text-4xl">My Courses</h1>
                <p className="mt-3 max-w-2xl text-lg leading-relaxed text-indigo-100">
                    Create, organize, and publish modern video courses. You have {courses.length} course{courses.length !== 1 ? 's' : ''}.
                </p>
            </div>

            {/* ---------------------------------------------------------
                 SECTION 1: Create Course Form 
                 --------------------------------------------------------- */}
            <div className="surface-card mb-8 p-8">
                <h2 className="mb-6 border-b border-slate-100 pb-3 text-xl font-semibold text-slate-900">Create New Course</h2>
                <form onSubmit={handleCourseSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    <div>
                        <label className="mb-2 block text-sm font-semibold tracking-wide text-slate-700">Course Title</label>
                        <input 
                            type="text" 
                            value={data.title} 
                            onChange={e => setData('title', e.target.value)} 
                            className="input-modern"
                            placeholder="Enter course title"
                        />
                        {errors.title && <p className="text-red-500 text-xs mt-2">{errors.title}</p>}
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold tracking-wide text-slate-700">Category</label>
                        <select 
                            value={data.category_id} 
                            onChange={e => setData('category_id', e.target.value)} 
                            className="input-modern"
                        >
                            <option value="">Select Category</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                        {errors.category_id && <p className="text-red-500 text-xs mt-2">{errors.category_id}</p>}
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold tracking-wide text-slate-700">Price (ETB)</label>
                        <input 
                            type="number" 
                            step="0.01" 
                            value={data.price} 
                            onChange={e => setData('price', e.target.value)} 
                            className="input-modern"
                            placeholder="0.00"
                        />
                        {errors.price && <p className="text-red-500 text-xs mt-2">{errors.price}</p>}
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold tracking-wide text-slate-700">Thumbnail Image</label>
                        <input 
                            type="file" 
                            onChange={e => setData('thumbnail', e.target.files[0])} 
                            className="input-modern"
                        />
                        {errors.thumbnail && <p className="text-red-500 text-xs mt-2">{errors.thumbnail}</p>}
                    </div>

                    <div className="lg:col-span-2">
                        <label className="mb-2 block text-sm font-semibold tracking-wide text-slate-700">Description</label>
                        <textarea 
                            rows={4} 
                            value={data.description} 
                            onChange={e => setData('description', e.target.value)} 
                            className="input-modern"
                            placeholder="Describe your course..."
                        ></textarea>
                        {errors.description && <p className="text-red-500 text-xs mt-2">{errors.description}</p>}
                    </div>

                    <div className="lg:col-span-2">
                        <button 
                            type="submit" 
                            disabled={processing} 
                            className="btn-primary w-full lg:w-auto"
                        >
                            {processing ? 'Creating...' : 'Create Course'}
                        </button>
                    </div>
                </form>
            </div>

            {/* ---------------------------------------------------------
                 SECTION 2: Existing Courses with Videos
                 --------------------------------------------------------- */}
            <div className="space-y-6 mb-8 animate-slide-up">
                {courses.length === 0 ? (
                    <div className="surface-card p-12 text-center">
                        <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-indigo-100">
                            <svg className="h-10 w-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <h3 className="mb-2 text-2xl font-bold text-slate-900">No courses yet!</h3>
                        <p className="text-slate-500">Create your first course above to get started.</p>
                    </div>
                ) : (
                    courses.map((course) => (
                        <div key={course.id} className="surface-card card-hover overflow-hidden">
                            {/* Course Header */}
                            <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white p-6">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900">{course.title}</h3>
                                        <p className="mt-1 text-sm text-slate-500">{course.videos?.length || 0} videos • {course.price} ETB</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`badge ${
                                            course.status === 'published' 
                                                ? 'badge-success' 
                                                : 'badge-warning'
                                        }`}>
                                            {course.status}
                                        </span>
                                        <button 
                                            onClick={() => router.patch(route('instructor.courses.publish', course.id))} 
                                            className={`rounded-2xl px-4 py-2 text-sm font-semibold transition-all ${
                                                course.status === 'draft' 
                                                    ? 'bg-green-600 hover:bg-green-700 text-white shadow-md' 
                                                    : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                                            }`}
                                        >
                                            {course.status === 'draft' ? 'Publish' : 'Unpublish'}
                                        </button>
                                        <button 
                                            onClick={() => {
                                                const newExpanded = expandedCourse === course.id ? null : course.id;
                                                setExpandedCourse(newExpanded);
                                                if (newExpanded) {
                                                    setVideoData('course_id', course.id);
                                                }
                                            }}
                                            className="rounded-2xl p-2 transition-colors hover:bg-slate-100"
                                        >
                                            <svg className={`w-5 h-5 text-slate-600 transition-transform ${expandedCourse === course.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Expanded Content - Videos List */}
                            {expandedCourse === course.id && (
                                <div className="border-t border-slate-200 p-6">
                                    <h4 className="mb-4 text-sm font-semibold text-slate-700">Uploaded Videos</h4>
                                    {course.videos?.length > 0 ? (
                                        <div className="space-y-3">
                                            {course.videos.map((video) => (
                                                <div key={video.id} className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4 transition-colors hover:bg-slate-100">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 font-bold text-indigo-600">
                                                        {video.sequence}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-medium text-slate-900">{video.title}</p>
                                                    </div>
                                                    <div className="text-indigo-500">
                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="py-6 text-center text-slate-500">
                                            No videos uploaded yet! Use the form below to add videos to this course.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* ---------------------------------------------------------
                 SECTION 3: Upload Video Form 
                 --------------------------------------------------------- */}
            <div className="surface-card p-8">
                <h2 className="mb-6 border-b border-slate-100 pb-3 text-xl font-semibold text-slate-900">Upload Video to a Course</h2>
                
                {courses.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-slate-500">You must create a course above before you can upload videos.</p>
                    </div>
                ) : (
                    <form onSubmit={handleVideoSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        
                        <div>
                            <label className="mb-2 block text-sm font-semibold tracking-wide text-slate-700">Select Course</label>
                            <select 
                                value={videoData.course_id} 
                                onChange={e => setVideoData('course_id', e.target.value)} 
                                className="input-modern"
                                required
                            >
                                <option value="">Choose a course...</option>
                                {courses.map(c => (
                                    <option key={c.id} value={c.id}>{c.title}</option>
                                ))}
                            </select>
                            {videoErrors.course_id && <p className="text-red-500 text-xs mt-2">{videoErrors.course_id}</p>}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold tracking-wide text-slate-700">Video Title</label>
                            <input 
                                type="text" 
                                value={videoData.title} 
                                onChange={e => setVideoData('title', e.target.value)} 
                                className="input-modern"
                                placeholder="e.g., Introduction to Routing"
                                required
                            />
                            {videoErrors.title && <p className="text-red-500 text-xs mt-2">{videoErrors.title}</p>}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold tracking-wide text-slate-700">Video File (MP4)</label>
                            <input 
                                type="file" 
                                onChange={e => setVideoData('video_file', e.target.files[0])} 
                                className="input-modern"
                                accept="video/mp4"
                                required
                            />
                            {videoErrors.video_file && <p className="text-red-500 text-xs mt-2">{videoErrors.video_file}</p>}
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-semibold tracking-wide text-slate-700">Order / Sequence</label>
                            <input 
                                type="number" 
                                min="1" 
                                value={videoData.sequence} 
                                onChange={e => setVideoData('sequence', e.target.value)} 
                                className="input-modern"
                                required
                            />
                        </div>

                        <div className="lg:col-span-2">
                            <button 
                                type="submit" 
                                disabled={videoProcessing} 
                            className="btn-primary w-full lg:w-auto"
                            >
                                {videoProcessing ? 'Uploading to Vault...' : 'Upload Secure Video'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </InstructorLayout>
    );
}
