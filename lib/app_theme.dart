import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:web_teamital/app_colors.dart';

/// Snapshot of semantic colors for building [ThemeData] without mutating globals.
class _Palette {
  const _Palette({
    required this.background,
    required this.surface,
    required this.inputFill,
    required this.textPrimary,
    required this.textSecondary,
    required this.textHint,
    required this.border,
    required this.divider,
    required this.surfaceCard,
  });

  final Color background;
  final Color surface;
  final Color inputFill;
  final Color textPrimary;
  final Color textSecondary;
  final Color textHint;
  final Color border;
  final Color divider;
  final Color surfaceCard;

  static const light = _Palette(
    background: Color(0xFFFFFFFF),
    surface: Color(0xFFF5F7FA),
    inputFill: Color(0xFFF0F4FF),
    textPrimary: Color(0xFF111827),
    textSecondary: Color(0xFF6B7280),
    textHint: Color(0xFF9CA3AF),
    border: Color(0xFFE5E7EB),
    divider: Color(0xFFE5E7EB),
    surfaceCard: Color(0xFFEEF2FF),
  );

  static const dark = _Palette(
    background: Color(0xFF0F172A),
    surface: Color(0xFF1E293B),
    inputFill: Color(0xFF1E293B),
    textPrimary: Color(0xFFF1F5F9),
    textSecondary: Color(0xFF94A3B8),
    textHint: Color(0xFF64748B),
    border: Color(0xFF334155),
    divider: Color(0xFF334155),
    surfaceCard: Color(0xFF334155),
  );
}

/// Builds consistent light / dark [ThemeData] for the whole app.
///
/// Does **not** mutate [AppColors] — that is owned by [AppThemeController]
/// so building both `theme` and `darkTheme` cannot leave colors stuck on dark.
class AppTheme {
  AppTheme._();

  static ThemeData light({required Color primary}) =>
      _build(primary: primary, dark: false, p: _Palette.light);

  static ThemeData dark({required Color primary}) =>
      _build(primary: primary, dark: true, p: _Palette.dark);

  static ThemeData _build({
    required Color primary,
    required bool dark,
    required _Palette p,
  }) {
    final scheme = ColorScheme.fromSeed(
      seedColor: primary,
      brightness: dark ? Brightness.dark : Brightness.light,
      surface: p.surface,
    );

    final baseText = GoogleFonts.poppinsTextTheme(
      dark ? ThemeData.dark().textTheme : ThemeData.light().textTheme,
    );

    return ThemeData(
      useMaterial3: true,
      brightness: dark ? Brightness.dark : Brightness.light,
      pageTransitionsTheme: const PageTransitionsTheme(
        builders: {
          TargetPlatform.android: _InstantPageTransitionsBuilder(),
          TargetPlatform.iOS: _InstantPageTransitionsBuilder(),
          TargetPlatform.windows: _InstantPageTransitionsBuilder(),
        },
      ),
      primaryColor: primary,
      colorScheme: scheme.copyWith(
        primary: primary,
        onPrimary: AppColors.textOnPrimary,
        surface: p.surface,
        onSurface: p.textPrimary,
        error: AppColors.error,
      ),
      scaffoldBackgroundColor: p.surface,
      canvasColor: p.background,
      dividerColor: p.divider,
      cardColor: p.background,
      dialogTheme: DialogThemeData(
        backgroundColor: p.background,
        surfaceTintColor: Colors.transparent,
        titleTextStyle: GoogleFonts.poppins(
          color: p.textPrimary,
          fontSize: 18,
          fontWeight: FontWeight.w700,
        ),
        contentTextStyle: GoogleFonts.poppins(
          color: p.textSecondary,
          fontSize: 14,
          fontWeight: FontWeight.w400,
          height: 1.4,
        ),
      ),
      drawerTheme: DrawerThemeData(
        backgroundColor: p.background,
        surfaceTintColor: Colors.transparent,
        shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.only(
            topRight: Radius.circular(24),
            bottomRight: Radius.circular(24),
          ),
        ),
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: p.background,
        elevation: 0,
        scrolledUnderElevation: 0,
        surfaceTintColor: Colors.transparent,
        foregroundColor: p.textPrimary,
        iconTheme: IconThemeData(color: p.textPrimary),
        actionsIconTheme: IconThemeData(color: p.textPrimary),
        titleTextStyle: TextStyle(
          color: p.textPrimary,
          fontSize: 20,
          fontWeight: FontWeight.w600,
          fontFamily: GoogleFonts.poppins().fontFamily,
        ),
      ),
      textTheme: baseText.copyWith(
        displayLarge: baseText.displayLarge?.copyWith(
          color: p.textPrimary,
          fontWeight: FontWeight.w800,
        ),
        displayMedium: baseText.displayMedium?.copyWith(
          color: p.textPrimary,
          fontWeight: FontWeight.w800,
        ),
        headlineLarge: baseText.headlineLarge?.copyWith(
          color: p.textPrimary,
          fontWeight: FontWeight.w700,
        ),
        headlineMedium: baseText.headlineMedium?.copyWith(
          color: p.textPrimary,
          fontWeight: FontWeight.w700,
        ),
        titleLarge: baseText.titleLarge?.copyWith(
          color: p.textPrimary,
          fontWeight: FontWeight.w700,
        ),
        titleMedium: baseText.titleMedium?.copyWith(
          color: p.textPrimary,
          fontWeight: FontWeight.w600,
        ),
        bodyLarge: baseText.bodyLarge?.copyWith(color: p.textPrimary),
        bodyMedium: baseText.bodyMedium?.copyWith(color: p.textPrimary),
        bodySmall: baseText.bodySmall?.copyWith(color: p.textSecondary),
        labelLarge: baseText.labelLarge?.copyWith(
          color: p.textPrimary,
          fontWeight: FontWeight.w600,
        ),
      ),
      iconTheme: IconThemeData(color: p.textSecondary),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: p.inputFill,
        hintStyle: TextStyle(color: p.textHint),
        labelStyle: TextStyle(color: p.textSecondary),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: BorderSide.none,
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: BorderSide(color: p.border.withValues(alpha: 0.6)),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: BorderSide(color: primary, width: 1.5),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: primary,
          foregroundColor: AppColors.textOnPrimary,
          minimumSize: const Size(0, 44),
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
        ),
      ),
      filledButtonTheme: FilledButtonThemeData(
        style: FilledButton.styleFrom(
          backgroundColor: primary,
          foregroundColor: AppColors.textOnPrimary,
          minimumSize: const Size(0, 44),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
        ),
      ),
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          foregroundColor: primary,
          minimumSize: const Size(0, 40),
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        ),
      ),
      switchTheme: SwitchThemeData(
        thumbColor: WidgetStateProperty.resolveWith((states) {
          if (states.contains(WidgetState.selected)) return primary;
          return dark ? p.textHint : Colors.white;
        }),
        trackColor: WidgetStateProperty.resolveWith((states) {
          if (states.contains(WidgetState.selected)) {
            return primary.withValues(alpha: 0.45);
          }
          return p.border;
        }),
      ),
      navigationBarTheme: NavigationBarThemeData(
        height: 64,
        backgroundColor: p.background,
        indicatorColor: primary.withValues(alpha: dark ? 0.25 : 0.12),
        labelBehavior: NavigationDestinationLabelBehavior.onlyShowSelected,
        iconTheme: WidgetStateProperty.resolveWith((states) {
          final selected = states.contains(WidgetState.selected);
          return IconThemeData(
            color: selected ? primary : p.textSecondary,
            size: 22,
          );
        }),
        labelTextStyle: WidgetStateProperty.resolveWith((states) {
          final selected = states.contains(WidgetState.selected);
          return TextStyle(
            fontSize: 11,
            fontWeight: selected ? FontWeight.w700 : FontWeight.w500,
            color: selected ? primary : p.textSecondary,
          );
        }),
      ),
      bottomSheetTheme: BottomSheetThemeData(
        backgroundColor: p.background,
        surfaceTintColor: Colors.transparent,
        shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
        ),
      ),
      snackBarTheme: SnackBarThemeData(
        behavior: SnackBarBehavior.floating,
        backgroundColor: dark ? p.surfaceCard : p.textPrimary,
        contentTextStyle: GoogleFonts.poppins(
          color: AppColors.textOnPrimary,
          fontSize: 14,
          fontWeight: FontWeight.w500,
        ),
        actionTextColor: AppColors.textOnPrimary,
      ),
      dividerTheme: DividerThemeData(color: p.divider, thickness: 1),
      listTileTheme: ListTileThemeData(
        iconColor: p.textSecondary,
        textColor: p.textPrimary,
      ),
      progressIndicatorTheme: ProgressIndicatorThemeData(color: primary),
    );
  }
}

/// Skip the default 300ms Android/iOS route animation so screens appear
/// as soon as their first frame is ready.
class _InstantPageTransitionsBuilder extends PageTransitionsBuilder {
  const _InstantPageTransitionsBuilder();

  @override
  Widget buildTransitions<T>(
    PageRoute<T> route,
    BuildContext context,
    Animation<double> animation,
    Animation<double> secondaryAnimation,
    Widget child,
  ) {
    return child;
  }
}
