import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:web_teamital/app_colors.dart';
import 'package:web_teamital/web/web_footer.dart';

/// Shared long-form legal / policy page chrome (privacy, terms, cookies, security).
class WebLegalPolicyPage extends StatelessWidget {
  const WebLegalPolicyPage({
    super.key,
    required this.title,
    required this.lastUpdated,
    required this.sections,
  });

  final String title;
  final String lastUpdated;
  final List<Widget> sections;

  @override
  Widget build(BuildContext context) {
    final w = MediaQuery.sizeOf(context).width;
    final pad = w < 700 ? 20.0 : 48.0;

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
        appBar: AppBar(
          backgroundColor: Colors.white,
          foregroundColor: const Color(0xFF111827),
          elevation: 0,
          title: Text(
            title,
            style: GoogleFonts.poppins(fontWeight: FontWeight.w700),
          ),
        ),
        body: SingleChildScrollView(
          child: Column(
            children: [
              Padding(
                padding: EdgeInsets.fromLTRB(pad, 32, pad, 40),
                child: Center(
                  child: ConstrainedBox(
                    constraints: const BoxConstraints(maxWidth: 860),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          title,
                          style: GoogleFonts.poppins(
                            fontSize: 34,
                            fontWeight: FontWeight.w800,
                            color: const Color(0xFF111827),
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Last Updated: $lastUpdated',
                          style: GoogleFonts.poppins(
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                            color: AppColors.primary,
                          ),
                        ),
                        const SizedBox(height: 20),
                        ...sections,
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
    );
  }

  static Widget h(String text) {
    return Padding(
      padding: const EdgeInsets.only(top: 28, bottom: 12),
      child: Text(
        text,
        style: GoogleFonts.poppins(
          fontSize: 20,
          fontWeight: FontWeight.w700,
          color: const Color(0xFF111827),
        ),
      ),
    );
  }

  static Widget p(String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Text(
        text,
        style: GoogleFonts.poppins(
          fontSize: 15,
          height: 1.65,
          color: const Color(0xFF374151),
        ),
      ),
    );
  }

  static Widget bullets(List<String> items) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12, left: 4),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          for (final item in items)
            Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Padding(
                    padding: const EdgeInsets.only(top: 7),
                    child: Container(
                      width: 6,
                      height: 6,
                      decoration: const BoxDecoration(
                        color: AppColors.masterPrimary,
                        shape: BoxShape.circle,
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      item,
                      style: GoogleFonts.poppins(
                        fontSize: 15,
                        height: 1.6,
                        color: const Color(0xFF374151),
                      ),
                    ),
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }
}
