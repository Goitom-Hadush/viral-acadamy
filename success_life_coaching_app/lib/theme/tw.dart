import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// Colors from the website (tailwind.config.js + Tailwind defaults it uses).
class Tw {
  // "copper" palette = Success Life logo greens
  static const copper50 = Color(0xFFF1F8F1);
  static const copper100 = Color(0xFFE1EFE2);
  static const copper200 = Color(0xFFC3DEC5);
  static const copper300 = Color(0xFF98C49B);
  static const copper400 = Color(0xFF68A96C);
  static const copper500 = Color(0xFF36823B);
  static const copper600 = Color(0xFF17621D);
  static const copper700 = Color(0xFF004101);
  static const copper800 = Color(0xFF003501);
  static const copper900 = Color(0xFF002801);
  static const bronze = Color(0xFF17621D);
  static const accent = Color(0xFF68A96C);

  // Home hero / gold accents
  static const heroA = Color(0xFF06240C);
  static const heroB = Color(0xFF04180A);
  static const heroC = Color(0xFF0A2E12);
  static const heroBorder = Color(0xFF1D4A28);
  static const goldLight = Color(0xFFF6E7B4);
  static const gold = Color(0xFFD4AF37);
  static const goldInk = Color(0xFF1A1404);
  static const gold2 = Color(0xFFE4C36A);
  static const goldDeep = Color(0xFFC9A227);
  static const goldMuted = Color(0xFF9A7B24);
  static const cream = Color(0xFFF3E2AD);
  static const creamBg = Color(0xFFFFFDF6);
  static const creamBorder = Color(0xFFEADCB4);
  static const priceInk = Color(0xFF3B2D08);

  // Neutrals (Tailwind slate)
  static const slate50 = Color(0xFFF8FAFC);
  static const slate100 = Color(0xFFF1F5F9);
  static const slate200 = Color(0xFFE2E8F0);
  static const slate300 = Color(0xFFCBD5E1);
  static const slate400 = Color(0xFF94A3B8);
  static const slate500 = Color(0xFF64748B);
  static const slate600 = Color(0xFF475569);
  static const slate700 = Color(0xFF334155);
  static const slate800 = Color(0xFF1E293B);
  static const slate900 = Color(0xFF0F172A);
  static const slate950 = Color(0xFF020617);

  // Status
  static const emerald50 = Color(0xFFECFDF5);
  static const emerald100 = Color(0xFFD1FAE5);
  static const emerald200 = Color(0xFFA7F3D0);
  static const emerald500 = Color(0xFF10B981);
  static const emerald600 = Color(0xFF059669);
  static const emerald700 = Color(0xFF047857);
  static const emerald800 = Color(0xFF065F46);
  static const emerald900 = Color(0xFF064E3B);
  static const rose50 = Color(0xFFFFF1F2);
  static const rose200 = Color(0xFFFECDD3);
  static const rose300 = Color(0xFFFDA4AF);
  static const rose600 = Color(0xFFE11D48);
  static const rose700 = Color(0xFFBE123C);
  static const amber50 = Color(0xFFFFFBEB);
  static const amber100 = Color(0xFFFEF3C7);
  static const amber200 = Color(0xFFFDE68A);
  static const amber700 = Color(0xFFB45309);
  static const amber800 = Color(0xFF92400E);
  static const yellow400 = Color(0xFFFACC15);

  /// body background (#f6faf7)
  static const page = Color(0xFFF6FAF7);

  // ── Gradients ───────────────────────────────────────────────────────────
  static const brandGradient =
      LinearGradient(colors: [copper700, copper600]); // btn-primary
  static const brandDeepGradient =
      LinearGradient(colors: [copper700, copper900]); // active menu, Join Free
  static const goldGradient = LinearGradient(colors: [goldLight, gold]);
  static const authButtonGradient =
      LinearGradient(colors: [copper700, accent, bronze]);

  // ── Shadows (Tailwind arbitrary shadows from the site) ──────────────────
  static List<BoxShadow> surfaceShadow = [
    BoxShadow(
      color: const Color(0xFF004101).withValues(alpha: 0.22),
      offset: const Offset(0, 12),
      blurRadius: 36,
      spreadRadius: -24,
    ),
  ];
  static List<BoxShadow> homeCardShadow = [
    BoxShadow(
      color: const Color(0xFF04240C).withValues(alpha: 0.45),
      offset: const Offset(0, 18),
      blurRadius: 40,
      spreadRadius: -28,
    ),
  ];
  static List<BoxShadow> primaryButtonShadow = [
    BoxShadow(
      color: const Color(0xFF004101).withValues(alpha: 0.75),
      offset: const Offset(0, 10),
      blurRadius: 24,
      spreadRadius: -12,
    ),
  ];
  static List<BoxShadow> goldShadow = [
    BoxShadow(
      color: gold.withValues(alpha: 0.8),
      offset: const Offset(0, 14),
      blurRadius: 40,
      spreadRadius: -16,
    ),
  ];
  static List<BoxShadow> sm = [
    BoxShadow(
      color: Colors.black.withValues(alpha: 0.06),
      offset: const Offset(0, 1),
      blurRadius: 3,
    ),
  ];
}

/// Typography: Poppins body, Merriweather headings (`.home-display`, `.page-title`).
class TwText {
  static TextStyle display(double size,
          {Color color = Tw.slate900, double height = 1.2}) =>
      GoogleFonts.merriweather(
        fontSize: size,
        fontWeight: FontWeight.w900,
        letterSpacing: -0.025 * size,
        height: height,
        color: color,
      );

  static TextStyle sans(
    double size, {
    FontWeight weight = FontWeight.w400,
    Color color = Tw.slate900,
    double? height,
    double letterSpacing = 0,
  }) =>
      GoogleFonts.poppins(
        fontSize: size,
        fontWeight: weight,
        color: color,
        height: height,
        letterSpacing: letterSpacing,
      );

  /// Uppercase tracked label, e.g. eyebrows (tracking in em like Tailwind).
  static TextStyle eyebrow(double size, Color color,
          {double trackingEm = 0.22}) =>
      GoogleFonts.poppins(
        fontSize: size,
        fontWeight: FontWeight.w700,
        color: color,
        letterSpacing: trackingEm * size,
      );
}

ThemeData buildAppTheme() {
  final base = ThemeData(
    useMaterial3: true,
    colorScheme: ColorScheme.fromSeed(
      seedColor: Tw.copper700,
      primary: Tw.copper700,
      secondary: Tw.copper600,
      surface: Colors.white,
      brightness: Brightness.light,
    ),
    scaffoldBackgroundColor: Tw.page,
  );

  return base.copyWith(
    // google_fonts 9's *TextTheme helpers use a different TextTheme type, so
    // apply Poppins through its font family instead.
    textTheme: base.textTheme.apply(
      fontFamily: GoogleFonts.poppins().fontFamily,
      bodyColor: Tw.slate900,
      displayColor: Tw.slate900,
    ),
    appBarTheme: const AppBarTheme(
      backgroundColor: Colors.white,
      foregroundColor: Tw.slate900,
      surfaceTintColor: Colors.transparent,
      elevation: 0,
    ),
    progressIndicatorTheme:
        const ProgressIndicatorThemeData(color: Tw.copper700),
    snackBarTheme: SnackBarThemeData(
      behavior: SnackBarBehavior.floating,
      backgroundColor: Tw.copper900,
      contentTextStyle: GoogleFonts.poppins(color: Colors.white, fontSize: 14),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
    ),
    textButtonTheme: TextButtonThemeData(
      style: TextButton.styleFrom(foregroundColor: Tw.copper700),
    ),
  );
}
