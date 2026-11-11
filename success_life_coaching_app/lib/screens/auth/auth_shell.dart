import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:success_life_coaching_app/config/constants.dart';
import 'package:success_life_coaching_app/theme/tw.dart';
import 'package:success_life_coaching_app/widgets/app_menu.dart';
import 'package:success_life_coaching_app/widgets/ui.dart';

/// Mirrors resources/js/Layouts/GuestLayout.jsx on mobile: dark green hero
/// background, floating glass nav bar, and a white rounded card.
class AuthShell extends StatefulWidget {
  final String currentRoute; // '/login' or '/register'
  final Widget child;

  const AuthShell({super.key, required this.currentRoute, required this.child});

  @override
  State<AuthShell> createState() => _AuthShellState();
}

class _AuthShellState extends State<AuthShell> {
  final _key = GlobalKey<ScaffoldState>();

  @override
  Widget build(BuildContext context) {
    final onLogin = widget.currentRoute == '/login';
    final router = GoRouter.of(context);

    void leave() {
      if (router.canPop()) {
        router.pop();
      } else {
        router.go('/home');
      }
    }

    return Scaffold(
      key: _key,
      backgroundColor: Tw.heroB,
      endDrawer: SiteDrawer(currentRoute: widget.currentRoute),
      body: HeroBox(
        radius: 0,
        border: false,
        padding: EdgeInsets.zero,
        child: SafeArea(
          child: SizedBox.expand(
            child: SingleChildScrollView(
              padding: const EdgeInsets.fromLTRB(12, 12, 12, 24),
              child: Column(
                children: [
                  // Floating glass nav
                  Container(
                    height: 64,
                    padding: const EdgeInsets.symmetric(horizontal: 12),
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: Colors.white.withValues(alpha: 0.15)),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.6),
                          blurRadius: 40,
                          offset: const Offset(0, 10),
                          spreadRadius: -15,
                        ),
                      ],
                    ),
                    child: Row(
                      children: [
                        InkWell(
                          onTap: () => router.go('/home'),
                          borderRadius: BorderRadius.circular(12),
                          child: Container(
                            width: 40,
                            height: 40,
                            padding: const EdgeInsets.all(4),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: Tw.gold2.withValues(alpha: 0.5)),
                            ),
                            child: Image.asset(AppConstants.logoAsset, fit: BoxFit.contain),
                          ),
                        ),
                        const Spacer(),
                        if (onLogin)
                          GoldPillButton(
                            label: 'Join Free',
                            expand: false,
                            fontSize: 12,
                            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 9),
                            onPressed: () => router.pushReplacement('/register'),
                          )
                        else
                          OutlinedButton(
                            onPressed: () => router.pushReplacement('/login'),
                            style: OutlinedButton.styleFrom(
                              foregroundColor: Tw.goldLight,
                              backgroundColor: Tw.gold2.withValues(alpha: 0.15),
                              side: BorderSide(color: Tw.gold2.withValues(alpha: 0.6)),
                              shape: const StadiumBorder(),
                              minimumSize: const Size(0, 36),
                              textStyle: TwText.sans(12, weight: FontWeight.w800),
                            ),
                            child: const Text('Login'),
                          ),
                        const SizedBox(width: 8),
                        Material(
                          color: Colors.white.withValues(alpha: 0.1),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                            side: BorderSide(color: Colors.white.withValues(alpha: 0.2)),
                          ),
                          child: InkWell(
                            customBorder: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                            onTap: () => _key.currentState?.openEndDrawer(),
                            child: const SizedBox(
                              width: 44,
                              height: 44,
                              child: Icon(Icons.menu, color: Colors.white, size: 22),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),
                  // White card
                  Container(
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(28),
                      border: Border.all(color: Colors.white.withValues(alpha: 0.15)),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.8),
                          blurRadius: 100,
                          offset: const Offset(0, 40),
                          spreadRadius: -30,
                        ),
                      ],
                    ),
                    clipBehavior: Clip.antiAlias,
                    child: Column(
                      children: [
                        Padding(padding: const EdgeInsets.fromLTRB(20, 28, 20, 28), child: widget.child),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
                          decoration: BoxDecoration(
                            border: Border(top: BorderSide(color: Tw.copper100.withValues(alpha: 0.8))),
                          ),
                          child: Row(
                            children: [
                              Expanded(
                                child: Text('© ${DateTime.now().year} Success Life Coaching Academy',
                                    style: TwText.sans(12, color: Tw.slate500)),
                              ),
                              InkWell(
                                onTap: leave,
                                child: Padding(
                                  padding: const EdgeInsets.symmetric(vertical: 6),
                                  child: Text('← Back to homepage',
                                      style: TwText.sans(12, weight: FontWeight.w600, color: Tw.copper700)),
                                ),
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
          ),
        ),
      ),
    );
  }
}

/// Eyebrow + Merriweather headline + subtitle used at the top of auth cards.
class AuthHeading extends StatelessWidget {
  final String eyebrow;
  final String title;
  final String subtitle;
  const AuthHeading({super.key, required this.eyebrow, required this.title, required this.subtitle});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(eyebrow.toUpperCase(), style: TwText.eyebrow(12, Tw.copper600, trackingEm: 0.35).copyWith(fontWeight: FontWeight.w600)),
        const SizedBox(height: 8),
        Text(title, style: TwText.display(28, height: 1.25)),
        const SizedBox(height: 10),
        Text(subtitle, style: TwText.sans(14, color: Tw.slate600, height: 1.6)),
      ],
    );
  }
}

/// Uppercase gradient submit (from-copper-700 via-accent to-bronze).
class AuthSubmitButton extends StatelessWidget {
  final String label;
  final bool loading;
  final VoidCallback? onPressed;
  const AuthSubmitButton({super.key, required this.label, required this.loading, required this.onPressed});

  @override
  Widget build(BuildContext context) {
    final radius = BorderRadius.circular(16);
    return Opacity(
      opacity: onPressed == null && !loading ? 0.5 : 1,
      child: DecoratedBox(
        decoration: BoxDecoration(
          gradient: Tw.authButtonGradient,
          borderRadius: radius,
          boxShadow: [
            BoxShadow(
              color: Tw.copper700.withValues(alpha: 0.18),
              blurRadius: 40,
              offset: const Offset(0, 10),
              spreadRadius: -12,
            ),
          ],
        ),
        child: Material(
          color: Colors.transparent,
          borderRadius: radius,
          clipBehavior: Clip.antiAlias,
          child: InkWell(
            onTap: loading ? null : onPressed,
            child: SizedBox(
              width: double.infinity,
              height: 58,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  if (loading) ...[
                    const SizedBox(
                      width: 18,
                      height: 18,
                      child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                    ),
                    const SizedBox(width: 12),
                  ],
                  Text(label.toUpperCase(),
                      style: TwText.sans(16, weight: FontWeight.w700, color: Colors.white, letterSpacing: 2.9)),
                  if (!loading) ...[
                    const SizedBox(width: 10),
                    const Icon(Icons.arrow_forward, color: Colors.white, size: 20),
                  ],
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
