import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:success_life_coaching_app/config/constants.dart';
import 'package:success_life_coaching_app/l10n/strings.dart';
import 'package:success_life_coaching_app/providers/language_provider.dart';
import 'package:success_life_coaching_app/theme/tw.dart';
import 'package:success_life_coaching_app/widgets/ui.dart';

/// Shown while the saved session is checked. The router (main.dart) moves on
/// to Home automatically once AuthProvider is initialized.
class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with SingleTickerProviderStateMixin {
  late final AnimationController _glowCtrl;
  late final Animation<double> _glowAnim;

  @override
  void initState() {
    super.initState();
    _glowCtrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2200),
    )..repeat(reverse: true);
    _glowAnim = CurvedAnimation(parent: _glowCtrl, curve: Curves.easeInOut);
  }

  @override
  void dispose() {
    _glowCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final lang = context.watch<LanguageProvider>().languageCode;

    return Scaffold(
      backgroundColor: Tw.heroB,
      body: HeroBox(
        radius: 0,
        border: false,
        padding: EdgeInsets.zero,
        child: SizedBox.expand(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // Animated glow ring + logo
              AnimatedBuilder(
                animation: _glowAnim,
                builder: (_, child) => Container(
                  width: 148,
                  height: 148,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    boxShadow: [
                      BoxShadow(
                        color: Tw.gold2
                            .withValues(alpha: 0.18 + 0.22 * _glowAnim.value),
                        blurRadius: 40 + 30 * _glowAnim.value,
                        spreadRadius: 4 + 12 * _glowAnim.value,
                      ),
                    ],
                  ),
                  child: child,
                ),
                child: Container(
                  margin: const EdgeInsets.all(14),
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(28),
                    border: Border.all(color: Tw.gold2.withValues(alpha: 0.5)),
                    boxShadow: [
                      BoxShadow(
                        color: Tw.gold.withValues(alpha: 0.5),
                        blurRadius: 32,
                        offset: const Offset(0, 12),
                        spreadRadius: -8,
                      ),
                    ],
                  ),
                  child: Image.asset(AppConstants.logoAsset, fit: BoxFit.contain),
                ),
              ),
              const SizedBox(height: 32),
              // Brand name
              RichText(
                text: TextSpan(
                  style: TwText.display(32, color: Colors.white),
                  children: const [
                    TextSpan(text: 'Success '),
                    TextSpan(
                        text: 'Life',
                        style: TextStyle(color: Tw.gold2)),
                  ],
                ),
              ),
              const SizedBox(height: 6),
              Text('COACHING ACADEMY',
                  style: TwText.eyebrow(11, Tw.cream, trackingEm: 0.3)),
              const SizedBox(height: 14),
              // Translated tagline
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.07),
                  borderRadius: BorderRadius.circular(999),
                  border: Border.all(color: Colors.white.withValues(alpha: 0.1)),
                ),
                child: Text(
                  translate('splash.tagline', lang),
                  style: TwText.sans(13,
                      color: Tw.emerald50.withValues(alpha: 0.75),
                      letterSpacing: 0.5),
                ),
              ),
              const SizedBox(height: 44),
              // Gold spinner
              const SizedBox(
                width: 26,
                height: 26,
                child: CircularProgressIndicator(
                    strokeWidth: 2.5, color: Tw.gold2),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
