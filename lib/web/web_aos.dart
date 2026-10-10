import 'dart:async';

import 'package:flutter/material.dart';

/// Lightweight scroll-reveal (AOS-style) for marketing pages.
class WebAos extends StatefulWidget {
  const WebAos({
    super.key,
    required this.child,
    this.delay = Duration.zero,
    this.duration = const Duration(milliseconds: 650),
    this.offset = 36,
    this.fromLeft = false,
    this.fromRight = false,
  });

  final Widget child;
  final Duration delay;
  final Duration duration;
  final double offset;
  final bool fromLeft;
  final bool fromRight;

  @override
  State<WebAos> createState() => _WebAosState();
}

class _WebAosState extends State<WebAos> with SingleTickerProviderStateMixin {
  late final AnimationController _c;
  late final Animation<double> _fade;
  late final Animation<Offset> _slide;
  bool _started = false;
  Timer? _poll;

  @override
  void initState() {
    super.initState();
    final dx = widget.fromLeft
        ? -0.06
        : widget.fromRight
            ? 0.06
            : 0.0;
    final dy = (widget.fromLeft || widget.fromRight) ? 0.0 : 0.08;
    _c = AnimationController(vsync: this, duration: widget.duration);
    _fade = CurvedAnimation(parent: _c, curve: Curves.easeOutCubic);
    _slide = Tween<Offset>(begin: Offset(dx, dy), end: Offset.zero)
        .animate(CurvedAnimation(parent: _c, curve: Curves.easeOutCubic));
    WidgetsBinding.instance.addPostFrameCallback((_) => _check());
    _poll = Timer.periodic(const Duration(milliseconds: 160), (_) {
      _check();
      if (_started) _poll?.cancel();
    });
    // Tall legal/privacy pages never satisfied the old "15% height" check and
    // stayed at opacity 0 forever — force-reveal as a safety net.
    Future<void>.delayed(const Duration(milliseconds: 700), () {
      if (mounted && !_started) _reveal();
    });
  }

  @override
  void dispose() {
    _poll?.cancel();
    _c.dispose();
    super.dispose();
  }

  void _reveal() {
    if (!mounted || _started) return;
    _started = true;
    _poll?.cancel();
    Future<void>.delayed(widget.delay, () {
      if (mounted) _c.forward();
    });
  }

  void _check() {
    if (!mounted || _started) return;
    final box = context.findRenderObject() as RenderBox?;
    if (box == null || !box.hasSize) return;
    final pos = box.localToGlobal(Offset.zero);
    final h = MediaQuery.sizeOf(context).height;
    // Use the top edge only — full height * 0.15 fails for long pages.
    final topVisible = pos.dy < h - widget.offset && pos.dy + 48 > 0;
    if (topVisible) _reveal();
  }

  @override
  Widget build(BuildContext context) {
    return FadeTransition(
      opacity: _fade,
      child: SlideTransition(position: _slide, child: widget.child),
    );
  }
}
