import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';
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

/// Mirrors resources/js/Pages/Course/Show.jsx (mobile).
class CourseDetailScreen extends StatefulWidget {
  final String courseId;
  const CourseDetailScreen({super.key, required this.courseId});

  @override
  State<CourseDetailScreen> createState() => _CourseDetailScreenState();
}

class _CourseDetailScreenState extends State<CourseDetailScreen> {
  final _purchaseKey = GlobalKey();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _load());
  }

  Future<void> _load() =>
      context.read<CourseProvider>().getCourseDetail(widget.courseId);

  void _scrollToPurchase() {
    final ctx = _purchaseKey.currentContext;
    if (ctx != null) {
      Scrollable.ensureVisible(ctx,
          duration: const Duration(milliseconds: 500),
          curve: Curves.easeOutCubic);
    }
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<CourseProvider>();
    final loggedIn = context.watch<AuthProvider>().isLoggedIn;
    final course = provider.selectedCourse;
    final matches = course != null && '${course.id}' == widget.courseId;

    Widget body;
    if (provider.isLoading && !matches) {
      body = ListView(
        padding: const EdgeInsets.fromLTRB(16, 24, 16, 32),
        children: const [
          ShimmerCardSkeleton(height: 320),
          SizedBox(height: 20),
          ShimmerCardSkeleton(height: 180),
        ],
      );
    } else if (!matches) {
      body = Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(provider.error ?? 'Course not found.',
                  textAlign: TextAlign.center, style: TwText.sans(15)),
              const SizedBox(height: 16),
              SecondaryButton(
                  label: context.tr('common.retry'),
                  expand: false,
                  onPressed: _load),
            ],
          ),
        ),
      );
    } else {
      body = RefreshIndicator(
        color: Tw.copper700,
        onRefresh: _load,
        child: ListView(
          padding: const EdgeInsets.fromLTRB(16, 24, 16, 32),
          children: [
            _MainCard(course: course),
            const SizedBox(height: 24),
            _EnrollCard(course: course),
            const SizedBox(height: 24),
            KeyedSubtree(
              key: _purchaseKey,
              child: _PurchaseCard(
                  course: course, loggedIn: loggedIn, onChanged: _load),
            ),
            const SizedBox(height: 16),
            SecondaryButton(
                label: 'Back to Courses',
                onPressed: () => context.go('/courses')),
          ],
        ),
      );
    }

    return SiteScaffold(
      currentRoute: '/courses',
      stickyBottom: matches
          ? _StickyPriceBar(
              course: course, loggedIn: loggedIn, onEnroll: _scrollToPurchase)
          : null,
      body: body,
    );
  }
}

class _MainCard extends StatelessWidget {
  final Course course;
  const _MainCard({required this.course});

  @override
  Widget build(BuildContext context) {
    Widget tile(String label, String value, {bool brand = false}) => Expanded(
          child: Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: brand ? Tw.copper50.withValues(alpha: 0.6) : Tw.slate50,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(
                  color: brand
                      ? Tw.copper100.withValues(alpha: 0.6)
                      : Tw.slate100),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(label.toUpperCase(),
                    style: TwText.eyebrow(10, Tw.slate500, trackingEm: 0.05)),
                const SizedBox(height: 4),
                FittedBox(
                  fit: BoxFit.scaleDown,
                  alignment: Alignment.centerLeft,
                  child: Text(value,
                      style: TwText.sans(20,
                          weight: FontWeight.w900,
                          color: brand ? Tw.copper800 : Tw.slate900)),
                ),
              ],
            ),
          ),
        );

    return SurfaceCard(
      padding: EdgeInsets.zero,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            height: 240,
            child: CourseImage(
              url: course.thumbnail,
              aspectRatio: 16 / 10,
              overlays: [
                DecoratedBox(
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.bottomCenter,
                      end: Alignment.topCenter,
                      colors: [
                        Tw.slate900.withValues(alpha: 0.95),
                        Tw.slate900.withValues(alpha: 0.4),
                        Colors.transparent,
                      ],
                    ),
                  ),
                ),
                Positioned(
                  left: 16,
                  right: 16,
                  bottom: 16,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 12, vertical: 4),
                        decoration: BoxDecoration(
                          color: Colors.white.withValues(alpha: 0.2),
                          borderRadius: BorderRadius.circular(999),
                        ),
                        child: Text('VIDEO COACHING EXPERIENCE',
                            style: TwText.eyebrow(10, Colors.white,
                                trackingEm: 0.25)),
                      ),
                      const SizedBox(height: 10),
                      Text(course.title,
                          style: TwText.sans(24,
                              weight: FontWeight.w900,
                              color: Colors.white,
                              height: 1.2)),
                      const SizedBox(height: 6),
                      Text.rich(
                        TextSpan(
                          style: TwText.sans(12, color: Tw.slate200),
                          children: [
                            const TextSpan(text: 'Coach: '),
                            TextSpan(
                              text: course.instructorName ?? 'Success Coach',
                              style: const TextStyle(
                                  fontWeight: FontWeight.w600,
                                  color: Colors.white),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                Row(children: [
                  tile('Price', etb(course.price), brand: true),
                  const SizedBox(width: 12),
                  tile('Lessons', '${course.lessonsCount}'),
                ]),
                const SizedBox(height: 12),
                Row(children: [
                  tile('Format', 'HD Video'),
                  const SizedBox(width: 12),
                  tile('Access', '6 Months', brand: true),
                ]),
                const SizedBox(height: 20),
                // Course Description: rounded-[28px] shell with slate-50 inner panel
                Container(
                  padding: const EdgeInsets.all(4),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(28),
                    border: Border.all(color: Tw.copper100),
                  ),
                  child: Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                        color: Tw.slate50,
                        borderRadius: BorderRadius.circular(24)),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Course Description',
                            style: TwText.sans(22, weight: FontWeight.w700)),
                        const SizedBox(height: 14),
                        Text(
                          course.description.isEmpty ? '—' : course.description,
                          style:
                              TwText.sans(16, color: Tw.slate600, height: 1.9),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _EnrollCard extends StatelessWidget {
  final Course course;
  const _EnrollCard({required this.course});

  @override
  Widget build(BuildContext context) {
    Widget benefit(String text) => Padding(
          padding: const EdgeInsets.only(top: 12),
          child: Row(
            children: [
              Container(
                width: 32,
                height: 32,
                alignment: Alignment.center,
                decoration: const BoxDecoration(
                    color: Tw.emerald100, shape: BoxShape.circle),
                child: Text('✓',
                    style: TwText.sans(14,
                        weight: FontWeight.w700, color: Tw.emerald600)),
              ),
              const SizedBox(width: 12),
              Expanded(
                  child: Text(text,
                      style:
                          TwText.sans(14, color: Tw.slate600, height: 1.45))),
            ],
          ),
        );

    return SurfaceCard(
      padding: const EdgeInsets.all(24),
      child: Column(
        children: [
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(28),
              gradient: const LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [Tw.copper600, Tw.accent, Tw.bronze],
              ),
              boxShadow: [
                BoxShadow(
                  color: Tw.copper700.withValues(alpha: 0.5),
                  blurRadius: 80,
                  offset: const Offset(0, 24),
                  spreadRadius: -36,
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('ENROLL NOW',
                    style: TwText.eyebrow(14, Tw.copper100, trackingEm: 0.28)
                        .copyWith(fontWeight: FontWeight.w600)),
                const SizedBox(height: 16),
                FittedBox(
                  fit: BoxFit.scaleDown,
                  alignment: Alignment.centerLeft,
                  child: Text(etb(course.price),
                      style: TwText.sans(36,
                          weight: FontWeight.w900, color: Colors.white)),
                ),
                const SizedBox(height: 6),
                Text('${course.lessonsCount} lessons included',
                    style: TwText.sans(14, color: Tw.copper100)),
              ],
            ),
          ),
          const SizedBox(height: 24),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Tw.slate50,
              borderRadius: BorderRadius.circular(28),
              border: Border.all(color: Tw.copper100),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('What you get',
                    style: TwText.sans(18, weight: FontWeight.w700)),
                const SizedBox(height: 4),
                benefit(
                    'Full 6-month access to stream all lessons and modules'),
                benefit('Continue from your saved progress anytime'),
                benefit('Verifiable certificate upon completing the program'),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

/// The 4 states of the website's #purchase card.
class _PurchaseCard extends StatelessWidget {
  final Course course;
  final bool loggedIn;
  final Future<void> Function() onChanged;

  const _PurchaseCard(
      {required this.course, required this.loggedIn, required this.onChanged});

  Widget _statusTile(String emoji, Color bg, Color border) => Container(
        width: 64,
        height: 64,
        alignment: Alignment.center,
        decoration: BoxDecoration(
          color: bg,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: border),
          boxShadow: Tw.sm,
        ),
        child: Text(emoji, style: const TextStyle(fontSize: 28)),
      );

  @override
  Widget build(BuildContext context) {
    final here = '/courses/${course.id}';

    if (!loggedIn) {
      return SurfaceCard(
        padding: const EdgeInsets.all(24),
        child: Column(
          children: [
            _statusTile('🔒', Tw.copper50, Tw.copper200),
            const SizedBox(height: 16),
            Text('Sign in to Enroll',
                style: TwText.sans(22, weight: FontWeight.w900)),
            const SizedBox(height: 8),
            Text(
              'Create an account or login to purchase this coaching course and get 6-month access.',
              textAlign: TextAlign.center,
              style: TwText.sans(14, color: Tw.slate600, height: 1.6),
            ),
            const SizedBox(height: 20),
            PrimaryButton(
              label: 'Login to Purchase',
              onPressed: () => context.push(
                  Uri(path: '/login', queryParameters: {'from': here})
                      .toString()),
            ),
            const SizedBox(height: 10),
            SecondaryButton(
                label: 'Create Account',
                onPressed: () => context.push('/register')),
          ],
        ),
      );
    }

    if (course.isPurchased) {
      return SurfaceCard(
        padding: const EdgeInsets.all(24),
        child: Column(
          children: [
            _statusTile('✓', Tw.emerald100, Tw.emerald200),
            const SizedBox(height: 16),
            Text('You Are Enrolled!',
                style: TwText.sans(22, weight: FontWeight.w900)),
            const SizedBox(height: 8),
            Text('Your 6-month access is active. Pick up where you left off.',
                textAlign: TextAlign.center,
                style: TwText.sans(14, color: Tw.slate600, height: 1.6)),
            const SizedBox(height: 20),
            PrimaryButton(
                label: 'Continue Learning →',
                onPressed: () => context.push('$here/learn')),
          ],
        ),
      );
    }

    if (course.hasPendingPayment) {
      return SurfaceCard(
        padding: const EdgeInsets.all(24),
        child: Column(
          children: [
            _statusTile('⏳', Tw.amber100, Tw.amber200),
            const SizedBox(height: 16),
            Text('Payment Under Review',
                style: TwText.sans(22, weight: FontWeight.w900)),
            const SizedBox(height: 8),
            Text(
              'We received your bank payment receipt! Our team is verifying your deposit. Your 6-month course access will unlock immediately once approved.',
              textAlign: TextAlign.center,
              style: TwText.sans(14, color: Tw.slate600, height: 1.6),
            ),
            const SizedBox(height: 20),
            SecondaryButton(
                label: 'Go to Student Dashboard',
                onPressed: () => context.go('/dashboard')),
            const SizedBox(height: 8),
            TextButton(
                onPressed: onChanged, child: const Text('Check status again')),
          ],
        ),
      );
    }

    if (course.isFree) {
      return _FreeEnroll(course: course, onEnrolled: onChanged);
    }

    return _PaidPurchase(course: course, onSubmitted: onChanged);
  }
}

class _FreeEnroll extends StatefulWidget {
  final Course course;
  final Future<void> Function() onEnrolled;
  const _FreeEnroll({required this.course, required this.onEnrolled});

  @override
  State<_FreeEnroll> createState() => _FreeEnrollState();
}

class _FreeEnrollState extends State<_FreeEnroll> {
  bool _busy = false;
  String? _error;

  Future<void> _enroll() async {
    setState(() {
      _busy = true;
      _error = null;
    });
    final ok = await context
        .read<CourseProvider>()
        .enrollCourse('${widget.course.id}');
    if (!mounted) return;
    setState(() {
      _busy = false;
      if (!ok) _error = context.read<CourseProvider>().error;
    });
  }

  @override
  Widget build(BuildContext context) {
    return SurfaceCard(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Free 6-Month Access',
              style: TwText.sans(22, weight: FontWeight.w700)),
          const SizedBox(height: 8),
          Text(
              'This program is free. Enroll now and start watching immediately.',
              style: TwText.sans(14, color: Tw.slate600, height: 1.6)),
          if (_error != null) ...[
            const SizedBox(height: 14),
            ErrorBox([_error!])
          ],
          const SizedBox(height: 20),
          PrimaryButton(
              label: 'Enroll for Free', loading: _busy, onPressed: _enroll),
        ],
      ),
    );
  }
}

class _PaidPurchase extends StatefulWidget {
  final Course course;
  final Future<void> Function() onSubmitted;
  const _PaidPurchase({required this.course, required this.onSubmitted});

  @override
  State<_PaidPurchase> createState() => _PaidPurchaseState();
}

class _PaidPurchaseState extends State<_PaidPurchase> {
  late final Future<PaymentInfo> _info = ApiService().getPaymentInfo();
  File? _receipt;
  bool _busy = false;
  String? _error;
  String? _copied;

  Future<void> _pick() async {
    final picked = await ImagePicker().pickImage(
      source: ImageSource.gallery,
      imageQuality: 85, // keeps uploads under the 4 MB limit
      maxWidth: 2000,
    );
    if (picked != null) setState(() => _receipt = File(picked.path));
  }

  Future<void> _submit() async {
    if (_receipt == null) {
      setState(
          () => _error = 'Please choose your payment receipt photo first.');
      return;
    }
    setState(() {
      _busy = true;
      _error = null;
    });
    try {
      final msg = await ApiService().uploadReceipt(widget.course.id, _receipt!);
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg)));
      await widget.onSubmitted();
    } catch (e) {
      if (mounted) setState(() => _error = e.toString());
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  void _copy(String text, String field) {
    Clipboard.setData(ClipboardData(text: text));
    setState(() => _copied = field);
    Future.delayed(const Duration(seconds: 2), () {
      if (mounted && _copied == field) setState(() => _copied = null);
    });
  }

  Widget _account({
    required String label,
    required String number,
    required String ownerLabel,
    required String owner,
    required String copyLabel,
    required String field,
    required Color border,
    required Color bg,
    required Color ink,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: border),
        boxShadow: Tw.sm,
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(label.toUpperCase(),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: TwText.eyebrow(11, ink, trackingEm: 0.05)),
                const SizedBox(height: 4),
                SelectableText(number,
                    style: TwText.sans(20,
                            weight: FontWeight.w900, letterSpacing: 1)
                        .copyWith(fontFamily: 'monospace')),
                const SizedBox(height: 4),
                Text.rich(TextSpan(
                  style: TwText.sans(12, color: Tw.slate600),
                  children: [
                    TextSpan(text: '$ownerLabel '),
                    TextSpan(
                        text: owner,
                        style: const TextStyle(
                            fontWeight: FontWeight.w600, color: Tw.slate900)),
                  ],
                )),
              ],
            ),
          ),
          const SizedBox(width: 8),
          OutlinedButton(
            onPressed: () => _copy(number, field),
            style: OutlinedButton.styleFrom(
              foregroundColor: ink,
              backgroundColor: Colors.white,
              side: BorderSide(color: border),
              minimumSize: const Size(0, 40),
              padding: const EdgeInsets.symmetric(horizontal: 12),
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12)),
              textStyle: TwText.sans(12, weight: FontWeight.w700),
            ),
            child: Text(_copied == field ? '✓ Copied' : copyLabel),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final price = etb(widget.course.price);

    return SurfaceCard(
      padding: const EdgeInsets.all(24),
      child: FutureBuilder<PaymentInfo>(
        future: _info,
        builder: (context, snap) {
          final info = snap.data;
          return Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Purchase 6-Month Access',
                  style: TwText.sans(22, weight: FontWeight.w700)),
              const SizedBox(height: 8),
              Text.rich(TextSpan(
                style: TwText.sans(14, color: Tw.slate600, height: 1.6),
                children: [
                  const TextSpan(text: 'Send '),
                  TextSpan(
                      text: price,
                      style: const TextStyle(
                          fontWeight: FontWeight.w700, color: Tw.copper700)),
                  const TextSpan(
                      text:
                          ' to one of the following official accounts, then upload your receipt.'),
                ],
              )),
              const SizedBox(height: 20),
              if (info == null && snap.connectionState != ConnectionState.done)
                const Center(
                    child: Padding(
                        padding: EdgeInsets.all(16),
                        child: CircularProgressIndicator()))
              else if (info == null)
                ErrorBox(
                    ['${snap.error ?? 'Could not load payment accounts.'}'])
              else ...[
                _account(
                  label: info.bankName,
                  number: info.bankNumber,
                  ownerLabel: 'Book Owner:',
                  owner: info.bankOwner,
                  copyLabel: 'Copy Number',
                  field: 'bank',
                  border: Tw.copper200,
                  bg: Tw.copper50.withValues(alpha: 0.5),
                  ink: Tw.copper800,
                ),
                const SizedBox(height: 14),
                _account(
                  label: 'Telebirr Mobile Wallet',
                  number: info.telebirrPhone,
                  ownerLabel: 'Account Name:',
                  owner: info.telebirrName,
                  copyLabel: 'Copy Phone',
                  field: 'telebirr',
                  border: Tw.emerald200,
                  bg: Tw.emerald50.withValues(alpha: 0.5),
                  ink: Tw.emerald800,
                ),
                if (info.instructions != null &&
                    info.instructions!.isNotEmpty) ...[
                  const SizedBox(height: 12),
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Tw.slate50,
                      borderRadius: BorderRadius.circular(12),
                      border:
                          Border.all(color: Tw.slate200.withValues(alpha: 0.8)),
                    ),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('ℹ️'),
                        const SizedBox(width: 8),
                        Expanded(
                            child: Text(info.instructions!,
                                style: TwText.sans(12,
                                    color: Tw.slate600, height: 1.6))),
                      ],
                    ),
                  ),
                ],
              ],
              const SizedBox(height: 24),
              Text('UPLOAD PAYMENT RECEIPT',
                  style: TwText.eyebrow(12, Tw.slate700, trackingEm: 0.05)),
              const SizedBox(height: 8),
              InkWell(
                onTap: _pick,
                borderRadius: BorderRadius.circular(16),
                child: Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Tw.copper50.withValues(alpha: 0.3),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: Tw.copper200, width: 2),
                  ),
                  child: _receipt == null
                      ? Column(
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 16, vertical: 10),
                              decoration: BoxDecoration(
                                  color: Tw.copper700,
                                  borderRadius: BorderRadius.circular(12)),
                              child: Text('Choose receipt photo',
                                  style: TwText.sans(12,
                                      weight: FontWeight.w700,
                                      color: Colors.white)),
                            ),
                            const SizedBox(height: 8),
                            Text('JPG or PNG, up to 4 MB',
                                style: TwText.sans(12, color: Tw.slate500)),
                          ],
                        )
                      : Row(
                          children: [
                            ClipRRect(
                              borderRadius: BorderRadius.circular(10),
                              child: Image.file(_receipt!,
                                  width: 56, height: 56, fit: BoxFit.cover),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Text('Receipt selected — tap to change',
                                  style: TwText.sans(13,
                                      weight: FontWeight.w600,
                                      color: Tw.copper800)),
                            ),
                            const Icon(Icons.check_circle,
                                color: Tw.emerald600),
                          ],
                        ),
                ),
              ),
              if (_error != null) ...[
                const SizedBox(height: 14),
                ErrorBox([_error!])
              ],
              const SizedBox(height: 20),
              PrimaryButton(
                label: _busy
                    ? 'Submitting receipt...'
                    : 'Confirm & Submit Receipt',
                loading: _busy,
                onPressed: _submit,
              ),
            ],
          );
        },
      ),
    );
  }
}

/// Fixed bar above the tab bar: "COURSE PRICE 1500 ETB  [Enroll Now]".
class _StickyPriceBar extends StatelessWidget {
  final Course course;
  final bool loggedIn;
  final VoidCallback onEnroll;
  const _StickyPriceBar(
      {required this.course, required this.loggedIn, required this.onEnroll});

  @override
  Widget build(BuildContext context) {
    final here = '/courses/${course.id}';
    final String label;
    final VoidCallback action;
    if (!loggedIn) {
      label = 'Login to Enroll';
      action = () => context.push(
          Uri(path: '/login', queryParameters: {'from': here}).toString());
    } else if (course.isPurchased) {
      label = 'Continue Learning →';
      action = () => context.push('$here/learn');
    } else {
      label = 'Enroll Now';
      action = onEnroll;
    }

    final price = etb(course.price);
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.97),
        border:
            Border(top: BorderSide(color: Tw.copper200.withValues(alpha: 0.8))),
        boxShadow: [
          BoxShadow(
              color: Colors.black.withValues(alpha: 0.06),
              blurRadius: 20,
              offset: const Offset(0, -8))
        ],
      ),
      child: Row(
        children: [
          Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('COURSE PRICE',
                  style: TwText.eyebrow(10, Tw.slate500, trackingEm: 0.05)),
              Text.rich(TextSpan(children: [
                TextSpan(
                  text: price.replaceAll(' ETB', ''),
                  style: TwText.sans(18,
                      weight: FontWeight.w900, color: Tw.copper800),
                ),
                TextSpan(
                    text: ' ETB',
                    style: TwText.sans(12,
                        weight: FontWeight.w700, color: Tw.copper800)),
              ])),
            ],
          ),
          const Spacer(),
          PrimaryButton(
            label: label,
            expand: false,
            fontSize: 14,
            padding: const EdgeInsets.symmetric(horizontal: 22, vertical: 10),
            onPressed: action,
          ),
        ],
      ),
    );
  }
}
