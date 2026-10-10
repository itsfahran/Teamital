import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:web_teamital/app_colors.dart';
import 'package:web_teamital/app_config.dart';
import 'package:web_teamital/config/site_config.dart';
import 'package:web_teamital/web/web_routes.dart';
import 'package:web_teamital/web/web_store_badges.dart';
import 'package:web_teamital/widgets/brand_logo.dart';
import 'package:url_launcher/url_launcher.dart';

/// Shared marketing footer with menus, legal pages, and social icons.
class WebMarketingFooter extends StatelessWidget {
  const WebMarketingFooter({super.key});

  Future<void> _url(String url) async {
    final uri = Uri.tryParse(url);
    if (uri == null) return;
    await launchUrl(uri, mode: LaunchMode.externalApplication);
  }

  @override
  Widget build(BuildContext context) {
    final w = MediaQuery.sizeOf(context).width;
    final site = SiteConfig.publicSiteUrl;

    return Container(
      width: double.infinity,
      color: const Color(0xFF0F172A),
      padding: EdgeInsets.fromLTRB(w < 700 ? 20 : 48, 48, w < 700 ? 20 : 48, 36),
      child: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 1100),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              LayoutBuilder(builder: (context, c) {
                final cols = c.maxWidth >= 900
                    ? 5
                    : c.maxWidth >= 640
                        ? 2
                        : 1;
                final gap = 24.0;
                final itemW = cols == 1
                    ? c.maxWidth
                    : (c.maxWidth - gap * (cols - 1)) / cols;
                return Wrap(
                  spacing: gap,
                  runSpacing: 28,
                  children: [
                    SizedBox(
                      width: itemW,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 12,
                              vertical: 10,
                            ),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: const BrandLogo.header(height: 72),
                          ),
                          const SizedBox(height: 12),
                          Text(
                            'Teamital - Complete Workforce Intelligence in One Place',
                            style: GoogleFonts.poppins(
                              color: Colors.white60,
                              fontSize: 13,
                              height: 1.5,
                            ),
                          ),
                        ],
                      ),
                    ),
                    SizedBox(
                      width: itemW,
                      child: _col(context, 'Product', [
                        ('Features', () => WebRoutes.push(context, WebRoutes.features)),
                        ('How it works', () => WebRoutes.replace(context, WebRoutes.howItWorks)),
                        ('Pricing', () => WebRoutes.replace(context, WebRoutes.pricing)),
                        ('Security', () => WebRoutes.push(context, WebRoutes.security)),
                      ]),
                    ),
                    SizedBox(
                      width: itemW,
                      child: _col(context, 'Company', [
                        ('About', () => WebRoutes.push(context, WebRoutes.about)),
                        ('Contact', () => WebRoutes.replace(context, WebRoutes.contact)),
                        ('Careers', () => WebRoutes.push(context, WebRoutes.careers)),
                        ('Blog', () => WebRoutes.push(context, WebRoutes.blog)),
                      ]),
                    ),
                    SizedBox(
                      width: itemW,
                      child: _col(context, 'Legal', [
                        (
                          'Privacy',
                          () => WebRoutes.push(context, WebRoutes.privacyPolicy),
                        ),
                        (
                          'Terms',
                          () => WebRoutes.push(context, WebRoutes.terms),
                        ),
                        (
                          'Cookies',
                          () => WebRoutes.push(context, WebRoutes.cookies),
                        ),
                        (
                          'Security',
                          () => WebRoutes.push(context, WebRoutes.security),
                        ),
                        (
                          'Delete account',
                          () => WebRoutes.push(context, WebRoutes.deleteAccount),
                        ),
                        (
                          'Sign in',
                          () => WebRoutes.push(context, WebRoutes.signIn),
                        ),
                      ]),
                    ),
                    SizedBox(
                      width: itemW,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Follow us',
                            style: GoogleFonts.poppins(
                              color: Colors.white,
                              fontWeight: FontWeight.w700,
                              fontSize: 14,
                            ),
                          ),
                          const SizedBox(height: 14),
                          Wrap(
                            spacing: 10,
                            runSpacing: 10,
                            children: [
                              _social(Icons.business_center_rounded, 'in',
                                  SiteConfig.socialLinkedIn, const Color(0xFF0A66C2)),
                              _social(Icons.alternate_email_rounded, 'X',
                                  SiteConfig.socialX, const Color(0xFF111827)),
                              _social(Icons.play_circle_fill_rounded, 'YT',
                                  SiteConfig.socialYouTube, const Color(0xFFFF0000)),
                              _social(Icons.facebook_rounded, 'f',
                                  SiteConfig.socialFacebook, const Color(0xFF1877F2)),
                              _social(Icons.camera_alt_rounded, 'IG',
                                  SiteConfig.socialInstagram, const Color(0xFFE1306C)),
                              _social(Icons.push_pin_rounded, 'Pin',
                                  SiteConfig.socialPinterest, const Color(0xFFE60023)),
                              _social(Icons.music_note_rounded, 'TT',
                                  SiteConfig.socialTikTok, const Color(0xFF010101)),
                            ],
                          ),
                          const SizedBox(height: 16),
                          Text(
                            site.replaceFirst(RegExp(r'^https?://'), ''),
                            style: GoogleFonts.poppins(
                                color: Colors.white54, fontSize: 12),
                          ),
                          const SizedBox(height: 12),
                          FilledButton(
                            onPressed: () =>
                                WebRoutes.push(context, WebRoutes.signUp),
                            style: FilledButton.styleFrom(
                              backgroundColor: AppColors.primary,
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 16, vertical: 12),
                            ),
                            child: Text('Get started',
                                style: GoogleFonts.poppins(
                                    fontWeight: FontWeight.w700, fontSize: 13)),
                          ),
                        ],
                      ),
                    ),
                  ],
                );
              }),
              const SizedBox(height: 28),
              SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: const WebStoreBadgeRow(compact: true),
              ),
              const SizedBox(height: 36),
              const Divider(color: Colors.white12),
              const SizedBox(height: 16),
              Text(
                '© ${DateTime.now().year} ${AppConfig.displayName}. All rights reserved.',
                style: GoogleFonts.poppins(color: Colors.white38, fontSize: 12),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _col(
    BuildContext context,
    String title,
    List<(String, VoidCallback)> links,
  ) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: GoogleFonts.poppins(
            color: Colors.white,
            fontWeight: FontWeight.w700,
            fontSize: 14,
          ),
        ),
        const SizedBox(height: 14),
        for (final l in links) ...[
          InkWell(
            onTap: l.$2,
            child: Padding(
              padding: const EdgeInsets.symmetric(vertical: 5),
              child: Text(
                l.$1,
                style: GoogleFonts.poppins(color: Colors.white70, fontSize: 13),
              ),
            ),
          ),
        ],
      ],
    );
  }

  Widget _social(IconData icon, String tip, String url, Color bg) {
    return Tooltip(
      message: tip,
      child: InkWell(
        onTap: () => _url(url),
        borderRadius: BorderRadius.circular(10),
        child: Container(
          width: 40,
          height: 40,
          decoration: BoxDecoration(
            color: bg,
            borderRadius: BorderRadius.circular(10),
            border: Border.all(color: Colors.white24),
          ),
          child: Icon(icon, color: Colors.white, size: 18),
        ),
      ),
    );
  }
}
