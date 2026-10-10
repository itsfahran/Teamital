import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:web_teamital/app_colors.dart';

/// Toastify-style floating alerts (web marketing + auth).
class WebToast {
  WebToast._();

  static void success(BuildContext context, String message) {
    _show(context, message, const Color(0xFF059669), Icons.check_circle_rounded);
  }

  static void error(BuildContext context, String message) {
    _show(context, message, AppColors.error, Icons.error_outline_rounded);
  }

  static void info(BuildContext context, String message) {
    _show(context, message, AppColors.primary, Icons.info_rounded);
  }

  static void _show(
    BuildContext context,
    String message,
    Color color,
    IconData icon,
  ) {
    final messenger = ScaffoldMessenger.maybeOf(context);
    if (messenger == null) return;
    messenger.clearSnackBars();
    messenger.showSnackBar(
      SnackBar(
        behavior: SnackBarBehavior.floating,
        backgroundColor: Colors.transparent,
        elevation: 0,
        margin: const EdgeInsets.fromLTRB(16, 0, 16, 24),
        duration: const Duration(seconds: 3),
        content: Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: color.withValues(alpha: 0.35)),
            boxShadow: [
              BoxShadow(
                color: color.withValues(alpha: 0.18),
                blurRadius: 24,
                offset: const Offset(0, 10),
              ),
            ],
          ),
          child: Row(
            children: [
              Icon(icon, color: color, size: 22),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  message,
                  style: GoogleFonts.poppins(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: const Color(0xFF111827),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

/// Confirm before signing out on web.
Future<bool> confirmWebSignOut(BuildContext context) async {
  if (!kIsWeb) return true;
  final ok = await showDialog<bool>(
    context: context,
    barrierDismissible: false,
    builder: (ctx) => AlertDialog(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
      title: Text(
        'Sign out?',
        style: GoogleFonts.poppins(fontWeight: FontWeight.w700),
      ),
      content: Text(
        'Are you sure you want to sign out?',
        style: GoogleFonts.poppins(fontSize: 14, color: const Color(0xFF6B7280)),
      ),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(ctx, false),
          child: Text('Cancel',
              style: GoogleFonts.poppins(fontWeight: FontWeight.w600)),
        ),
        FilledButton(
          onPressed: () => Navigator.pop(ctx, true),
          style: FilledButton.styleFrom(backgroundColor: AppColors.error),
          child: Text('Sign out',
              style: GoogleFonts.poppins(fontWeight: FontWeight.w700)),
        ),
      ],
    ),
  );
  return ok == true;
}
