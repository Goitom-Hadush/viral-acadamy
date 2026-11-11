import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:success_life_coaching_app/config/api_config.dart';
import 'package:success_life_coaching_app/config/constants.dart';

/// The Success Life Coaching logo in a white rounded tile,
/// matching the logo badge used across the website.
class AppLogo extends StatelessWidget {
  final double size;
  final double radius;
  final bool shadow;

  const AppLogo(
      {super.key, this.size = 88, this.radius = 22, this.shadow = true});

  @override
  Widget build(BuildContext context) {
    return Semantics(
      label: 'Success Life Coaching Academy logo',
      image: true,
      child: Container(
        width: size,
        height: size,
        padding: EdgeInsets.all(size * 0.12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(radius),
          border: Border.all(color: const Color(0xFFC3DEC5)),
          boxShadow: shadow
              ? [
                  BoxShadow(
                    color: AppConstants.primaryColor.withValues(alpha: 0.18),
                    blurRadius: 24,
                    offset: const Offset(0, 10),
                  ),
                ]
              : null,
        ),
        child: Image.asset(AppConstants.logoAsset, fit: BoxFit.contain),
      ),
    );
  }
}

/// Network image with the logo as placeholder/fallback
/// (same behaviour as the website's CourseThumbnail component).
class BrandImage extends StatelessWidget {
  final String? url;
  final double? height;
  final BorderRadius? borderRadius;

  const BrandImage({super.key, this.url, this.height, this.borderRadius});

  @override
  Widget build(BuildContext context) {
    final fallback = Container(
      height: height,
      width: double.infinity,
      color: AppConstants.primaryLight,
      alignment: Alignment.center,
      child: FractionallySizedBox(
        heightFactor: 0.5,
        child: Opacity(
          opacity: 0.85,
          child: Image.asset(AppConstants.logoAsset, fit: BoxFit.contain),
        ),
      ),
    );

    final resolved = ApiConfig.mediaUrl(url);
    final child = resolved == null
        ? fallback
        : CachedNetworkImage(
            imageUrl: resolved,
            height: height,
            width: double.infinity,
            fit: BoxFit.cover,
            placeholder: (_, __) => fallback,
            errorWidget: (_, __, ___) => fallback,
          );

    return ClipRRect(
      borderRadius: borderRadius ?? BorderRadius.zero,
      child: SizedBox(height: height, width: double.infinity, child: child),
    );
  }
}
