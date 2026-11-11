import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:success_life_coaching_app/l10n/strings.dart';
import 'package:success_life_coaching_app/models/payment_info.dart';
import 'package:success_life_coaching_app/providers/auth_provider.dart';
import 'package:success_life_coaching_app/providers/seminar_provider.dart';
import 'package:success_life_coaching_app/screens/seminars/seminars_list_screen.dart';
import 'package:success_life_coaching_app/services/api_service.dart';
import 'package:success_life_coaching_app/theme/tw.dart';
import 'package:success_life_coaching_app/widgets/app_menu.dart';
import 'package:success_life_coaching_app/widgets/ui.dart';

class SeminarDetailScreen extends StatefulWidget {
  final String seminarId;
  const SeminarDetailScreen({super.key, required this.seminarId});

  @override
  State<SeminarDetailScreen> createState() => _SeminarDetailScreenState();
}

class _SeminarDetailScreenState extends State<SeminarDetailScreen> {
  bool _busy = false;
  String? _error;
  String? _success;
  String? _code;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _load());
  }

  Future<void> _load() => context.read<SeminarProvider>().getSeminarDetail(widget.seminarId);

  Future<void> _register() async {
    if (!context.read<AuthProvider>().isLoggedIn) {
      context.push(Uri(path: '/login', queryParameters: {'from': '/seminars/${widget.seminarId}'}).toString());
      return;
    }
    setState(() {
      _busy = true;
      _error = null;
    });
    final provider = context.read<SeminarProvider>();
    final ok = await provider.registerSeminar(widget.seminarId);
    if (!mounted) return;
    setState(() {
      _busy = false;
      if (ok) {
        _success = provider.message;
        _code = provider.registrationCode;
      } else {
        _error = provider.error;
      }
    });
    if (ok) _load();
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<SeminarProvider>();
    final s = provider.selectedSeminar;
    final matches = s != null && '${s.id}' == widget.seminarId;

    Widget body;
    if (!matches && provider.isLoading) {
      body = ListView(
        padding: const EdgeInsets.fromLTRB(16, 20, 16, 32),
        children: const [
          ShimmerCardSkeleton(height: 340),
          SizedBox(height: 20),
          ShimmerCardSkeleton(height: 160),
        ],
      );
    } else if (!matches) {
      body = Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(mainAxisSize: MainAxisSize.min, children: [
            Text(provider.error ?? 'Seminar not found.', textAlign: TextAlign.center),
            const SizedBox(height: 16),
            SecondaryButton(label: context.tr('common.retry'), expand: false, onPressed: _load),
          ]),
        ),
      );
    } else {
      final label = s.isFull
          ? 'Fully Booked'
          : s.isFree
              ? context.t('seminars.reserve_seat', 'Reserve Free Seat')
              : context.t('seminars.buy_ticket', 'Buy Ticket / Upload Slip');

      body = RefreshIndicator(
        color: Tw.copper700,
        onRefresh: _load,
        child: ListView(
          padding: const EdgeInsets.fromLTRB(16, 20, 16, 32),
          children: [
            SeminarCard(
              seminar: s,
              full: true,
              action: const SizedBox.shrink(),
            ),
            const SizedBox(height: 20),
            if (_success != null)
              _BoardingPass(message: _success!, code: _code, seminarTitle: s.title)
            else ...[
              if (!s.isFree) const _SeminarPaymentInfo(),
              if (_error != null) ...[const SizedBox(height: 12), ErrorBox([_error!])],
              const SizedBox(height: 16),
              GoldPillButton(
                label: '$label →',
                onPressed: s.isFull || _busy ? null : _register,
              ),
            ],
            if (s.onlineLink != null) ...[
              const SizedBox(height: 12),
              SecondaryButton(
                label: '🔗 ${context.t('seminars.join_stream', 'Join Stream / Online Link')}',
                onPressed: () => launchUrl(Uri.parse(s.onlineLink!), mode: LaunchMode.externalApplication),
              ),
            ],
          ],
        ),
      );
    }

    return SiteScaffold(currentRoute: '/seminars', body: body);
  }
}

class _SeminarPaymentInfo extends StatelessWidget {
  const _SeminarPaymentInfo();

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<PaymentInfo>(
      future: ApiService().getPaymentInfo(),
      builder: (context, snap) {
        final p = snap.data;
        return Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: Tw.creamBg,
            borderRadius: BorderRadius.circular(24),
            border: Border.all(color: Tw.creamBorder),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(context.t('seminars.payment_instructions', 'Payment Instructions'),
                  style: TwText.sans(16, weight: FontWeight.w700)),
              const SizedBox(height: 8),
              Text(
                'Reserve your seat, then transfer the entrance fee to one of these accounts. An admin approves your seat after the payment is confirmed.',
                style: TwText.sans(13, color: Tw.slate600, height: 1.6),
              ),
              if (p != null) ...[
                const SizedBox(height: 12),
                Text('${p.bankName}: ${p.bankNumber}', style: TwText.sans(13, weight: FontWeight.w700)),
                const SizedBox(height: 4),
                Text('Telebirr: ${p.telebirrPhone} (${p.telebirrName})',
                    style: TwText.sans(13, weight: FontWeight.w700)),
              ],
            ],
          ),
        );
      },
    );
  }
}

class _BoardingPass extends StatelessWidget {
  final String message;
  final String? code;
  final String seminarTitle;
  const _BoardingPass({required this.message, required this.code, required this.seminarTitle});

  @override
  Widget build(BuildContext context) {
    return HeroBox(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(context.t('seminars.pass_confirmed', 'Official Seminar Boarding Pass').toUpperCase(),
              style: TwText.eyebrow(11, Tw.cream, trackingEm: 0.2)),
          const SizedBox(height: 12),
          Text(seminarTitle, style: TwText.display(22, color: Colors.white, height: 1.3)),
          const SizedBox(height: 10),
          Text(message, style: TwText.sans(14, color: Tw.emerald50.withValues(alpha: 0.85), height: 1.6)),
          if (code != null) ...[
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.08),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Tw.gold2.withValues(alpha: 0.4)),
              ),
              child: SelectableText(code!,
                  style: TwText.sans(20, weight: FontWeight.w900, color: Tw.goldLight, letterSpacing: 2)),
            ),
          ],
        ],
      ),
    );
  }
}
