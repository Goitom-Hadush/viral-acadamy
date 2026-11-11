import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:success_life_coaching_app/l10n/strings.dart';
import 'package:success_life_coaching_app/providers/auth_provider.dart';
import 'package:success_life_coaching_app/providers/course_provider.dart';
import 'package:success_life_coaching_app/theme/tw.dart';
import 'package:success_life_coaching_app/widgets/app_menu.dart';
import 'package:success_life_coaching_app/widgets/course_cards.dart';
import 'package:success_life_coaching_app/widgets/ui.dart';

/// Mirrors resources/js/Pages/Courses/Index.jsx.
class CoursesListScreen extends StatefulWidget {
  const CoursesListScreen({super.key});

  @override
  State<CoursesListScreen> createState() => _CoursesListScreenState();
}

class _CoursesListScreenState extends State<CoursesListScreen> {
  int? _category; // null = all
  final _search = TextEditingController();
  String _query = '';

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback(
        (_) => context.read<CourseProvider>().getCourses());
  }

  @override
  void dispose() {
    _search.dispose();
    super.dispose();
  }

  String _categoryIcon(String name) {
    final lower = name.toLowerCase();
    if (lower.contains('mind') || lower.contains('habit')) return '🧠';
    if (lower.contains('lead') || lower.contains('exec')) return '💼';
    if (lower.contains('career') || lower.contains('job')) return '🚀';
    if (lower.contains('money') ||
        lower.contains('income') ||
        lower.contains('wealth')) {
      return '📈';
    }
    return '📚';
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<CourseProvider>();
    final loggedIn = context.watch<AuthProvider>().isLoggedIn;
    final courses = provider.courses;

    final categories = <int, String>{};
    final counts = <int, int>{};
    for (final c in courses) {
      if (c.categoryId != null && c.category != null) {
        categories[c.categoryId!] = c.category!;
        counts[c.categoryId!] = (counts[c.categoryId!] ?? 0) + 1;
      }
    }

    final q = _query.trim().toLowerCase();
    final shown = courses.where((c) {
      final matchesCat = _category == null || c.categoryId == _category;
      final matchesQ = q.isEmpty ||
          c.title.toLowerCase().contains(q) ||
          c.description.toLowerCase().contains(q) ||
          (c.instructorName ?? '').toLowerCase().contains(q);
      return matchesCat && matchesQ;
    }).toList();

    return SiteScaffold(
      currentRoute: '/courses',
      body: RefreshIndicator(
        color: Tw.copper700,
        onRefresh: () => context.read<CourseProvider>().getCourses(),
        child: ListView(
          padding: const EdgeInsets.fromLTRB(16, 20, 16, 32),
          children: [
            const PageIntro(
              chip: '📚 Academy Catalog',
              title: 'Transformative Masterclasses',
              subtitle:
                  'Explore our published learning paths, master high-income skills, and start streaming immediately.',
            ),
            const SizedBox(height: 16),
            // Search field
            TextField(
              controller: _search,
              onChanged: (v) => setState(() => _query = v),
              style: TwText.sans(14, color: Tw.slate800),
              decoration: InputDecoration(
                hintText: 'Search masterclasses, topics, coaches...',
                hintStyle: TwText.sans(14, color: Tw.slate400),
                filled: true,
                fillColor: Colors.white,
                prefixIcon:
                    const Icon(Icons.search, size: 20, color: Tw.slate400),
                suffixIcon: _query.isEmpty
                    ? null
                    : IconButton(
                        tooltip: 'Clear',
                        icon: const Icon(Icons.close,
                            size: 18, color: Tw.slate400),
                        onPressed: () => setState(() {
                          _search.clear();
                          _query = '';
                        }),
                      ),
                contentPadding: const EdgeInsets.symmetric(vertical: 14),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(999),
                  borderSide: const BorderSide(color: Tw.slate200),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(999),
                  borderSide: const BorderSide(color: Tw.goldDeep, width: 1.5),
                ),
              ),
            ),
            const SizedBox(height: 14),
            // Category horizontal slider
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: [
                  ModernCategoryPill(
                    icon: '🌟',
                    label: 'All Courses',
                    count: courses.length,
                    active: _category == null,
                    onTap: () => setState(() => _category = null),
                  ),
                  const SizedBox(width: 8),
                  for (final e in categories.entries) ...[
                    ModernCategoryPill(
                      icon: _categoryIcon(e.value),
                      label: e.value,
                      count: counts[e.key],
                      active: _category == e.key,
                      onTap: () => setState(() => _category = e.key),
                    ),
                    const SizedBox(width: 8),
                  ],
                ],
              ),
            ),
            const SizedBox(height: 16),
            // Result count pill
            Align(
              alignment: Alignment.centerLeft,
              child: Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.95),
                  borderRadius: BorderRadius.circular(16),
                  border:
                      Border.all(color: Tw.copper200.withValues(alpha: 0.9)),
                  boxShadow: Tw.sm,
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const PulseDot(color: Tw.emerald500, size: 7),
                    const SizedBox(width: 8),
                    Text(
                      '${shown.length} of ${courses.length} courses available',
                      style: TwText.sans(12,
                          weight: FontWeight.w700, color: Tw.copper800),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 20),
            if (provider.isLoading && courses.isEmpty) ...[
              const ShimmerCardSkeleton(),
              const SizedBox(height: 20),
              const ShimmerCardSkeleton(),
            ] else if (provider.error != null && courses.isEmpty)
              _Empty(
                title: provider.error!,
                body: '',
                action: SecondaryButton(
                  label: context.tr('common.retry'),
                  expand: false,
                  onPressed: () => context.read<CourseProvider>().getCourses(),
                ),
              )
            else if (shown.isEmpty)
              _Empty(
                title: 'No masterclasses match your search',
                body: 'Try adjusting your search terms or reset the filters.',
                action: SecondaryButton(
                  label: 'Reset Filters',
                  expand: false,
                  onPressed: () => setState(() {
                    _search.clear();
                    _query = '';
                    _category = null;
                  }),
                ),
              )
            else
              for (final c in shown) ...[
                CatalogCourseCard(
                  course: c,
                  loggedIn: loggedIn,
                  onTap: () => context.push('/courses/${c.id}'),
                ),
                const SizedBox(height: 22),
              ],
          ],
        ),
      ),
    );
  }
}

class _Empty extends StatelessWidget {
  final String title;
  final String body;
  final Widget? action;
  const _Empty({required this.title, required this.body, this.action});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(40),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: Tw.copper100),
      ),
      child: Column(
        children: [
          Container(
            width: 64,
            height: 64,
            alignment: Alignment.center,
            decoration: BoxDecoration(
                color: Tw.copper100, borderRadius: BorderRadius.circular(16)),
            child: const Text('📚', style: TextStyle(fontSize: 28)),
          ),
          const SizedBox(height: 16),
          Text(title,
              textAlign: TextAlign.center,
              style: TwText.sans(16, weight: FontWeight.w700)),
          if (body.isNotEmpty) ...[
            const SizedBox(height: 6),
            Text(body,
                textAlign: TextAlign.center,
                style: TwText.sans(13, color: Tw.slate500)),
          ],
          if (action != null) ...[const SizedBox(height: 16), action!],
        ],
      ),
    );
  }
}
