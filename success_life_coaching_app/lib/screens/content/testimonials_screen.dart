import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:success_life_coaching_app/models/content_models.dart';
import 'package:success_life_coaching_app/screens/home/home_screen.dart';
import 'package:success_life_coaching_app/services/api_service.dart';
import 'package:success_life_coaching_app/theme/tw.dart';
import 'package:success_life_coaching_app/widgets/app_menu.dart';
import 'package:success_life_coaching_app/widgets/async_content.dart';
import 'package:success_life_coaching_app/widgets/ui.dart';

/// Mirrors resources/js/Pages/Testimonials.jsx.
class TestimonialsScreen extends StatelessWidget {
  const TestimonialsScreen({super.key});

  static const _avatarColors = [
    [Tw.emerald600, Tw.copper800],
    [Tw.copper700, Tw.accent],
    [Tw.bronze, Tw.copper700],
  ];

  @override
  Widget build(BuildContext context) {
    return SiteScaffold(
      currentRoute: '/testimonials',
      body: AsyncContent<TestimonialsContent>(
        load: () => ApiService().getTestimonials(),
        builder: (context, content) {
          final page = content.page;
          return ListView(
            padding: const EdgeInsets.fromLTRB(16, 24, 16, 32),
            children: [
              EmeraldChip(page.eyebrow ?? 'Student Breakthroughs'),
              const SizedBox(height: 14),
              Text(page.headline ?? 'What Our Learners & Leaders Say.',
                  style: TwText.display(30, height: 1.25)),
              const SizedBox(height: 12),
              Text(
                page.intro ??
                    'Real feedback from people who transformed their mindset, built consistent habits, and opened new income opportunities with Success Life Coaching.',
                style: TwText.sans(15, color: Tw.slate600, height: 1.7),
              ),
              const SizedBox(height: 28),
              if (content.testimonials.isNotEmpty)
                for (var i = 0; i < content.testimonials.length; i++) ...[
                  TestimonialCard(
                    quote: content.testimonials[i].quote,
                    name: content.testimonials[i].name,
                    subtitle:
                        content.testimonials[i].role ?? 'Verified Student',
                    initials: content.testimonials[i].initials,
                    avatarColors: _avatarColors[i % _avatarColors.length],
                  ),
                  const SizedBox(height: 16),
                ]
              else
                // Same fallback reviews the website shows.
                for (final t in defaultTestimonials) ...[
                  TestimonialCard(
                      name: t.$1,
                      subtitle: t.$2,
                      initials: t.$3,
                      avatarColors: t.$4,
                      quote: t.$5),
                  const SizedBox(height: 16),
                ],
              const SizedBox(height: 8),
              _GradientLinkButton(
                label: 'Browse All Coaching Masterclasses ➜',
                onTap: () => context.go('/courses'),
              ),
            ],
          );
        },
      ),
    );
  }
}

class _GradientLinkButton extends StatelessWidget {
  final String label;
  final VoidCallback onTap;
  const _GradientLinkButton({required this.label, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Ink(
          padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 16),
          decoration: BoxDecoration(
            gradient: Tw.brandDeepGradient,
            borderRadius: BorderRadius.circular(16),
            boxShadow: [
              BoxShadow(
                  color: Colors.black.withValues(alpha: 0.12),
                  blurRadius: 10,
                  offset: const Offset(0, 4))
            ],
          ),
          child: Center(
            child: Text(label,
                style: TwText.sans(14,
                    weight: FontWeight.w700, color: Colors.white)),
          ),
        ),
      ),
    );
  }
}
