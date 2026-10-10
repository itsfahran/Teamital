import 'dart:async';

import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// Short cycling typewriter headline with color changes.
class WebTypewriterHeading extends StatefulWidget {
  const WebTypewriterHeading({
    super.key,
    this.phrases = const [
      'Track attendance.',
      'Manage teams.',
      'Grow faster.',
      'Stay in sync.',
    ],
    this.colors = const [
      Color(0xFF1A56DB),
      Color(0xFF0EA5E9),
      Color(0xFF7C3AED),
      Color(0xFF059669),
    ],
    this.fontSize = 42,
  });

  final List<String> phrases;
  final List<Color> colors;
  final double fontSize;

  @override
  State<WebTypewriterHeading> createState() => _WebTypewriterHeadingState();
}

class _WebTypewriterHeadingState extends State<WebTypewriterHeading> {
  int _phrase = 0;
  String _shown = '';
  bool _deleting = false;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _schedule(380);
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  void _schedule(int ms) {
    _timer?.cancel();
    _timer = Timer(Duration(milliseconds: ms), _tick);
  }

  void _tick() {
    if (!mounted) return;
    final full = widget.phrases[_phrase % widget.phrases.length];
    if (!_deleting) {
      if (_shown.length < full.length) {
        setState(() => _shown = full.substring(0, _shown.length + 1));
        _schedule(55);
      } else {
        _schedule(1400);
        _deleting = true;
      }
    } else {
      if (_shown.isNotEmpty) {
        setState(() => _shown = _shown.substring(0, _shown.length - 1));
        _schedule(28);
      } else {
        _deleting = false;
        setState(() => _phrase++);
        _schedule(320);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final color = widget.colors[_phrase % widget.colors.length];
    return Text.rich(
      TextSpan(
        children: [
          TextSpan(
            text: _shown.isEmpty ? ' ' : _shown,
            style: GoogleFonts.poppins(
              fontSize: widget.fontSize,
              height: 1.15,
              fontWeight: FontWeight.w800,
              color: color,
            ),
          ),
          TextSpan(
            text: '|',
            style: GoogleFonts.poppins(
              fontSize: widget.fontSize,
              height: 1.15,
              fontWeight: FontWeight.w300,
              color: color.withValues(alpha: 0.55),
            ),
          ),
        ],
      ),
    );
  }
}
