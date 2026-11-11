import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:success_life_coaching_app/models/course_model.dart';
import 'package:success_life_coaching_app/providers/auth_provider.dart';
import 'package:success_life_coaching_app/services/api_service.dart';
import 'package:success_life_coaching_app/theme/tw.dart';
import 'package:success_life_coaching_app/widgets/app_menu.dart';
import 'package:success_life_coaching_app/widgets/course_cards.dart';
import 'package:success_life_coaching_app/widgets/ui.dart';

/// Mirrors resources/js/Pages/Student/Dashboard.jsx (mobile).
class StudentDashboardScreen extends StatefulWidget {
  const StudentDashboardScreen({super.key});

  @override
  State<StudentDashboardScreen> createState() => _StudentDashboardScreenState();
}

class _StudentDashboardScreenState extends State<StudentDashboardScreen> {
  late Future<List<Course>> _myCourses = ApiService().getMyCourses();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback(
        (_) => context.read<AuthProvider>().refreshProfile());
  }

  Future<void> _refresh() async {
    final next = ApiService().getMyCourses();
    setState(() => _myCourses = next);
    await Future.wait([
      next.catchError((_) => <Course>[]),
      context.read<AuthProvider>().refreshProfile()
    ]);
  }

  @override
  Widget build(BuildContext context) {
    final user = context.watch<AuthProvider>().user;

    return SiteScaffold(
      currentRoute: '/dashboard',
      body: RefreshIndicator(
        color: Tw.copper700,
        onRefresh: _refresh,
        child: FutureBuilder<List<Course>>(
          future: _myCourses,
          builder: (context, snap) {
            final courses = snap.data ?? const <Course>[];
            final totalLessons =
                courses.fold<int>(0, (sum, c) => sum + c.lessonsCount);
            final completedLessons =
                courses.fold<int>(0, (sum, c) => sum + c.completedLessonsCount);
            final completedCourses = courses
                .where((c) =>
                    c.lessonsCount > 0 &&
                    c.completedLessonsCount >= c.lessonsCount)
                .length;

            return ListView(
              padding: const EdgeInsets.fromLTRB(16, 16, 16, 32),
              children: [
                // Welcome banner with gold glow
                Container(
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(28),
                    gradient: const LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: [Color(0xFF04240C), Tw.copper700, Tw.copper600],
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: Tw.copper700.withValues(alpha: 0.35),
                        blurRadius: 36,
                        offset: const Offset(0, 10),
                      ),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: Colors.white.withValues(alpha: 0.12),
                              borderRadius: BorderRadius.circular(999),
                              border: Border.all(
                                  color: Tw.gold2.withValues(alpha: 0.4)),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                const PulseDot(color: Tw.gold2, size: 6),
                                const SizedBox(width: 6),
                                Text(
                                  'STUDENT DASHBOARD',
                                  style: TwText.eyebrow(10, Tw.cream,
                                      trackingEm: 0.15),
                                ),
                              ],
                            ),
                          ),
                          const Spacer(),
                          Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: Tw.emerald500.withValues(alpha: 0.2),
                              borderRadius: BorderRadius.circular(999),
                            ),
                            child: Text(
                              'Verified Student 🎓',
                              style: TwText.sans(11,
                                  weight: FontWeight.w700,
                                  color: Tw.emerald200),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 14),
                      Text(
                        'Welcome back, ${user?.firstName ?? ''}!',
                        style: TwText.sans(26,
                            weight: FontWeight.w900,
                            color: Colors.white,
                            height: 1.2,
                            letterSpacing: -0.5),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Continue your learning journey with ${courses.length} masterclass${courses.length == 1 ? '' : 'es'} in progress.',
                        style:
                            TwText.sans(14, color: Tw.copper100, height: 1.5),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),
                // 3-stat overview cards
                Row(
                  children: [
                    _StatTile(
                      icon: Icons.school_outlined,
                      label: 'Enrolled',
                      value: '${courses.length}',
                      color: Tw.copper700,
                      bg: Tw.copper50,
                    ),
                    const SizedBox(width: 8),
                    _StatTile(
                      icon: Icons.check_circle_outline,
                      label: 'Lessons',
                      value: totalLessons > 0
                          ? '$completedLessons/$totalLessons'
                          : '$completedLessons',
                      color: Tw.emerald700,
                      bg: Tw.emerald50,
                    ),
                    const SizedBox(width: 8),
                    _StatTile(
                      icon: Icons.workspace_premium_outlined,
                      label: 'Certificates',
                      value: '$completedCourses',
                      color: Tw.amber700,
                      bg: Tw.amber50,
                    ),
                  ],
                ),
                const SizedBox(height: 20),
                if (user?.referralCode != null) ...[
                  _ReferralCard(code: user!.referralCode!),
                  const SizedBox(height: 24),
                ],
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        'My Masterclasses',
                        style: TwText.sans(20, weight: FontWeight.w800),
                      ),
                    ),
                    TextButton.icon(
                      onPressed: () => context.go('/courses'),
                      icon: const Icon(Icons.search, size: 16),
                      label: const Text('Browse More'),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                if (snap.connectionState != ConnectionState.done &&
                    courses.isEmpty)
                  const Column(
                    children: [
                      ShimmerCardSkeleton(height: 140),
                      SizedBox(height: 14),
                      ShimmerCardSkeleton(height: 140),
                    ],
                  )
                else if (snap.hasError && courses.isEmpty)
                  SurfaceCard(
                    padding: const EdgeInsets.all(20),
                    child: Column(children: [
                      Text('${snap.error}',
                          textAlign: TextAlign.center,
                          style: TwText.sans(14, color: Tw.slate600)),
                      const SizedBox(height: 12),
                      SecondaryButton(
                          label: 'Try again',
                          expand: false,
                          onPressed: _refresh),
                    ]),
                  )
                else if (courses.isEmpty)
                  SurfaceCard(
                    padding: const EdgeInsets.all(32),
                    child: Column(children: [
                      const Text('📚', style: TextStyle(fontSize: 44)),
                      const SizedBox(height: 12),
                      Text("You haven't enrolled in a program yet",
                          textAlign: TextAlign.center,
                          style: TwText.sans(17, weight: FontWeight.w800)),
                      const SizedBox(height: 6),
                      Text(
                          'Explore our world-class video masterclasses and start transforming your skills today.',
                          textAlign: TextAlign.center,
                          style: TwText.sans(13.5,
                              color: Tw.slate600, height: 1.55)),
                      const SizedBox(height: 20),
                      PrimaryButton(
                          label: 'Explore Catalog',
                          onPressed: () => context.go('/courses')),
                    ]),
                  )
                else
                  for (final c in courses) ...[
                    _MyCourseTile(course: c),
                    const SizedBox(height: 16),
                  ],
              ],
            );
          },
        ),
      ),
    );
  }
}

class _StatTile extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;
  final Color color;
  final Color bg;

  const _StatTile({
    required this.icon,
    required this.label,
    required this.value,
    required this.color,
    required this.bg,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 14),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(color: Tw.copper100),
          boxShadow: Tw.sm,
        ),
        child: Column(
          children: [
            Container(
              width: 34,
              height: 34,
              alignment: Alignment.center,
              decoration: BoxDecoration(color: bg, shape: BoxShape.circle),
              child: Icon(icon, size: 18, color: color),
            ),
            const SizedBox(height: 8),
            Text(value,
                style: TwText.sans(18,
                    weight: FontWeight.w900, color: Tw.slate900)),
            const SizedBox(height: 2),
            Text(label,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: TwText.sans(11,
                    weight: FontWeight.w600, color: Tw.slate500)),
          ],
        ),
      ),
    );
  }
}

class _MyCourseTile extends StatelessWidget {
  final Course course;
  const _MyCourseTile({required this.course});

  @override
  Widget build(BuildContext context) {
    final progress = course.progressPercentage;
    final percent = course.progressPercentInt;

    return SurfaceCard(
      padding: const EdgeInsets.all(16),
      onTap: () => context.push('/courses/${course.id}/learn'),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              SizedBox(
                width: 100,
                height: 70,
                child: CourseImage(
                  url: course.thumbnail,
                  borderRadius: BorderRadius.circular(14),
                  overlays: const [
                    Center(
                      child: Icon(Icons.play_circle_fill,
                          color: Colors.white, size: 30),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      course.title,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style:
                          TwText.sans(15, weight: FontWeight.w800, height: 1.3),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      course.instructorName ?? 'Success Life Coach',
                      style: TwText.sans(12, color: Tw.slate500),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Progress: ${course.completedLessonsCount} / ${course.lessonsCount} lessons',
                style: TwText.sans(12,
                    weight: FontWeight.w600, color: Tw.slate700),
              ),
              Text(
                '$percent%',
                style: TwText.sans(12,
                    weight: FontWeight.w800, color: Tw.copper700),
              ),
            ],
          ),
          const SizedBox(height: 6),
          ClipRRect(
            borderRadius: BorderRadius.circular(999),
            child: LinearProgressIndicator(
              value: progress,
              minHeight: 7,
              backgroundColor: Tw.copper50,
              valueColor: const AlwaysStoppedAnimation<Color>(Tw.emerald500),
            ),
          ),
          const SizedBox(height: 12),
          Align(
            alignment: Alignment.centerRight,
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  'Continue Lesson',
                  style: TwText.sans(12.5,
                      weight: FontWeight.w700, color: Tw.copper700),
                ),
                const SizedBox(width: 4),
                const Icon(Icons.arrow_forward_rounded,
                    size: 15, color: Tw.copper700),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _ReferralCard extends StatefulWidget {
  final String code;
  const _ReferralCard({required this.code});

  @override
  State<_ReferralCard> createState() => _ReferralCardState();
}

class _ReferralCardState extends State<_ReferralCard> {
  bool _copied = false;

  @override
  Widget build(BuildContext context) {
    return SurfaceCard(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
            decoration: BoxDecoration(
              color: Tw.emerald50,
              borderRadius: BorderRadius.circular(999),
              border: Border.all(color: Tw.emerald200),
            ),
            child: Row(mainAxisSize: MainAxisSize.min, children: [
              const PulseDot(color: Tw.emerald500),
              const SizedBox(width: 8),
              Text('🎁 STUDENT REFERRAL PROGRAM',
                  style: TwText.sans(11,
                      weight: FontWeight.w900,
                      color: Tw.emerald800,
                      letterSpacing: 0.5)),
            ]),
          ),
          const SizedBox(height: 12),
          Text('Invite Students & Earn',
              style: TwText.sans(22, weight: FontWeight.w900)),
          const SizedBox(height: 6),
          Text(
            'Share your personal referral number with friends. Whenever someone enters your number when buying a coaching course, you automatically receive a commission!',
            style: TwText.sans(13, color: Tw.slate600, height: 1.6),
          ),
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.fromLTRB(16, 10, 10, 10),
            decoration: BoxDecoration(
              color: Tw.copper50.withValues(alpha: 0.5),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: Tw.copper300, width: 2),
            ),
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('MY REFERRAL NUMBER',
                          style:
                              TwText.eyebrow(10, Tw.slate500, trackingEm: 0.1)),
                      const SizedBox(height: 2),
                      SelectableText(widget.code,
                          style: TwText.sans(20,
                              weight: FontWeight.w900,
                              color: Tw.copper900,
                              letterSpacing: 2)),
                    ],
                  ),
                ),
                PrimaryButton(
                  label: _copied ? '✓ Copied!' : 'Copy Code',
                  expand: false,
                  fontSize: 13,
                  padding:
                      const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                  onPressed: () {
                    Clipboard.setData(ClipboardData(text: widget.code));
                    setState(() => _copied = true);
                    Future.delayed(const Duration(seconds: 2), () {
                      if (mounted) setState(() => _copied = false);
                    });
                  },
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
