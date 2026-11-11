import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:success_life_coaching_app/models/content_models.dart';
import 'package:success_life_coaching_app/services/api_service.dart';
import 'package:success_life_coaching_app/theme/tw.dart';
import 'package:success_life_coaching_app/widgets/app_menu.dart';
import 'package:success_life_coaching_app/widgets/async_content.dart';
import 'package:success_life_coaching_app/widgets/brand.dart';
import 'package:success_life_coaching_app/widgets/ui.dart';

/// Website "About" page (admin-managed content from GET /api/content/about).
class AboutScreen extends StatelessWidget {
  const AboutScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return SiteScaffold(
      currentRoute: '/about',
      body: AsyncContent<AboutContent>(
        load: () => ApiService().getAbout(),
        builder: (context, about) {
          final page = about.page;
          return ListView(
            padding: const EdgeInsets.fromLTRB(16, 24, 16, 32),
            children: [
              EmeraldChip(page.eyebrow ?? 'Our story'),
              const SizedBox(height: 14),
              Text(page.headline ?? 'About Success Life Coaching Academy',
                  style: TwText.display(30, height: 1.25)),
              if (page.intro != null) ...[
                const SizedBox(height: 12),
                Text(page.intro!,
                    style: TwText.sans(16, color: Tw.slate600, height: 1.7)),
              ],
              if (page.heroImage != null) ...[
                const SizedBox(height: 24),
                Container(
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(28),
                    boxShadow: Tw.homeCardShadow,
                  ),
                  child: BrandImage(
                    url: page.heroImage,
                    height: 220,
                    borderRadius: BorderRadius.circular(28),
                  ),
                ),
              ],
              if (page.bannerTitle != null || page.bannerBody != null) ...[
                const SizedBox(height: 24),
                HeroBox(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      if (page.bannerTitle != null)
                        Text(page.bannerTitle!,
                            style: TwText.display(22,
                                color: Colors.white, height: 1.3)),
                      if (page.bannerBody != null) ...[
                        const SizedBox(height: 10),
                        Text(page.bannerBody!,
                            style: TwText.sans(15,
                                color: Tw.emerald50.withValues(alpha: 0.8),
                                height: 1.7)),
                      ],
                    ],
                  ),
                ),
              ],
              if (about.highlights.isNotEmpty) ...[
                const SizedBox(height: 40),
                SectionHeader(
                  eyebrow: 'The academy advantage',
                  title: page.sectionTitle ?? 'Why learners choose our academy',
                ),
                const SizedBox(height: 20),
                for (final h in about.highlights) ...[
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
                          padding: const EdgeInsets.all(22),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Container(
                                width: 44,
                                height: 44,
                                decoration: BoxDecoration(
                                    color: Tw.heroA,
                                    borderRadius: BorderRadius.circular(14)),
                                child: const Icon(Icons.check_rounded,
                                    color: Tw.gold2),
                              ),
                              const SizedBox(height: 14),
                              Text(h.title,
                                  style: TwText.display(20, height: 1.3)),
                              const SizedBox(height: 6),
                              Text(h.body,
                                  style: TwText.sans(14,
                                      color: Tw.slate600, height: 1.6)),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),
                ],
              ],
              const SizedBox(height: 16),
              PrimaryButton(
                  label: 'Browse All Courses',
                  onPressed: () => context.go('/courses')),
            ],
          );
        },
      ),
    );
  }
}
