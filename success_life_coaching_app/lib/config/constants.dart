import 'package:flutter/material.dart';

class AppConstants {
  // Brand colors - match the logo and the website (tailwind "copper" palette)
  static const Color primaryColor =
      Color(0xFF004101); // Deep logo green (copper-700)
  static const Color secondaryColor =
      Color(0xFF17621D); // Bronze green (copper-600)
  static const Color accentColor =
      Color(0xFF68A96C); // Fresh green (copper-400)
  static const Color primaryLight =
      Color(0xFFF1F8F1); // Tint for backgrounds (copper-50)

  static const String logoAsset = 'assets/images/logo.png';

  // Neutral colors
  static const Color errorColor = Color(0xFFDC2626); // Red
  static const Color successColor = Color(0xFF16A34A); // Green
  static const Color warningColor = Color(0xFFF59E0B); // Amber

  // Backgrounds
  static const Color backgroundColor = Color(0xFFFAFAFA);
  static const Color surfaceColor = Colors.white;

  // Text colors
  static const Color textPrimaryColor = Color(0xFF111827);
  static const Color textSecondaryColor = Color(0xFF6B7280);

  // Border colors
  static const Color borderColor = Color(0xFFE5E7EB);

  // Spacing
  static const double spacingXs = 4.0;
  static const double spacingSm = 8.0;
  static const double spacingMd = 16.0;
  static const double spacingLg = 24.0;
  static const double spacingXl = 32.0;

  // Border radius
  static const double radiusSm = 4.0;
  static const double radiusMd = 8.0;
  static const double radiusLg = 12.0;
  static const double radiusXl = 16.0;

  // Font sizes
  static const double fontSizeXs = 12.0;
  static const double fontSizeSm = 14.0;
  static const double fontSizeMd = 16.0;
  static const double fontSizeLg = 18.0;
  static const double fontSizeXl = 24.0;
  static const double fontSize2xl = 32.0;

  // Animation durations
  static const Duration animationDurationFast = Duration(milliseconds: 200);
  static const Duration animationDurationMd = Duration(milliseconds: 300);
  static const Duration animationDurationSlow = Duration(milliseconds: 500);

  // API
  static const int apiTimeoutSeconds = 30;
  static const int maxRetries = 3;

  // Pagination
  static const int itemsPerPage = 10;

  // Video
  static const int videoQualityDefault = 720;
  static const int videoQualityHD = 1080;
}
