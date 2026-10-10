import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:web_teamital/app_colors.dart';
import 'package:web_teamital/app_config.dart';
import 'package:web_teamital/web/cms_content_service.dart';
import 'package:web_teamital/web/web_aos.dart';
import 'package:web_teamital/web/web_footer.dart';
import 'package:web_teamital/web/web_home_slots.dart';
import 'package:web_teamital/web/web_routes.dart';
import 'package:web_teamital/web/web_seo.dart';
import 'package:web_teamital/web/web_site_header.dart';
import 'package:web_teamital/web/web_store_badges.dart';
import 'package:web_teamital/web/web_typewriter.dart';
import 'package:web_teamital/widgets/brand_logo.dart';
import 'dart:async';

/// Public marketing home — **web only**, always light mode.
class WebHomePage extends StatefulWidget {
  const WebHomePage({super.key});

  @override
  State<WebHomePage> createState() => _WebHomePageState();
}

class _WebHomePageState extends State<WebHomePage> {
  final _scroll = ScrollController();
  StreamSubscription<Map<String, CmsPageContent>>? _cmsSub;
  CmsPageContent? _homeCms;

  @override
  void initState() {
    super.initState();
    final cms = CmsContentService.instance;
    _cmsSub = cms.pagesStream.listen((pages) {
      if (!mounted) return;
      setState(() => _homeCms = pages['home']);
      WebSeo.applyForPath(WebRoutes.home);
    });
    _homeCms = cms.page('home');
    WebSeo.applyForPath(WebRoutes.home);
    cms.start();
  }

  static const _menus = <_NavMenu>[
    _NavMenu(
      id: 'Product',
      label: 'Product',
      columns: [
        _MegaCol(title: 'Workforce', items: [
          _MegaItem(Icons.fingerprint_rounded, 'Clock in / out',
              'GPS, face & biometric attendance'),
          _MegaItem(Icons.task_alt_rounded, 'Tasks',
              'Assign work and track progress'),
          _MegaItem(Icons.beach_access_rounded, 'Leave',
              'Requests, balances & approvals'),
          _MegaItem(Icons.schedule_rounded, 'Shifts',
              'Schedules your team can trust'),
        ]),
        _MegaCol(title: 'Insights', items: [
          _MegaItem(Icons.bar_chart_rounded, 'Live dashboards',
              'Realtime hours & attendance charts'),
          _MegaItem(Icons.assignment_rounded, 'Work summary',
              'Hours, overtime & attendance %'),
          _MegaItem(Icons.notifications_rounded, 'Alerts',
              'Clock-in reminders & updates'),
        ]),
        _MegaCol(title: 'Collaboration', items: [
          _MegaItem(Icons.forum_rounded, 'Community & AI',
              'Chat with HR and company teams'),
          _MegaItem(Icons.support_agent_rounded, 'Help desk',
              'Tickets and support in-app'),
        ]),
      ],
    ),
    _NavMenu(
      id: 'Solutions',
      label: 'Solutions',
      columns: [
        _MegaCol(title: 'By role', items: [
          _MegaItem(Icons.business_rounded, 'Companies',
              'Manage teams, attendance & payroll-ready data'),
          _MegaItem(Icons.badge_rounded, 'Employees',
              'Clock in, tasks, leave & chat'),
          _MegaItem(Icons.hub_rounded, 'White label',
              'Partner portals with your brand'),
        ]),
        _MegaCol(title: 'By need', items: [
          _MegaItem(Icons.location_on_rounded, 'Field teams',
              'GPS-verified presence on site'),
          _MegaItem(Icons.apartment_rounded, 'Offices',
              'Biometric + desk-friendly workflows'),
          _MegaItem(Icons.devices_rounded, 'Multi-device',
              'Web, mobile & desktop together'),
        ]),
      ],
    ),
    _NavMenu(
      id: 'Resources',
      label: 'Resources',
      columns: [
        _MegaCol(title: 'Learn', items: [
          _MegaItem(Icons.menu_book_rounded, 'Product guide',
              'How attendance & workforce tools work'),
          _MegaItem(Icons.security_rounded, 'Security',
              'Auth, roles & data protection basics'),
        ]),
        _MegaCol(title: 'Support', items: [
          _MegaItem(Icons.mail_outline_rounded, 'Contact',
              'Reach our support inbox'),
          _MegaItem(Icons.public_rounded, 'Website', 'teamital.com'),
        ]),
      ],
    ),
  ];

  String? _openMenu;
  void _toggleMenu(String id) =>
      setState(() => _openMenu = _openMenu == id ? null : id);
  void _closeMenu() {
    if (_openMenu != null) setState(() => _openMenu = null);
  }

  void _goSignIn() => WebRoutes.push(context, WebRoutes.signIn);

  void _goSignUp() => WebRoutes.push(context, WebRoutes.signUp);

  void _goPricing() => WebRoutes.replace(context, WebRoutes.pricing);

  void _goContact() => WebRoutes.replace(context, WebRoutes.contact);

  void _openHref(String href, {required bool primary}) {
    final h = href.trim();
    if (h.isEmpty || h.startsWith('http://') || h.startsWith('https://')) {
      if (primary) {
        _goSignUp();
      } else {
        _goContact();
      }
      return;
    }
    WebRoutes.push(context, h.startsWith('/') ? h : '/$h');
  }

  @override
  void dispose() {
    _cmsSub?.cancel();
    _scroll.dispose();
    super.dispose();
  }
  @override
  Widget build(BuildContext context) {
    final w = MediaQuery.sizeOf(context).width;
    final compact = w < 980;

    // Home page is always light — ignore app dark theme.
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
        body: CustomScrollView(
                controller: _scroll,
                slivers: [
                  SliverToBoxAdapter(
                    child: WebSiteHeader(
                      current: WebSitePage.home,
                      compact: compact,
                    ),
                  ),
                  SliverToBoxAdapter(
                      child: WebAos(child: _hero(w))),
                  SliverToBoxAdapter(
                      child: WebAos(
                          delay: const Duration(milliseconds: 80),
                          child: _platforms())),
                  SliverToBoxAdapter(child: WebAos(child: _section2(w))),
                  SliverToBoxAdapter(child: WebAos(child: _section3(w))),
                  SliverToBoxAdapter(child: WebAos(child: _slotOr(4, _roles(w), w))),
                  SliverToBoxAdapter(child: WebAos(child: _slotOr(5, _security(w), w))),
                  SliverToBoxAdapter(child: WebAos(child: _slotOr(6, _testimonials(w), w))),
                  SliverToBoxAdapter(child: WebAos(child: _slotOr(7, _whyUs(w), w))),
                  SliverToBoxAdapter(child: WebAos(child: _slotOr(8, _integrations(w), w))),
                  SliverToBoxAdapter(child: WebAos(child: _slotOr(9, _statsBand(w), w))),
                  SliverToBoxAdapter(child: WebAos(child: _faq(w))),
                  SliverToBoxAdapter(child: WebAos(child: _slotOr(10, _ctaBand(), w))),
                  const SliverToBoxAdapter(child: WebMarketingFooter()),
                ],
        ),
      ),
    );
  }

  // ── Header ───────────────────────────────────────────────────────────────
  Widget _header(bool compact) {
    return Material(
      color: Colors.white,
      child: Container(
        height: 72,
        padding: EdgeInsets.symmetric(horizontal: compact ? 16 : 28),
        decoration: const BoxDecoration(
          border: Border(bottom: BorderSide(color: Color(0xFFE5E7EB))),
        ),
        child: Row(
          children: [
            InkWell(
              onTap: () {
                _closeMenu();
                _scroll.animateTo(0,
                    duration: const Duration(milliseconds: 350),
                    curve: Curves.easeOut);
              },
              borderRadius: BorderRadius.circular(10),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const BrandLogo.header(height: 108),
                ],
              ),
            ),
            if (!compact) ...[
              const Spacer(),
              Row(
                mainAxisSize: MainAxisSize.min,
                children: _menus.map((m) {
                  final open = _openMenu == m.id;
                  return Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 4),
                    child: InkWell(
                      onTap: () => _toggleMenu(m.id),
                      borderRadius: BorderRadius.circular(10),
                      child: AnimatedContainer(
                        duration: const Duration(milliseconds: 160),
                        padding: const EdgeInsets.symmetric(
                            horizontal: 14, vertical: 10),
                        decoration: BoxDecoration(
                          color: open
                              ? const Color(0xFFDBEAFE)
                              : Colors.transparent,
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: Row(
                          children: [
                            Text(
                              m.label,
                              style: GoogleFonts.poppins(
                                fontSize: 13,
                                fontWeight: FontWeight.w600,
                                color: open
                                    ? AppColors.primary
                                    : const Color(0xFF111827),
                              ),
                            ),
                            Icon(
                              open
                                  ? Icons.keyboard_arrow_up_rounded
                                  : Icons.keyboard_arrow_down_rounded,
                              size: 18,
                              color: open
                                  ? AppColors.primary
                                  : const Color(0xFF6B7280),
                            ),
                          ],
                        ),
                      ),
                    ),
                  );
                }).toList(),
              ),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 4),
                child: InkWell(
                  onTap: () {
                    _closeMenu();
                    _goPricing();
                  },
                  borderRadius: BorderRadius.circular(10),
                  child: Padding(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 14, vertical: 10),
                    child: Text(
                      'Pricing',
                      style: GoogleFonts.poppins(
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                        color: const Color(0xFF111827),
                      ),
                    ),
                  ),
                ),
              ),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 4),
                child: InkWell(
                  onTap: () {
                    _closeMenu();
                    _goContact();
                  },
                  borderRadius: BorderRadius.circular(10),
                  child: Padding(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 14, vertical: 10),
                    child: Text(
                      'Contact',
                      style: GoogleFonts.poppins(
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                        color: const Color(0xFF111827),
                      ),
                    ),
                  ),
                ),
              ),
              const Spacer(),
            ] else
              const Spacer(),
            if (compact)
              IconButton(
                onPressed: _showMobileNav,
                icon: const Icon(Icons.menu_rounded, color: Color(0xFF111827)),
              )
            else ...[
              TextButton(
                onPressed: _goSignIn,
                child: Text('Sign in',
                    style: GoogleFonts.poppins(
                        fontWeight: FontWeight.w600, fontSize: 13)),
              ),
              const SizedBox(width: 8),
              FilledButton(
                onPressed: _goSignUp,
                style: FilledButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  foregroundColor: Colors.white,
                  padding:
                      const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12)),
                ),
                child: Text('Start free trial',
                    style: GoogleFonts.poppins(
                        fontWeight: FontWeight.w700, fontSize: 13)),
              ),
            ],
          ],
        ),
      ),
    );
  }

  void _showMobileNav() {
    showModalBottomSheet<void>(
      context: context,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(20, 16, 20, 24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              ..._menus.map((m) => ListTile(
                    title: Text(m.label,
                        style:
                            GoogleFonts.poppins(fontWeight: FontWeight.w600)),
                    onTap: () {
                      Navigator.pop(ctx);
                      _goSignUp();
                    },
                  )),
              ListTile(
                title: Text('Pricing',
                    style: GoogleFonts.poppins(fontWeight: FontWeight.w600)),
                onTap: () {
                  Navigator.pop(ctx);
                  _goPricing();
                },
              ),
              ListTile(
                title: Text('Contact',
                    style: GoogleFonts.poppins(fontWeight: FontWeight.w600)),
                onTap: () {
                  Navigator.pop(ctx);
                  _goContact();
                },
              ),
              OutlinedButton(
                  onPressed: () {
                    Navigator.pop(ctx);
                    _goSignIn();
                  },
                  child: const Text('Sign in')),
              const SizedBox(height: 8),
              FilledButton(
                onPressed: () {
                  Navigator.pop(ctx);
                  _goSignUp();
                },
                style:
                    FilledButton.styleFrom(backgroundColor: AppColors.primary),
                child: const Text('Start free trial'),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _megaPanel(String id) {
    final menu = _menus.firstWhere((m) => m.id == id);
    return Center(
      child: GestureDetector(
        onTap: () {},
        child: Material(
          elevation: 16,
          borderRadius: BorderRadius.circular(20),
          color: Colors.white,
          child: Container(
            constraints: const BoxConstraints(maxWidth: 920),
            margin: const EdgeInsets.symmetric(horizontal: 24),
            padding: const EdgeInsets.fromLTRB(28, 24, 28, 28),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: const Color(0xFFE5E7EB)),
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                for (var i = 0; i < menu.columns.length; i++) ...[
                  if (i > 0)
                    Container(
                      width: 1,
                      height: 200,
                      margin: const EdgeInsets.symmetric(horizontal: 18),
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
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: InkWell(
        onTap: () {
          _closeMenu();
          if (item.title == 'Contact') {
            _goContact();
          } else {
            _goSignUp();
          }
        },
        borderRadius: BorderRadius.circular(12),
        child: Padding(
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
                    Text(item.title,
                        style: GoogleFonts.poppins(
                            fontSize: 13, fontWeight: FontWeight.w600)),
                    Text(item.subtitle,
                        style: GoogleFonts.poppins(
                            fontSize: 12, color: const Color(0xFF6B7280))),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // ── Hero + mockup ────────────────────────────────────────────────────────
  String get _heroVariant {
    final v = _homeCms?.heroVariant.trim() ?? '';
    if (v.isEmpty) return 'split-product';
    return v;
  }

  Widget _hero(double w) {
    final narrow = w < 960;
    final variant = _heroVariant;
    if (variant == 'center-icons') return _heroPrivacy(w);
    if (variant == 'split-map') return _heroWorkforce(w);
    if (variant == 'ops-dashboard') return _heroOps(w);
    return Container(
      width: double.infinity,
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFFEFF6FF), Color(0xFFFFFFFF), Color(0xFFF0F9FF)],
        ),
      ),
      padding: EdgeInsets.fromLTRB(
          narrow ? 20 : 48, narrow ? 36 : 56, narrow ? 20 : 48, 40),
      child: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 1140),
          child: narrow
              ? Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _heroCopy(),
                    const SizedBox(height: 28),
                    _heroVisual(variant),
                  ],
                )
              : Row(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Expanded(flex: 5, child: _heroCopy(center: false)),
                    const SizedBox(width: 36),
                    Expanded(flex: 5, child: _heroVisual(variant)),
                  ],
                ),
        ),
      ),
    );
  }

  Widget _heroVisual(String variant) {
    if (variant == 'split-dashboard') return _heroDashboardCard();
    if (variant == 'split-map') return _heroMapCard();
    return _heroMockup();
  }

  String get _heroTitle {
    final h = _homeCms?.h1.trim() ?? '';
    if (h.isNotEmpty) return h;
    if (_heroVariant == 'split-map') {
      return 'Track, manage, and optimize your workforce';
    }
    if (_heroVariant == 'ops-dashboard') {
      return 'See how your team spends the day';
    }
    return 'Automatic time tracking built for privacy';
  }

  String get _heroBlurb {
    final b = _homeCms?.body.trim() ?? '';
    if (b.isNotEmpty) return b;
    if (_heroVariant == 'split-map') {
      return 'Keep tabs on your team while they are clocked in, with live location.';
    }
    if (_heroVariant == 'ops-dashboard') {
      return 'Live attendance, breaks, and hours in one view, so you know who is on site.';
    }
    return 'See the day as it happens, and keep activity data private.';
  }

  Widget _heroPrivacy(double w) {
    final narrow = w < 1100;
    final headerH = narrow ? 88.0 : 118.0;
    final screenH = MediaQuery.sizeOf(context).height;
    final heroH = (screenH - headerH).clamp(680.0, 960.0);
    final titleSize = narrow ? 36.0 : (w >= 1400 ? 68.0 : 60.0);
    return Container(
      width: double.infinity,
      height: heroH,
      color: Colors.white,
      child: Stack(
        children: [
          if (!narrow)
            Positioned.fill(
              child: CustomPaint(
                painter: _IconLinkPainter(heroH: heroH),
              ),
            ),
          if (!narrow) ..._privacyEdgeIcons(heroH),
          Center(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 28),
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 760),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      _heroTitle,
                      textAlign: TextAlign.center,
                      style: GoogleFonts.poppins(
                        fontSize: titleSize,
                        height: 1.05,
                        fontWeight: FontWeight.w800,
                        color: const Color(0xFF111827),
                      ),
                    ),
                    const SizedBox(height: 20),
                    Text(
                      _heroBlurb,
                      textAlign: TextAlign.center,
                      style: GoogleFonts.poppins(
                        fontSize: narrow ? 16 : 18,
                        height: 1.55,
                        color: const Color(0xFF6B7280),
                      ),
                    ),
                    const SizedBox(height: 28),
                    _HeroPill(
                      label: (_homeCms?.buttonLabel.trim().isNotEmpty ?? false)
                          ? _homeCms!.buttonLabel
                          : 'Start free 14-day trial',
                      filled: true,
                      large: true,
                      onPressed: () => _openHref(_homeCms?.buttonHref ?? '', primary: true),
                    ),
                    const SizedBox(height: 14),
                    Text(
                      'No credit card required',
                      style: GoogleFonts.poppins(fontSize: 14, color: const Color(0xFF6B7280)),
                    ),
                    if (narrow) ...[
                      const SizedBox(height: 28),
                      const Wrap(
                        alignment: WrapAlignment.center,
                        spacing: 12,
                        runSpacing: 12,
                        children: [
                          _FloatIcon(Icons.assignment_rounded, Color(0xFF7C3AED)),
                          _FloatIcon(Icons.schedule_rounded, Color(0xFF7C3AED)),
                          _FloatIcon(Icons.location_on_rounded, Color(0xFF16A34A)),
                          _FloatIcon(Icons.mail_outline_rounded, Color(0xFFDB2777)),
                          _FloatIcon(Icons.forum_rounded, Color(0xFFF59E0B)),
                          _FloatIcon(Icons.public_rounded, Color(0xFF7C3AED)),
                          _FloatIcon(Icons.bar_chart_rounded, Color(0xFFF59E0B)),
                          _FloatIcon(Icons.fingerprint_rounded, Color(0xFF16A34A)),
                        ],
                      ),
                    ],
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  List<Widget> _privacyEdgeIcons(double heroH) {
    const left = <(IconData, Color)>[
      (Icons.assignment_rounded, Color(0xFF7C3AED)),
      (Icons.schedule_rounded, Color(0xFF7C3AED)),
      (Icons.location_on_rounded, Color(0xFF16A34A)),
      (Icons.mail_outline_rounded, Color(0xFFDB2777)),
      (Icons.forum_rounded, Color(0xFFF59E0B)),
    ];
    const right = <(IconData, Color)>[
      (Icons.public_rounded, Color(0xFF7C3AED)),
      (Icons.devices_rounded, Color(0xFFDB2777)),
      (Icons.bar_chart_rounded, Color(0xFFF59E0B)),
      (Icons.security_rounded, Color(0xFF2563EB)),
      (Icons.fingerprint_rounded, Color(0xFF16A34A)),
    ];
    const ys = <double>[0.08, 0.26, 0.46, 0.66, 0.84];
    const xs = <double>[28, 108, 20, 120, 48];
    return [
      for (var i = 0; i < left.length; i++)
        Positioned(
          left: xs[i],
          top: heroH * ys[i],
          child: _FloatIcon(left[i].$1, left[i].$2),
        ),
      for (var i = 0; i < right.length; i++)
        Positioned(
          right: xs[i],
          top: heroH * ys[i],
          child: _FloatIcon(right[i].$1, right[i].$2),
        ),
    ];
  }

  Widget _heroWorkforce(double w) {
    final narrow = w < 960;
    final copy = Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          _heroTitle,
          style: GoogleFonts.poppins(
            fontSize: narrow ? 34 : 48,
            height: 1.05,
            fontWeight: FontWeight.w800,
            color: const Color(0xFF111827),
          ),
        ),
        const SizedBox(height: 16),
        Text(
          _heroBlurb,
          style: GoogleFonts.poppins(fontSize: 16, height: 1.5, color: const Color(0xFF6B7280)),
        ),
        const SizedBox(height: 22),
        Wrap(
          spacing: 12,
          runSpacing: 12,
          crossAxisAlignment: WrapCrossAlignment.center,
          children: [
            _HeroPill(
              label: (_homeCms?.buttonLabel.trim().isNotEmpty ?? false)
                  ? _homeCms!.buttonLabel
                  : 'Create a free account',
              filled: true,
              onPressed: () => _openHref(_homeCms?.buttonHref ?? '', primary: true),
            ),
            _HeroPill(
              label: (_homeCms?.button2Label.trim().isNotEmpty ?? false)
                  ? _homeCms!.button2Label
                  : 'Request a free demo',
              filled: false,
              onPressed: () => _openHref(_homeCms?.button2Href ?? '', primary: false),
            ),
          ],
        ),
      ],
    );
    final visual = const _HeroSignInArt();
    return Container(
      width: double.infinity,
      color: Colors.white,
      padding: EdgeInsets.fromLTRB(narrow ? 20 : 56, 48, narrow ? 20 : 56, 40),
      child: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 1140),
          child: narrow
              ? Column(crossAxisAlignment: CrossAxisAlignment.start, children: [copy, const SizedBox(height: 28), visual])
              : Row(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Expanded(flex: 5, child: copy),
                    const SizedBox(width: 28),
                    Expanded(flex: 5, child: visual),
                  ],
                ),
        ),
      ),
    );
  }

  Widget _heroOps(double w) {
    final narrow = w < 960;
    final copy = Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          _heroTitle,
          style: GoogleFonts.poppins(
            fontSize: narrow ? 34 : 48,
            height: 1.08,
            fontWeight: FontWeight.w800,
            color: const Color(0xFF111827),
          ),
        ),
        const SizedBox(height: 16),
        Text(
          _heroBlurb,
          style: GoogleFonts.poppins(fontSize: 16, height: 1.55, color: const Color(0xFF6B7280)),
        ),
        const SizedBox(height: 22),
        Wrap(
          spacing: 12,
          runSpacing: 12,
          crossAxisAlignment: WrapCrossAlignment.center,
          children: [
            _HeroPill(
              label: (_homeCms?.buttonLabel.trim().isNotEmpty ?? false)
                  ? _homeCms!.buttonLabel
                  : 'Book a demo',
              filled: true,
              onPressed: () => _openHref(_homeCms?.buttonHref ?? '/contact', primary: false),
            ),
            _HeroPill(
              label: (_homeCms?.button2Label.trim().isNotEmpty ?? false)
                  ? _homeCms!.button2Label
                  : 'Start free trial',
              filled: false,
              onPressed: () => _openHref(_homeCms?.button2Href ?? '/sign-up', primary: true),
            ),
          ],
        ),
        const SizedBox(height: 12),
        Text(
          'No credit card required',
          style: GoogleFonts.poppins(fontSize: 12, color: const Color(0xFF9CA3AF)),
        ),
      ],
    );
    return Container(
      width: double.infinity,
      color: const Color(0xFFF8FAFC),
      padding: EdgeInsets.fromLTRB(narrow ? 20 : 56, 56, narrow ? 20 : 48, 48),
      child: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 1140),
          child: narrow
              ? Column(crossAxisAlignment: CrossAxisAlignment.start, children: [copy, const SizedBox(height: 28), _opsBoard()])
              : Row(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Expanded(flex: 5, child: copy),
                    const SizedBox(width: 28),
                    Expanded(flex: 6, child: _opsBoard()),
                  ],
                ),
        ),
      ),
    );
  }

  Widget _opsBoard() {
    Widget row(String name, String pct, Color pctColor, double bar) {
      return Padding(
        padding: const EdgeInsets.symmetric(vertical: 6),
        child: Row(
          children: [
            CircleAvatar(radius: 14, backgroundColor: const Color(0xFFDBEAFE), child: Text(name[0], style: GoogleFonts.poppins(fontSize: 12, fontWeight: FontWeight.w700, color: AppColors.masterPrimary))),
            const SizedBox(width: 8),
            SizedBox(width: 88, child: Text(name, style: GoogleFonts.poppins(fontSize: 12, fontWeight: FontWeight.w600))),
            Text(pct, style: GoogleFonts.poppins(fontSize: 11, color: pctColor, fontWeight: FontWeight.w700)),
            const SizedBox(width: 8),
            Expanded(
              child: Align(
                alignment: Alignment.centerLeft,
                child: FractionallySizedBox(
                  widthFactor: bar,
                  child: Container(height: 8, decoration: BoxDecoration(color: AppColors.masterPrimary, borderRadius: BorderRadius.circular(8))),
                ),
              ),
            ),
          ],
        ),
      );
    }

    return SizedBox(
      height: 420,
      child: Stack(
        children: [
          Positioned(
            left: 0,
            right: 24,
            top: 10,
            child: Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                boxShadow: const [BoxShadow(color: Color(0x141A56DB), blurRadius: 28, offset: Offset(0, 12))],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Activities', style: GoogleFonts.poppins(fontWeight: FontWeight.w700)),
                  const SizedBox(height: 4),
                  Text('On site  ·  Break  ·  Late', style: GoogleFonts.poppins(fontSize: 11, color: const Color(0xFF9CA3AF))),
                  const SizedBox(height: 8),
                  row('Ayesha', '92%', const Color(0xFF16A34A), 0.86),
                  row('Hamza', '34%', const Color(0xFFEF4444), 0.34),
                  row('Sara', '76%', AppColors.masterPrimary, 0.7),
                ],
              ),
            ),
          ),
          Positioned(
            right: 0,
            top: 150,
            child: Container(
              width: 180,
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                boxShadow: const [BoxShadow(color: Color(0x1A1A56DB), blurRadius: 18, offset: Offset(0, 8))],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Work time', style: GoogleFonts.poppins(fontSize: 12, color: const Color(0xFF6B7280))),
                  Text('02:43:02', style: GoogleFonts.poppins(fontSize: 22, fontWeight: FontWeight.w800, color: AppColors.masterPrimary)),
                  const SizedBox(height: 6),
                  Text('On site · 92%', style: GoogleFonts.poppins(fontSize: 12, fontWeight: FontWeight.w600)),
                ],
              ),
            ),
          ),
          Positioned(
            left: 8,
            bottom: 0,
            child: Container(
              width: 230,
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                boxShadow: const [BoxShadow(color: Color(0x141A56DB), blurRadius: 16, offset: Offset(0, 8))],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Team hours', style: GoogleFonts.poppins(fontSize: 12, fontWeight: FontWeight.w700)),
                  const SizedBox(height: 8),
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      for (final h in [36.0, 58.0, 44.0, 72.0, 50.0, 66.0])
                        Expanded(
                          child: Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 3),
                            child: Container(
                              height: h,
                              decoration: BoxDecoration(
                                color: h > 60 ? AppColors.masterPrimary : const Color(0xFF93C5FD),
                                borderRadius: BorderRadius.circular(4),
                              ),
                            ),
                          ),
                        ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _heroDashboardCard() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: const Color(0xFFF8FAFC),
        borderRadius: BorderRadius.circular(28),
        border: Border.all(color: const Color(0xFFE5E7EB)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Live attendance',
              style: GoogleFonts.poppins(fontWeight: FontWeight.w700)),
          const SizedBox(height: 16),
          Row(
            children: [
              _stat('96%', 'Present'),
              const SizedBox(width: 10),
              _stat('12', 'Late'),
              const SizedBox(width: 10),
              _stat('4', 'Leave'),
            ],
          ),
          const SizedBox(height: 16),
          ...['William · 8h 12m', 'Sara · 7h 40m', 'Ali · On site']
              .map((line) => Padding(
                    padding: const EdgeInsets.only(bottom: 8),
                    child: Text(line,
                        style: GoogleFonts.poppins(
                            fontSize: 13, color: const Color(0xFF374151))),
                  )),
        ],
      ),
    );
  }

  Widget _stat(String value, String label) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
        ),
        child: Column(
          children: [
            Text(value,
                style: GoogleFonts.poppins(
                    fontSize: 20, fontWeight: FontWeight.w800)),
            Text(label,
                style: GoogleFonts.poppins(
                    fontSize: 12, color: const Color(0xFF6B7280))),
          ],
        ),
      ),
    );
  }

  Widget _heroMapCard() {
    return Container(
      height: 320,
      decoration: BoxDecoration(
        color: const Color(0xFFE0F2FE),
        borderRadius: BorderRadius.circular(28),
        border: Border.all(color: const Color(0xFFBAE6FD)),
      ),
      child: Center(
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.location_on_rounded, color: Color(0xFF2563EB)),
              const SizedBox(width: 8),
              Text('Clocked in · on site',
                  style: GoogleFonts.poppins(fontWeight: FontWeight.w700)),
            ],
          ),
        ),
      ),
    );
  }

  Widget _heroCopy({bool center = false}) {
    final cmsH1 = _homeCms?.h1.trim();
    final cmsBody = _homeCms?.body.trim();
    final primaryLabel = (_homeCms?.buttonLabel.trim().isNotEmpty ?? false)
        ? _homeCms!.buttonLabel
        : 'Get started free';
    final secondaryLabel = (_homeCms?.button2Label.trim().isNotEmpty ?? false)
        ? _homeCms!.button2Label
        : 'Sign in';
    return Column(
      crossAxisAlignment:
          center ? CrossAxisAlignment.center : CrossAxisAlignment.start,
      children: [
        Text(
          AppConfig.displayName,
          style: GoogleFonts.poppins(
            fontSize: 13,
            fontWeight: FontWeight.w700,
            color: AppColors.primary,
          ),
        ),
        const SizedBox(height: 14),
        Text(
          (cmsH1 != null && cmsH1.isNotEmpty)
              ? cmsH1
              : 'Workforce tools that',
          textAlign: center ? TextAlign.center : TextAlign.start,
          style: GoogleFonts.poppins(
            fontSize: 22,
            height: 1.2,
            fontWeight: FontWeight.w600,
            color: const Color(0xFF6B7280),
          ),
        ),
        const SizedBox(height: 6),
        const WebTypewriterHeading(fontSize: 40),
        const SizedBox(height: 16),
        Text(
          (cmsBody != null && cmsBody.isNotEmpty)
              ? cmsBody
              : 'Clock in with GPS and biometrics, manage leave and tasks, '
                  'and see live workforce insights — on every device.',
          style: GoogleFonts.poppins(
            fontSize: 16,
            height: 1.55,
            color: const Color(0xFF6B7280),
          ),
        ),
        const SizedBox(height: 28),
        Wrap(
          alignment: center ? WrapAlignment.center : WrapAlignment.start,
          spacing: 12,
          runSpacing: 12,
          children: [
            FilledButton(
              onPressed: _goSignUp,
              style: FilledButton.styleFrom(
                backgroundColor: AppColors.primary,
                foregroundColor: Colors.white,
                padding:
                    const EdgeInsets.symmetric(horizontal: 22, vertical: 16),
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(14)),
              ),
              child: Text(primaryLabel,
                  style: GoogleFonts.poppins(fontWeight: FontWeight.w700)),
            ),
            OutlinedButton(
              onPressed: _goSignIn,
              style: OutlinedButton.styleFrom(
                foregroundColor: AppColors.primary,
                padding:
                    const EdgeInsets.symmetric(horizontal: 22, vertical: 16),
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(14)),
              ),
              child: Text(secondaryLabel,
                  style: GoogleFonts.poppins(fontWeight: FontWeight.w600)),
            ),
          ],
        ),
        const SizedBox(height: 8),
      ],
    );
  }

  /// Hero visual — chatting mockup SVG.
  Widget _heroMockup() {
    return WebAos(
      fromRight: true,
      child: Container(
        constraints: const BoxConstraints(maxHeight: 420),
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(28),
          border: Border.all(color: const Color(0xFFE5E7EB)),
          boxShadow: [
            BoxShadow(
              color: AppColors.primary.withValues(alpha: 0.14),
              blurRadius: 40,
              offset: const Offset(0, 18),
            ),
          ],
        ),
        child: SvgPicture.asset(
          'assets/undraw_chatting_29rn.svg',
          fit: BoxFit.contain,
          height: 360,
        ),
      ),
    );
  }

  String get _h2Variant => _homeCms?.h2Variant.trim() ?? '';

  String get _h3Variant => _homeCms?.h3Variant.trim() ?? '';

  Widget _h3Why(double w) {
    final narrow = w < 960;
    final title = (_homeCms?.h3Heading.trim().isNotEmpty ?? false)
        ? _homeCms!.h3Heading
        : 'Why time tracking matters';
    final lines = (_homeCms?.h3Items.isNotEmpty ?? false)
        ? _homeCms!.h3Items
        : const [
            'See hours clearly across every team.',
            'Build a record your managers can trust.',
            'Give clients a work log they can check.',
            'Keep attendance ready for review.',
          ];
    final copy = Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: GoogleFonts.poppins(
            fontSize: narrow ? 32 : 44,
            height: 1.1,
            fontWeight: FontWeight.w800,
            color: const Color(0xFF111827),
          ),
        ),
        const SizedBox(height: 18),
        for (final line in lines)
          Padding(
            padding: const EdgeInsets.only(bottom: 10),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Padding(
                  padding: EdgeInsets.only(top: 8),
                  child: Icon(Icons.circle, size: 7, color: Color(0xFF1A56DB)),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(line, style: GoogleFonts.poppins(fontSize: 16, height: 1.45, color: const Color(0xFF374151))),
                ),
              ],
            ),
          ),
        const SizedBox(height: 16),
        _HeroPill(
          label: (_homeCms?.h3Button.trim().isNotEmpty ?? false) ? _homeCms!.h3Button : 'Get started',
          filled: true,
          onPressed: _goSignUp,
        ),
      ],
    );
    final visual = SizedBox(
      height: 360,
      child: Stack(
        children: [
          Positioned.fill(
            child: ClipRRect(
              borderRadius: BorderRadius.circular(24),
              child: Container(
                color: const Color(0xFFEFF6FF),
                padding: const EdgeInsets.all(28),
                alignment: Alignment.center,
                child: Image.asset('assets/screen-signin (1).webp', height: 280, fit: BoxFit.contain),
              ),
            ),
          ),
          Positioned(
            right: 12,
            top: 18,
            child: Container(
              width: 210,
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                boxShadow: const [BoxShadow(color: Color(0x221A56DB), blurRadius: 18, offset: Offset(0, 8))],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('00:21:25', style: GoogleFonts.poppins(fontSize: 22, fontWeight: FontWeight.w800, color: AppColors.masterPrimary)),
                  Text('On site today', style: GoogleFonts.poppins(fontSize: 12, color: const Color(0xFF6B7280))),
                  const SizedBox(height: 10),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(8),
                    child: const LinearProgressIndicator(
                      value: 0.55,
                      minHeight: 8,
                      backgroundColor: Color(0xFFE5E7EB),
                      color: Color(0xFF1A56DB),
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text('55% core work', style: GoogleFonts.poppins(fontSize: 12, fontWeight: FontWeight.w600)),
                ],
              ),
            ),
          ),
        ],
      ),
    );
    return Container(
      width: double.infinity,
      color: Colors.white,
      padding: EdgeInsets.fromLTRB(narrow ? 20 : 56, 28, narrow ? 20 : 56, 40),
      child: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 1140),
          child: narrow
              ? Column(crossAxisAlignment: CrossAxisAlignment.start, children: [copy, const SizedBox(height: 24), visual])
              : Row(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Expanded(flex: 5, child: copy),
                    const SizedBox(width: 36),
                    Expanded(flex: 6, child: visual),
                  ],
                ),
        ),
      ),
    );
  }

  bool _isCustom(String variant) => variant.isNotEmpty && variant != 'original';

  Widget _section2(double w) => _isCustom(_h2Variant) ? _h2Section(w) : _features(w);

  Widget _section3(double w) => _isCustom(_h3Variant) ? _h3Section(w) : _howItWorks(w);

  Widget _slotOr(int n, Widget original, double w) {
    final slot = _homeCms?.slots[n];
    if (slot == null || !_isCustom(slot.variant)) return original;
    final demoFirst = slot.variant == 'ops-board' || slot.variant == 'ask-banner';
    return buildHomeSlot(
      slot,
      w,
      onPrimary: demoFirst ? _goContact : _goSignUp,
      onSecondary: demoFirst ? _goSignUp : _goContact,
    );
  }

  Widget _h3Section(double w) {
    if (_h3Variant == 'why-matters') return _h3Why(w);
    final narrow = w < 960;
    final title = (_homeCms?.h3Heading.trim().isNotEmpty ?? false)
        ? _homeCms!.h3Heading
        : 'Employee tracking on every device';
    final blurb = (_homeCms?.h3Body.trim().isNotEmpty ?? false)
        ? _homeCms!.h3Body
        : 'Clock in from Windows, Mac, and the web. Attendance, GPS, and live status stay in one place.';
    final copy = Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: GoogleFonts.poppins(
            fontSize: narrow ? 30 : 40,
            height: 1.15,
            fontWeight: FontWeight.w800,
            color: const Color(0xFF111827),
          ),
        ),
        const SizedBox(height: 14),
        Text(
          blurb,
          style: GoogleFonts.poppins(fontSize: 16, height: 1.55, color: const Color(0xFF4B5563)),
        ),
        const SizedBox(height: 22),
        Wrap(
          spacing: 22,
          runSpacing: 10,
          children: [
            _osTab('Desktop', true),
            _osTab('Mobile', false),
            _osTab('Web', false),
          ],
        ),
        const SizedBox(height: 18),
        Wrap(
          spacing: 10,
          runSpacing: 10,
          children: const [
            _OsPill(Icons.desktop_windows_rounded, 'Windows'),
            _OsPill(Icons.laptop_mac_rounded, 'macOS'),
            _OsPill(Icons.public_rounded, 'Web'),
          ],
        ),
      ],
    );
    return Container(
      width: double.infinity,
      color: Colors.white,
      padding: EdgeInsets.fromLTRB(narrow ? 20 : 56, 24, narrow ? 20 : 56, 36),
      child: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 1140),
          child: narrow
              ? Column(children: [_h3Dashboard(), const SizedBox(height: 28), _h3CopyBackdrop(copy)])
              : Row(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Expanded(flex: 6, child: _h3Dashboard()),
                    const SizedBox(width: 28),
                    Expanded(flex: 5, child: _h3CopyBackdrop(copy)),
                  ],
                ),
        ),
      ),
    );
  }

  Widget _h3CopyBackdrop(Widget copy) {
    return Container(
      constraints: const BoxConstraints(minHeight: 340),
      padding: const EdgeInsets.fromLTRB(16, 20, 88, 20),
      alignment: Alignment.centerLeft,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(28),
        image: const DecorationImage(
          image: AssetImage('assets/home/devices.jpg'),
          fit: BoxFit.cover,
          alignment: Alignment.centerRight,
        ),
      ),
      child: Container(
        padding: const EdgeInsets.all(18),
        decoration: BoxDecoration(
          color: const Color(0xF7FFFFFF),
          borderRadius: BorderRadius.circular(20),
        ),
        child: copy,
      ),
    );
  }

  Widget _osTab(String label, bool selected) {
    return Column(
      children: [
        Text(
          label,
          style: GoogleFonts.poppins(
            fontWeight: FontWeight.w700,
            color: selected ? AppColors.masterPrimary : const Color(0xFF6B7280),
          ),
        ),
        const SizedBox(height: 6),
        Container(
          height: 3,
          width: 28,
          decoration: BoxDecoration(
            color: selected ? AppColors.masterPrimary : Colors.transparent,
            borderRadius: BorderRadius.circular(4),
          ),
        ),
      ],
    );
  }

  Widget _h3Dashboard() {
    return Container(
      height: 340,
      padding: const EdgeInsets.all(22),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFFEFF6FF), Color(0xFFE0F2FE), Color(0xFFDBEAFE)],
        ),
        borderRadius: BorderRadius.circular(28),
      ),
      child: Center(
        child: Container(
          width: 280,
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(18),
            boxShadow: const [BoxShadow(color: Color(0x1A1A56DB), blurRadius: 24, offset: Offset(0, 12))],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Row(
                children: [
                  Text('Tracked hours', style: GoogleFonts.poppins(fontWeight: FontWeight.w700, fontSize: 13)),
                  const Spacer(),
                  Text('05:57', style: GoogleFonts.poppins(color: AppColors.masterPrimary, fontWeight: FontWeight.w800)),
                ],
              ),
              const SizedBox(height: 12),
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: const Color(0xFFF8FAFC),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text('On site · clocked in', style: GoogleFonts.poppins(fontSize: 13, color: const Color(0xFF374151))),
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  _miniStat('95%', 'On time'),
                  const SizedBox(width: 8),
                  _miniStat('76%', 'On site'),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _miniStat(String value, String label) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 10),
        decoration: BoxDecoration(
          color: const Color(0xFFEFF6FF),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Column(
          children: [
            Text(value, style: GoogleFonts.poppins(fontWeight: FontWeight.w800, color: AppColors.masterPrimary)),
            Text(label, style: GoogleFonts.poppins(fontSize: 11, color: const Color(0xFF6B7280))),
          ],
        ),
      ),
    );
  }

  Widget _h2Section(double w) {
    if (_h2Variant == 'security-card') return _h2Security(w);
    return _h2Dashboard(w);
  }

  List<String> get _h2Lines {
    final items = _homeCms?.h2Items ?? const <String>[];
    if (items.isNotEmpty) return items;
    if (_h2Variant == 'security-card') {
      return const [
        'GPS check',
        'Face check',
        'Fingerprint',
        '- Outside the site',
        '- Missing photo',
      ];
    }
    return const [
      'Clock-in with GPS, face, and fingerprint',
      'Leave, shifts, and task tracking',
      'Live dashboards for managers',
      'Reports your payroll team can use',
      'Works on mobile, desktop, and web',
    ];
  }

  String get _h2Title {
    final h = _homeCms?.h2Heading.trim() ?? '';
    if (h.isNotEmpty) return h;
    return _h2Variant == 'security-card'
        ? 'See who is on site, on every device'
        : 'Workforce tools built for every team';
  }

  String get _h2Blurb {
    final b = _homeCms?.h2Body.trim() ?? '';
    if (b.isNotEmpty) return b;
    return _h2Variant == 'security-card'
        ? 'Attendance checks GPS, face, and fingerprint, then shows a clear pass or fail for the team.'
        : 'Track attendance, tasks, and hours in real time, by person, shift, and site.';
  }

  Widget _h2Dashboard(double w) {
    final narrow = w < 960;
    final copy = Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          _h2Title,
          style: GoogleFonts.poppins(
            fontSize: narrow ? 30 : 40,
            height: 1.15,
            fontWeight: FontWeight.w800,
            color: const Color(0xFF111827),
          ),
        ),
        const SizedBox(height: 16),
        Text(
          _h2Blurb,
          style: GoogleFonts.poppins(fontSize: 16, height: 1.55, color: const Color(0xFF4B5563)),
        ),
        const SizedBox(height: 18),
        for (final line in _h2Lines)
          Padding(
            padding: const EdgeInsets.only(bottom: 8),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Padding(
                  padding: EdgeInsets.only(top: 7),
                  child: Icon(Icons.circle, size: 7, color: Color(0xFF111827)),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    line.replaceFirst(RegExp(r'^[+-]\s*'), ''),
                    style: GoogleFonts.poppins(fontSize: 15, height: 1.4, color: const Color(0xFF1F2937)),
                  ),
                ),
              ],
            ),
          ),
      ],
    );
    return Container(
      width: double.infinity,
      color: Colors.white,
      padding: EdgeInsets.fromLTRB(narrow ? 20 : 56, 28, narrow ? 20 : 56, 48),
      child: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 1140),
          child: narrow
              ? Column(children: [_h2DashboardArt(), const SizedBox(height: 28), copy])
              : Row(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Expanded(flex: 6, child: _h2DashboardArt()),
                    const SizedBox(width: 36),
                    Expanded(flex: 5, child: copy),
                  ],
                ),
        ),
      ),
    );
  }

  Widget _h2DashboardArt() {
    Widget stat(String value, String label) {
      return Expanded(
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 14),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [Color(0xFF2563EB), Color(0xFF7C3AED)],
            ),
            borderRadius: BorderRadius.circular(14),
          ),
          child: Column(
            children: [
              Text(value, style: GoogleFonts.poppins(color: Colors.white, fontSize: 26, fontWeight: FontWeight.w800)),
              Text(label, style: GoogleFonts.poppins(color: Colors.white70, fontSize: 11)),
            ],
          ),
        ),
      );
    }

    return SizedBox(
      height: 380,
      child: Stack(
        children: [
          Positioned.fill(
            top: 36,
            left: 18,
            right: 8,
            child: Container(
              padding: const EdgeInsets.fromLTRB(16, 78, 16, 16),
              decoration: BoxDecoration(
                color: const Color(0xFFF8FAFC),
                borderRadius: BorderRadius.circular(22),
                border: Border.all(color: const Color(0xFFBFDBFE), width: 1.4),
              ),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  for (final h in [70.0, 110.0, 86.0, 130.0])
                    Expanded(
                      child: Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 6),
                        child: Align(
                          alignment: Alignment.bottomCenter,
                          child: Container(
                            height: h,
                            decoration: BoxDecoration(
                              color: h > 100 ? const Color(0xFF60A5FA) : const Color(0xFFC4B5FD),
                              borderRadius: BorderRadius.circular(8),
                            ),
                          ),
                        ),
                      ),
                    ),
                ],
              ),
            ),
          ),
          Positioned(
            left: 36,
            right: 36,
            top: 0,
            child: Container(
              padding: const EdgeInsets.fromLTRB(12, 10, 12, 12),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFFE5E7EB)),
                boxShadow: const [BoxShadow(color: Color(0x14000000), blurRadius: 18, offset: Offset(0, 8))],
              ),
              child: Column(
                children: [
                  Text('Today', style: GoogleFonts.poppins(fontSize: 12, color: const Color(0xFF6B7280))),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      stat('95%', 'On time'),
                      const SizedBox(width: 8),
                      stat('76%', 'On site'),
                      const SizedBox(width: 8),
                      stat('73%', 'Active'),
                    ],
                  ),
                ],
              ),
            ),
          ),
          Positioned(
            left: 8,
            bottom: 8,
            child: Container(
              width: 132,
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                boxShadow: const [BoxShadow(color: Color(0x14000000), blurRadius: 16, offset: Offset(0, 6))],
              ),
              child: Column(
                children: [
                  Text('Hours', style: GoogleFonts.poppins(fontSize: 12, fontWeight: FontWeight.w600)),
                  const SizedBox(height: 8),
                  const SizedBox(
                    width: 64,
                    height: 64,
                    child: CircularProgressIndicator(
                      value: 0.72,
                      strokeWidth: 8,
                      backgroundColor: Color(0xFFE5E7EB),
                      color: Color(0xFF22C55E),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _h2Security(double w) {
    final narrow = w < 900;
    final lines = _h2Lines;
    final copy = Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          _h2Title,
          style: GoogleFonts.poppins(
            fontSize: narrow ? 28 : 36,
            height: 1.15,
            fontWeight: FontWeight.w800,
            color: Colors.white,
          ),
        ),
        const SizedBox(height: 14),
        Text(
          _h2Blurb,
          style: GoogleFonts.poppins(fontSize: 15, height: 1.55, color: const Color(0xFFE9D5FF)),
        ),
        const SizedBox(height: 22),
        _HeroPill(
          label: (_homeCms?.h2Button.trim().isNotEmpty ?? false)
              ? _homeCms!.h2Button
              : 'Explore attendance checks',
          filled: true,
          onPressed: _goSignUp,
        ),
      ],
    );
    final card = Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(22),
        boxShadow: const [BoxShadow(color: Color(0x33000000), blurRadius: 24, offset: Offset(0, 10))],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.laptop_mac_rounded, color: Color(0xFF2563EB)),
              const SizedBox(width: 8),
              Text('Team devices', style: GoogleFonts.poppins(fontWeight: FontWeight.w700)),
            ],
          ),
          const SizedBox(height: 8),
          Text('Checks  ·  Needs review', style: GoogleFonts.poppins(fontSize: 12, color: const Color(0xFF6B7280))),
          const SizedBox(height: 10),
          for (final line in lines)
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 5),
              child: Row(
                children: [
                  Icon(
                    line.trimLeft().startsWith('-') ? Icons.cancel_rounded : Icons.check_circle_rounded,
                    size: 18,
                    color: line.trimLeft().startsWith('-') ? const Color(0xFFEF4444) : const Color(0xFF16A34A),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      line.replaceFirst(RegExp(r'^[+-]\s*'), ''),
                      style: GoogleFonts.poppins(fontSize: 14),
                    ),
                  ),
                ],
              ),
            ),
        ],
      ),
    );
    return Padding(
      padding: EdgeInsets.fromLTRB(narrow ? 16 : 48, 12, narrow ? 16 : 48, 12),
      child: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 1140),
          child: Container(
            width: double.infinity,
            padding: EdgeInsets.fromLTRB(narrow ? 20 : 40, 36, narrow ? 20 : 40, 36),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [Color(0xFF4C1D95), Color(0xFF6D28D9), Color(0xFF7C3AED)],
              ),
              borderRadius: BorderRadius.circular(28),
            ),
            child: narrow
                ? Column(crossAxisAlignment: CrossAxisAlignment.start, children: [copy, const SizedBox(height: 24), card])
                : Row(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      Expanded(flex: 5, child: copy),
                      const SizedBox(width: 28),
                      Expanded(flex: 5, child: card),
                    ],
                  ),
          ),
        ),
      ),
    );
  }

  Widget _platforms() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 8, 20, 40),
      child: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 980),
          child: Column(
            children: [
              Text(
                'Get the app — Windows, Android, iOS & Web',
                textAlign: TextAlign.center,
                style: GoogleFonts.poppins(
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  color: const Color(0xFF6B7280),
                ),
              ),
              const SizedBox(height: 16),
              const WebStoreBadgeRow(alignment: WrapAlignment.center),
            ],
          ),
        ),
      ),
    );
  }

  // ── Sections ─────────────────────────────────────────────────────────────
  Widget _sectionTitle(String title, String subtitle) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(title,
            style: GoogleFonts.poppins(
                fontSize: 28,
                fontWeight: FontWeight.w800,
                color: const Color(0xFF111827))),
        const SizedBox(height: 8),
        Text(subtitle,
            style: GoogleFonts.poppins(
                fontSize: 15, color: const Color(0xFF6B7280))),
      ],
    );
  }

  Widget _features(double w) {
    const items = [
      (Icons.fingerprint_rounded, 'Trusted clock-in',
          'Face, fingerprint and GPS checks keep attendance honest.'),
      (Icons.bar_chart_rounded, 'Realtime charts',
          'Web dashboards update as your team clocks in and out.'),
      (Icons.forum_rounded, 'HR chat',
          'Employees reach HR without leaving the app.'),
    ];
    return _wrapSection(
      w,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          LayoutBuilder(builder: (context, c) {
            final wide = c.maxWidth >= 880;
            final title = _sectionTitle('Built for modern teams',
                'One product for attendance, tasks, leave and insights.');
            final cards = _gridCards(w, items);
            if (!wide) {
              return Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  title,
                  const SizedBox(height: 20),
                  Center(
                    child: SvgPicture.asset(
                      'assets/undraw_engineering-team_13ax.svg',
                      height: 200,
                    ),
                  ),
                  const SizedBox(height: 28),
                  cards,
                ],
              );
            }
            return Row(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Expanded(
                  flex: 4,
                  child: SvgPicture.asset(
                    'assets/undraw_engineering-team_13ax.svg',
                    height: 260,
                  ),
                ),
                const SizedBox(width: 36),
                Expanded(
                  flex: 6,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      title,
                      const SizedBox(height: 28),
                      cards,
                    ],
                  ),
                ),
              ],
            );
          }),
        ],
      ),
    );
  }

  Widget _howItWorks(double w) {
    const steps = [
      ('1', 'Create company', 'Sign up and invite your workforce in minutes.'),
      ('2', 'Clock with confidence',
          'Employees punch in with GPS, face or biometric checks.'),
      ('3', 'See live insights',
          'Managers track hours, leave and tasks from the web dashboard.'),
    ];
    return Container(
      width: double.infinity,
      color: Colors.white,
      padding: EdgeInsets.fromLTRB(w < 700 ? 20 : 48, 56, w < 700 ? 20 : 48, 56),
      child: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 1100),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              LayoutBuilder(builder: (context, c) {
                final wide = c.maxWidth >= 880;
                final title = _sectionTitle(
                    'How it works', 'Three steps from signup to live ops.');
                final stepsWrap = LayoutBuilder(builder: (context, c2) {
                  final cols = c2.maxWidth >= 900 ? 3 : 1;
                  final gap = 16.0;
                  final itemW = cols == 1
                      ? c2.maxWidth
                      : (c2.maxWidth - gap * (cols - 1)) / cols;
                  return Wrap(
                    spacing: gap,
                    runSpacing: gap,
                    children: [
                      for (final s in steps)
                        SizedBox(
                          width: itemW,
                          child: Container(
                            padding: const EdgeInsets.all(22),
                            decoration: BoxDecoration(
                              color: const Color(0xFFF8FAFC),
                              borderRadius: BorderRadius.circular(18),
                              border:
                                  Border.all(color: const Color(0xFFE5E7EB)),
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(s.$1,
                                    style: GoogleFonts.poppins(
                                        fontSize: 32,
                                        fontWeight: FontWeight.w800,
                                        color: AppColors.primary)),
                                const SizedBox(height: 8),
                                Text(s.$2,
                                    style: GoogleFonts.poppins(
                                        fontSize: 16,
                                        fontWeight: FontWeight.w700)),
                                const SizedBox(height: 8),
                                Text(s.$3,
                                    style: GoogleFonts.poppins(
                                        fontSize: 13,
                                        height: 1.5,
                                        color: const Color(0xFF6B7280))),
                              ],
                            ),
                          ),
                        ),
                    ],
                  );
                });
                if (!wide) {
                  return Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      title,
                      const SizedBox(height: 20),
                      Center(
                        child: SvgPicture.asset(
                          'assets/undraw_working-together_r43a.svg',
                          height: 200,
                        ),
                      ),
                      const SizedBox(height: 28),
                      stepsWrap,
                    ],
                  );
                }
                return Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        Expanded(child: title),
                        const SizedBox(width: 24),
                        SvgPicture.asset(
                          'assets/undraw_working-together_r43a.svg',
                          height: 180,
                        ),
                      ],
                    ),
                    const SizedBox(height: 28),
                    stepsWrap,
                  ],
                );
              }),
            ],
          ),
        ),
      ),
    );
  }

  Widget _roles(double w) {
    const items = [
      (Icons.business_rounded, 'Company admins',
          'Departments, employees, attendance maps and exports.'),
      (Icons.badge_rounded, 'Employees',
          'Clock in/out, tasks, leave requests and HR chat.'),
      (Icons.hub_rounded, 'White-label partners',
          'Resell with your brand and manage tenant companies.'),
    ];
    return _wrapSection(
      w,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _sectionTitle('Built for every role',
              'The right tools for admins, staff and partners.'),
          const SizedBox(height: 28),
          _gridCards(w, items),
        ],
      ),
    );
  }

  Widget _security(double w) {
    return Container(
      width: double.infinity,
      color: Colors.white,
      padding: EdgeInsets.fromLTRB(w < 700 ? 20 : 48, 56, w < 700 ? 20 : 48, 56),
      child: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 1100),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _sectionTitle('Security you can trust',
                        'Role-based access, secure auth and audit-friendly records.'),
                    const SizedBox(height: 20),
                    _bullet('Encrypted auth sessions via Supabase'),
                    _bullet('Role gates for admin, employee & partners'),
                    _bullet('GPS / biometric verification options'),
                    _bullet('Attendance history ready for exports'),
                  ],
                ),
              ),
              if (w >= 800) ...[
                const SizedBox(width: 40),
                Expanded(
                  child: SvgPicture.asset(
                    'assets/undraw_device-sync_d9ei.svg',
                    height: 220,
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }

  Widget _bullet(String t) => Padding(
        padding: const EdgeInsets.only(bottom: 10),
        child: Row(
          children: [
            const Icon(Icons.check_circle_rounded,
                color: AppColors.success, size: 20),
            const SizedBox(width: 10),
            Expanded(
                child: Text(t,
                    style: GoogleFonts.poppins(
                        fontSize: 14, color: const Color(0xFF374151)))),
          ],
        ),
      );

  Widget _testimonials(double w) {
    const quotes = [
      ('“Clock-in finally works for our field team.”', 'Ops Manager'),
      ('“Web dashboards help us spot late days early.”', 'HR Lead'),
      ('“Employees love the leave + chat flow.”', 'Company Admin'),
    ];
    return _wrapSection(
      w,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _sectionTitle('Loved by growing teams',
              'Simple words from teams who track attendance every day.'),
          const SizedBox(height: 28),
          LayoutBuilder(builder: (context, c) {
            final cols = c.maxWidth >= 900 ? 3 : 1;
            final gap = 16.0;
            final itemW =
                cols == 1 ? c.maxWidth : (c.maxWidth - gap * (cols - 1)) / cols;
            return Wrap(
              spacing: gap,
              runSpacing: gap,
              children: [
                for (final q in quotes)
                  SizedBox(
                    width: itemW,
                    child: Container(
                      padding: const EdgeInsets.all(22),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(18),
                        border: Border.all(color: const Color(0xFFE5E7EB)),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(q.$1,
                              style: GoogleFonts.poppins(
                                  fontSize: 15,
                                  height: 1.45,
                                  fontWeight: FontWeight.w600)),
                          const SizedBox(height: 14),
                          Text(q.$2,
                              style: GoogleFonts.poppins(
                                  fontSize: 12,
                                  color: AppColors.primary,
                                  fontWeight: FontWeight.w700)),
                        ],
                      ),
                    ),
                  ),
              ],
            );
          }),
        ],
      ),
    );
  }

  Widget _whyUs(double w) {
    const items = [
      (Icons.verified_user_rounded, 'Honest attendance',
          'GPS and biometric checks cut buddy punching and fake punches.'),
      (Icons.speed_rounded, 'Live ops view',
          'Managers see who is in, late, or on leave without spreadsheet chase.'),
      (Icons.devices_rounded, 'One stack everywhere',
          'Web, Android, iOS and desktop share the same workforce data.'),
    ];
    return _wrapSection(
      w,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _sectionTitle('Why teams switch to us',
              'Clear outcomes for HR, ops and field supervisors.'),
          const SizedBox(height: 28),
          _gridCards(w, items),
        ],
      ),
    );
  }

  Widget _integrations(double w) {
    const chips = [
      ('GPS', Icons.location_on_rounded),
      ('Face ID', Icons.face_retouching_natural_rounded),
      ('Fingerprint', Icons.fingerprint_rounded),
      ('Leave', Icons.beach_access_rounded),
      ('Tasks', Icons.task_alt_rounded),
      ('Reports', Icons.ios_share_rounded),
    ];
    return Container(
      width: double.infinity,
      color: Colors.white,
      padding:
          EdgeInsets.fromLTRB(w < 700 ? 20 : 48, 56, w < 700 ? 20 : 48, 56),
      child: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 1100),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _sectionTitle('Built-in workforce toolkit',
                  'No patchwork of apps — attendance, leave, tasks and chat together.'),
              const SizedBox(height: 24),
              Wrap(
                spacing: 12,
                runSpacing: 12,
                children: [
                  for (final c in chips)
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 16, vertical: 12),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF8FAFC),
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: const Color(0xFFE5E7EB)),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(c.$2, color: AppColors.primary, size: 20),
                          const SizedBox(width: 8),
                          Text(c.$1,
                              style: GoogleFonts.poppins(
                                  fontWeight: FontWeight.w600, fontSize: 13)),
                        ],
                      ),
                    ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _statsBand(double w) {
    const stats = [
      ('99.9%', 'Uptime focus'),
      ('4', 'Platforms'),
      ('1', 'Source of truth'),
      ('24/7', 'Live clock data'),
    ];
    return Padding(
      padding: EdgeInsets.fromLTRB(w < 700 ? 20 : 48, 24, w < 700 ? 20 : 48, 24),
      child: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 1100),
          child: Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
            decoration: BoxDecoration(
              gradient: AppColors.primaryGradient,
              borderRadius: BorderRadius.circular(24),
            ),
            child: LayoutBuilder(builder: (context, c) {
              final cols = c.maxWidth >= 720 ? 4 : 2;
              final gap = 16.0;
              final itemW =
                  (c.maxWidth - gap * (cols - 1)) / cols;
              return Wrap(
                spacing: gap,
                runSpacing: gap,
                children: [
                  for (final s in stats)
                    SizedBox(
                      width: itemW,
                      child: Column(
                        children: [
                          Text(s.$1,
                              style: GoogleFonts.poppins(
                                  fontSize: 28,
                                  fontWeight: FontWeight.w800,
                                  color: Colors.white)),
                          const SizedBox(height: 4),
                          Text(s.$2,
                              textAlign: TextAlign.center,
                              style: GoogleFonts.poppins(
                                  fontSize: 13, color: Colors.white70)),
                        ],
                      ),
                    ),
                ],
              );
            }),
          ),
        ),
      ),
    );
  }

  Widget _faq(double w) {
    const faqs = [
      ('Does it work on mobile and web?',
          'Yes — Android, iOS, web and desktop share the same Teamital experience.'),
      ('Can employees clock in with GPS?',
          'Yes. Admins can require GPS (and biometric/face) for clock-in and clock-out.'),
      ('Is there a company admin dashboard?',
          'Company admins manage employees, attendance, leave, tasks and reports from the web.'),
    ];
    return Container(
      width: double.infinity,
      color: Colors.white,
      padding: EdgeInsets.fromLTRB(w < 700 ? 20 : 48, 56, w < 700 ? 20 : 48, 40),
      child: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 1000),
          child: LayoutBuilder(builder: (context, c) {
            final wide = c.maxWidth >= 820;
            final faqList = Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                for (final f in faqs)
                  Theme(
                    data: ThemeData(dividerColor: Colors.transparent),
                    child: ExpansionTile(
                      tilePadding: EdgeInsets.zero,
                      title: Text(f.$1,
                          style: GoogleFonts.poppins(
                              fontWeight: FontWeight.w600, fontSize: 15)),
                      children: [
                        Align(
                          alignment: Alignment.centerLeft,
                          child: Padding(
                            padding: const EdgeInsets.only(bottom: 12),
                            child: Text(f.$2,
                                style: GoogleFonts.poppins(
                                    fontSize: 13,
                                    height: 1.5,
                                    color: const Color(0xFF6B7280))),
                          ),
                        ),
                      ],
                    ),
                  ),
              ],
            );
            if (!wide) {
              return Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _sectionTitle('FAQ', 'Quick answers before you sign up.'),
                  const SizedBox(height: 16),
                  Center(
                    child: SvgPicture.asset(
                      'assets/undraw_questions_52ic.svg',
                      height: 180,
                    ),
                  ),
                  const SizedBox(height: 12),
                  faqList,
                ],
              );
            }
            return Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  flex: 4,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _sectionTitle('FAQ', 'Quick answers before you sign up.'),
                      const SizedBox(height: 20),
                      SvgPicture.asset(
                        'assets/undraw_questions_52ic.svg',
                        height: 220,
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 36),
                Expanded(flex: 6, child: faqList),
              ],
            );
          }),
        ),
      ),
    );
  }

  Widget _ctaBand() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 24, 20, 48),
      child: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 1100),
          child: Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 36),
            decoration: BoxDecoration(
              gradient: AppColors.primaryGradient,
              borderRadius: BorderRadius.circular(24),
            ),
            child: Column(
              children: [
                Text('Ready to track your workforce?',
                    textAlign: TextAlign.center,
                    style: GoogleFonts.poppins(
                        fontSize: 24,
                        fontWeight: FontWeight.w800,
                        color: Colors.white)),
                const SizedBox(height: 10),
                Text('Create your company account in minutes.',
                    style: GoogleFonts.poppins(
                        fontSize: 14, color: Colors.white70)),
                const SizedBox(height: 22),
                FilledButton(
                  onPressed: _goSignUp,
                  style: FilledButton.styleFrom(
                    backgroundColor: Colors.white,
                    foregroundColor: AppColors.primary,
                    padding: const EdgeInsets.symmetric(
                        horizontal: 24, vertical: 16),
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(14)),
                  ),
                  child: Text('Sign up now',
                      style: GoogleFonts.poppins(fontWeight: FontWeight.w700)),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _wrapSection(double w, {required Widget child}) {
    return Padding(
      padding: EdgeInsets.fromLTRB(w < 700 ? 20 : 48, 56, w < 700 ? 20 : 48, 24),
      child: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 1100),
          child: child,
        ),
      ),
    );
  }

  Widget _gridCards(
      double w, List<(IconData, String, String)> items) {
    return LayoutBuilder(builder: (context, c) {
      final cols = c.maxWidth >= 1000 ? 3 : (c.maxWidth >= 640 ? 2 : 1);
      final gap = 16.0;
      final itemW =
          cols == 1 ? c.maxWidth : (c.maxWidth - gap * (cols - 1)) / cols;
      return Wrap(
        spacing: gap,
        runSpacing: gap,
        children: [
          for (final it in items)
            SizedBox(
              width: itemW,
              child: Container(
                padding: const EdgeInsets.all(22),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(color: const Color(0xFFE5E7EB)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      width: 44,
                      height: 44,
                      decoration: BoxDecoration(
                        gradient: AppColors.primaryGradient,
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Icon(it.$1, color: Colors.white, size: 22),
                    ),
                    const SizedBox(height: 16),
                    Text(it.$2,
                        style: GoogleFonts.poppins(
                            fontSize: 16, fontWeight: FontWeight.w700)),
                    const SizedBox(height: 8),
                    Text(it.$3,
                        style: GoogleFonts.poppins(
                            fontSize: 13,
                            height: 1.5,
                            color: const Color(0xFF6B7280))),
                  ],
                ),
              ),
            ),
        ],
      );
    });
  }
}

class _OsPill extends StatelessWidget {
  const _OsPill(this.icon, this.label);
  final IconData icon;
  final String label;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: AppColors.primaryDark,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, color: Colors.white, size: 18),
          const SizedBox(width: 8),
          Text(label, style: GoogleFonts.poppins(color: Colors.white, fontWeight: FontWeight.w600)),
        ],
      ),
    );
  }
}

class _HeroPill extends StatelessWidget {
  const _HeroPill({
    required this.label,
    required this.filled,
    required this.onPressed,
    this.large = false,
  });

  final String label;
  final bool filled;
  final bool large;
  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: filled ? const Color(0xFF2563EB) : Colors.white,
      elevation: 0,
      shape: StadiumBorder(
        side: filled
            ? BorderSide.none
            : const BorderSide(color: Color(0xFF93C5FD), width: 1.6),
      ),
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: onPressed,
        child: Padding(
          padding: EdgeInsets.symmetric(
            horizontal: large ? 28 : 22,
            vertical: large ? 16 : 14,
          ),
          child: Text(
            label,
            style: GoogleFonts.poppins(
              fontSize: large ? 16 : 15,
              fontWeight: FontWeight.w600,
              color: filled ? Colors.white : const Color(0xFF2563EB),
            ),
          ),
        ),
      ),
    );
  }
}

class _HeroSignInArt extends StatefulWidget {
  const _HeroSignInArt();

  @override
  State<_HeroSignInArt> createState() => _HeroSignInArtState();
}

class _HeroSignInArtState extends State<_HeroSignInArt>
    with SingleTickerProviderStateMixin {
  late final AnimationController _float;

  @override
  void initState() {
    super.initState();
    _float = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2800),
    )..repeat(reverse: true);
  }

  @override
  void dispose() {
    _float.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 520,
      child: Stack(
        alignment: Alignment.center,
        children: [
          Positioned.fill(
            child: DecoratedBox(
              decoration: BoxDecoration(
                gradient: RadialGradient(
                  center: const Alignment(0.15, 0),
                  radius: 0.85,
                  colors: [
                    const Color(0xFFDBEAFE),
                    const Color(0xFFF8FAFC),
                    Colors.white.withValues(alpha: 0),
                  ],
                ),
              ),
            ),
          ),
          AnimatedBuilder(
            animation: _float,
            builder: (context, child) {
              final t = Curves.easeInOut.transform(_float.value);
              return Transform.translate(
                offset: Offset(0, -14 + (28 * t)),
                child: child,
              );
            },
            child: Image.asset(
              'assets/screen-signin (1).webp',
              height: 460,
              fit: BoxFit.contain,
              filterQuality: FilterQuality.high,
            ),
          ),
        ],
      ),
    );
  }
}

class _IconLinkPainter extends CustomPainter {
  const _IconLinkPainter({required this.heroH});

  final double heroH;

  static const _ys = <double>[0.08, 0.26, 0.46, 0.66, 0.84];
  static const _xs = <double>[28, 108, 20, 120, 48];
  static const _icon = 54.0;

  @override
  void paint(Canvas canvas, Size size) {
    final ribbon = Paint()
      ..color = const Color(0xFFDBEAFE)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 28
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;
    final line = Paint()
      ..color = const Color(0xFF93C5FD)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2
      ..strokeCap = StrokeCap.round;
    Offset left(int i) => Offset(_xs[i] + _icon / 2, heroH * _ys[i] + _icon / 2);
    Offset right(int i) => Offset(size.width - _xs[i] - _icon / 2, heroH * _ys[i] + _icon / 2);
    final leftPath = _smooth([for (var i = 0; i < _ys.length; i++) left(i)]);
    final rightPath = _smooth([for (var i = 0; i < _ys.length; i++) right(i)]);
    canvas.drawPath(leftPath, ribbon);
    canvas.drawPath(rightPath, ribbon);
    canvas.drawPath(leftPath, line);
    canvas.drawPath(rightPath, line);
  }

  Path _smooth(List<Offset> pts) {
    final path = Path()..moveTo(pts.first.dx, pts.first.dy);
    for (var i = 0; i < pts.length - 1; i++) {
      final p0 = i == 0 ? pts[i] : pts[i - 1];
      final p1 = pts[i];
      final p2 = pts[i + 1];
      final p3 = i + 2 < pts.length ? pts[i + 2] : p2;
      final c1 = Offset(p1.dx + (p2.dx - p0.dx) / 6, p1.dy + (p2.dy - p0.dy) / 6);
      final c2 = Offset(p2.dx - (p3.dx - p1.dx) / 6, p2.dy - (p3.dy - p1.dy) / 6);
      path.cubicTo(c1.dx, c1.dy, c2.dx, c2.dy, p2.dx, p2.dy);
    }
    return path;
  }

  @override
  bool shouldRepaint(covariant _IconLinkPainter oldDelegate) => oldDelegate.heroH != heroH;
}

class _FloatIcon extends StatelessWidget {
  const _FloatIcon(this.icon, this.color);
  final IconData icon;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 54,
      height: 54,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: const [BoxShadow(color: Color(0x14000000), blurRadius: 16, offset: Offset(0, 6))],
      ),
      child: Icon(icon, color: color, size: 26),
    );
  }
}

class _HeroIcon extends StatelessWidget {
  const _HeroIcon(this.icon);
  final IconData icon;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 56,
      height: 56,
      decoration: BoxDecoration(
        color: const Color(0xFFF8FAFC),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE5E7EB)),
      ),
      child: Icon(icon, color: const Color(0xFF2563EB)),
    );
  }
}

class _NavMenu {
  final String id;
  final String label;
  final List<_MegaCol> columns;
  const _NavMenu(
      {required this.id, required this.label, required this.columns});
}

class _MegaCol {
  final String title;
  final List<_MegaItem> items;
  const _MegaCol({required this.title, required this.items});
}

class _MegaItem {
  final IconData icon;
  final String title;
  final String subtitle;
  const _MegaItem(this.icon, this.title, this.subtitle);
}
