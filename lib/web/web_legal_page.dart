import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:web_teamital/app_colors.dart';
import 'package:web_teamital/app_config.dart';
import 'package:web_teamital/web/web_aos.dart';
import 'package:web_teamital/web/web_footer.dart';
import 'package:web_teamital/web/web_privacy_policy_page.dart';
import 'package:web_teamital/web/web_site_header.dart';

enum WebLegalSlug {
  about,
  features,
  security,
  privacy,
  terms,
  cookies,
  careers,
  blog,
}

/// Static marketing / legal pages linked from the footer.
class WebLegalPage extends StatelessWidget {
  const WebLegalPage({super.key, required this.slug});

  final WebLegalSlug slug;

  (String, String, List<String>) get _content => switch (slug) {
        WebLegalSlug.about => (
            'About us',
            'We build workforce tools that keep teams honest, on time, and in sync.',
            [
              '${AppConfig.displayName} helps companies track attendance with GPS and biometrics, manage leave and tasks, and see live workforce insights.',
              'Our product runs on web, Android, iOS and desktop so office and field teams share one source of truth.',
              'We partner with HR and operations leaders who need reliable punch data without complicated software.',
            ],
          ),
        WebLegalSlug.features => (
            'Features',
            'Everything you need for modern workforce attendance.',
            [
              'Clock in / out with GPS geofencing, face and biometric checks.',
              'Leave requests, balances and manager approvals in one place.',
              'Task assignment, HR chat, and realtime dashboards for admins.',
              'Exports and work summaries ready for payroll workflows.',
            ],
          ),
        WebLegalSlug.security => (
            'Security',
            'Role-based access and audit-friendly records by design.',
            [
              'Encrypted auth sessions via Supabase.',
              'Separate roles for employees, company admins, partners and super admins.',
              'Optional GPS and biometric verification on clock events.',
              'Attendance history you can export for compliance reviews.',
            ],
          ),
        WebLegalSlug.privacy => (
            'Privacy policy',
            'How we handle account and workforce data.',
            [
              'We collect account details, attendance events and usage needed to run the product.',
              'Data is stored with our cloud providers under industry-standard access controls.',
              'We do not sell personal data. Contact us to request export or deletion where applicable.',
              'For privacy questions email ${'' /* filled below */}',
            ],
          ),
        WebLegalSlug.terms => (
            'Terms of service',
            'Rules for using ${AppConfig.displayName}.',
            [
              'Accounts must be used for lawful workforce management only.',
              'You are responsible for your employees’ access and accurate time records.',
              'Subscriptions renew per the plan you activate until cancelled.',
              'We may update these terms; continued use means you accept the latest version.',
            ],
          ),
        WebLegalSlug.cookies => (
            'Cookies',
            'How the web app uses cookies and local storage.',
            [
              'We use essential cookies / local storage for login sessions and preferences.',
              'Analytics may be used to improve reliability and performance.',
              'You can clear site data in your browser at any time.',
            ],
          ),
        WebLegalSlug.careers => (
            'Careers',
            'Join a product team focused on workforce tools.',
            [
              'We hire engineers, designers and customer success specialists who care about clear UX.',
              'Remote-friendly roles open periodically — send your CV via the Contact page.',
              'Tell us how you would improve attendance for field teams.',
            ],
          ),
        WebLegalSlug.blog => (
            'Blog',
            'Guides on attendance, GPS and HR ops.',
            [
              'How GPS geofencing reduces buddy punching.',
              'Choosing biometric vs face verification for offices.',
              'Building dashboards managers actually open every morning.',
              'More articles coming soon — follow us on social for updates.',
            ],
          ),
      };

  @override
  Widget build(BuildContext context) {
    // Always serve the full GDPR policy (never the short stub).
    if (slug == WebLegalSlug.privacy) {
      return const WebPrivacyPolicyPage();
    }

    final w = MediaQuery.sizeOf(context).width;
    final data = _content;
    final paragraphs = List<String>.from(data.$3);

    return Theme(
      data: ThemeData(
        brightness: Brightness.light,
        scaffoldBackgroundColor: const Color(0xFFF5F7FA),
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: AppColors.primary,
          brightness: Brightness.light,
        ),
      ),
      child: Scaffold(
        backgroundColor: const Color(0xFFF5F7FA),
        body: Column(
          children: [
            WebSiteHeader(
              current: slug == WebLegalSlug.features
                  ? WebSitePage.features
                  : slug == WebLegalSlug.blog
                      ? WebSitePage.resources
                      : WebSitePage.home,
              compact: w < 980,
            ),
            Expanded(
              child: SingleChildScrollView(
          child: Column(
            children: [
              Padding(
                padding: EdgeInsets.fromLTRB(
                    w < 700 ? 20 : 48, 32, w < 700 ? 20 : 48, 40),
                child: Center(
                  child: ConstrainedBox(
                    constraints: const BoxConstraints(maxWidth: 800),
                    child: WebAos(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            data.$1,
                            style: GoogleFonts.poppins(
                              fontSize: 32,
                              fontWeight: FontWeight.w800,
                              color: const Color(0xFF111827),
                            ),
                          ),
                          const SizedBox(height: 10),
                          Text(
                            data.$2,
                            style: GoogleFonts.poppins(
                              fontSize: 16,
                              height: 1.5,
                              color: const Color(0xFF6B7280),
                            ),
                          ),
                          const SizedBox(height: 28),
                          for (final p in paragraphs) ...[
                            Text(
                              p,
                              style: GoogleFonts.poppins(
                                fontSize: 15,
                                height: 1.65,
                                color: const Color(0xFF374151),
                              ),
                            ),
                            const SizedBox(height: 16),
                          ],
                        ],
                      ),
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
}
