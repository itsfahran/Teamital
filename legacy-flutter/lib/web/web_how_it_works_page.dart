import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:web_teamital/app_colors.dart';
import 'package:web_teamital/web/web_aos.dart';
import 'package:web_teamital/web/web_footer.dart';
import 'package:web_teamital/web/web_routes.dart';
import 'package:web_teamital/web/web_site_header.dart';

/// Public workflow page: /how-it-works
class WebHowItWorksPage extends StatelessWidget {
  const WebHowItWorksPage({super.key});

  static const _steps = <(IconData, String, String)>[
    (
      Icons.apartment_rounded,
      'Create your company account',
      'Sign up, name your workspace, and invite the first admin.',
    ),
    (
      Icons.group_add_rounded,
      'Add employees',
      'Invite people by email or add them from the company dashboard.',
    ),
    (
      Icons.location_on_rounded,
      'Set attendance rules and locations',
      'Choose clock-in methods, GPS geofences, and working hours.',
    ),
    (
      Icons.fingerprint_rounded,
      'Employees clock in and out',
      'Teams punch with GPS, face, or biometrics on web and mobile.',
    ),
    (
      Icons.insights_rounded,
      'Track attendance and workforce activity',
      'See who is present, late, or on site from live dashboards.',
    ),
    (
      Icons.assignment_rounded,
      'Manage projects and leave',
      'Assign work, approve time off, and keep one source of truth.',
    ),
    (
      Icons.bar_chart_rounded,
      'Generate reports',
      'Export hours, overtime, and attendance summaries for payroll.',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    final w = MediaQuery.sizeOf(context).width;
    final compact = w < 980;

    return Theme(
      data: ThemeData(
        brightness: Brightness.light,
        scaffoldBackgroundColor: const Color(0xFFF5F7FA),
        colorScheme: ColorScheme.fromSeed(
          seedColor: AppColors.primary,
          brightness: Brightness.light,
        ),
        useMaterial3: true,
      ),
      child: Scaffold(
        backgroundColor: const Color(0xFFF5F7FA),
        body: Column(
          children: [
            WebSiteHeader(
              current: WebSitePage.howItWorks,
              compact: compact,
            ),
            Expanded(
              child: SingleChildScrollView(
                child: Column(
                  children: [
                    Padding(
                      padding: EdgeInsets.fromLTRB(
                        compact ? 20 : 48,
                        40,
                        compact ? 20 : 48,
                        40,
                      ),
                      child: Center(
                        child: ConstrainedBox(
                          constraints: const BoxConstraints(maxWidth: 860),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              WebAos(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      'How It Works',
                                      style: GoogleFonts.poppins(
                                        fontSize: 36,
                                        fontWeight: FontWeight.w800,
                                        color: const Color(0xFF111827),
                                      ),
                                    ),
                                    const SizedBox(height: 10),
                                    Text(
                                      'The complete Teamital workflow — from signup to reports.',
                                      style: GoogleFonts.poppins(
                                        fontSize: 16,
                                        height: 1.5,
                                        color: const Color(0xFF6B7280),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              const SizedBox(height: 32),
                              for (var i = 0; i < _steps.length; i++)
                                WebAos(
                                  delay: Duration(milliseconds: 60 * i),
                                  child: _step(i + 1, _steps[i]),
                                ),
                              const SizedBox(height: 24),
                              FilledButton(
                                onPressed: () =>
                                    WebRoutes.push(context, WebRoutes.signUp),
                                style: FilledButton.styleFrom(
                                  backgroundColor: AppColors.primary,
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 22,
                                    vertical: 14,
                                  ),
                                ),
                                child: Text(
                                  'Create your company account',
                                  style: GoogleFonts.poppins(
                                    fontWeight: FontWeight.w700,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                    const WebMarketingFooter(),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _step(int n, (IconData, String, String) s) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: const Color(0xFFE5E7EB)),
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                gradient: AppColors.primaryGradient,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(s.$1, color: Colors.white, size: 22),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    '$n. ${s.$2}',
                    style: GoogleFonts.poppins(
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                      color: const Color(0xFF111827),
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    s.$3,
                    style: GoogleFonts.poppins(
                      fontSize: 14,
                      height: 1.5,
                      color: const Color(0xFF6B7280),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
