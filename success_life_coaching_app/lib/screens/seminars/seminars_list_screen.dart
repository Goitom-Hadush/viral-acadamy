import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:success_life_coaching_app/config/api_config.dart';
import 'package:success_life_coaching_app/l10n/strings.dart';
import 'package:success_life_coaching_app/models/seminar_model.dart';
import 'package:success_life_coaching_app/providers/seminar_provider.dart';
import 'package:success_life_coaching_app/theme/tw.dart';
import 'package:success_life_coaching_app/widgets/app_menu.dart';
import 'package:success_life_coaching_app/widgets/ui.dart';

/// Mirrors resources/js/Pages/Seminars.jsx (mobile).
class SeminarsListScreen extends StatefulWidget {
  const SeminarsListScreen({super.key});

  @override
  State<SeminarsListScreen> createState() => _SeminarsListScreenState();
}

class _SeminarsListScreenState extends State<SeminarsListScreen> {
  final _listKey = GlobalKey();
  final _search = TextEditingController();
  String _filter = 'all'; // all | in_person | virtual
  String _query = '';

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback(
        (_) => context.read<SeminarProvider>().getSeminars());
  }

  @override
  void dispose() {
    _search.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<SeminarProvider>();
    final all = provider.seminars;
    final q = _query.trim().toLowerCase();
    final seminars = all.where((s) {
      final type = _filter == 'all' ||
          (_filter == 'in_person' && !s.isVirtual && !s.isHybrid) ||
          (_filter == 'virtual' && (s.isVirtual || s.isHybrid));
      final text = q.isEmpty ||
          s.title.toLowerCase().contains(q) ||
          (s.speakerName ?? '').toLowerCase().contains(q) ||
          s.location.toLowerCase().contains(q) ||
          s.description.toLowerCase().contains(q);
      return type && text;
    }).toList();

    return SiteScaffold(
      currentRoute: '/seminars',
      body: RefreshIndicator(
        color: Tw.copper700,
        onRefresh: () => context.read<SeminarProvider>().getSeminars(),
        child: ListView(
          padding: const EdgeInsets.fromLTRB(16, 16, 16, 32),
          children: [
            HeroBox(
              padding: const EdgeInsets.fromLTRB(24, 40, 24, 32),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  HeroChip(context.t(
                      'seminars.hero_badge', 'Live rooms and virtual summits')),
                  const SizedBox(height: 24),
                  RichText(
                    text: TextSpan(
                      style:
                          TwText.display(34, color: Colors.white, height: 1.2),
                      children: [
                        TextSpan(
                            text:
                                '${context.t('seminars.hero_heading_new', 'Transform Your Mindset.')} '),
                        WidgetSpan(
                          alignment: PlaceholderAlignment.baseline,
                          baseline: TextBaseline.alphabetic,
                          child: ShaderMask(
                            shaderCallback: (r) => const LinearGradient(
                                    colors: [Tw.goldLight, Tw.gold2])
                                .createShader(r),
                            child: Text(
                                context.t('seminars.hero_highlight',
                                    'Build Your Career.'),
                                style: TwText.display(34,
                                    color: Colors.white, height: 1.2)),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),
                  Text(
                    context.t('seminars.hero_intro_new',
                        'Join world-class executive masterclasses, leadership summits, and breakthrough intensives. Learn from top coaches, network with ambitious leaders, and earn verifiable certificates.'),
                    style: TwText.sans(15,
                        color: Tw.emerald50.withValues(alpha: 0.8),
                        height: 1.8),
                  ),
                  const SizedBox(height: 32),
                  Wrap(
                    spacing: 16,
                    runSpacing: 16,
                    crossAxisAlignment: WrapCrossAlignment.center,
                    children: [
                      GoldPillButton(
                        expand: false,
                        fontSize: 14,
                        padding: const EdgeInsets.symmetric(
                            horizontal: 24, vertical: 12),
                        label:
                            '🎯 ${context.t('seminars.browse_upcoming', 'Browse Upcoming')}',
                        onPressed: () {
                          final ctx = _listKey.currentContext;
                          if (ctx != null) {
                            Scrollable.ensureVisible(ctx,
                                duration: const Duration(milliseconds: 500));
                          }
                        },
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 20, vertical: 12),
                        decoration: BoxDecoration(
                          color: Colors.white.withValues(alpha: 0.05),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(
                              color: Colors.white.withValues(alpha: 0.1)),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text(
                                '${all.length} ${context.t('seminars.seminars_live', 'Live Events')}',
                                style: TwText.sans(14,
                                    weight: FontWeight.w700, color: Tw.cream)),
                            Text(
                                context.t(
                                    'seminars.book_your_seat', 'Book now'),
                                style: TwText.sans(12,
                                    color: const Color(0xFFD1FAE5)
                                        .withValues(alpha: 0.7))),
                          ],
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
            // Filter tabs
            Container(
              padding: const EdgeInsets.all(4),
              decoration: BoxDecoration(
                color: Tw.creamBg,
                borderRadius: BorderRadius.circular(999),
                border: Border.all(color: Tw.creamBorder),
              ),
              child: SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  children: [
                    _tab('all', context.t('seminars.all', 'All Seminars')),
                    _tab('in_person',
                        context.t('seminars.in_person', 'In-person')),
                    _tab('virtual',
                        context.t('seminars.virtual', 'Virtual & hybrid')),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 14),
            TextField(
              controller: _search,
              onChanged: (v) => setState(() => _query = v),
              style: TwText.sans(14, color: Tw.slate800),
              decoration: InputDecoration(
                hintText: 'Search by topic, speaker, venue...',
                hintStyle: TwText.sans(14, color: Tw.slate400),
                filled: true,
                fillColor: Colors.white,
                prefixIcon:
                    const Icon(Icons.search, size: 20, color: Tw.slate400),
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
            const SizedBox(height: 20),
            KeyedSubtree(key: _listKey, child: const SizedBox.shrink()),
            if (provider.isLoading && all.isEmpty) ...[
              const ShimmerCardSkeleton(height: 320),
              const SizedBox(height: 20),
              const ShimmerCardSkeleton(height: 320),
            ] else if (provider.error != null && all.isEmpty)
              _NoSeminars(
                title: provider.error!,
                hint: '',
                onReset: () => context.read<SeminarProvider>().getSeminars(),
                resetLabel: context.tr('common.retry'),
              )
            else if (seminars.isEmpty)
              _NoSeminars(
                title: 'No seminars found',
                hint: all.isEmpty
                    ? 'New seminars will appear here as soon as they are announced.'
                    : 'Try adjusting your search query or switching filters.',
                onReset: all.isEmpty
                    ? null
                    : () => setState(() {
                          _filter = 'all';
                          _search.clear();
                          _query = '';
                        }),
                resetLabel: 'Reset Filters',
              )
            else
              for (final s in seminars) ...[
                SeminarCard(
                    seminar: s, onTap: () => context.push('/seminars/${s.id}')),
                const SizedBox(height: 20),
              ],
          ],
        ),
      ),
    );
  }

  Widget _tab(String value, String label) {
    final active = _filter == value;
    return Material(
      color: Colors.transparent,
      child: InkWell(
        borderRadius: BorderRadius.circular(999),
        onTap: () => setState(() => _filter = value),
        child: Ink(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
          decoration: BoxDecoration(
            color: active ? Tw.heroA : Colors.transparent,
            borderRadius: BorderRadius.circular(999),
          ),
          child: Text(label,
              style: TwText.sans(12.5,
                  weight: FontWeight.w600,
                  color: active ? Tw.goldLight : Tw.slate700)),
        ),
      ),
    );
  }
}

class _NoSeminars extends StatelessWidget {
  final String title;
  final String hint;
  final VoidCallback? onReset;
  final String resetLabel;
  const _NoSeminars(
      {required this.title,
      required this.hint,
      this.onReset,
      required this.resetLabel});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(40),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: Tw.slate200),
      ),
      child: Column(
        children: [
          const Text('🏛️', style: TextStyle(fontSize: 36)),
          const SizedBox(height: 12),
          Text(title,
              textAlign: TextAlign.center,
              style: TwText.sans(16, weight: FontWeight.w700)),
          if (hint.isNotEmpty) ...[
            const SizedBox(height: 6),
            Text(hint,
                textAlign: TextAlign.center,
                style: TwText.sans(12, color: Tw.slate500)),
          ],
          if (onReset != null) ...[
            const SizedBox(height: 16),
            SecondaryButton(
                label: resetLabel,
                expand: false,
                fontSize: 14,
                onPressed: onReset),
          ],
        ],
      ),
    );
  }
}

/// Seminar card (Seminars.jsx <article>).
class SeminarCard extends StatelessWidget {
  final Seminar seminar;
  final VoidCallback? onTap;
  final bool full; // detail page shows the whole description
  final Widget? action;

  const SeminarCard(
      {super.key,
      required this.seminar,
      this.onTap,
      this.full = false,
      this.action});

  @override
  Widget build(BuildContext context) {
    final s = seminar;
    final image = ApiConfig.mediaUrl(s.image);
    final locationLabel = s.isVirtual
        ? context.t('seminars.loc_virtual', 'Virtual')
        : s.isHybrid
            ? context.t('seminars.loc_hybrid', 'Hybrid')
            : context.t('seminars.loc_in_person', 'In person');

    return HomeCard(
      padding: EdgeInsets.zero,
      onTap: onTap,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (image != null)
            SizedBox(
              height: 192,
              width: double.infinity,
              child: Stack(
                fit: StackFit.expand,
                children: [
                  CachedNetworkImage(
                    imageUrl: image,
                    fit: BoxFit.cover,
                    errorWidget: (_, __, ___) =>
                        const ColoredBox(color: Tw.slate900),
                  ),
                  Positioned(
                    left: 12,
                    top: 12,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 12, vertical: 4),
                      decoration: BoxDecoration(
                        color: Tw.heroA.withValues(alpha: 0.8),
                        borderRadius: BorderRadius.circular(999),
                        border:
                            Border.all(color: Tw.gold2.withValues(alpha: 0.4)),
                      ),
                      child: Text((s.badge ?? 'Seminar').toUpperCase(),
                          style: TwText.eyebrow(11, Tw.goldLight,
                              trackingEm: 0.05)),
                    ),
                  ),
                  Positioned(
                    right: 12,
                    top: 12,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 12, vertical: 4),
                      decoration: BoxDecoration(
                          color: Tw.goldLight,
                          borderRadius: BorderRadius.circular(999)),
                      child: Text(s.priceLabel,
                          style: TwText.sans(12,
                              weight: FontWeight.w800, color: Tw.priceInk)),
                    ),
                  ),
                ],
              ),
            ),
          Container(
            height: 4,
            decoration: const BoxDecoration(
                gradient:
                    LinearGradient(colors: [Tw.heroA, Tw.goldDeep, Tw.heroA])),
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(24, 20, 24, 16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                if (image == null) ...[
                  Row(
                    children: [
                      Flexible(
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 12, vertical: 4),
                          decoration: BoxDecoration(
                            color: Tw.creamBg,
                            borderRadius: BorderRadius.circular(999),
                            border: Border.all(color: Tw.creamBorder),
                          ),
                          child: Text(
                              (s.badge ?? 'Upcoming Seminar').toUpperCase(),
                              overflow: TextOverflow.ellipsis,
                              style: TwText.eyebrow(11, Tw.goldMuted,
                                  trackingEm: 0.05)),
                        ),
                      ),
                      const Spacer(),
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 12, vertical: 4),
                        decoration: BoxDecoration(
                            color: Tw.heroA,
                            borderRadius: BorderRadius.circular(999)),
                        child: Text(locationLabel,
                            style: TwText.sans(11,
                                weight: FontWeight.w600, color: Tw.goldLight)),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                ],
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: Tw.creamBg,
                    borderRadius: BorderRadius.circular(999),
                    border: Border.all(color: Tw.creamBorder),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(Icons.calendar_today_outlined,
                          size: 15, color: Tw.emerald700),
                      const SizedBox(width: 8),
                      Flexible(
                        child: Text(s.dateLabel,
                            style: TwText.sans(12,
                                weight: FontWeight.w600, color: Tw.priceInk)),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 12),
                Text(s.title, style: TwText.display(24, height: 1.35)),
                if (s.tagline != null) ...[
                  const SizedBox(height: 8),
                  Text(s.tagline!,
                      style: TwText.sans(14,
                          weight: FontWeight.w500, color: Tw.goldMuted)),
                ],
                const SizedBox(height: 12),
                _location(context, s),
                if (s.description.isNotEmpty) ...[
                  const SizedBox(height: 12),
                  Text(
                    s.description,
                    maxLines: full ? null : 3,
                    overflow: full ? null : TextOverflow.ellipsis,
                    style: TwText.sans(full ? 15 : 13,
                        color: Tw.slate600, height: 1.65),
                  ),
                ],
                if (s.topics.isNotEmpty) ...[
                  const SizedBox(height: 16),
                  Wrap(
                    spacing: 6,
                    runSpacing: 6,
                    children: [
                      for (final t in s.topics)
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: Tw.slate100,
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(
                                color: Tw.slate200.withValues(alpha: 0.6)),
                          ),
                          child: Text('✓ $t',
                              style: TwText.sans(11,
                                  weight: FontWeight.w500, color: Tw.slate700)),
                        ),
                    ],
                  ),
                ],
                const SizedBox(height: 20),
                const Divider(height: 1, color: Tw.slate100),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Container(
                      width: 44,
                      height: 44,
                      alignment: Alignment.center,
                      decoration: const BoxDecoration(
                          color: Tw.heroA, shape: BoxShape.circle),
                      child: Text(s.speakerInitials ?? 'SL',
                          style: TwText.sans(14,
                              weight: FontWeight.w700, color: Tw.goldLight)),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(s.speakerName ?? 'Success Life Coaching',
                              style: TwText.sans(14,
                                  weight: FontWeight.w700, height: 1.2)),
                          Text(s.speakerTitle ?? 'Executive Master Coach',
                              style: TwText.sans(12, color: Tw.slate500)),
                        ],
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          // Footer with capacity bar
          Container(
            padding: const EdgeInsets.fromLTRB(24, 16, 24, 20),
            decoration: const BoxDecoration(
              color: Tw.creamBg,
              border: Border(top: BorderSide(color: Color(0xFFF3E6C2))),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Expanded(
                      child: Text.rich(TextSpan(
                        style: TwText.sans(12,
                            weight: FontWeight.w500, color: Tw.slate500),
                        children: [
                          TextSpan(
                              text:
                                  '${context.t('seminars.capacity_status', 'Capacity Status')}: '),
                          TextSpan(
                            text: s.hasCapacity
                                ? '${s.registeredCount} / ${s.capacity} booked'
                                : 'Open seating',
                            style: const TextStyle(
                                fontWeight: FontWeight.w700,
                                color: Tw.slate800),
                          ),
                        ],
                      )),
                    ),
                    Text(s.priceLabel,
                        style: TwText.sans(12,
                            weight: FontWeight.w700, color: Tw.copper700)),
                  ],
                ),
                const SizedBox(height: 10),
                ClipRRect(
                  borderRadius: BorderRadius.circular(999),
                  child: Container(
                    height: 6,
                    color: Tw.creamBorder,
                    alignment: Alignment.centerLeft,
                    child: FractionallySizedBox(
                      widthFactor: s.fill,
                      child: Container(
                        decoration: const BoxDecoration(
                          gradient:
                              LinearGradient(colors: [Tw.heroA, Tw.goldDeep]),
                        ),
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        '✓ ${context.t('seminars.certificate_included', 'Includes Certificate of Attendance')}',
                        style: TwText.sans(11,
                            weight: FontWeight.w600, color: Tw.emerald800),
                      ),
                    ),
                    const SizedBox(width: 8),
                    action ??
                        GoldPillButton(
                          expand: false,
                          fontSize: 12,
                          padding: const EdgeInsets.symmetric(
                              horizontal: 18, vertical: 10),
                          label:
                              '${s.isFree ? context.t('seminars.reserve_seat', 'Reserve Free Seat') : context.t('seminars.buy_ticket', 'Buy Ticket / Upload Slip')} →',
                          onPressed: onTap,
                        ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _location(BuildContext context, Seminar s) {
    if (s.isVirtual) {
      return Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: Tw.copper50.withValues(alpha: 0.9),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: Tw.copper200.withValues(alpha: 0.8)),
        ),
        child: Text('💻  ${s.location}',
            style:
                TwText.sans(12, weight: FontWeight.w600, color: Tw.copper800)),
      );
    }
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(s.isHybrid ? Icons.public : Icons.location_on_outlined,
            size: 16, color: s.isHybrid ? Tw.amber700 : Tw.slate400),
        const SizedBox(width: 6),
        Expanded(
          child: Text.rich(TextSpan(children: [
            if (s.isHybrid)
              TextSpan(
                  text: 'Hybrid: ',
                  style: TwText.sans(12,
                      weight: FontWeight.w700, color: Tw.amber700)),
            TextSpan(
                text: s.venueName ?? 'TBA',
                style: TwText.sans(12,
                    weight: FontWeight.w600, color: Tw.slate700)),
            if (s.venueCity != null)
              TextSpan(
                  text: '  (${s.venueCity})',
                  style: TwText.sans(12, color: Tw.slate400)),
          ])),
        ),
      ],
    );
  }
}
