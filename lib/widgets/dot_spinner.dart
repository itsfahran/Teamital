import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:web_teamital/app_colors.dart';

/// Uiverse "dot-spinner" (abrahamcalsin) — Flutter port.
/// Uses [AppColors.primary] by default so it matches the app brand.
class DotSpinner extends StatefulWidget {
  const DotSpinner({
    super.key,
    this.size = 44,
    this.color,
    this.speed = const Duration(milliseconds: 900),
  });

  final double size;
  final Color? color;
  final Duration speed;

  @override
  State<DotSpinner> createState() => _DotSpinnerState();
}

class _DotSpinnerState extends State<DotSpinner>
    with SingleTickerProviderStateMixin {
  late final AnimationController _ctrl;

  @override
  void initState() {
    super.initState();
    // CSS: animation duration = speed * 1.111
    final period = Duration(
      microseconds: (widget.speed.inMicroseconds * 1.111).round(),
    );
    _ctrl = AnimationController(vsync: this, duration: period)..repeat();
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final color = widget.color ?? AppColors.primary;
    return SizedBox(
      width: widget.size,
      height: widget.size,
      child: AnimatedBuilder(
        animation: _ctrl,
        builder: (context, _) {
          return CustomPaint(
            size: Size.square(widget.size),
            painter: _DotSpinnerPainter(
              progress: _ctrl.value,
              color: color,
              // CSS delays: speed * (-0.875 … 0) as fraction of pulse cycle
              speedMs: widget.speed.inMilliseconds.toDouble(),
            ),
          );
        },
      ),
    );
  }
}

class _DotSpinnerPainter extends CustomPainter {
  _DotSpinnerPainter({
    required this.progress,
    required this.color,
    required this.speedMs,
  });

  final double progress;
  final Color color;
  final double speedMs;

  @override
  void paint(Canvas canvas, Size size) {
    final cx = size.width / 2;
    final cy = size.height / 2;
    final radius = size.width * 0.38;
    final dotR = size.width * 0.10;

    // Pulse cycle matches controller (already scaled to speed * 1.111).
    final pulsePeriod = 1.0;
    final delayStep = 0.125; // matches CSS -0.875 … -0.125 steps

    for (var i = 0; i < 8; i++) {
      final angle = (i * 45) * math.pi / 180;
      // CSS: nth-child(1) delay 0; (2) -0.875*speed … relative to pulse
      final delayFrac = i == 0 ? 0.0 : -(1.0 - (i * delayStep));
      var t = (progress + delayFrac) % pulsePeriod;
      if (t < 0) t += pulsePeriod;

      // ease-in-out scale 0 → 1 → 0 (CSS keyframes 0/50/100)
      final scale = t < 0.5
          ? Curves.easeInOut.transform(t * 2)
          : Curves.easeInOut.transform((1 - t) * 2);
      final opacity = 0.5 + (scale * 0.5);

      final dx = cx + math.cos(angle - math.pi / 2) * radius;
      final dy = cy + math.sin(angle - math.pi / 2) * radius;

      final paint = Paint()
        ..color = color.withValues(alpha: opacity)
        ..maskFilter = MaskFilter.blur(BlurStyle.normal, dotR * 0.35 * scale);

      canvas.drawCircle(Offset(dx, dy), dotR * scale.clamp(0.001, 1.0), paint);

      // Solid core (less blur) so dots stay crisp
      canvas.drawCircle(
        Offset(dx, dy),
        dotR * scale.clamp(0.001, 1.0),
        Paint()..color = color.withValues(alpha: opacity),
      );
    }
  }

  @override
  bool shouldRepaint(covariant _DotSpinnerPainter old) =>
      old.progress != progress || old.color != color;
}

/// Centered full-page / section loader using [DotSpinner].
class AppLoader extends StatelessWidget {
  const AppLoader({
    super.key,
    this.size = 44,
    this.color,
    this.message,
  });

  final double size;
  final Color? color;
  final String? message;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          DotSpinner(size: size, color: color),
          if (message != null) ...[
            const SizedBox(height: 14),
            Text(
              message!,
              style: TextStyle(
                fontSize: 13,
                color: AppColors.textSecondary,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ],
      ),
    );
  }
}

/// Compact spinner for buttons (same animation, smaller).
class DotSpinnerCompact extends StatelessWidget {
  const DotSpinnerCompact({
    super.key,
    this.size = 18,
    this.color = Colors.white,
  });

  final double size;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return DotSpinner(size: size, color: color, speed: const Duration(milliseconds: 800));
  }
}
