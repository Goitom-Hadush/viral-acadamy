import 'package:flutter/material.dart';
import 'package:flutter/scheduler.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:success_life_coaching_app/l10n/strings.dart';
import 'package:success_life_coaching_app/models/course_model.dart';
import 'package:success_life_coaching_app/models/payment_info.dart';
import 'package:success_life_coaching_app/providers/auth_provider.dart';
import 'package:success_life_coaching_app/providers/course_provider.dart';
import 'package:success_life_coaching_app/services/api_service.dart';
import 'package:success_life_coaching_app/theme/tw.dart';
import 'package:success_life_coaching_app/widgets/app_menu.dart';
import 'package:success_life_coaching_app/widgets/course_cards.dart';
import 'package:success_life_coaching_app/widgets/ui.dart';

/// Mirrors resources/js/Pages/Welcome.jsx (mobile layout), section by section.
class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final _scroll = ScrollController();
  final _coursesKey = GlobalKey();
  final _search = TextEditingController();
  String _query = '';
  int? _category; // null = all
  int? _openFaq;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback(
        (_) => context.read<CourseProvider>().getCourses());
  }

  @override
  void dispose() {
    _scroll.dispose();
    _search.dispose();
    super.dispose();
  }

  void _scrollToCourses() {
    final ctx = _coursesKey.currentContext;
    if (ctx != null) {
      Scrollable.ensureVisible(ctx,
          duration: const Duration(milliseconds: 600),
          curve: Curves.easeOutCubic);
    }
  }

  @override
  Widget build(BuildContext context) {
    return SiteScaffold(
      currentRoute: '/home',
      body: RefreshIndicator(
        color: Tw.copper700,
        onRefresh: () => context.read<CourseProvider>().getCourses(),
        child: ListView(
          controller: _scroll,
          padding: const EdgeInsets.only(top: 8, bottom: 32),
          children: [
            const _SponsorTicker(),
            const SizedBox(height: 16),
            const _QuickResumeBanner(),
            _pad(_Hero(onExplore: _scrollToCourses)),
            const SizedBox(height: 64),
            _pad(const _ValuePillars()),
            const SizedBox(height: 56),
            _pad(const _HowItWorks()),
            const SizedBox(height: 56),
            KeyedSubtree(
                key: _coursesKey, child: _pad(_coursesSection(context))),
            const SizedBox(height: 64),
            _pad(const _Testimonials()),
            const SizedBox(height: 64),
            _pad(_faqSection(context)),
            const SizedBox(height: 56),
            _pad(const _FinalCta()),
            const SizedBox(height: 40),
            const SiteFooter(),
          ],
        ),
      ),
    );
  }

  Widget _pad(Widget child) => Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16), child: child);

  // ── 5. Courses ─────────────────────────────────────────────────────────────
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
    if (lower.contains('comm') || lower.contains('speak')) return '🗣️';
    return '📚';
  }

  Widget _coursesSection(BuildContext context) {
    final provider = context.watch<CourseProvider>();
    final courses = provider.courses;

    // Categories that have published courses (like the website's chips).
    final categories = <int, String>{};
    final counts = <int, int>{};
    for (final c in courses) {
      if (c.categoryId != null && c.category != null) {
        categories[c.categoryId!] = c.category!;
        counts[c.categoryId!] = (counts[c.categoryId!] ?? 0) + 1;
      }
    }

    final q = _query.trim().toLowerCase();
    final filtered = courses.where((c) {
      final matchesCat = _category == null || c.categoryId == _category;
      final matchesQ = q.isEmpty ||
          c.title.toLowerCase().contains(q) ||
          c.description.toLowerCase().contains(q) ||
          (c.instructorName ?? '').toLowerCase().contains(q);
      return matchesCat && matchesQ;
    }).toList();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SectionHeader(
          eyebrow: context.tr('courses.section_eyebrow'),
          title: context.tr('courses.section_title'),
          subtitle: context.tr('courses.section_sub'),
        ),
        const SizedBox(height: 20),
        // Search pill
        TextField(
          controller: _search,
          onChanged: (v) => setState(() => _query = v),
          style: TwText.sans(14, color: Tw.slate800),
          decoration: InputDecoration(
            hintText: context.t('home.search_placeholder',
                'Search programs, topics, coaches...'),
            hintStyle: TwText.sans(14, color: Tw.slate400),
            filled: true,
            fillColor: Colors.white,
            prefixIcon: const Icon(Icons.search, size: 20, color: Tw.slate400),
            suffixIcon: _query.isEmpty
                ? null
                : IconButton(
                    tooltip: 'Clear',
                    icon: const Icon(Icons.close, size: 18, color: Tw.slate400),
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
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: Row(
            children: [
              ModernCategoryPill(
                icon: '🌟',
                label: context.t('home.all_programs', 'All Programs'),
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
        const SizedBox(height: 20),
        if (provider.isLoading && courses.isEmpty) ...[
          const ShimmerCardSkeleton(),
          const SizedBox(height: 20),
          const ShimmerCardSkeleton(),
        ] else if (provider.error != null && courses.isEmpty)
          SurfaceCard(
            padding: const EdgeInsets.all(24),
            child: Column(
              children: [
                Text(provider.error!,
                    textAlign: TextAlign.center,
                    style: TwText.sans(14, color: Tw.slate600)),
                const SizedBox(height: 16),
                SecondaryButton(
                  label: context.tr('common.retry'),
                  onPressed: () => context.read<CourseProvider>().getCourses(),
                ),
              ],
            ),
          )
        else if (filtered.isEmpty)
          SurfaceCard(
            padding: const EdgeInsets.all(32),
            child: Column(
              children: [
                const Text('📚', style: TextStyle(fontSize: 40)),
                const SizedBox(height: 12),
                Text(context.tr('no_match_title'),
                    textAlign: TextAlign.center,
                    style: TwText.sans(16, weight: FontWeight.w700)),
                const SizedBox(height: 6),
                Text(context.tr('no_match_sub'),
                    textAlign: TextAlign.center,
                    style: TwText.sans(13, color: Tw.slate500)),
                const SizedBox(height: 16),
                SecondaryButton(
                  label: context.tr('reset_filters'),
                  expand: false,
                  onPressed: () => setState(() {
                    _search.clear();
                    _query = '';
                    _category = null;
                  }),
                ),
              ],
            ),
          )
        else
          for (final Course c in filtered) ...[
            HomeCourseCard(
                course: c, onTap: () => context.push('/courses/${c.id}')),
            const SizedBox(height: 20),
          ],
      ],
    );
  }

  // ── 7. FAQ ─────────────────────────────────────────────────────────────────
  Widget _faqSection(BuildContext context) {
    return FutureBuilder<PaymentInfo>(
      future: ApiService().getPaymentInfo(),
      builder: (context, snap) {
        final p = snap.data;
        final bank = p?.bankName ?? 'Commercial Bank of Ethiopia (CBE)';
        final account = p?.bankNumber ?? '10000125544';
        final tele = p?.telebirrPhone ?? '0914026415';

        final faqs = [
          (
            context.tr('faq.how_access.q'),
            'Once you transfer the course tuition via $bank ($account) or Telebirr ($tele) and upload your payment receipt screenshot, our system approves your enrollment and unlocks immediate 6-month access to all lessons in your student dashboard.'
          ),
          (
            context.tr('faq.mobile.q'),
            context.tr('faq.mobile.a'),
          ),
          (
            context.tr('faq.duration.q'),
            context.tr('faq.duration.a'),
          ),
          (
            context.tr('faq.cert.q'),
            context.tr('faq.cert.a'),
          ),
          (
            context.tr('faq.app.q'),
            context.tr('faq.app.a'),
          ),
        ];

        return Column(
          children: [
            SectionHeader(
              eyebrow: context.tr('faq.eyebrow'),
              title: context.t('home.faq_title', 'Frequently Asked Questions'),
              subtitle:
                  'Everything you need to know about getting started and studying with us.',
              center: true,
            ),
            const SizedBox(height: 24),
            for (var i = 0; i < faqs.length; i++) ...[
              _FaqItem(
                question: faqs[i].$1,
                answer: faqs[i].$2,
                open: _openFaq == i,
                onTap: () =>
                    setState(() => _openFaq = _openFaq == i ? null : i),
              ),
              const SizedBox(height: 12),
            ],
          ],
        );
      },
    );
  }
}

class _QuickResumeBanner extends StatelessWidget {
  const _QuickResumeBanner();

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    if (!auth.isLoggedIn) return const SizedBox.shrink();

    return FutureBuilder<List<Course>>(
      future: ApiService().getMyCourses(),
      builder: (context, snap) {
        final list = snap.data;
        if (list == null || list.isEmpty) return const SizedBox.shrink();
        final first = list.first;

        return Padding(
          padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
          child: Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF04240C), Color(0xFF0A3A15)],
              ),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: Tw.gold2.withValues(alpha: 0.4)),
              boxShadow: [
                BoxShadow(
                  color: Tw.heroA.withValues(alpha: 0.45),
                  blurRadius: 16,
                  offset: const Offset(0, 6),
                ),
              ],
            ),
            child: Row(
              children: [
                Container(
                  width: 44,
                  height: 44,
                  decoration: BoxDecoration(
                    color: Tw.gold2.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: Tw.gold2.withValues(alpha: 0.4)),
                  ),
                  child: const Icon(Icons.play_arrow_rounded,
                      color: Tw.gold2, size: 28),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        'CONTINUE LEARNING',
                        style:
                            TwText.eyebrow(9.5, Tw.goldLight, trackingEm: 0.15),
                      ),
                      const SizedBox(height: 3),
                      Text(
                        first.title,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: TwText.sans(14,
                            weight: FontWeight.w700, color: Colors.white),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        '${first.lessonsCount} ${context.tr('lessons_count')} ${context.tr('pick_up_where')}',
                        style: TwText.sans(11.5, color: Colors.white70),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 10),
                ElevatedButton(
                  onPressed: () => context.push('/courses/${first.id}/learn'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Tw.gold2,
                    foregroundColor: Tw.slate950,
                    padding: const EdgeInsets.symmetric(
                        horizontal: 14, vertical: 10),
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12)),
                    textStyle: TwText.sans(12, weight: FontWeight.w800),
                  ),
                  child: Text(context.tr('resume')),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}

// ── 1. Sponsor ticker ─────────────────────────────────────────────────────────

class _Sponsor {
  final String name;
  final String tier;
  final String icon;
  const _Sponsor(this.name, this.tier, this.icon);
}

const _sponsors = [
  _Sponsor('Commercial Bank of Ethiopia (CBE)', 'platinum', '🏦'),
  _Sponsor('Telebirr', 'platinum', '📱'),
  _Sponsor('Awash Bank', 'gold', '🏦'),
  _Sponsor('Ethiopian Airlines', 'silver', '✈️'),
  _Sponsor('Success Life Global', 'bronze', '🌟'),
];

class _SponsorTicker extends StatefulWidget {
  const _SponsorTicker();

  @override
  State<_SponsorTicker> createState() => _SponsorTickerState();
}

class _SponsorTickerState extends State<_SponsorTicker>
    with SingleTickerProviderStateMixin {
  final _controller = ScrollController();
  late final Ticker _ticker;
  Duration _last = Duration.zero;

  @override
  void initState() {
    super.initState();
    // Continuous marquee (website: animate-marquee 25s linear infinite),
    // driven by the frame clock at ~40 px/second.
    _ticker = createTicker((elapsed) {
      final dt = (elapsed - _last).inMicroseconds / 1e6;
      _last = elapsed;
      if (!_controller.hasClients) return;
      final max = _controller.position.maxScrollExtent;
      final next = _controller.offset + 40 * dt;
      _controller.jumpTo(next >= max ? 0 : next);
    })
      ..start();
  }

  @override
  void dispose() {
    _ticker.dispose();
    _controller.dispose();
    super.dispose();
  }

  ({Color bg, Color border, Color text, String icon}) _tier(String tier) {
    switch (tier) {
      case 'platinum':
        return (
          bg: const Color(0xFFECFEFF),
          border: const Color(0xFF67E8F9),
          text: const Color(0xFF164E63),
          icon: '💎'
        );
      case 'gold':
        return (
          bg: Tw.amber50,
          border: const Color(0xFFFCD34D),
          text: const Color(0xFF78350F),
          icon: '🥇'
        );
      case 'silver':
        return (
          bg: Tw.slate100,
          border: Tw.slate300,
          text: Tw.slate800,
          icon: '🥈'
        );
      default:
        return (
          bg: Tw.amber100.withValues(alpha: 0.7),
          border: const Color(0x66D97706),
          text: const Color(0xFF451A03),
          icon: '🥉'
        );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 84,
      decoration: const BoxDecoration(
        gradient: LinearGradient(
            colors: [Color(0xFFF6FAF7), Colors.white, Color(0xFFF6FAF7)]),
        border: Border.symmetric(horizontal: BorderSide(color: Tw.copper100)),
      ),
      child: ShaderMask(
        // soft fade at both edges
        shaderCallback: (rect) => const LinearGradient(
          colors: [
            Colors.transparent,
            Colors.black,
            Colors.black,
            Colors.transparent
          ],
          stops: [0, 0.1, 0.9, 1],
        ).createShader(rect),
        blendMode: BlendMode.dstIn,
        child: ListView.builder(
          controller: _controller,
          scrollDirection: Axis.horizontal,
          physics: const NeverScrollableScrollPhysics(),
          padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 8),
          itemCount: _sponsors.length * 200,
          itemBuilder: (_, i) {
            final s = _sponsors[i % _sponsors.length];
            final t = _tier(s.tier);
            return Container(
              margin: const EdgeInsets.symmetric(horizontal: 8),
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Tw.slate200.withValues(alpha: 0.8)),
              ),
              child: Row(
                children: [
                  Container(
                    width: 38,
                    height: 38,
                    alignment: Alignment.center,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: Tw.slate200),
                    ),
                    child: Text(s.icon, style: const TextStyle(fontSize: 18)),
                  ),
                  const SizedBox(width: 10),
                  Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 8, vertical: 1),
                        decoration: BoxDecoration(
                          color: t.bg,
                          borderRadius: BorderRadius.circular(999),
                          border: Border.all(color: t.border),
                        ),
                        child: Text('${t.icon} ${s.tier}'.toUpperCase(),
                            style: TwText.sans(9,
                                weight: FontWeight.w900, color: t.text)),
                      ),
                      const SizedBox(height: 3),
                      ConstrainedBox(
                        constraints: const BoxConstraints(maxWidth: 160),
                        child: Text(s.name,
                            overflow: TextOverflow.ellipsis,
                            style: TwText.sans(12,
                                weight: FontWeight.w700, color: Tw.slate800)),
                      ),
                    ],
                  ),
                ],
              ),
            );
          },
        ),
      ),
    );
  }
}

// ── 2. Hero ───────────────────────────────────────────────────────────────────

class _Hero extends StatelessWidget {
  final VoidCallback onExplore;
  const _Hero({required this.onExplore});

  @override
  Widget build(BuildContext context) {
    final title = context.t('home.hero_title',
        'Transform your mindset, master high-value skills & build real success.');
    // Last two words shimmer gold on the website (AnimatedHeadline highlightLast=2).
    final words = title.split(' ');
    final split = words.length > 2 ? words.length - 2 : 0;
    final lead = words.sublist(0, split).join(' ');
    final gold = words.sublist(split).join(' ');

    return HeroBox(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          HeroChip(context.t('home.badge',
              "Ethiopia's premier leadership & coaching academy")),
          const SizedBox(height: 20),
          RichText(
            text: TextSpan(
              style: TwText.display(32, color: Colors.white, height: 1.18),
              children: [
                if (lead.isNotEmpty) TextSpan(text: '$lead '),
                WidgetSpan(
                  alignment: PlaceholderAlignment.baseline,
                  baseline: TextBaseline.alphabetic,
                  child: ShaderMask(
                    shaderCallback: (r) => const LinearGradient(
                      colors: [Color(0xFFF8E7B0), Tw.gold2, Tw.goldDeep],
                      stops: [0, 0.42, 1],
                    ).createShader(r),
                    child: Text(gold,
                        style: TwText.display(32,
                            color: Colors.white, height: 1.18)),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
          Text(
            context.t('home.hero_sub',
                'Learn from accredited mentors through focused, high-definition video masterclasses. Designed for ambitious professionals, creators, and leaders across Ethiopia.'),
            style: TwText.sans(14,
                color: Tw.emerald50.withValues(alpha: 0.75), height: 1.75),
          ),
          const SizedBox(height: 28),
          GoldPillButton(
            label: context.t('home.explore_courses', 'Explore All Courses →'),
            onPressed: onExplore,
          ),
          const SizedBox(height: 12),
          GhostPillButton(
            label: context.t('home.reserve_seminar', 'Live Seminars'),
            onPressed: () => context.go('/seminars'),
          ),
          const SizedBox(height: 32),
          Container(
            padding: const EdgeInsets.only(top: 24),
            decoration: BoxDecoration(
              border: Border(
                  top: BorderSide(color: Colors.white.withValues(alpha: 0.1))),
            ),
            child: Row(
              children: [
                _HeroStat('4.9', context.tr('stat.rating')),
                _HeroStat('1,200+', context.tr('stat.graduates')),
                _HeroStat('6 mo', context.tr('stat.access')),
              ],
            ),
          ),
          const SizedBox(height: 28),
          const _FeaturedMasterclass(),
        ],
      ),
    );
  }
}

class _HeroStat extends StatelessWidget {
  final String value;
  final String label;
  const _HeroStat(this.value, this.label);

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(value, style: TwText.display(20, color: Tw.cream)),
          const SizedBox(height: 4),
          Text(label.toUpperCase(),
              style: TwText.sans(10.5,
                  color: const Color(0xFFD1FAE5).withValues(alpha: 0.55),
                  letterSpacing: 0.6)),
        ],
      ),
    );
  }
}

/// Fallback media card shown when no promo video is set (website hero right column).
class _FeaturedMasterclass extends StatelessWidget {
  const _FeaturedMasterclass();

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(1.5),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(24),
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Tw.goldLight, Tw.goldDeep, Color(0xFF8A7018)],
        ),
        boxShadow: [
          BoxShadow(
              color: Colors.black.withValues(alpha: 0.7),
              blurRadius: 70,
              offset: const Offset(0, 30),
              spreadRadius: -28),
        ],
      ),
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(22),
          gradient: const LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [Tw.copper800, Tw.copper700, Color(0xFF001F00)],
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(999),
                  ),
                  child: Text(context.tr('featured_masterclass'),
                      style:
                          TwText.eyebrow(10, Colors.white, trackingEm: 0.12)),
                ),
                const Spacer(),
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    border:
                        Border.all(color: Colors.white.withValues(alpha: 0.3)),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text('4K HD',
                      style: TwText.sans(11,
                          weight: FontWeight.w800, color: Tw.cream)),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Text(context.tr('featured_title'),
                style: TwText.display(20, color: Colors.white, height: 1.3)),
            const SizedBox(height: 8),
            Text(
              context.tr('featured_desc'),
              style: TwText.sans(13,
                  color: Colors.white.withValues(alpha: 0.8), height: 1.6),
            ),
            const SizedBox(height: 14),
            Wrap(
              spacing: 16,
              runSpacing: 6,
              children: [
                Text(context.tr('featured_cbe'),
                    style: TwText.sans(12,
                        weight: FontWeight.w600, color: Tw.cream)),
                Text(context.tr('featured_access'),
                    style: TwText.sans(12,
                        weight: FontWeight.w600, color: Tw.cream)),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

// ── 3. Value pillars ──────────────────────────────────────────────────────────

class _ValuePillars extends StatelessWidget {
  const _ValuePillars();

  @override
  Widget build(BuildContext context) {
    const items = [
      (
        '🧠',
        'Proven Mindset Frameworks',
        'Mental Mastery',
        'Transform self-limiting beliefs into unshakable confidence with actionable coaching engineered for real breakthroughs.'
      ),
      (
        '📱',
        'Mobile-First HD Learning',
        'Learn Anywhere',
        'Watch crystal-clear HD lessons on your phone or computer with low data consumption and automatic progress tracking.'
      ),
      (
        '⚡',
        'Instant CBE & Telebirr Access',
        'Instant Activation',
        'No foreign cards required. Pay safely in Ethiopian Birr with fast verification and zero transaction delays.'
      ),
      (
        '🏆',
        'Accredited Certifications',
        'Career Boost',
        'Earn verifiable certificates of completion to validate your skills and boost your professional credentials.'
      ),
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SectionHeader(
          eyebrow: context.tr('pillars.eyebrow'),
          title: context.t('home.why_choose', 'Why ambitious people learn here'),
          subtitle:
              'Practical coaching, local payments, and lessons built for professionals across Ethiopia.',
        ),
        const SizedBox(height: 24),
        for (final it in items) ...[
          HomeCard(
            padding: EdgeInsets.zero,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  height: 4,
                  decoration: const BoxDecoration(
                    gradient: LinearGradient(
                        colors: [Tw.heroA, Tw.goldDeep, Tw.heroA]),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Container(
                            width: 48,
                            height: 48,
                            alignment: Alignment.center,
                            decoration: BoxDecoration(
                                color: Tw.heroA,
                                borderRadius: BorderRadius.circular(16)),
                            child: Text(it.$1,
                                style: const TextStyle(fontSize: 20)),
                          ),
                          const Spacer(),
                          Text(it.$3.toUpperCase(),
                              style: TwText.eyebrow(10, Tw.goldMuted,
                                  trackingEm: 0.16)),
                        ],
                      ),
                      const SizedBox(height: 16),
                      Text(it.$2, style: TwText.display(20, height: 1.3)),
                      const SizedBox(height: 8),
                      Text(it.$4,
                          style:
                              TwText.sans(14, color: Tw.slate600, height: 1.6)),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
        ],
      ],
    );
  }
}

// ── 4. How it works ───────────────────────────────────────────────────────────

class _HowItWorks extends StatelessWidget {
  const _HowItWorks();

  @override
  Widget build(BuildContext context) {
    const steps = [
      (
        '01',
        '🎯',
        'Choose Your Coaching Program',
        'Explore curated courses in mindset, leadership, executive success, and career acceleration.'
      ),
      (
        '02',
        '💳',
        'Instant Activation',
        'Complete your one-time tuition safely via Telebirr or CBE with simple receipt upload.'
      ),
      (
        '03',
        '🚀',
        'Transform & Build Income',
        'Watch focused lessons, apply proven habits daily, and unlock your highest earning potential.'
      ),
    ];

    return Container(
      padding: const EdgeInsets.fromLTRB(24, 40, 24, 24),
      decoration: BoxDecoration(
        color: Tw.creamBg,
        borderRadius: BorderRadius.circular(32),
        border: Border.all(color: const Color(0xFFE7D7A4)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SectionHeader(
              eyebrow: context.tr('how.eyebrow'),
              title: context.tr('how.title')),
          const SizedBox(height: 24),
          for (final s in steps) ...[
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: Tw.creamBorder),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Text(s.$1, style: TwText.display(30, color: Tw.goldDeep)),
                      const Spacer(),
                      Container(
                        width: 44,
                        height: 44,
                        alignment: Alignment.center,
                        decoration: const BoxDecoration(
                            color: Tw.heroA, shape: BoxShape.circle),
                        child: Text(s.$2, style: const TextStyle(fontSize: 18)),
                      ),
                    ],
                  ),
                  const SizedBox(height: 14),
                  Text(s.$3, style: TwText.sans(18, weight: FontWeight.w600)),
                  const SizedBox(height: 6),
                  Text(s.$4,
                      style: TwText.sans(14, color: Tw.slate600, height: 1.6)),
                ],
              ),
            ),
            const SizedBox(height: 14),
          ],
        ],
      ),
    );
  }
}

// ── 6. Testimonials ───────────────────────────────────────────────────────────

class TestimonialCard extends StatelessWidget {
  final String quote;
  final String name;
  final String subtitle;
  final String initials;
  final List<Color> avatarColors;

  const TestimonialCard({
    super.key,
    required this.quote,
    required this.name,
    required this.subtitle,
    required this.initials,
    this.avatarColors = const [Tw.emerald600, Tw.copper800],
  });

  @override
  Widget build(BuildContext context) {
    return HomeCard(
      padding: const EdgeInsets.all(28),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('“', style: TwText.display(48, color: Tw.gold2, height: 0.9)),
          const GoldStars(),
          const SizedBox(height: 12),
          Text(quote, style: TwText.sans(14, color: Tw.slate700, height: 1.75)),
          const SizedBox(height: 20),
          const Divider(height: 1, color: Tw.slate100),
          const SizedBox(height: 18),
          Row(
            children: [
              InitialsAvatar(initials, colors: avatarColors),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(name, style: TwText.sans(14, weight: FontWeight.w600)),
                    Text(subtitle, style: TwText.sans(11, color: Tw.slate500)),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

/// The website's default testimonials (Welcome.jsx / Testimonials.jsx fallback).
const defaultTestimonials = [
  (
    'Dawit Kebede',
    'Digital Entrepreneur & Creator · Addis Ababa',
    'DK',
    [Tw.emerald600, Tw.copper800],
    'Success Life Coaching completely changed how I approach goal setting and daily discipline. The video masterclasses are crisp, practical, and tailored for our reality in Ethiopia.'
  ),
  (
    'Selamawit Bekele',
    'Executive Marketing Lead · Hawassa',
    'SB',
    [Tw.copper700, Tw.accent],
    'Paying through Telebirr took less than a minute, and I was learning on my phone right away. The mindset shift alone doubled my workplace performance.'
  ),
  (
    'Yonas Abebe',
    'Tech Lead & Freelancer · Mekelle',
    'YA',
    [Tw.bronze, Tw.copper700],
    'The video lessons cut straight to the point without fluff. I especially appreciate the mobile experience and how easy it is to track watched lessons.'
  ),
];

class _Testimonials extends StatelessWidget {
  const _Testimonials();

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SectionHeader(
          eyebrow: context.tr('testimonials.eyebrow'),
          title: context.tr('testimonials.title'),
          subtitle: context.tr('testimonials.sub'),
        ),
        const SizedBox(height: 24),
        for (final t in defaultTestimonials) ...[
          TestimonialCard(
              name: t.$1,
              subtitle: t.$2,
              initials: t.$3,
              avatarColors: t.$4,
              quote: t.$5),
          const SizedBox(height: 16),
        ],
      ],
    );
  }
}

// ── 7. FAQ item ───────────────────────────────────────────────────────────────

class _FaqItem extends StatelessWidget {
  final String question;
  final String answer;
  final bool open;
  final VoidCallback onTap;
  const _FaqItem(
      {required this.question,
      required this.answer,
      required this.open,
      required this.onTap});

  @override
  Widget build(BuildContext context) {
    return AnimatedContainer(
      duration: const Duration(milliseconds: 200),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
            color: open ? Tw.gold2 : Tw.slate200.withValues(alpha: 0.8)),
        boxShadow: open
            ? [
                BoxShadow(
                    color: Tw.goldMuted.withValues(alpha: 0.55),
                    blurRadius: 36,
                    offset: const Offset(0, 16),
                    spreadRadius: -24)
              ]
            : null,
      ),
      child: Material(
        color: Colors.transparent,
        borderRadius: BorderRadius.circular(16),
        clipBehavior: Clip.antiAlias,
        child: Column(
          children: [
            InkWell(
              onTap: onTap,
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Row(
                  children: [
                    Expanded(
                      child: Text(question,
                          style: TwText.sans(14,
                              weight: FontWeight.w600, height: 1.4)),
                    ),
                    const SizedBox(width: 12),
                    Container(
                      width: 32,
                      height: 32,
                      alignment: Alignment.center,
                      decoration: BoxDecoration(
                        color: open ? Tw.heroA : const Color(0xFFFFF8E8),
                        shape: BoxShape.circle,
                      ),
                      child: Text(open ? '–' : '+',
                          style: TwText.sans(16,
                              weight: FontWeight.w700,
                              color: open ? Tw.goldLight : Tw.goldMuted)),
                    ),
                  ],
                ),
              ),
            ),
            AnimatedCrossFade(
              duration: const Duration(milliseconds: 200),
              crossFadeState:
                  open ? CrossFadeState.showSecond : CrossFadeState.showFirst,
              firstChild: const SizedBox(width: double.infinity),
              secondChild: Container(
                width: double.infinity,
                padding: const EdgeInsets.fromLTRB(16, 12, 16, 20),
                decoration: const BoxDecoration(
                    border: Border(top: BorderSide(color: Color(0xFFF3E6C2)))),
                child: Text(answer,
                    style: TwText.sans(14, color: Tw.slate600, height: 1.6)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ── 8. Final CTA ──────────────────────────────────────────────────────────────

class _FinalCta extends StatelessWidget {
  const _FinalCta();

  @override
  Widget build(BuildContext context) {
    return HeroBox(
      radius: 32,
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 48),
      child: Column(
        children: [
          Text(context.tr('cta.begin_transformation'),
              textAlign: TextAlign.center,
              style: TwText.eyebrow(11, Tw.cream, trackingEm: 0.24)),
          const SizedBox(height: 12),
          Text(context.tr('cta.ready_title'),
              textAlign: TextAlign.center,
              style: TwText.display(28, color: Colors.white, height: 1.25)),
          const SizedBox(height: 14),
          Text(
            context.tr('cta.ready_sub'),
            textAlign: TextAlign.center,
            style: TwText.sans(14,
                color: Tw.emerald50.withValues(alpha: 0.75), height: 1.7),
          ),
          const SizedBox(height: 28),
          GoldPillButton(
              label: context.tr('cta.get_started'),
              onPressed: () => context.push('/register')),
          const SizedBox(height: 12),
          GhostPillButton(
              label: context.tr('nav.courses'),
              onPressed: () => context.go('/courses')),
        ],
      ),
    );
  }
}

// ── Footer ────────────────────────────────────────────────────────────────────

/// Compact version of the website footer (brand, about text, links, ©).
class SiteFooter extends StatelessWidget {
  const SiteFooter({super.key});

  @override
  Widget build(BuildContext context) {
    Widget link(String label, String route, {bool highlight = false}) =>
        InkWell(
          onTap: () => context.go(route),
          child: Padding(
            padding: const EdgeInsets.symmetric(vertical: 6),
            child: Text(label,
                style: TwText.sans(13,
                    weight: highlight ? FontWeight.w600 : FontWeight.w400,
                    color: highlight ? Tw.emerald700 : Tw.slate600)),
          ),
        );

    return Container(
      padding: const EdgeInsets.fromLTRB(16, 40, 16, 24),
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(top: BorderSide(color: Tw.copper100)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const BrandLockup(logo: 48),
          const SizedBox(height: 14),
          Text(
            context.tr('footer.about_text'),
            style: TwText.sans(12.5, color: Tw.slate600, height: 1.65),
          ),
          const SizedBox(height: 24),
          Text(context.tr('footer.platform_nav'),
              style: TwText.eyebrow(12, Tw.slate900, trackingEm: 0.05)),
          const SizedBox(height: 8),
          link(context.tr('nav.home'), '/home'),
          link(context.tr('footer.about'), '/about'),
          link(context.tr('footer.courses_link'), '/courses'),
          link(context.tr('footer.seminars_link'), '/seminars', highlight: true),
          link(context.tr('footer.reels_link'), '/reels'),
          link(context.tr('footer.testimonials_link'), '/testimonials'),
          const SizedBox(height: 20),
          const Divider(color: Tw.copper100),
          const SizedBox(height: 12),
          Text(
            '© ${DateTime.now().year} Success Life Coaching Academy. ${context.t('footer.rights', 'All rights reserved.')}',
            style: TwText.sans(12, color: Tw.slate500),
          ),
          const SizedBox(height: 4),
          Text(
            context.t('footer.motto',
                'Empowering Minds, Transforming Futures in Ethiopia & Beyond.'),
            style: TwText.sans(12, color: Tw.slate500),
          ),
          const SizedBox(height: 10),
          Row(
            children: [
              Text('${context.tr('footer.developed_by')} ',
                  style: TwText.sans(12, color: Tw.slate500)),
              Text('Goitom Hadush',
                  style: TwText.sans(12,
                      weight: FontWeight.w700, color: Tw.slate900)),
            ],
          ),
        ],
      ),
    );
  }
}
