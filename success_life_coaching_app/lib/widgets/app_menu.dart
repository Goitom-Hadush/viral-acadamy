import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:provider/provider.dart';
import 'package:success_life_coaching_app/config/constants.dart';
import 'package:success_life_coaching_app/l10n/strings.dart';
import 'package:success_life_coaching_app/models/payment_info.dart';
import 'package:success_life_coaching_app/providers/auth_provider.dart';
import 'package:success_life_coaching_app/providers/language_provider.dart';
import 'package:success_life_coaching_app/services/api_service.dart';
import 'package:success_life_coaching_app/theme/tw.dart';
import 'package:success_life_coaching_app/widgets/ui.dart';

/// Mirrors resources/js/Layouts/AppLayout.jsx on mobile:
/// white sticky header, right-side drawer, and the 5-tab bottom bar.

class NavItem {
  final String route;
  final String labelKey;
  final IconData icon;
  final String? badgeKey;
  const NavItem(this.route, this.labelKey, this.icon, {this.badgeKey});
}

/// Same items and order as resources/js/Components/PublicMenu.jsx.
const List<NavItem> websiteNavItems = [
  NavItem('/home', 'nav.home', Icons.home_outlined),
  NavItem('/about', 'nav.about', Icons.info_outline),
  NavItem('/courses', 'nav.courses', Icons.menu_book_outlined),
  NavItem('/seminars', 'nav.seminars', Icons.calendar_month_outlined,
      badgeKey: 'nav.live'),
  NavItem('/reels', 'nav.reels', Icons.videocam_outlined, badgeKey: 'nav.new'),
  NavItem('/testimonials', 'nav.testimonials', Icons.sms_outlined),
];

class SiteScaffold extends StatefulWidget {
  /// Route used to highlight the menu / tab, e.g. '/courses'.
  final String currentRoute;
  final Widget body;

  /// Optional sticky bar shown above the tab bar (e.g. course price bar).
  final Widget? stickyBottom;

  const SiteScaffold({
    super.key,
    required this.currentRoute,
    required this.body,
    this.stickyBottom,
  });

  @override
  State<SiteScaffold> createState() => _SiteScaffoldState();
}

class _SiteScaffoldState extends State<SiteScaffold> {
  final _scaffoldKey = GlobalKey<ScaffoldState>();
  bool _drawerOpen = false;

  bool get _isTopLevel => const {
        '/home',
        '/about',
        '/courses',
        '/seminars',
        '/reels',
        '/testimonials',
        '/dashboard',
        '/profile'
      }.contains(widget.currentRoute);

  @override
  Widget build(BuildContext context) {
    final canPopRoute = GoRouter.of(context).canPop();
    final isHome = widget.currentRoute == '/home';

    return PopScope(
      // Top-level pages: Android back returns Home instead of closing the app.
      canPop: isHome || canPopRoute || !_isTopLevel,
      onPopInvokedWithResult: (didPop, _) {
        if (!didPop) context.go('/home');
      },
      child: Scaffold(
        key: _scaffoldKey,
        backgroundColor: Tw.page,
        appBar: SiteHeader(
            onMenu: () => _scaffoldKey.currentState?.openEndDrawer()),
        endDrawer: SiteDrawer(currentRoute: widget.currentRoute),
        onEndDrawerChanged: (open) => setState(() => _drawerOpen = open),
        body: widget.body,
        bottomNavigationBar: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (widget.stickyBottom != null) widget.stickyBottom!,
            SiteTabBar(
              currentRoute: widget.currentRoute,
              menuActive: _drawerOpen,
              onMenu: () => _scaffoldKey.currentState?.openEndDrawer(),
            ),
          ],
        ),
      ),
    );
  }
}

// ── Header ────────────────────────────────────────────────────────────────────

/// "Success Life / COACHING ACADEMY" wordmark next to the logo badge.
class BrandLockup extends StatelessWidget {
  final double logo;
  final bool light;
  const BrandLockup({super.key, this.logo = 40, this.light = false});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          width: logo,
          height: logo,
          padding: const EdgeInsets.all(4),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: Tw.copper200.withValues(alpha: 0.8)),
            boxShadow: Tw.sm,
          ),
          child: Image.asset(AppConstants.logoAsset, fit: BoxFit.contain),
        ),
        const SizedBox(width: 10),
        Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            RichText(
              text: TextSpan(
                style: TwText.sans(16,
                    weight: FontWeight.w900,
                    color: light ? Colors.white : Tw.slate900,
                    height: 1,
                    letterSpacing: -0.3),
                children: [
                  const TextSpan(text: 'Success '),
                  TextSpan(
                      text: 'Life',
                      style: TextStyle(color: light ? Tw.cream : Tw.copper700)),
                ],
              ),
            ),
            const SizedBox(height: 3),
            Text(context.tr('layout.academy').toUpperCase(),
                style: TwText.eyebrow(9, light ? Tw.cream : Tw.copper600,
                    trackingEm: 0.2)),
          ],
        ),
      ],
    );
  }
}

class SiteHeader extends StatelessWidget implements PreferredSizeWidget {
  final VoidCallback onMenu;
  const SiteHeader({super.key, required this.onMenu});

  @override
  Size get preferredSize => const Size.fromHeight(64);

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final router = GoRouter.of(context);

    return Material(
      color: Colors.white,
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          border: Border(
              bottom: BorderSide(color: Tw.copper100.withValues(alpha: 0.9))),
          boxShadow: Tw.sm,
        ),
        child: SafeArea(
          bottom: false,
          child: SizedBox(
            height: 64,
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 12),
              child: Row(
                children: [
                  Flexible(
                    child: InkWell(
                      onTap: () => router.go('/home'),
                      borderRadius: BorderRadius.circular(12),
                      child: const BrandLockup(),
                    ),
                  ),
                  const SizedBox(width: 8),
                  const _HeaderLangChip(),
                  const SizedBox(width: 6),
                  if (auth.isLoggedIn)
                    _UserPill(name: auth.user?.name ?? '')
                  else
                    _JoinFreePill(
                      label: context.tr('layout.login'),
                      onTap: () => router.push('/login'),
                    ),
                  const SizedBox(width: 6),
                  _SquareIconButton(
                    icon: Icons.menu,
                    tooltip: context.tr('tab.menu'),
                    onTap: onMenu,
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _HeaderLangChip extends StatelessWidget {
  const _HeaderLangChip();

  @override
  Widget build(BuildContext context) {
    final lang = context.watch<LanguageProvider>();
    final active = appLanguages.firstWhere(
      (l) => l.code == lang.languageCode,
      orElse: () => appLanguages.first,
    );

    return PopupMenuButton<String>(
      tooltip: 'Change Language / ቋንቋ ቀይር',
      position: PopupMenuPosition.under,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: const BorderSide(color: Tw.copper200),
      ),
      color: Colors.white,
      onSelected: (code) => lang.setLanguage(code),
      itemBuilder: (_) => [
        for (final l in appLanguages)
          PopupMenuItem<String>(
            value: l.code,
            child: Row(
              children: [
                Text(l.flag, style: const TextStyle(fontSize: 16)),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    l.label,
                    style: TwText.sans(
                      13,
                      weight: l.code == lang.languageCode
                          ? FontWeight.w700
                          : FontWeight.w500,
                      color: l.code == lang.languageCode
                          ? Tw.copper700
                          : Tw.slate700,
                    ),
                  ),
                ),
                if (l.code == lang.languageCode)
                  const Icon(Icons.check, size: 16, color: Tw.copper700),
              ],
            ),
          ),
      ],
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
        decoration: BoxDecoration(
          color: Tw.copper50.withValues(alpha: 0.9),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: Tw.copper200),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(active.flag, style: const TextStyle(fontSize: 14)),
            const SizedBox(width: 4),
            Text(
              active.label.length > 5 ? active.label.substring(0, 3) : active.label,
              style: TwText.sans(11.5, weight: FontWeight.w700, color: Tw.copper800),
            ),
            const Icon(Icons.arrow_drop_down, size: 14, color: Tw.copper800),
          ],
        ),
      ),
    );
  }
}

class _JoinFreePill extends StatelessWidget {
  final String? label;
  final VoidCallback onTap;
  const _JoinFreePill({this.label, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(999),
        child: Ink(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
          decoration: BoxDecoration(
            gradient: Tw.brandDeepGradient,
            borderRadius: BorderRadius.circular(999),
            boxShadow: [
              BoxShadow(
                  color: Colors.black.withValues(alpha: 0.12),
                  blurRadius: 6,
                  offset: const Offset(0, 3))
            ],
          ),
          child: Text(label ?? context.tr('layout.join_free'),
              style: TwText.sans(12,
                  weight: FontWeight.w600, color: Colors.white)),
        ),
      ),
    );
  }
}

class _SquareIconButton extends StatelessWidget {
  final IconData icon;
  final VoidCallback onTap;
  final String tooltip;
  const _SquareIconButton(
      {required this.icon, required this.onTap, required this.tooltip});

  @override
  Widget build(BuildContext context) {
    return Tooltip(
      message: tooltip,
      child: Material(
        color: Tw.copper50.withValues(alpha: 0.6),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: const BorderSide(color: Tw.copper200),
        ),
        child: InkWell(
          onTap: onTap,
          customBorder:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          child: SizedBox(
              width: 44,
              height: 44,
              child: Icon(icon, size: 22, color: Tw.slate700)),
        ),
      ),
    );
  }
}

class _UserPill extends StatelessWidget {
  final String name;
  const _UserPill({required this.name});

  @override
  Widget build(BuildContext context) {
    final first =
        name.trim().isEmpty ? '' : name.trim().split(RegExp(r'\s+')).first;
    final initial = first.isEmpty
        ? '?'
        : String.fromCharCode(first.runes.first).toUpperCase();
    final router = GoRouter.of(context);

    return PopupMenuButton<String>(
      tooltip: name,
      position: PopupMenuPosition.under,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
      color: Colors.white,
      onSelected: (v) async {
        if (v == 'logout') {
          await context.read<AuthProvider>().logout();
          router.go('/home');
        } else {
          router.go(v);
        }
      },
      itemBuilder: (_) => [
        PopupMenuItem(
          enabled: false,
          child: Text(name, style: TwText.sans(14, weight: FontWeight.w600)),
        ),
        PopupMenuItem(
            value: '/dashboard', child: Text(context.tr('nav.dashboard'))),
        PopupMenuItem(
            value: '/profile',
            child: Text(context.tr('layout.change_profile'))),
        PopupMenuItem(
          value: 'logout',
          child: Text(context.tr('nav.logout'),
              style:
                  TwText.sans(14, color: Tw.rose600, weight: FontWeight.w500)),
        ),
      ],
      child: Container(
        padding: const EdgeInsets.fromLTRB(6, 6, 8, 6),
        decoration: BoxDecoration(
          color: Tw.copper50.withValues(alpha: 0.8),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: Tw.copper200),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 28,
              height: 28,
              alignment: Alignment.center,
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [Tw.copper700, Tw.copper900]),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(initial,
                  style: TwText.sans(12,
                      weight: FontWeight.w700, color: Colors.white)),
            ),
            const SizedBox(width: 6),
            ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 80),
              child: Text(first,
                  overflow: TextOverflow.ellipsis,
                  style: TwText.sans(12,
                      weight: FontWeight.w500, color: Tw.slate700)),
            ),
            const Icon(Icons.expand_more, size: 16, color: Tw.slate600),
          ],
        ),
      ),
    );
  }
}

// ── Bottom tab bar ────────────────────────────────────────────────────────────

class SiteTabBar extends StatelessWidget {
  final String currentRoute;
  final bool menuActive;
  final VoidCallback onMenu;

  const SiteTabBar({
    super.key,
    required this.currentRoute,
    required this.menuActive,
    required this.onMenu,
  });

  @override
  Widget build(BuildContext context) {
    final router = GoRouter.of(context);
    final onMenuPage = currentRoute.startsWith('/about');

    Widget tab({
      required String label,
      required IconData outline,
      required IconData filled,
      required bool active,
      String? badge,
      required VoidCallback onTap,
    }) {
      return Expanded(
        child: Semantics(
          selected: active,
          button: true,
          child: Material(
            color: Colors.transparent,
            child: InkWell(
              onTap: onTap,
              borderRadius: BorderRadius.circular(16),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                padding: const EdgeInsets.symmetric(vertical: 4),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Stack(
                      clipBehavior: Clip.none,
                      alignment: Alignment.center,
                      children: [
                        AnimatedContainer(
                          duration: const Duration(milliseconds: 200),
                          padding: EdgeInsets.symmetric(
                            horizontal: active ? 16 : 8,
                            vertical: active ? 4 : 2,
                          ),
                          decoration: BoxDecoration(
                            gradient: active ? Tw.brandDeepGradient : null,
                            borderRadius: BorderRadius.circular(999),
                            boxShadow: active
                                ? [
                                    BoxShadow(
                                      color:
                                          Tw.copper700.withValues(alpha: 0.35),
                                      blurRadius: 8,
                                      offset: const Offset(0, 3),
                                    ),
                                  ]
                                : null,
                          ),
                          child: Icon(
                            active ? filled : outline,
                            size: 20,
                            color: active ? Colors.white : Tw.slate600,
                          ),
                        ),
                        if (badge != null && !active)
                          Positioned(
                            top: -2,
                            right: -4,
                            child: Container(
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 5, vertical: 1),
                              decoration: BoxDecoration(
                                color: badge == 'LIVE'
                                    ? Tw.emerald600
                                    : Tw.amber700,
                                borderRadius: BorderRadius.circular(999),
                              ),
                              child: Text(
                                badge,
                                style: TwText.eyebrow(7.5, Colors.white,
                                    trackingEm: 0.05),
                              ),
                            ),
                          ),
                      ],
                    ),
                    const SizedBox(height: 3),
                    Text(
                      label,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: TwText.sans(
                        10.5,
                        weight: active ? FontWeight.w800 : FontWeight.w500,
                        color: active ? Tw.copper800 : Tw.slate600,
                        height: 1.1,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      );
    }

    return Material(
      color: Colors.white.withValues(alpha: 0.98),
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          border: const Border(top: BorderSide(color: Tw.copper100)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.07),
              blurRadius: 24,
              offset: const Offset(0, -6),
            ),
          ],
        ),
        child: SafeArea(
          top: false,
          child: SizedBox(
            height: 64,
            child: Row(
              children: [
                tab(
                  label: context.tr('nav.home'),
                  outline: Icons.home_outlined,
                  filled: Icons.home_rounded,
                  active: currentRoute == '/home',
                  onTap: () => router.go('/home'),
                ),
                tab(
                  label: context.tr('nav.courses'),
                  outline: Icons.menu_book_outlined,
                  filled: Icons.menu_book_rounded,
                  active: currentRoute.startsWith('/courses'),
                  onTap: () => router.go('/courses'),
                ),
                tab(
                  label: context.tr('nav.seminars'),
                  outline: Icons.calendar_month_outlined,
                  filled: Icons.calendar_month_rounded,
                  active: currentRoute.startsWith('/seminars'),
                  badge: 'LIVE',
                  onTap: () => router.go('/seminars'),
                ),
                tab(
                  label: context.tr('nav.reels'),
                  outline: Icons.videocam_outlined,
                  filled: Icons.videocam_rounded,
                  active: currentRoute.startsWith('/reels'),
                  badge: 'NEW',
                  onTap: () => router.go('/reels'),
                ),
                tab(
                  label: context.tr('tab.menu'),
                  outline: Icons.menu_rounded,
                  filled: Icons.menu_rounded,
                  active: menuActive || onMenuPage,
                  onTap: onMenu,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

// ── Drawer ────────────────────────────────────────────────────────────────────

class SiteDrawer extends StatelessWidget {
  final String currentRoute;
  const SiteDrawer({super.key, required this.currentRoute});

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final router = GoRouter.of(context);
    final width = MediaQuery.of(context).size.width;

    void go(String route, {bool push = false}) {
      Navigator.of(context).pop();
      if (push) {
        router.push(route);
      } else if (route != currentRoute) {
        router.go(route);
      }
    }

    return Drawer(
      width: width > 384 ? 384 : width,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(),
      child: SafeArea(
        child: Column(
          children: [
            // Header: logo + close
            Container(
              padding: const EdgeInsets.all(20),
              decoration: const BoxDecoration(
                gradient: LinearGradient(colors: [Tw.copper50, Colors.white]),
                border: Border(bottom: BorderSide(color: Tw.copper100)),
              ),
              child: Row(
                children: [
                  InkWell(onTap: () => go('/home'), child: const BrandLockup()),
                  const Spacer(),
                  Material(
                    color: Tw.slate100,
                    borderRadius: BorderRadius.circular(12),
                    child: InkWell(
                      borderRadius: BorderRadius.circular(12),
                      onTap: () => Navigator.of(context).pop(),
                      child: const SizedBox(
                        width: 40,
                        height: 40,
                        child: Icon(Icons.close, size: 20, color: Tw.slate500),
                      ),
                    ),
                  ),
                ],
              ),
            ),

            Expanded(
              child: ListView(
                padding: const EdgeInsets.all(16),
                children: [
                  const _LanguageBox(),
                  const SizedBox(height: 16),
                  Padding(
                    padding: const EdgeInsets.only(left: 12, bottom: 8),
                    child: Text(context.tr('layout.public_menus').toUpperCase(),
                        style:
                            TwText.eyebrow(11, Tw.slate400, trackingEm: 0.05)),
                  ),
                  for (final item in websiteNavItems)
                    _MenuTile(
                      item: item,
                      active: currentRoute == item.route,
                      onTap: () => go(item.route),
                    ),
                  const SizedBox(height: 16),
                  const _PaymentNotice(),
                ],
              ),
            ),

            // Bottom actions
            Container(
              padding: const EdgeInsets.all(16),
              decoration: const BoxDecoration(
                color: Tw.slate50,
                border: Border(top: BorderSide(color: Tw.copper100)),
              ),
              child: auth.isLoggedIn
                  ? Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        PrimaryButton(
                          label: context.tr('layout.go_dashboard'),
                          fontSize: 14,
                          onPressed: () => go('/dashboard'),
                        ),
                        const SizedBox(height: 6),
                        TextButton(
                          onPressed: () async {
                            Navigator.of(context).pop();
                            await context.read<AuthProvider>().logout();
                            router.go('/home');
                          },
                          child: Text(context.tr('nav.logout'),
                              style: TwText.sans(14,
                                  weight: FontWeight.w600, color: Tw.rose600)),
                        ),
                      ],
                    )
                  : Row(
                      children: [
                        Expanded(
                          child: SecondaryButton(
                            label: context.tr('layout.login'),
                            fontSize: 14,
                            onPressed: () => go('/login', push: true),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: PrimaryButton(
                            label: context.tr('layout.join_free'),
                            fontSize: 14,
                            padding: const EdgeInsets.symmetric(
                                horizontal: 12, vertical: 14),
                            onPressed: () => go('/register', push: true),
                          ),
                        ),
                      ],
                    ),
            ),
          ],
        ),
      ),
    );
  }
}

class _LanguageBox extends StatelessWidget {
  const _LanguageBox();

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<LanguageProvider>();

    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Tw.copper50.withValues(alpha: 0.7),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Tw.copper200.withValues(alpha: 0.8)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.only(left: 4, bottom: 8),
            child: Row(
              children: [
                Expanded(
                  child: Text(
                      '🌐 ${context.tr('lang.label').toUpperCase()} / ቋንቋ',
                      style:
                          TwText.eyebrow(11, Tw.copper800, trackingEm: 0.05)),
                ),
                Text('Tigrigna • Amharic • English',
                    style: TwText.sans(10, color: Tw.slate400)),
              ],
            ),
          ),
          Row(
            children: [
              for (final lang in appLanguages) ...[
                Expanded(
                  child: _LangButton(
                    lang: lang,
                    active: provider.languageCode == lang.code,
                    onTap: () => provider.setLanguage(lang.code),
                  ),
                ),
                if (lang != appLanguages.last) const SizedBox(width: 6),
              ],
            ],
          ),
        ],
      ),
    );
  }
}

class _LangButton extends StatelessWidget {
  final AppLanguage lang;
  final bool active;
  final VoidCallback onTap;
  const _LangButton(
      {required this.lang, required this.active, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Semantics(
      selected: active,
      button: true,
      label: lang.hint,
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(12),
          child: Ink(
            height: 44,
            decoration: BoxDecoration(
              gradient: active ? Tw.brandDeepGradient : null,
              color: active ? null : Colors.white,
              borderRadius: BorderRadius.circular(12),
              border: active ? null : Border.all(color: Tw.slate200),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(lang.flag, style: const TextStyle(fontSize: 13)),
                const SizedBox(width: 4),
                Flexible(
                  child: Text(
                    lang.label,
                    overflow: TextOverflow.ellipsis,
                    style: TwText.sans(12,
                        weight: FontWeight.w700,
                        color: active ? Colors.white : Tw.slate700),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _MenuTile extends StatelessWidget {
  final NavItem item;
  final bool active;
  final VoidCallback onTap;
  const _MenuTile(
      {required this.item, required this.active, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(16),
          child: Ink(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              gradient: active ? Tw.brandDeepGradient : null,
              color: active ? null : Colors.white.withValues(alpha: 0.7),
              borderRadius: BorderRadius.circular(16),
              border: active ? null : Border.all(color: Tw.slate100),
              boxShadow: active
                  ? [
                      BoxShadow(
                          color: Colors.black.withValues(alpha: 0.12),
                          blurRadius: 8,
                          offset: const Offset(0, 4))
                    ]
                  : null,
            ),
            child: Row(
              children: [
                Container(
                  width: 34,
                  height: 34,
                  decoration: BoxDecoration(
                    color: active
                        ? Colors.white.withValues(alpha: 0.2)
                        : Tw.copper50,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(item.icon,
                      size: 18, color: active ? Colors.white : Tw.copper700),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(context.tr(item.labelKey),
                      style: TwText.sans(14,
                          weight: FontWeight.w600,
                          color: active ? Colors.white : Tw.slate700)),
                ),
                if (item.badgeKey != null)
                  Container(
                    padding:
                        const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                    decoration: BoxDecoration(
                      color: active
                          ? Colors.white.withValues(alpha: 0.25)
                          : Tw.emerald500.withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(999),
                      border: active
                          ? null
                          : Border.all(
                              color: Tw.emerald500.withValues(alpha: 0.3)),
                    ),
                    child: Text(context.tr(item.badgeKey!).toUpperCase(),
                        style: TwText.eyebrow(
                            10, active ? Colors.white : Tw.emerald700,
                            trackingEm: 0.08)),
                  )
                else
                  Icon(Icons.chevron_right,
                      size: 18, color: active ? Colors.white70 : Tw.slate400),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _PaymentNotice extends StatelessWidget {
  const _PaymentNotice();

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<PaymentInfo>(
      future: ApiService().getPaymentInfo(),
      builder: (context, snap) {
        final info = snap.data;
        return Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: Tw.copper50.withValues(alpha: 0.6),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: Tw.copper200.withValues(alpha: 0.8)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('🔒 ${context.tr('layout.direct_payment')}',
                  style: TwText.sans(12,
                      weight: FontWeight.w600, color: Tw.copper900)),
              if (info != null) ...[
                const SizedBox(height: 4),
                Text.rich(
                  TextSpan(
                    style: TwText.sans(11, color: Tw.slate600),
                    children: [
                      TextSpan(text: '${info.bankName.split(' ').first}: '),
                      TextSpan(
                          text: info.bankNumber,
                          style: const TextStyle(fontWeight: FontWeight.w700)),
                      const TextSpan(text: '  |  Telebirr: '),
                      TextSpan(
                          text: info.telebirrPhone,
                          style: const TextStyle(fontWeight: FontWeight.w700)),
                    ],
                  ),
                ),
              ],
            ],
          ),
        );
      },
    );
  }
}
