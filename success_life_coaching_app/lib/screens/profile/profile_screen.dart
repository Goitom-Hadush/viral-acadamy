import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:success_life_coaching_app/config/api_config.dart';
import 'package:success_life_coaching_app/l10n/strings.dart';
import 'package:success_life_coaching_app/providers/auth_provider.dart';
import 'package:success_life_coaching_app/providers/language_provider.dart';
import 'package:success_life_coaching_app/theme/tw.dart';
import 'package:success_life_coaching_app/widgets/app_menu.dart';
import 'package:success_life_coaching_app/widgets/ui.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final user = auth.user;
    final lang = context.watch<LanguageProvider>();
    final initial = (user?.name.trim().isNotEmpty ?? false)
        ? String.fromCharCode(user!.name.trim().runes.first).toUpperCase()
        : '?';

    Widget info(IconData icon, String label, String? value) => Padding(
          padding: const EdgeInsets.only(top: 12),
          child: Row(
            children: [
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                    color: Tw.copper50,
                    borderRadius: BorderRadius.circular(12)),
                child: Icon(icon, size: 20, color: Tw.copper700),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(label.toUpperCase(),
                        style:
                            TwText.eyebrow(10, Tw.slate500, trackingEm: 0.08)),
                    Text(value == null || value.isEmpty ? '—' : value,
                        style: TwText.sans(15,
                            weight: FontWeight.w600, color: Tw.slate900)),
                  ],
                ),
              ),
            ],
          ),
        );

    return SiteScaffold(
      currentRoute: '/profile',
      body: ListView(
        padding: const EdgeInsets.fromLTRB(16, 20, 16, 32),
        children: [
          // Profile Header Card
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [Color(0xFF04240C), Tw.copper700, Tw.copper600],
              ),
              borderRadius: BorderRadius.circular(28),
              boxShadow: [
                BoxShadow(
                  color: Tw.copper700.withValues(alpha: 0.35),
                  blurRadius: 32,
                  offset: const Offset(0, 8),
                ),
              ],
            ),
            child: Column(
              children: [
                Container(
                  padding: const EdgeInsets.all(3),
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    border: Border.all(color: Tw.gold2, width: 2),
                    boxShadow: Tw.goldShadow,
                  ),
                  child: InitialsAvatar(
                    initial,
                    size: 72,
                    colors: const [Tw.copper600, Tw.copper800],
                  ),
                ),
                const SizedBox(height: 14),
                Text(
                  user?.name ?? 'Student',
                  style: TwText.sans(22,
                      weight: FontWeight.w900, color: Colors.white),
                ),
                const SizedBox(height: 4),
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(999),
                    border: Border.all(
                        color: Tw.gold2.withValues(alpha: 0.3)),
                  ),
                  child: Text(
                    'VERIFIED MEMBER 🌟',
                    style:
                        TwText.eyebrow(10, Tw.cream, trackingEm: 0.15),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
          // Account Info Card
          SurfaceCard(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('ACCOUNT DETAILS',
                    style:
                        TwText.eyebrow(11, Tw.copper700, trackingEm: 0.08)),
                const SizedBox(height: 6),
                info(Icons.phone_outlined,
                    context.t('form.phone', 'Phone Number'), user?.phone),
                info(Icons.mail_outline, context.t('form.email', 'Email'),
                    user?.email),
                if (user?.referralCode != null)
                  info(Icons.card_giftcard, 'My Referral Code',
                      user!.referralCode),
              ],
            ),
          ),
          const SizedBox(height: 16),
          // Quick Shortcuts
          SurfaceCard(
            padding: const EdgeInsets.all(12),
            child: Column(
              children: [
                ListTile(
                  leading: Container(
                    width: 38,
                    height: 38,
                    decoration: BoxDecoration(
                        color: Tw.copper50,
                        borderRadius: BorderRadius.circular(12)),
                    child: const Icon(Icons.dashboard_outlined,
                        color: Tw.copper700, size: 20),
                  ),
                  title: Text(context.tr('nav.dashboard'),
                      style: TwText.sans(14, weight: FontWeight.w700)),
                  trailing: const Icon(Icons.chevron_right, color: Tw.slate400),
                  onTap: () => context.go('/dashboard'),
                ),
                const Divider(height: 1, indent: 56),
                ListTile(
                  leading: Container(
                    width: 38,
                    height: 38,
                    decoration: BoxDecoration(
                        color: Tw.copper50,
                        borderRadius: BorderRadius.circular(12)),
                    child: const Icon(Icons.menu_book_outlined,
                        color: Tw.copper700, size: 20),
                  ),
                  title: Text(context.tr('nav.courses'),
                      style: TwText.sans(14, weight: FontWeight.w700)),
                  trailing: const Icon(Icons.chevron_right, color: Tw.slate400),
                  onTap: () => context.go('/courses'),
                ),
                const Divider(height: 1, indent: 56),
                ListTile(
                  leading: Container(
                    width: 38,
                    height: 38,
                    decoration: BoxDecoration(
                        color: Tw.copper50,
                        borderRadius: BorderRadius.circular(12)),
                    child: const Icon(Icons.calendar_month_outlined,
                        color: Tw.copper700, size: 20),
                  ),
                  title: Text(context.tr('nav.seminars'),
                      style: TwText.sans(14, weight: FontWeight.w700)),
                  trailing: const Icon(Icons.chevron_right, color: Tw.slate400),
                  onTap: () => context.go('/seminars'),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          // Language selector
          SurfaceCard(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('🌐 ${context.tr('lang.label')} / ቋንቋ',
                    style: TwText.sans(16, weight: FontWeight.w800)),
                const SizedBox(height: 14),
                Row(
                  children: [
                    for (final l in appLanguages) ...[
                      Expanded(
                        child: _LangChoice(
                          label: l.label,
                          flag: l.flag,
                          active: lang.languageCode == l.code,
                          onTap: () => lang.setLanguage(l.code),
                        ),
                      ),
                      if (l != appLanguages.last) const SizedBox(width: 8),
                    ],
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
          SecondaryButton(
            label: context.tr('layout.change_profile'),
            leading:
                const Icon(Icons.open_in_new, size: 18, color: Tw.slate700),
            onPressed: () {
              // Profile and password changes use the website's secure profile page.
              final url =
                  Uri.parse(ApiConfig.baseUrl).replace(path: '/profile');
              launchUrl(url, mode: LaunchMode.externalApplication);
            },
          ),
          const SizedBox(height: 12),
          Material(
            color: Tw.rose50,
            borderRadius: BorderRadius.circular(16),
            child: InkWell(
              borderRadius: BorderRadius.circular(16),
              onTap: () async {
                final router = GoRouter.of(context);
                await context.read<AuthProvider>().logout();
                router.go('/home');
              },
              child: SizedBox(
                height: 52,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.logout, color: Tw.rose600, size: 20),
                    const SizedBox(width: 8),
                    Text(context.tr('nav.logout'),
                        style: TwText.sans(15,
                            weight: FontWeight.w700, color: Tw.rose600)),
                  ],
                ),
              ),
            ),
          ),
          const SizedBox(height: 24),
          Center(
            child: Text(
              'Success Life Coaching Academy v1.0.0\nBuilt for Ethiopia & Beyond',
              textAlign: TextAlign.center,
              style: TwText.sans(11.5, color: Tw.slate400, height: 1.5),
            ),
          ),
        ],
      ),
    );
  }
}

class _LangChoice extends StatelessWidget {
  final String label;
  final String flag;
  final bool active;
  final VoidCallback onTap;
  const _LangChoice(
      {required this.label,
      required this.flag,
      required this.active,
      required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Ink(
          height: 48,
          decoration: BoxDecoration(
            gradient: active ? Tw.brandDeepGradient : null,
            color: active ? null : Colors.white,
            borderRadius: BorderRadius.circular(12),
            border: active ? null : Border.all(color: Tw.slate200),
          ),
          child: Center(
            child: Text('$flag $label',
                style: TwText.sans(13,
                    weight: FontWeight.w700,
                    color: active ? Colors.white : Tw.slate700)),
          ),
        ),
      ),
    );
  }
}
