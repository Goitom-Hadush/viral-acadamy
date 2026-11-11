import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:success_life_coaching_app/config/api_config.dart';
import 'package:success_life_coaching_app/config/constants.dart';
import 'package:success_life_coaching_app/models/course_model.dart';
import 'package:success_life_coaching_app/theme/tw.dart';
import 'package:success_life_coaching_app/widgets/ui.dart';

/// Course image like the website's CourseThumbnail: photo, or a green gradient
/// with the logo when there is no thumbnail / it fails to load.
class CourseImage extends StatelessWidget {
  final String? url;
  final double aspectRatio;
  final List<Widget> overlays;
  final BorderRadius borderRadius;

  const CourseImage({
    super.key,
    required this.url,
    this.aspectRatio = 16 / 9,
    this.overlays = const [],
    this.borderRadius = BorderRadius.zero,
  });

  @override
  Widget build(BuildContext context) {
    final resolved = ApiConfig.mediaUrl(url);
    final fallback = DecoratedBox(
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Tw.copper700, Tw.copper500, Tw.bronze],
        ),
      ),
      child: Center(
        child: Opacity(
          opacity: 0.7,
          child: Container(
            width: 64,
            height: 64,
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(16)),
            child: Image.asset(AppConstants.logoAsset, fit: BoxFit.contain),
          ),
        ),
      ),
    );

    return ClipRRect(
      borderRadius: borderRadius,
      child: AspectRatio(
        aspectRatio: aspectRatio,
        child: Stack(
          fit: StackFit.expand,
          children: [
            if (resolved == null)
              fallback
            else
              CachedNetworkImage(
                imageUrl: resolved,
                fit: BoxFit.cover,
                fadeInDuration: const Duration(milliseconds: 200),
                placeholder: (_, __) => const ShimmerBox(
                    width: double.infinity, height: double.infinity, radius: 0),
                errorWidget: (_, __, ___) => fallback,
              ),
            ...overlays,
          ],
        ),
      ),
    );
  }
}

/// Bottom-to-top dark overlay used on course images.
Widget darkOverlay({double strength = 0.85}) => DecoratedBox(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.bottomCenter,
          end: Alignment.topCenter,
          colors: [
            Tw.slate950.withValues(alpha: strength),
            Tw.slate900.withValues(alpha: 0.3),
            Colors.transparent,
          ],
          stops: const [0, 0.5, 1],
        ),
      ),
    );

/// Home page "Featured coaching programs" card (Welcome.jsx).
class HomeCourseCard extends StatelessWidget {
  final Course course;
  final VoidCallback onTap;
  const HomeCourseCard({super.key, required this.course, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return HomeCard(
      padding: EdgeInsets.zero,
      onTap: onTap,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          CourseImage(
            url: course.thumbnail,
            aspectRatio: 16 / 9.5,
            overlays: [
              darkOverlay(strength: 0.8),
              Positioned(
                right: 14,
                top: 14,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                  decoration: BoxDecoration(
                    gradient: course.isFree
                        ? const LinearGradient(colors: [Tw.emerald500, Tw.emerald700])
                        : Tw.goldGradient,
                    borderRadius: BorderRadius.circular(999),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.25),
                        blurRadius: 10,
                        offset: const Offset(0, 3),
                      ),
                    ],
                  ),
                  child: Text(
                    course.isFree ? 'FREE' : etb(course.price, thousands: true),
                    style: TwText.sans(
                      12,
                      weight: FontWeight.w800,
                      color: course.isFree ? Colors.white : Tw.priceInk,
                    ),
                  ),
                ),
              ),
              if (course.category != null)
                Positioned(
                  left: 14,
                  top: 14,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.92),
                      borderRadius: BorderRadius.circular(999),
                    ),
                    child: Text(
                      course.category!,
                      style: TwText.sans(11,
                          weight: FontWeight.w700, color: Tw.copper800),
                    ),
                  ),
                ),
              Positioned(
                left: 16,
                right: 16,
                bottom: 12,
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: Colors.black.withValues(alpha: 0.5),
                        borderRadius: BorderRadius.circular(6),
                        border: Border.all(
                            color: Colors.white.withValues(alpha: 0.2)),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(Icons.star_rounded,
                              size: 14, color: Tw.goldLight),
                          const SizedBox(width: 4),
                          Text(
                            course.rating > 0
                                ? course.rating.toStringAsFixed(1)
                                : '4.9',
                            style: TwText.sans(11,
                                weight: FontWeight.w700, color: Colors.white),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: Colors.black.withValues(alpha: 0.5),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        '${course.lessonsCount} Lessons',
                        style: TwText.sans(11,
                            weight: FontWeight.w600, color: Colors.white70),
                      ),
                    ),
                    const Spacer(),
                    if (course.isPurchased)
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                        decoration: BoxDecoration(
                          color: Tw.emerald500,
                          borderRadius: BorderRadius.circular(999),
                        ),
                        child: Text('✓ ENROLLED',
                            style: TwText.eyebrow(9.5, Colors.white, trackingEm: 0.1)),
                      ),
                  ],
                ),
              ),
            ],
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(18, 16, 18, 18),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  course.title,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: TwText.sans(16.5, weight: FontWeight.w800, height: 1.3),
                ),
                if (course.description.isNotEmpty) ...[
                  const SizedBox(height: 6),
                  Text(
                    course.description,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: TwText.sans(12.5, color: Tw.slate600, height: 1.55),
                  ),
                ],
                const SizedBox(height: 14),
                const Divider(height: 1, color: Tw.copper100),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Container(
                      width: 28,
                      height: 28,
                      alignment: Alignment.center,
                      decoration: BoxDecoration(
                        color: Tw.copper50,
                        shape: BoxShape.circle,
                        border: Border.all(color: Tw.copper200),
                      ),
                      child: const Icon(Icons.person, size: 16, color: Tw.copper700),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        course.instructorName ?? 'Success Life Coach',
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: TwText.sans(12.5,
                            weight: FontWeight.w600, color: Tw.slate800),
                      ),
                    ),
                    Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(
                          'View Details',
                          style: TwText.sans(12,
                              weight: FontWeight.w700, color: Tw.copper700),
                        ),
                        const SizedBox(width: 4),
                        const Icon(Icons.arrow_forward_rounded,
                            size: 14, color: Tw.copper700),
                      ],
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
}

/// Courses page card (Courses/Index.jsx).
class CatalogCourseCard extends StatelessWidget {
  final Course course;
  final bool loggedIn;
  final VoidCallback onTap;

  const CatalogCourseCard(
      {super.key,
      required this.course,
      required this.loggedIn,
      required this.onTap});

  @override
  Widget build(BuildContext context) {
    final showPrice = course.isFree || loggedIn;

    return HomeCard(
      padding: EdgeInsets.zero,
      radius: 24,
      onTap: onTap,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          CourseImage(
            url: course.thumbnail,
            aspectRatio: 16 / 10,
            overlays: [
              darkOverlay(strength: 0.75),
              if (course.category != null)
                Positioned(
                  left: 16,
                  top: 16,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.95),
                      borderRadius: BorderRadius.circular(999),
                      boxShadow: Tw.sm,
                    ),
                    child: Text(course.category!,
                        style: TwText.sans(11.5,
                            weight: FontWeight.w700, color: Tw.copper800)),
                  ),
                ),
              if (showPrice)
                Positioned(
                  right: 16,
                  top: 16,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                    decoration: BoxDecoration(
                      gradient: course.isFree
                          ? const LinearGradient(colors: [Tw.emerald500, Tw.emerald700])
                          : Tw.goldGradient,
                      borderRadius: BorderRadius.circular(999),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.22),
                          blurRadius: 10,
                          offset: const Offset(0, 3),
                        ),
                      ],
                    ),
                    child: Text(
                      course.isFree ? 'FREE' : etb(course.price, thousands: true),
                      style: TwText.sans(
                        12,
                        weight: FontWeight.w900,
                        color: course.isFree ? Colors.white : Tw.copper900,
                      ),
                    ),
                  ),
                ),
              Positioned(
                left: 16,
                right: 16,
                bottom: 14,
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: Colors.black.withValues(alpha: 0.6),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(Icons.star_rounded,
                              size: 14, color: Tw.goldLight),
                          const SizedBox(width: 4),
                          Text(
                            course.rating > 0
                                ? course.rating.toStringAsFixed(1)
                                : '4.9',
                            style: TwText.sans(11,
                                weight: FontWeight.w700, color: Colors.white),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: Colors.black.withValues(alpha: 0.6),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        '${course.lessonsCount} lessons',
                        style: TwText.sans(11,
                            weight: FontWeight.w600, color: Colors.white70),
                      ),
                    ),
                    const Spacer(),
                    if (course.isPurchased)
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                        decoration: BoxDecoration(
                          gradient: const LinearGradient(
                              colors: [Tw.emerald500, Tw.emerald700]),
                          borderRadius: BorderRadius.circular(999),
                          boxShadow: Tw.sm,
                        ),
                        child: Text('✓ ENROLLED',
                            style: TwText.eyebrow(10, Colors.white, trackingEm: 0.1)),
                      ),
                  ],
                ),
              ),
            ],
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 18, 20, 18),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  course.title,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: TwText.sans(18, weight: FontWeight.w800, height: 1.3),
                ),
                if (course.description.isNotEmpty) ...[
                  const SizedBox(height: 8),
                  Text(
                    course.description,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: TwText.sans(12.5, color: Tw.slate600, height: 1.6),
                  ),
                ],
                const SizedBox(height: 16),
                const Divider(height: 1, color: Tw.copper100),
                const SizedBox(height: 14),
                Row(
                  children: [
                    Container(
                      width: 28,
                      height: 28,
                      alignment: Alignment.center,
                      decoration: BoxDecoration(
                        color: Tw.copper50,
                        shape: BoxShape.circle,
                        border: Border.all(color: Tw.copper200),
                      ),
                      child: const Icon(Icons.person, size: 16, color: Tw.copper700),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        course.instructorName ?? 'Success Life Coach',
                        overflow: TextOverflow.ellipsis,
                        style: TwText.sans(12.5,
                            weight: FontWeight.w600, color: Tw.slate800),
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                      decoration: BoxDecoration(
                        color: course.isPurchased
                            ? Tw.emerald50
                            : Tw.copper50,
                        borderRadius: BorderRadius.circular(999),
                        border: Border.all(
                          color: course.isPurchased
                              ? Tw.emerald200
                              : Tw.copper200,
                        ),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(
                            course.isPurchased
                                ? 'Resume Watching'
                                : (course.isFree ? 'Enroll Free' : 'Start Watching'),
                            style: TwText.sans(
                              12,
                              weight: FontWeight.w700,
                              color: course.isPurchased
                                  ? Tw.emerald700
                                  : Tw.copper700,
                            ),
                          ),
                          const SizedBox(width: 4),
                          Icon(
                            course.isPurchased
                                ? Icons.play_circle_outline
                                : Icons.arrow_forward_rounded,
                            size: 14,
                            color: course.isPurchased
                                ? Tw.emerald700
                                : Tw.copper700,
                          ),
                        ],
                      ),
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
}
