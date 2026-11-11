import 'package:flutter/material.dart';
import 'package:success_life_coaching_app/theme/tw.dart';

/// Website building blocks (resources/css/app.css + repeated Tailwind patterns).

// ── Cards ─────────────────────────────────────────────────────────────────────

/// `.surface-card` — rounded-2xl, slate border, soft green shadow.
class SurfaceCard extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry padding;
  final double radius;
  final Color color;
  final Color? borderColor;
  final VoidCallback? onTap;

  const SurfaceCard({
    super.key,
    required this.child,
    this.padding = const EdgeInsets.all(16),
    this.radius = 16,
    this.color = Colors.white,
    this.borderColor,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final r = BorderRadius.circular(radius);
    return Container(
      decoration: BoxDecoration(
        color: color,
        borderRadius: r,
        border: Border.all(
            color: borderColor ?? Tw.slate200.withValues(alpha: 0.8)),
        boxShadow: Tw.surfaceShadow,
      ),
      child: Material(
        color: Colors.transparent,
        borderRadius: r,
        clipBehavior: Clip.antiAlias,
        child: InkWell(
          onTap: onTap,
          child: Padding(padding: padding, child: child),
        ),
      ),
    );
  }
}

/// Home page card — rounded-[28px], copper-100 border, deeper shadow.
class HomeCard extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry padding;
  final double radius;
  final VoidCallback? onTap;
  final Color color;
  final Color borderColor;

  const HomeCard({
    super.key,
    required this.child,
    this.padding = const EdgeInsets.all(24),
    this.radius = 28,
    this.onTap,
    this.color = Colors.white,
    this.borderColor = Tw.copper100,
  });

  @override
  Widget build(BuildContext context) {
    final r = BorderRadius.circular(radius);
    return Container(
      decoration: BoxDecoration(
        color: color,
        borderRadius: r,
        border: Border.all(color: borderColor),
        boxShadow: Tw.homeCardShadow,
      ),
      child: Material(
        color: Colors.transparent,
        borderRadius: r,
        clipBehavior: Clip.antiAlias,
        child: InkWell(
            onTap: onTap, child: Padding(padding: padding, child: child)),
      ),
    );
  }
}

/// `.home-hero` — deep green gradient with gold/green glows and a faint grid.
class HeroBox extends StatelessWidget {
  final Widget child;
  final double radius;
  final EdgeInsetsGeometry padding;
  final bool border;

  const HeroBox({
    super.key,
    required this.child,
    this.radius = 28,
    this.padding = const EdgeInsets.all(24),
    this.border = true,
  });

  @override
  Widget build(BuildContext context) {
    final r = BorderRadius.circular(radius);
    return Container(
      decoration: BoxDecoration(
        borderRadius: r,
        border: border ? Border.all(color: Tw.heroBorder) : null,
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF04180A).withValues(alpha: 0.85),
            offset: const Offset(0, 36),
            blurRadius: 90,
            spreadRadius: -40,
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: r,
        child: Stack(
          children: [
            const Positioned.fill(child: _HeroBackground()),
            Padding(padding: padding, child: child),
          ],
        ),
      ),
    );
  }
}

class _HeroBackground extends StatelessWidget {
  const _HeroBackground();

  @override
  Widget build(BuildContext context) {
    return Stack(
      fit: StackFit.expand,
      children: [
        const DecoratedBox(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment(-0.6, -1),
              end: Alignment(0.6, 1),
              colors: [Tw.heroA, Tw.heroB, Tw.heroC],
              stops: [0, 0.48, 1],
            ),
          ),
        ),
        // gold glow top-right
        DecoratedBox(
          decoration: BoxDecoration(
            gradient: RadialGradient(
              center: const Alignment(0.84, -0.84),
              radius: 0.9,
              colors: [
                Tw.gold2.withValues(alpha: 0.22),
                Tw.gold2.withValues(alpha: 0)
              ],
            ),
          ),
        ),
        // green glow bottom-left
        DecoratedBox(
          decoration: BoxDecoration(
            gradient: RadialGradient(
              center: const Alignment(-0.84, 1),
              radius: 0.75,
              colors: [
                Tw.accent.withValues(alpha: 0.28),
                Tw.accent.withValues(alpha: 0)
              ],
            ),
          ),
        ),
        CustomPaint(painter: _GridPainter()),
      ],
    );
  }
}

class _GridPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.white.withValues(alpha: 0.07)
      ..strokeWidth = 1;
    const step = 56.0;
    for (double x = 0; x < size.width; x += step) {
      canvas.drawLine(Offset(x, 0), Offset(x, size.height), paint);
    }
    for (double y = 0; y < size.height; y += step) {
      canvas.drawLine(Offset(0, y), Offset(size.width, y), paint);
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

// ── Buttons ───────────────────────────────────────────────────────────────────

class _PressableBox extends StatefulWidget {
  final Widget child;
  final VoidCallback? onTap;
  final BorderRadius radius;
  final BoxDecoration decoration;

  const _PressableBox({
    required this.child,
    required this.onTap,
    required this.radius,
    required this.decoration,
  });

  @override
  State<_PressableBox> createState() => _PressableBoxState();
}

class _PressableBoxState extends State<_PressableBox> {
  bool _down = false;

  @override
  Widget build(BuildContext context) {
    final enabled = widget.onTap != null;
    return AnimatedScale(
      scale: _down ? 0.98 : 1, // active:scale-[0.98]
      duration: const Duration(milliseconds: 120),
      child: Opacity(
        opacity: enabled ? 1 : 0.5,
        child: DecoratedBox(
          decoration: widget.decoration,
          child: Material(
            color: Colors.transparent,
            borderRadius: widget.radius,
            clipBehavior: Clip.antiAlias,
            child: InkWell(
              onTap: widget.onTap,
              onHighlightChanged: (v) => setState(() => _down = v),
              child: widget.child,
            ),
          ),
        ),
      ),
    );
  }
}

Widget _buttonContent(String label, TextStyle style,
    {IconData? icon, Widget? leading, bool loading = false, Color? spinner}) {
  return Row(
    mainAxisSize: MainAxisSize.min,
    mainAxisAlignment: MainAxisAlignment.center,
    children: [
      if (loading) ...[
        SizedBox(
          width: 18,
          height: 18,
          child: CircularProgressIndicator(
              strokeWidth: 2, color: spinner ?? style.color),
        ),
        const SizedBox(width: 10),
      ] else if (leading != null) ...[
        leading,
        const SizedBox(width: 8),
      ],
      Flexible(child: Text(label, style: style, textAlign: TextAlign.center)),
      if (icon != null && !loading) ...[
        const SizedBox(width: 8),
        Icon(icon, size: 18, color: style.color),
      ],
    ],
  );
}

/// `.btn-primary` — green gradient, rounded-xl, min height 48.
class PrimaryButton extends StatelessWidget {
  final String label;
  final VoidCallback? onPressed;
  final IconData? icon;
  final Widget? leading;
  final bool loading;
  final bool expand;
  final EdgeInsets padding;
  final double fontSize;

  const PrimaryButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.icon,
    this.leading,
    this.loading = false,
    this.expand = true,
    this.padding = const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
    this.fontSize = 16,
  });

  @override
  Widget build(BuildContext context) {
    final radius = BorderRadius.circular(12);
    final btn = _PressableBox(
      onTap: loading ? null : onPressed,
      radius: radius,
      decoration: BoxDecoration(
        gradient: Tw.brandGradient,
        borderRadius: radius,
        boxShadow: Tw.primaryButtonShadow,
      ),
      child: ConstrainedBox(
        constraints: const BoxConstraints(minHeight: 48),
        child: Padding(
          padding: padding,
          child: Center(
            widthFactor: 1,
            child: _buttonContent(
              label,
              TwText.sans(fontSize,
                  weight: FontWeight.w600, color: Colors.white),
              icon: icon,
              leading: leading,
              loading: loading,
            ),
          ),
        ),
      ),
    );
    return expand ? SizedBox(width: double.infinity, child: btn) : btn;
  }
}

/// `.btn-secondary` — white, slate border.
class SecondaryButton extends StatelessWidget {
  final String label;
  final VoidCallback? onPressed;
  final IconData? icon;
  final Widget? leading;
  final bool expand;
  final double fontSize;

  const SecondaryButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.icon,
    this.leading,
    this.expand = true,
    this.fontSize = 16,
  });

  @override
  Widget build(BuildContext context) {
    final radius = BorderRadius.circular(12);
    final btn = _PressableBox(
      onTap: onPressed,
      radius: radius,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: radius,
        border: Border.all(color: Tw.slate200),
        boxShadow: Tw.sm,
      ),
      child: ConstrainedBox(
        constraints: const BoxConstraints(minHeight: 48),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
          child: Center(
            widthFactor: 1,
            child: _buttonContent(
              label,
              TwText.sans(fontSize,
                  weight: FontWeight.w600, color: Tw.slate700),
              icon: icon,
              leading: leading,
            ),
          ),
        ),
      ),
    );
    return expand ? SizedBox(width: double.infinity, child: btn) : btn;
  }
}

/// Gold pill (home hero / CTA): from-[#f6e7b4] to-[#d4af37], dark ink text.
class GoldPillButton extends StatelessWidget {
  final String label;
  final VoidCallback? onPressed;
  final IconData? icon;
  final bool expand;
  final EdgeInsets padding;
  final double fontSize;

  const GoldPillButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.icon,
    this.expand = true,
    this.padding = const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
    this.fontSize = 16,
  });

  @override
  Widget build(BuildContext context) {
    final radius = BorderRadius.circular(999);
    final btn = _PressableBox(
      onTap: onPressed,
      radius: radius,
      decoration: BoxDecoration(
        gradient: Tw.goldGradient,
        borderRadius: radius,
        boxShadow: Tw.goldShadow,
      ),
      child: Padding(
        padding: padding,
        child: Center(
          widthFactor: 1,
          child: _buttonContent(
            label,
            TwText.sans(fontSize, weight: FontWeight.w700, color: Tw.goldInk),
            icon: icon,
          ),
        ),
      ),
    );
    return expand ? SizedBox(width: double.infinity, child: btn) : btn;
  }
}

/// Ghost pill on dark backgrounds: border white/20, bg white/5.
class GhostPillButton extends StatelessWidget {
  final String label;
  final VoidCallback? onPressed;
  final bool expand;

  const GhostPillButton(
      {super.key,
      required this.label,
      required this.onPressed,
      this.expand = true});

  @override
  Widget build(BuildContext context) {
    final radius = BorderRadius.circular(999);
    final btn = _PressableBox(
      onTap: onPressed,
      radius: radius,
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.05),
        borderRadius: radius,
        border: Border.all(color: Colors.white.withValues(alpha: 0.2)),
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 16),
        child: Center(
          widthFactor: 1,
          child: Text(label,
              style: TwText.sans(16,
                  weight: FontWeight.w600, color: Colors.white)),
        ),
      ),
    );
    return expand ? SizedBox(width: double.infinity, child: btn) : btn;
  }
}

// ── Chips & headings ──────────────────────────────────────────────────────────

/// Inner-page eyebrow chip: emerald-50 pill, uppercase emerald-800.
class EmeraldChip extends StatelessWidget {
  final String text;
  const EmeraldChip(this.text, {super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
      decoration: BoxDecoration(
        color: Tw.emerald50,
        borderRadius: BorderRadius.circular(999),
        border: Border.all(color: Tw.emerald200.withValues(alpha: 0.8)),
      ),
      child: Text(text.toUpperCase(),
          style: TwText.eyebrow(11, Tw.emerald800, trackingEm: 0.2)),
    );
  }
}

/// Hero chip on dark green: gold border, pulsing gold dot.
class HeroChip extends StatelessWidget {
  final String text;
  const HeroChip(this.text, {super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.05),
        borderRadius: BorderRadius.circular(999),
        border: Border.all(color: Tw.gold2.withValues(alpha: 0.35)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          const PulseDot(color: Tw.gold2),
          const SizedBox(width: 10),
          Flexible(
            child: Text(
              text.toUpperCase(),
              style: TwText.eyebrow(11, Tw.cream, trackingEm: 0.18)
                  .copyWith(fontWeight: FontWeight.w600),
            ),
          ),
        ],
      ),
    );
  }
}

/// Small dot with a breathing glow (hero-dot-pulse / animate-ping).
class PulseDot extends StatefulWidget {
  final Color color;
  final double size;
  const PulseDot({super.key, required this.color, this.size = 6});

  @override
  State<PulseDot> createState() => _PulseDotState();
}

class _PulseDotState extends State<PulseDot>
    with SingleTickerProviderStateMixin {
  late final AnimationController _c =
      AnimationController(vsync: this, duration: const Duration(seconds: 2))
        ..repeat();

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _c,
      builder: (_, __) => Container(
        width: widget.size,
        height: widget.size,
        decoration: BoxDecoration(
          color: widget.color,
          shape: BoxShape.circle,
          boxShadow: [
            BoxShadow(
              color: widget.color.withValues(alpha: 0.7 * (1 - _c.value)),
              spreadRadius: 7 * _c.value,
            ),
          ],
        ),
      ),
    );
  }
}

/// Home section header: gold eyebrow + Merriweather title + slate subtitle.
class SectionHeader extends StatelessWidget {
  final String eyebrow;
  final String title;
  final String? subtitle;
  final bool center;
  final bool dark;

  const SectionHeader({
    super.key,
    required this.eyebrow,
    required this.title,
    this.subtitle,
    this.center = false,
    this.dark = false,
  });

  @override
  Widget build(BuildContext context) {
    final align = center ? TextAlign.center : TextAlign.start;
    return Column(
      crossAxisAlignment:
          center ? CrossAxisAlignment.center : CrossAxisAlignment.start,
      children: [
        Text(eyebrow.toUpperCase(),
            textAlign: align,
            style: TwText.eyebrow(11, dark ? Tw.cream : Tw.goldMuted,
                trackingEm: 0.22)),
        const SizedBox(height: 8),
        Text(title,
            textAlign: align,
            style: TwText.display(30,
                color: dark ? Colors.white : Tw.slate900, height: 1.25)),
        if (subtitle != null) ...[
          const SizedBox(height: 10),
          Text(subtitle!,
              textAlign: align,
              style: TwText.sans(14,
                  color: dark
                      ? const Color(0xFFECFDF5).withValues(alpha: 0.75)
                      : Tw.slate600,
                  height: 1.6)),
        ],
      ],
    );
  }
}

/// Inner page intro: emerald chip + bold title + subtitle (Courses, Reels...).
class PageIntro extends StatelessWidget {
  final String chip;
  final String title;
  final String? subtitle;
  const PageIntro(
      {super.key, required this.chip, required this.title, this.subtitle});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        EmeraldChip(chip),
        const SizedBox(height: 12),
        Text(title,
            style: TwText.sans(24,
                weight: FontWeight.w900, height: 1.2, letterSpacing: -0.4)),
        if (subtitle != null) ...[
          const SizedBox(height: 8),
          Text(subtitle!,
              style: TwText.sans(14, color: Tw.slate600, height: 1.55)),
        ],
      ],
    );
  }
}

/// ★★★★★ in gold.
class GoldStars extends StatelessWidget {
  final int rating;
  final Color color;
  const GoldStars({super.key, this.rating = 5, this.color = Tw.goldDeep});

  @override
  Widget build(BuildContext context) {
    return Text(
      List.generate(5, (i) => '★').join(),
      style: TwText.sans(14, color: color, letterSpacing: 2.8),
    );
  }
}

/// Avatar circle with initials on a gradient.
class InitialsAvatar extends StatelessWidget {
  final String initials;
  final double size;
  final List<Color> colors;
  const InitialsAvatar(this.initials,
      {super.key,
      this.size = 44,
      this.colors = const [Tw.emerald600, Tw.copper800]});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: size,
      height: size,
      alignment: Alignment.center,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: colors),
        boxShadow: [
          BoxShadow(
            color: colors.first.withValues(alpha: 0.3),
            blurRadius: 8,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Text(initials,
          style: TwText.sans(size * 0.34,
              weight: FontWeight.w800, color: Colors.white)),
    );
  }
}

// ── Shimmer & Skeletons ────────────────────────────────────────────────────────

/// Animated sweep shimmer for modern loading skeletons.
class ShimmerLoading extends StatefulWidget {
  final Widget child;
  const ShimmerLoading({super.key, required this.child});

  @override
  State<ShimmerLoading> createState() => _ShimmerLoadingState();
}

class _ShimmerLoadingState extends State<ShimmerLoading>
    with SingleTickerProviderStateMixin {
  late final AnimationController _anim = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 1400),
  )..repeat();

  @override
  void dispose() {
    _anim.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _anim,
      builder: (context, child) {
        return ShaderMask(
          blendMode: BlendMode.srcATop,
          shaderCallback: (bounds) {
            final offset = _anim.value * 2.5 - 0.75;
            return LinearGradient(
              begin: Alignment.centerLeft,
              end: Alignment.centerRight,
              colors: const [
                Color(0xFFE2E8F0),
                Color(0xFFFFFFFF),
                Color(0xFFE2E8F0),
              ],
              stops: [
                (offset - 0.3).clamp(0.0, 1.0),
                offset.clamp(0.0, 1.0),
                (offset + 0.3).clamp(0.0, 1.0),
              ],
            ).createShader(bounds);
          },
          child: child,
        );
      },
      child: widget.child,
    );
  }
}

class ShimmerBox extends StatelessWidget {
  final double width;
  final double height;
  final double radius;

  const ShimmerBox({
    super.key,
    required this.width,
    required this.height,
    this.radius = 8,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: width,
      height: height,
      decoration: BoxDecoration(
        color: const Color(0xFFE2E8F0),
        borderRadius: BorderRadius.circular(radius),
      ),
    );
  }
}

class ShimmerCardSkeleton extends StatelessWidget {
  final double height;
  final double radius;
  const ShimmerCardSkeleton({super.key, this.height = 280, this.radius = 24});

  @override
  Widget build(BuildContext context) {
    return ShimmerLoading(
      child: Container(
        height: height,
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(radius),
          border: Border.all(color: Tw.copper100.withValues(alpha: 0.8)),
          boxShadow: Tw.sm,
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              flex: 5,
              child: Container(
                decoration: BoxDecoration(
                  color: const Color(0xFFE2E8F0),
                  borderRadius:
                      BorderRadius.vertical(top: Radius.circular(radius)),
                ),
              ),
            ),
            const Expanded(
              flex: 4,
              child: Padding(
                padding: EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    ShimmerBox(width: double.infinity, height: 18, radius: 6),
                    ShimmerBox(width: 220, height: 14, radius: 4),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        ShimmerBox(width: 120, height: 14, radius: 4),
                        ShimmerBox(width: 90, height: 26, radius: 999),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// Modern interactive category chip with icon and count.
class ModernCategoryPill extends StatelessWidget {
  final String label;
  final String? icon;
  final bool active;
  final int? count;
  final VoidCallback onTap;

  const ModernCategoryPill({
    super.key,
    required this.label,
    this.icon,
    required this.active,
    this.count,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(999),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
          decoration: BoxDecoration(
            gradient: active ? Tw.brandDeepGradient : null,
            color: active ? null : Colors.white,
            borderRadius: BorderRadius.circular(999),
            border: active
                ? null
                : Border.all(color: Tw.copper200.withValues(alpha: 0.8)),
            boxShadow: active
                ? [
                    BoxShadow(
                      color: Tw.copper700.withValues(alpha: 0.35),
                      blurRadius: 12,
                      offset: const Offset(0, 4),
                    ),
                  ]
                : Tw.sm,
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              if (icon != null) ...[
                Text(icon!, style: const TextStyle(fontSize: 14)),
                const SizedBox(width: 6),
              ],
              Text(
                label,
                style: TwText.sans(
                  13,
                  weight: active ? FontWeight.w700 : FontWeight.w600,
                  color: active ? Colors.white : Tw.slate700,
                ),
              ),
              if (count != null) ...[
                const SizedBox(width: 6),
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
                  decoration: BoxDecoration(
                    color: active
                        ? Colors.white.withValues(alpha: 0.22)
                        : Tw.copper50,
                    borderRadius: BorderRadius.circular(999),
                  ),
                  child: Text(
                    '$count',
                    style: TwText.sans(
                      11,
                      weight: FontWeight.w700,
                      color: active ? Colors.white : Tw.copper700,
                    ),
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}

/// Rose error box with one row per message (auth pages).
class ErrorBox extends StatelessWidget {
  final List<String> messages;
  const ErrorBox(this.messages, {super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Tw.rose50,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Tw.rose300),
        boxShadow: Tw.sm,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          for (final m in messages)
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 2),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Icon(Icons.error_outline, size: 20, color: Tw.rose600),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(m,
                        style: TwText.sans(14,
                            weight: FontWeight.w500, color: Tw.rose700)),
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }
}

/// AuthField — label above, leading icon, slate-50 fill, rounded-2xl, 56px tall.
class AuthField extends StatefulWidget {
  final String label;
  final IconData icon;
  final TextEditingController controller;
  final String? hint;
  final bool obscure;
  final TextInputType? keyboardType;
  final String? error;
  final TextInputAction? textInputAction;
  final ValueChanged<String>? onSubmitted;
  final Iterable<String>? autofillHints;

  const AuthField({
    super.key,
    required this.label,
    required this.icon,
    required this.controller,
    this.hint,
    this.obscure = false,
    this.keyboardType,
    this.error,
    this.textInputAction,
    this.onSubmitted,
    this.autofillHints,
  });

  @override
  State<AuthField> createState() => _AuthFieldState();
}

class _AuthFieldState extends State<AuthField> {
  late bool _hidden = widget.obscure;

  @override
  Widget build(BuildContext context) {
    final hasError = widget.error != null;
    OutlineInputBorder border(Color c, [double w = 1]) => OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide(color: c, width: w),
        );

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(widget.label,
            style: TwText.sans(14,
                weight: FontWeight.w600,
                color: Tw.slate700,
                letterSpacing: 0.2)),
        const SizedBox(height: 8),
        TextField(
          controller: widget.controller,
          obscureText: _hidden,
          keyboardType: widget.keyboardType,
          textInputAction: widget.textInputAction,
          onSubmitted: widget.onSubmitted,
          autofillHints: widget.autofillHints,
          style: TwText.sans(16, color: Tw.slate900),
          decoration: InputDecoration(
            hintText: widget.hint,
            hintStyle: TwText.sans(16, color: Tw.slate400),
            filled: true,
            fillColor: hasError ? Tw.rose50.withValues(alpha: 0.6) : Tw.slate50,
            contentPadding:
                const EdgeInsets.symmetric(horizontal: 16, vertical: 18),
            prefixIcon: Icon(widget.icon, size: 20, color: Tw.copper500),
            suffixIcon: widget.obscure
                ? IconButton(
                    tooltip: _hidden ? 'Show password' : 'Hide password',
                    icon: Icon(
                        _hidden
                            ? Icons.visibility_outlined
                            : Icons.visibility_off_outlined,
                        color: Tw.slate400),
                    onPressed: () => setState(() => _hidden = !_hidden),
                  )
                : null,
            enabledBorder: border(hasError ? Tw.rose300 : Tw.slate200),
            focusedBorder:
                border(hasError ? const Color(0xFFFB7185) : Tw.copper500, 2),
            border: border(Tw.slate200),
          ),
        ),
        if (hasError) ...[
          const SizedBox(height: 8),
          Row(
            children: [
              const Icon(Icons.error_outline, size: 16, color: Tw.rose600),
              const SizedBox(width: 6),
              Expanded(
                child: Text(widget.error!,
                    style: TwText.sans(14,
                        weight: FontWeight.w500, color: Tw.rose600)),
              ),
            ],
          ),
        ],
      ],
    );
  }
}

/// Price text like the website: "1500 ETB" (no decimals when whole).
String etb(double price, {bool thousands = false}) {
  final whole = price == price.roundToDouble();
  var n = whole ? price.toStringAsFixed(0) : price.toStringAsFixed(2);
  if (thousands) {
    final parts = n.split('.');
    final digits =
        parts[0].replaceAllMapped(RegExp(r'\B(?=(\d{3})+(?!\d))'), (_) => ',');
    n = parts.length > 1 ? '$digits.${parts[1]}' : digits;
  }
  return '$n ETB';
}
