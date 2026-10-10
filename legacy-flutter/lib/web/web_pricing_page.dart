import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:web_teamital/app_colors.dart';
import 'package:web_teamital/utils/subscription_billing_ui.dart';
import 'package:web_teamital/utils/subscription_plan_helpers.dart';
import 'package:web_teamital/web/web_aos.dart';
import 'package:web_teamital/web/web_footer.dart';
import 'package:web_teamital/web/web_routes.dart';
import 'package:web_teamital/web/web_site_header.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

/// Public pricing — same plans as Android subscription screen.
class WebPricingPage extends StatefulWidget {
  const WebPricingPage({super.key});

  @override
  State<WebPricingPage> createState() => _WebPricingPageState();
}

class _WebPricingPageState extends State<WebPricingPage> {
  final _db = Supabase.instance.client;
  List<Map<String, dynamic>> _plans = [];
  bool _loading = true;
  String _billingTab = 'Monthly';

  @override
  void initState() {
    super.initState();
    _loadPlans();
  }

  Future<void> _loadPlans() async {
    setState(() => _loading = true);
    try {
      List<dynamic> data;
      try {
        data = await _db
            .from('subscription_plans')
            .select()
            .eq('is_active', true)
            .order('price');
      } catch (_) {
        data = await _db.from('subscription_plans').select().order('price');
      }
      if (!mounted) return;
      setState(() {
        _plans = List<Map<String, dynamic>>.from(data);
        _loading = false;
      });
    } catch (_) {
      if (mounted) setState(() => _loading = false);
    }
  }

  List<Map<String, dynamic>> get _filtered => _plans
      .where((p) => !SubscriptionPlanHelpers.isFiveYearBilling(
            p['billing'] as String?,
          ))
      .where((p) => SubscriptionPlanHelpers.matchesBilling(
            p['billing'] as String?,
            _billingTab,
          ))
      .toList();

  @override
  Widget build(BuildContext context) {
    final w = MediaQuery.sizeOf(context).width;
    final compact = w < 900;
    final publicPlans = _plans
        .where((p) => !SubscriptionPlanHelpers.isFiveYearBilling(
              p['billing'] as String?,
            ))
        .toList();
    final shown = _filtered.isNotEmpty ? _filtered : publicPlans;

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
              current: WebSitePage.pricing,
              compact: compact,
            ),
            Expanded(
              child: SingleChildScrollView(
                child: Column(
                  children: [
                    Padding(
                      padding: EdgeInsets.fromLTRB(
                          compact ? 20 : 48, 40, compact ? 20 : 48, 40),
                      child: Center(
                        child: ConstrainedBox(
                          constraints: const BoxConstraints(maxWidth: 1100),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.center,
                            children: [
                              WebAos(
                                child: Column(
                                  children: [
                                    Text(
                                      'Pricing',
                                      style: GoogleFonts.poppins(
                                        fontSize: 36,
                                        fontWeight: FontWeight.w800,
                                        color: const Color(0xFF111827),
                                      ),
                                    ),
                                    const SizedBox(height: 10),
                                    Text(
                                      'Same subscription plans as the mobile app — pick Monthly or Yearly.',
                                      textAlign: TextAlign.center,
                                      style: GoogleFonts.poppins(
                                        fontSize: 15,
                                        color: const Color(0xFF6B7280),
                                      ),
                                    ),
                                    const SizedBox(height: 24),
                                    ConstrainedBox(
                                      constraints:
                                          const BoxConstraints(maxWidth: 360),
                                      child: SubscriptionBillingUi.plansToggle(
                                        selectedTab: _billingTab,
                                        tabs: SubscriptionPlanHelpers
                                            .webBillingTabs,
                                        onChanged: (t) =>
                                            setState(() => _billingTab = t),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              const SizedBox(height: 36),
                              if (_loading)
                                const Padding(
                                  padding: EdgeInsets.all(48),
                                  child: CircularProgressIndicator(),
                                )
                              else if (shown.isEmpty)
                                WebAos(
                                  child: Text(
                                    'No plans available right now.',
                                    style: GoogleFonts.poppins(
                                        color: const Color(0xFF6B7280)),
                                  ),
                                )
                              else
                                LayoutBuilder(builder: (context, c) {
                                  final cols = c.maxWidth >= 960
                                      ? 3
                                      : c.maxWidth >= 640
                                          ? 2
                                          : 1;
                                  final gap = 18.0;
                                  final itemW = cols == 1
                                      ? c.maxWidth
                                      : (c.maxWidth - gap * (cols - 1)) / cols;
                                  return Wrap(
                                    spacing: gap,
                                    runSpacing: gap,
                                    children: [
                                      for (var i = 0; i < shown.length; i++)
                                        SizedBox(
                                          width: itemW,
                                          child: WebAos(
                                            delay:
                                                Duration(milliseconds: 80 * i),
                                            child: _planCard(shown[i]),
                                          ),
                                        ),
                                    ],
                                  );
                                }),
                              const SizedBox(height: 48),
                              WebAos(
                                child: Container(
                                  width: double.infinity,
                                  padding: const EdgeInsets.all(28),
                                  decoration: BoxDecoration(
                                    gradient: AppColors.primaryGradient,
                                    borderRadius: BorderRadius.circular(20),
                                  ),
                                  child: Column(
                                    children: [
                                      Text(
                                        'Ready to activate a plan?',
                                        textAlign: TextAlign.center,
                                        style: GoogleFonts.poppins(
                                          fontSize: 20,
                                          fontWeight: FontWeight.w800,
                                          color: Colors.white,
                                        ),
                                      ),
                                      const SizedBox(height: 8),
                                      Text(
                                        'Sign up, then choose your plan from the company subscription screen.',
                                        textAlign: TextAlign.center,
                                        style: GoogleFonts.poppins(
                                            fontSize: 13, color: Colors.white70),
                                      ),
                                      const SizedBox(height: 18),
                                      FilledButton(
                                        onPressed: () => WebRoutes.push(
                                            context, WebRoutes.signUp),
                                        style: FilledButton.styleFrom(
                                          backgroundColor: Colors.white,
                                          foregroundColor: AppColors.primary,
                                          padding: const EdgeInsets.symmetric(
                                              horizontal: 22, vertical: 14),
                                        ),
                                        child: Text('Get started',
                                            style: GoogleFonts.poppins(
                                                fontWeight: FontWeight.w700)),
                                      ),
                                    ],
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

  Widget _planCard(Map<String, dynamic> plan) {
    final features = SubscriptionPlanHelpers.featureLines(plan);
    final name = '${plan['name'] ?? 'Plan'}';
    final popular = name.toLowerCase().contains('pro') ||
        name.toLowerCase().contains('growth');

    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: popular ? AppColors.primary : const Color(0xFFE5E7EB),
          width: popular ? 2 : 1,
        ),
        boxShadow: [
          BoxShadow(
            color: AppColors.primary.withValues(alpha: 0.06),
            blurRadius: 24,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: Text(
                  name,
                  style: GoogleFonts.poppins(
                    fontSize: 18,
                    fontWeight: FontWeight.w700,
                    color: const Color(0xFF111827),
                  ),
                ),
              ),
              SubscriptionPlanHelpers.billingChip(plan['billing'] as String?),
            ],
          ),
          if (popular) ...[
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: const Color(0xFFDBEAFE),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Text('Popular',
                  style: GoogleFonts.poppins(
                      fontSize: 11,
                      fontWeight: FontWeight.w700,
                      color: AppColors.primary)),
            ),
          ],
          const SizedBox(height: 12),
          Text(
            SubscriptionPlanHelpers.priceLabel(plan),
            style: GoogleFonts.poppins(
              fontSize: 34,
              fontWeight: FontWeight.w800,
              color: const Color(0xFF111827),
            ),
          ),
          const SizedBox(height: 18),
          ...features.map(SubscriptionPlanHelpers.featureRow),
          const SizedBox(height: 22),
          SizedBox(
            width: double.infinity,
            height: 48,
            child: DecoratedBox(
              decoration: BoxDecoration(
                gradient: AppColors.primaryGradient,
                borderRadius: BorderRadius.circular(14),
              ),
              child: ElevatedButton(
                onPressed: () {
                  if (SubscriptionPlanHelpers.isCustomPlan(plan)) {
                    WebRoutes.replace(context, WebRoutes.contact);
                    return;
                  }
                  WebRoutes.push(context, WebRoutes.signUp);
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.transparent,
                  shadowColor: Colors.transparent,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(14),
                  ),
                ),
                child: Text(
                  SubscriptionPlanHelpers.isCustomPlan(plan)
                      ? 'Contact sales'
                      : 'Choose plan',
                  style: GoogleFonts.poppins(
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                    color: Colors.white,
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
