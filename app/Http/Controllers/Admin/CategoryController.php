<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    // 1. READ: Show all categories on the page
    public function index()
    {
        $categories = Category::withCount('courses')->orderBy('name', 'asc')->get();
        
        if (request()->wantsJson() || request()->is('test-categories')) {
            return response()->json(['categories' => $categories]);
        }
        
        return Inertia::render('Admin/Categories/Index', [
            'categories' => $categories
        ]);
    }

    // 2. CREATE: Save a new category to the database
    public function store(Request $request)
    {
        // Validate the input
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name',
        ]);

        // Automatically generate the URL slug from the name (e.g., "Graphic Design" -> "graphic-design")
        $validated['slug'] = $this->uniqueSlug($validated['name']);

        Category::create($validated);

        // Redirect back to the page with a success message
        return redirect()->back()->with('success', 'Category created successfully!');
    }

    // 3. UPDATE: Rename a category (its slug follows the name)
    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,'.$category->id,
        ]);

        $category->update([
            'name' => $validated['name'],
            'slug' => $this->uniqueSlug($validated['name'], $category->id),
        ]);

        return redirect()->back()->with('success', 'Category updated successfully!');
    }

    private function uniqueSlug(string $name, ?int $ignoreId = null): string
    {
        $base = Str::slug($name) ?: 'category';
        $slug = $base;
        $i = 2;

        while (Category::where('slug', $slug)->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))->exists()) {
            $slug = $base.'-'.$i++;
        }

        return $slug;
    }
    // 4. DELETE: Remove a category
    public function destroy(Category $category)
    {
        // cascadeOnDelete in our migration ensures any courses in this category are handled
        $category->delete();

        return redirect()->back()->with('success', 'Category deleted.');
    }
}