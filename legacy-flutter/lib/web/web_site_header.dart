import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:web_teamital/app_colors.dart';
import 'package:web_teamital/web/web_routes.dart';
import 'package:web_teamital/web/web_store_badges.dart';
import 'package:web_teamital/widgets/brand_logo.dart';
import 'package:url_launcher/url_launcher.dart';

enum WebSitePage {
  home,
  features,
  solutions,
  platforms,
  howItWorks,
  resources,
  pricing,
  contact,
}

class _MegaItem {
  const _MegaItem(this.icon, this.title, this.subtitle, [this.onTap]);
  final IconData icon;
  final String title;
  final String subtitle;
  /// Null = preview only until owner publishes a CMS page for this item.
  final void Function(BuildContext context)? onTap;
}

class _MegaCol {
  const _MegaCol(this.title, this.items);
  final String title;
  final List<_MegaItem> items;
}

class _MegaMenu {
  const _MegaMenu(this.id, this.label, this.columns);
  final String id;
  final String label;
  final List<_MegaCol> columns;
}

/// Full marketing header with the previous wide mega menus (not tiny dropdowns).
class WebSiteHeader extends StatefulWidget {
  const WebSiteHeader({
    super.key,
    required this.current,
    this.compact = false,
  });

  final WebSitePage current;
  final bool compact;

  @override
  State<WebSiteHeader> createState() => _WebSiteHeaderState();
}

class _WebSiteHeaderState extends State<WebSiteHeader> {
  String? _openMenu;

  Future<void> _openUrl(String url) async {
    final uri = Uri.tryParse(url);
    if (uri == null) return;
    await launchUrl(uri, mode: LaunchMode.externalApplication);
  }

  void _go(String route) {
    _closeMenu();
    if (route == WebRoutes.home) {
      WebRoutes.goHome(context);
      return;
    }
    WebRoutes.replace(context, route);
  }

  void _toggleMenu(String id) {
    setState(() => _openMenu = _openMenu == id ? null : id);
  }

  void _closeMenu() {
    if (_openMenu != null) setState(() => _openMenu = null);
  }

  List<_MegaMenu> get _menus => [
        _MegaMenu('Features', 'Features', [
          _MegaCol('Workforce', [
            const _MegaItem(Icons.fingerprint_rounded, 'Clock in / out',
                'GPS, face & biometric attendance'),
            const _MegaItem(Icons.task_alt_rounded, 'Tasks',
                'Assign work and track progress'),
            const _MegaItem(Icons.beach_access_rounded, 'Leave',
                'Requests, balances & approvals'),
            const _MegaItem(Icons.schedule_rounded, 'Shifts',
                'Schedules your team can trust'),
          ]),
          _MegaCol('Insights', [
            const _MegaItem(Icons.bar_chart_rounded, 'Live dashboards',
                'Realtime hours & attendance charts'),
            const _MegaItem(Icons.assignment_rounded, 'Work summary',
                'Hours, overtime & attendance %'),
            const _MegaItem(Icons.notifications_rounded, 'Alerts',
                'Clock-in reminders & updates'),
          ]),
          _MegaCol('Collaboration', [
            const _MegaItem(Icons.forum_rounded, 'Community & AI',
                'Chat with HR and company teams'),
            const _MegaItem(Icons.support_agent_rounded, 'Help desk',
                'Tickets and support in-app'),
          ]),
        ]),
        _MegaMenu('Solutions', 'Solutions', [
          _MegaCol('Teams', [
            const _MegaItem(Icons.rocket_launch_rounded, 'For Startups',
                'Get attendance live without a big HR team'),
            const _MegaItem(Icons.storefront_rounded, 'For Small Businesses',
                'One place for clock-in, leave and reports'),
            const _MegaItem(Icons.apartment_rounded, 'For Enterprises',
                'Multi-site workforce with role-based access'),
            const _MegaItem(Icons.wifi_rounded, 'For Remote Teams',
                'See who is working, from any location'),
            const _MegaItem(Icons.location_on_rounded, 'For Field Employees',
                'GPS-verified presence on site'),
          ]),
          _MegaCol('Industries', [
            const _MegaItem(Icons.trending_up_rounded, 'For Sales Teams',
                'Track field visits and daily activity'),
            const _MegaItem(Icons.local_shipping_rounded, 'For Delivery Teams',
                'Confirm stops and on-the-road hours'),
            const _MegaItem(Icons.construction_rounded, 'For Construction Companies',
                'Site attendance with geofencing'),
            const _MegaItem(Icons.handyman_rounded, 'For Service Businesses',
                'Technicians, jobs and time on site'),
            const _MegaItem(Icons.precision_manufacturing_rounded, 'For Manufacturing Companies',
                'Shift attendance across factory floors'),
          ]),
        ]),
        _MegaMenu('Platforms', 'Platforms', [
          _MegaCol('Get the app', [
            _MegaItem(Icons.android_rounded, 'Android',
                'Download on Google Play', (_) => _openUrl(WebStoreLinks.playStore)),
            _MegaItem(Icons.apple, 'iOS',
                'Download on the App Store', (_) => _openUrl(WebStoreLinks.appStore)),
            _MegaItem(Icons.desktop_windows_rounded, 'Windows',
                'Install from Microsoft Store',
                (_) => _openUrl(WebStoreLinks.microsoftStore)),
            _MegaItem(Icons.language_rounded, 'Web',
                'Open the browser app',
                (ctx) => WebRoutes.push(ctx, WebRoutes.signIn)),
          ]),
        ]),
        _MegaMenu('Resources', 'Resources', [
          _MegaCol('Learn', [
            const _MegaItem(Icons.article_rounded, 'Blog',
                'Guides on attendance and GPS'),
            const _MegaItem(Icons.menu_book_rounded, 'Guides',
                'How attendance & workforce tools work'),
            const _MegaItem(Icons.new_releases_rounded, 'Product Updates',
                'What is new in Teamital'),
          ]),
          _MegaCol('Support', [
            const _MegaItem(Icons.help_center_rounded, 'Help Center',
                'Get answers and how-to steps'),
            const _MegaItem(Icons.quiz_rounded, 'FAQs',
                'Common questions about the workflow'),
            _MegaItem(Icons.mail_outline_rounded, 'Contact Support',
                'Reach our support inbox', (_) => _go(WebRoutes.contact)),
          ]),
        ]),
      ];

  @override
  Widget build(BuildContext context) {
    final compact = widget.compact;
    return Material(
      color: Colors.white,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            height: compact ? 88 : 118,
            padding: EdgeInsets.symmetric(horizontal: compact ? 16 : 28),
            decoration: const BoxDecoration(
              border: Border(bottom: BorderSide(color: Color(0xFFE5E7EB))),
            ),
            child: compact
                ? Row(
                    children: [
                      InkWell(
                        onTap: () => _go(WebRoutes.home),
                        borderRadius: BorderRadius.circular(8),
                        child: const BrandLogo.header(height: 104),
                      ),
                      const Spacer(),
                      IconButton(
                        onPressed: () => _mobileMenu(context),
                        icon: const Icon(Icons.menu_rounded, color: Color(0xFF111827)),
                      ),
                    ],
                  )
                : Row(
                    children: [
                      SizedBox(
                        width: 280,
                        child: Align(
                          alignment: Alignment.centerLeft,
                          child: InkWell(
                            onTap: () => _go(WebRoutes.home),
                            borderRadius: BorderRadius.circular(8),
                            child: const BrandLogo.header(height: 132),
                          ),
                        ),
                      ),
                      Expanded(
                        child: Center(
                          child: SingleChildScrollView(
                            scrollDirection: Axis.horizontal,
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                _link('Home', WebSitePage.home, WebRoutes.home),
                                for (final m in _menus) _menuTab(m),
                                _link(
                                  'How It Works',
                                  WebSitePage.howItWorks,
                                  WebRoutes.howItWorks,
                                ),
                                _link(
                                  'Pricing',
                                  WebSitePage.pricing,
                                  WebRoutes.pricing,
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                      SizedBox(
                        width: 280,
                        child: Align(
                          alignment: Alignment.centerRight,
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              TextButton(
                                onPressed: () =>
                                    WebRoutes.push(context, WebRoutes.signIn),
                                child: Text(
                                  'Sign in',
                                  style: GoogleFonts.poppins(
                                    fontWeight: FontWeight.w600,
                                    fontSize: 13,
                                  ),
                                ),
                              ),
                              const SizedBox(width: 6),
                              FilledButton(
                                onPressed: () =>
                                    WebRoutes.push(context, WebRoutes.signUp),
                                style: FilledButton.styleFrom(
                                  backgroundColor: AppColors.primary,
                                  foregroundColor: Colors.white,
                                  padding: const EdgeInsets.symmetric(
                                      horizontal: 16, vertical: 12),
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                ),
                                child: Text(
                                  'Start free trial',
                                  style: GoogleFonts.poppins(
                                    fontWeight: FontWeight.w700,
                                    fontSize: 13,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
          ),
          if (_openMenu != null && !compact) _megaPanel(_openMenu!),
        ],
      ),
    );
  }

  Widget _menuTab(_MegaMenu menu) {
    final open = _openMenu == menu.id;
    final active = open ||
        (menu.id == 'Features' && widget.current == WebSitePage.features) ||
        (menu.id == 'Solutions' && widget.current == WebSitePage.solutions) ||
        (menu.id == 'Platforms' && widget.current == WebSitePage.platforms) ||
        (menu.id == 'Resources' && widget.current == WebSitePage.resources);
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 2),
      child: InkWell(
        onTap: () => _toggleMenu(menu.id),
        borderRadius: BorderRadius.circular(10),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 160),
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
          decoration: BoxDecoration(
            color: active ? const Color(0xFFDBEAFE) : Colors.transparent,
            borderRadius: BorderRadius.circular(10),
          ),
          child: Row(
            children: [
              Text(
                menu.label,
                style: GoogleFonts.poppins(
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                  color: active ? AppColors.primary : const Color(0xFF111827),
                ),
              ),
              Icon(
                open
                    ? Icons.keyboard_arrow_up_rounded
                    : Icons.keyboard_arrow_down_rounded,
                size: 18,
                color: active ? AppColors.primary : const Color(0xFF6B7280),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _link(String label, WebSitePage page, String route) {
    final active = widget.current == page;
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 2),
      child: InkWell(
        onTap: () => _go(route),
        borderRadius: BorderRadius.circular(10),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
          decoration: BoxDecoration(
            color: active ? const Color(0xFFDBEAFE) : Colors.transparent,
            borderRadius: BorderRadius.circular(10),
          ),
          child: Text(
            label,
            style: GoogleFonts.poppins(
              fontSize: 13,
              fontWeight: FontWeight.w600,
              color: active ? AppColors.primary : const Color(0xFF111827),
            ),
          ),
        ),
      ),
    );
  }

  Widget _megaPanel(String id) {
    final menu = _menus.firstWhere((m) => m.id == id);
    return Material(
      elevation: 16,
      color: Colors.white,
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.fromLTRB(28, 24, 28, 28),
        decoration: const BoxDecoration(
          border: Border(bottom: BorderSide(color: Color(0xFFE5E7EB))),
        ),
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 1040),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                for (var i = 0; i < menu.columns.length; i++) ...[
                  if (i > 0)
                    Container(
                      width: 1,
                      height: 220,
                      margin: const EdgeInsets.symmetric(horizontal: 20),
                      color: const Color(0xFFE5E7EB),
                    ),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          menu.columns[i].title.toUpperCase(),
                          style: GoogleFonts.poppins(
                            fontSize: 11,
                            fontWeight: FontWeight.w700,
                            color: AppColors.primary,
                            letterSpacing: 1.1,
                          ),
                        ),
                        const SizedBox(height: 14),
                        for (final item in menu.columns[i].items)
                          _megaRow(item),
                      ],
                    ),
                  ),
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _megaRow(_MegaItem item) {
    final clickable = item.onTap != null;
    final row = Padding(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
      child: Row(
        children: [
          Container(
            width: 36,
            height: 36,
            decoration: BoxDecoration(
              color: const Color(0xFFDBEAFE),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(item.icon, size: 18, color: AppColors.primary),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  item.title,
                  style: GoogleFonts.poppins(
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    color: clickable
                        ? const Color(0xFF111827)
                        : const Color(0xFF374151),
                  ),
                ),
                Text(
                  item.subtitle,
                  style: GoogleFonts.poppins(
                    fontSize: 12,
                    color: const Color(0xFF6B7280),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: clickable
          ? InkWell(
              onTap: () => item.onTap!(context),
              borderRadius: BorderRadius.circular(12),
              child: row,
            )
          : row,
    );
  }

  void _mobileMenu(BuildContext context) {
    showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(20, 16, 20, 24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const BrandLogo.header(height: 108),
              ListTile(
                title: const Text('Home'),
                onTap: () {
                  Navigator.pop(ctx);
                  _go(WebRoutes.home);
                },
              ),
              for (final m in _menus)
                for (final col in m.columns)
                  for (final item in col.items)
                    ListTile(
                      leading: Icon(item.icon, color: AppColors.primary),
                      title: Text(item.title),
                      subtitle: Text(item.subtitle),
                      enabled: item.onTap != null,
                      onTap: item.onTap == null
                          ? null
                          : () {
                              Navigator.pop(ctx);
                              item.onTap!(context);
                            },
                    ),
              ListTile(
                title: const Text('How It Works'),
                onTap: () {
                  Navigator.pop(ctx);
                  _go(WebRoutes.howItWorks);
                },
              ),
              ListTile(
                title: const Text('Pricing'),
                onTap: () {
                  Navigator.pop(ctx);
                  _go(WebRoutes.pricing);
                },
              ),
              const Divider(),
              OutlinedButton(
                onPressed: () {
                  Navigator.pop(ctx);
                  WebRoutes.push(context, WebRoutes.signIn);
                },
                child: const Text('Sign in'),
              ),
              const SizedBox(height: 8),
              FilledButton(
                onPressed: () {
                  Navigator.pop(ctx);
                  WebRoutes.push(context, WebRoutes.signUp);
                },
                style: FilledButton.styleFrom(
                  backgroundColor: AppColors.primary,
                ),
                child: const Text('Start free trial'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
