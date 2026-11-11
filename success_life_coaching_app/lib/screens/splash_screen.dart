import 'package:flutter/material.dart';
import 'package:success_life_coaching_app/config/constants.dart';
import 'package:success_life_coaching_app/theme/tw.dart';
import 'package:success_life_coaching_app/widgets/ui.dart';

/// Shown while the saved session is checked. The router (main.dart) moves on
/// to Home automatically once AuthProvider is initialized.
class SplashScreen extends StatelessWidget {
  const SplashScreen({super.key});

  @override
  Widget build(BuildContext context) {
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
              Container(
                width: 112,
                height: 112,
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(28),
                  border: Border.all(color: Tw.gold2.withValues(alpha: 0.5)),
                  boxShadow: Tw.goldShadow,
                ),
                child: Image.asset(AppConstants.logoAsset, fit: BoxFit.contain),
              ),
              const SizedBox(height: 28),
              RichText(
                text: TextSpan(
                  style: TwText.display(30, color: Colors.white),
                  children: const [
                    TextSpan(text: 'Success '),
                    TextSpan(text: 'Life', style: TextStyle(color: Tw.gold2)),
                  ],
                ),
              ),
              const SizedBox(height: 6),
              Text('COACHING ACADEMY',
                  style: TwText.eyebrow(11, Tw.cream, trackingEm: 0.3)),
              const SizedBox(height: 12),
              Text(
                'Transforming Minds • Building Futures',
                style: TwText.sans(12.5,
                    color: Tw.emerald50.withValues(alpha: 0.7),
                    letterSpacing: 0.5),
              ),
              const SizedBox(height: 36),
              const SizedBox(
                width: 24,
                height: 24,
                child:
                    CircularProgressIndicator(strokeWidth: 2.2, color: Tw.gold2),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
