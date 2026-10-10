import 'package:flutter/material.dart';
import 'package:web_teamital/web/web_site_header.dart';

enum WebMarketingPage { home, pricing, contact, howItWorks }

/// Shared light header — full site menus on every marketing page.
class WebMarketingHeader extends StatelessWidget {
  const WebMarketingHeader({
    super.key,
    required this.current,
    required this.onHome,
    required this.onPricing,
    required this.onContact,
    required this.onSignIn,
    required this.onSignUp,
    this.compact = false,
  });

  final WebMarketingPage current;
  final VoidCallback onHome;
  final VoidCallback onPricing;
  final VoidCallback onContact;
  final VoidCallback onSignIn;
  final VoidCallback onSignUp;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    final page = switch (current) {
      WebMarketingPage.home => WebSitePage.home,
      WebMarketingPage.pricing => WebSitePage.pricing,
      WebMarketingPage.contact => WebSitePage.contact,
      WebMarketingPage.howItWorks => WebSitePage.howItWorks,
    };
    return WebSiteHeader(current: page, compact: compact);
  }
}
