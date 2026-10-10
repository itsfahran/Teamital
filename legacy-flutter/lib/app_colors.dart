import 'package:flutter/material.dart';

/// App-wide colors. Surfaces/text follow [applyBrightness].
/// Brand primary follows white-label via [applyBrand] (defaults to master blue).
class AppColors {
  AppColors._();

  // ── Master brand (const — use in default params / const widgets) ─────────
  static const Color masterPrimary = Color(0xFF1A56DB);
  static const Color masterAccent = Color(0xFF0EA5E9);
  static const LinearGradient masterPrimaryGradient = LinearGradient(
    colors: [masterPrimary, masterAccent],
    begin: Alignment.centerLeft,
    end: Alignment.centerRight,
  );

  // ── Active brand (updated by [applyBrand] for WL tenants) ───────────────
  static Color primary = masterPrimary;
  static Color primaryLight = const Color(0xFF3B82F6);
  static Color primaryDark = const Color(0xFF1239A6);
  static Color accent = masterAccent;

  static const Color success = Color(0xFF10B981);
  static const Color warning = Color(0xFFF59E0B);
  static const Color error = Color(0xFFEF4444);
  static const Color info = Color(0xFF3B82F6);
  static const Color pink = Color(0xFFEC4899);
  static const Color teal = Color(0xFF14B8A6);
  static const Color purple = Color(0xFF8B5CF6);
  static const Color superAdminBadge = Color(0xFF7C3AED);
  static Color companyAdminBadge = masterPrimary;
  static const Color employeeBadge = Color(0xFF10B981);
  static const Color whitelabelBadge = Color(0xFFF59E0B);
  static const Color textOnPrimary = Color(0xFFFFFFFF);
  static Color textLink = masterPrimary;
  static Color chartLine = masterPrimary;

  static LinearGradient get primaryGradient => LinearGradient(
        colors: [primary, Color.lerp(primary, accent, 0.55) ?? accent],
        begin: Alignment.centerLeft,
        end: Alignment.centerRight,
      );

  /// Sync active brand color from white-label (or reset to master when null).
  static void applyBrand(Color? brand) {
    final c = brand ?? masterPrimary;
    primary = c;
    primaryLight = Color.lerp(c, Colors.white, 0.28) ?? c;
    primaryDark = Color.lerp(c, Colors.black, 0.22) ?? c;
    accent = Color.lerp(c, masterAccent, 0.45) ?? masterAccent;
    textLink = c;
    chartLine = c;
    companyAdminBadge = c;
    borderFocus = c;
    borderFocused = c;
    iconColor = c;
  }
  static const LinearGradient successGradient = LinearGradient(
    colors: [Color(0xFF10B981), Color(0xFF059669)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );
  static const LinearGradient warmGradient = LinearGradient(
    colors: [Color(0xFFF59E0B), Color(0xFFF97316)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );
  static const LinearGradient darkGradient = LinearGradient(
    colors: [Color(0xFF1E293B), Color(0xFF0F172A)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );
  static const LinearGradient pinkGradient = LinearGradient(
    colors: [Color(0xFFEC4899), Color(0xFFF97316)],
    begin: Alignment.centerLeft,
    end: Alignment.centerRight,
  );

  // ── Theme-aware surfaces ──────────────────────────────────────────────────
  static bool _dark = false;

  static bool get isDark => _dark;

  static Color background = _lightBackground;
  static Color surface = _lightSurface;
  static Color surfaceCard = _lightSurfaceCard;
  static Color inputFill = _lightInputFill;
  static Color textPrimary = _lightTextPrimary;
  static Color textSecondary = _lightTextSecondary;
  static Color textHint = _lightTextHint;
  static Color border = _lightBorder;
  static Color borderFocus = primary;
  static Color borderFocused = primary;
  static Color divider = _lightDivider;
  static Color googleBtnBg = _lightGoogleBtnBg;
  static Color googleBtnBorder = _lightGoogleBtnBorder;
  static Color googleBtnText = _lightGoogleBtnText;
  static Color successLight = _lightSuccessLight;
  static Color warningLight = _lightWarningLight;
  static Color errorLight = _lightErrorLight;
  static Color infoLight = _lightInfoLight;
  static Color pinkLight = _lightPinkLight;
  static Color tealLight = _lightTealLight;
  static Color purpleLight = _lightPurpleLight;
  static Color dark = Color(0xFF1E293B);
  static Color iconBg = _lightIconBg;
  static Color iconColor = primary;
  static Color chartFill = _lightChartFill;
  static LinearGradient whiteGradient = const LinearGradient(
    colors: [Color(0xFFFFFFFF), Color(0xFF0F172A)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static void applyBrightness(bool dark) {
    _dark = dark;
    if (dark) {
      background = _darkBackground;
      surface = _darkSurface;
      surfaceCard = _darkSurfaceCard;
      inputFill = _darkInputFill;
      textPrimary = _darkTextPrimary;
      textSecondary = _darkTextSecondary;
      textHint = _darkTextHint;
      border = _darkBorder;
      divider = _darkDivider;
      googleBtnBg = _darkSurfaceCard;
      googleBtnBorder = _darkBorder;
      googleBtnText = _darkTextPrimary;
      successLight = _darkSuccessLight;
      warningLight = _darkWarningLight;
      errorLight = _darkErrorLight;
      infoLight = _darkInfoLight;
      pinkLight = _darkPinkLight;
      tealLight = _darkTealLight;
      purpleLight = _darkPurpleLight;
      AppColors.dark = _darkSurfaceCard;
      iconBg = _darkIconBg;
      chartFill = _darkChartFill;
    } else {
      background = _lightBackground;
      surface = _lightSurface;
      surfaceCard = _lightSurfaceCard;
      inputFill = _lightInputFill;
      textPrimary = _lightTextPrimary;
      textSecondary = _lightTextSecondary;
      textHint = _lightTextHint;
      border = _lightBorder;
      divider = _lightDivider;
      googleBtnBg = _lightGoogleBtnBg;
      googleBtnBorder = _lightGoogleBtnBorder;
      googleBtnText = _lightGoogleBtnText;
      successLight = _lightSuccessLight;
      warningLight = _lightWarningLight;
      errorLight = _lightErrorLight;
      infoLight = _lightInfoLight;
      pinkLight = _lightPinkLight;
      tealLight = _lightTealLight;
      purpleLight = _lightPurpleLight;
      AppColors.dark = const Color(0xFF1E293B);
      iconBg = _lightIconBg;
      chartFill = _lightChartFill;
    }
    borderFocus = primary;
    borderFocused = primary;
    iconColor = primary;
  }

  // Light palette
  static const _lightBackground = Color(0xFFFFFFFF);
  static const _lightSurface = Color(0xFFF5F7FA);
  static const _lightSurfaceCard = Color(0xFFEEF2FF);
  static const _lightInputFill = Color(0xFFF0F4FF);
  static const _lightTextPrimary = Color(0xFF111827);
  static const _lightTextSecondary = Color(0xFF6B7280);
  static const _lightTextHint = Color(0xFF9CA3AF);
  static const _lightBorder = Color(0xFFE5E7EB);
  static const _lightDivider = Color(0xFFE5E7EB);
  static const _lightGoogleBtnBg = Color(0xFFFFFFFF);
  static const _lightGoogleBtnBorder = Color(0xFFD1D5DB);
  static const _lightGoogleBtnText = Color(0xFF374151);
  static const _lightSuccessLight = Color(0xFFD1FAE5);
  static const _lightWarningLight = Color(0xFFFEF3C7);
  static const _lightErrorLight = Color(0xFFFEE2E2);
  static const _lightInfoLight = Color(0xFFDBEAFE);
  static const _lightPinkLight = Color(0xFFFCE7F3);
  static const _lightTealLight = Color(0xFFCCFBF1);
  static const _lightPurpleLight = Color(0xFFEDE9FE);
  static const _lightIconBg = Color(0xFFDCEEFF);
  static const _lightChartFill = Color(0xFFEEF2FF);

  // Dark palette
  static const _darkBackground = Color(0xFF0F172A);
  static const _darkSurface = Color(0xFF1E293B);
  static const _darkSurfaceCard = Color(0xFF334155);
  static const _darkInputFill = Color(0xFF1E293B);
  static const _darkTextPrimary = Color(0xFFF1F5F9);
  static const _darkTextSecondary = Color(0xFF94A3B8);
  static const _darkTextHint = Color(0xFF64748B);
  static const _darkBorder = Color(0xFF334155);
  static const _darkDivider = Color(0xFF334155);
  static const _darkSuccessLight = Color(0xFF064E3B);
  static const _darkWarningLight = Color(0xFF78350F);
  static const _darkErrorLight = Color(0xFF450A0A);
  static const _darkInfoLight = Color(0xFF1E3A8A);
  static const _darkPinkLight = Color(0xFF831843);
  static const _darkTealLight = Color(0xFF134E4A);
  static const _darkPurpleLight = Color(0xFF4C1D95);
  static const _darkIconBg = Color(0xFF1E3A5F);
  static const _darkChartFill = Color(0xFF1E293B);
}
