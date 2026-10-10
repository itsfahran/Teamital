import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';
import 'package:web_teamital/config/web_hosts.dart';
import 'package:web_teamital/web/browser_url.dart';
import 'package:web_teamital/web/initial_web_uri.dart';
import 'package:web_teamital/web/web_cms_page.dart';
import 'package:web_teamital/web/web_contact_page.dart';
import 'package:web_teamital/web/web_home_page.dart';
import 'package:web_teamital/web/web_host_redirect.dart';
import 'package:web_teamital/web/web_legal_page.dart';
import 'package:web_teamital/web/web_how_it_works_page.dart';
import 'package:web_teamital/web/web_pricing_page.dart';
import 'package:web_teamital/web/web_delete_account_page.dart';
import 'package:web_teamital/web/web_privacy_policy_page.dart';
import 'package:web_teamital/web/web_terms_page.dart';
import 'package:web_teamital/web/web_cookie_policy_page.dart';
import 'package:web_teamital/web/web_security_policy_page.dart';
import 'package:web_teamital/web/web_seo.dart';

/// Marketing-site routes only (teamital.com). App auth/dashboard → app.teamital.com.
class WebRoutes {
  WebRoutes._();

  static const root = '/';
  static const home = '/';
  static const signIn = '/sign-in';
  static const signUp = '/sign-up';
  static const confirmSignup = '/confirm-signup';
  static const forgotPassword = '/forgot-password';
  static const pricing = '/pricing';
  static const contact = '/contact';
  static const privacyPolicy = '/privacy-policy';
  static const deleteAccount = '/delete-account';
  static const resetPassword = '/reset-password';
  static const about = '/about';
  static const features = '/features';
  static const security = '/security-policy';
  static const terms = '/terms-and-conditions';
  static const cookies = '/cookie-policy';
  static const securityLegacy = '/security';
  static const termsLegacy = '/terms';
  static const cookiesLegacy = '/cookies';
  static const careers = '/careers';
  static const blog = '/blog';
  static const howItWorks = '/how-it-works';

  static String normalize(String? name) {
    if (name == null || name.isEmpty || name == '/') return root;
    final path = name.split('?').first.split('#').first;
    if (path.isEmpty) return root;
    final p = path.startsWith('/') ? path : '/$path';
    if (p == securityLegacy) return security;
    if (p == termsLegacy) return terms;
    if (p == cookiesLegacy) return cookies;
    return p;
  }

  static String? cmsSlugFromPath(String path) {
    final p = normalize(path);
    if (p == root) return null;
    if (isConfirmSignupPath(p) || WebHosts.isAppPath(p)) return null;
    final rest = p.startsWith('/') ? p.substring(1) : p;
    if (rest.isEmpty || rest.contains('/')) return null;
    const reserved = {
      'sign-in',
      'sign-up',
      'confirm-signup',
      'forgot-password',
      'pricing',
      'contact',
      'privacy-policy',
      'delete-account',
      'reset-password',
      'about',
      'features',
      'security',
      'security-policy',
      'terms',
      'terms-and-conditions',
      'cookies',
      'cookie-policy',
      'careers',
      'blog',
      'how-it-works',
      'home',
      'api',
      'assets',
      'canvaskit',
    };
    if (reserved.contains(rest)) return null;
    return rest;
  }

  static bool isConfirmSignupPath(String path) {
    final p = normalize(path);
    return p == confirmSignup || p.startsWith('$confirmSignup/');
  }

  static bool isDirectPublicRoute(String path) {
    if (cmsSlugFromPath(path) != null) return true;
    switch (normalize(path)) {
      case pricing:
      case contact:
      case privacyPolicy:
      case deleteAccount:
      case about:
      case features:
      case security:
      case terms:
      case cookies:
      case careers:
      case blog:
      case howItWorks:
        return true;
      default:
        return false;
    }
  }

  /// Send product URLs to app.teamital.com (sign-in, dashboards, etc.).
  static bool redirectAppPathIfNeeded(String path) {
    if (!kIsWeb) return false;
    final p = normalize(path);
    if (!WebHosts.isAppPath(p)) return false;
    final base = Uri.parse(WebHosts.appUrl);
    final uri = Uri.base;
    final target = base.replace(
      path: p,
      query: uri.query.isEmpty ? null : uri.query,
    );
    return redirectToExternalUrl(target.toString());
  }

  static Widget pageFor(String path) {
    switch (normalize(path)) {
      case pricing:
        return const WebPricingPage();
      case contact:
        return const WebContactPage();
      case privacyPolicy:
        return const WebPrivacyPolicyPage();
      case deleteAccount:
        return const WebDeleteAccountPage();
      case about:
        return const WebLegalPage(slug: WebLegalSlug.about);
      case features:
        return const WebLegalPage(slug: WebLegalSlug.features);
      case security:
        return const WebSecurityPolicyPage();
      case terms:
        return const WebTermsPage();
      case cookies:
        return const WebCookiePolicyPage();
      case careers:
        return const WebLegalPage(slug: WebLegalSlug.careers);
      case blog:
        return const WebLegalPage(slug: WebLegalSlug.blog);
      case howItWorks:
        return const WebHowItWorksPage();
      case home:
      default:
        final cmsSlug = cmsSlugFromPath(path);
        if (cmsSlug != null) {
          return WebCmsPage(slug: cmsSlug);
        }
        return const WebHomePage();
    }
  }

  static MaterialPageRoute<T> _pageRoute<T extends Object?>(
    String path,
    Widget page,
  ) {
    if (kIsWeb) WebSeo.applyForPath(path);
    return MaterialPageRoute<T>(
      settings: RouteSettings(name: path),
      builder: (_) => page,
    );
  }

  static Route<dynamic> onGenerateRoute(RouteSettings settings) {
    final path = normalize(settings.name);
    if (redirectAppPathIfNeeded(path)) {
      return _pageRoute<dynamic>(path, const SizedBox.shrink());
    }
    final page = settings.arguments is Widget
        ? settings.arguments as Widget
        : pageFor(path);
    return _pageRoute<dynamic>(path, page);
  }

  static List<Route<dynamic>> onGenerateInitialRoutes(String initialRoute) {
    final captured = InitialWebUri.value;
    final rawPath = captured?.path.isNotEmpty == true
        ? captured!.path
        : initialRoute;
    final path = normalize(rawPath);
    if (redirectAppPathIfNeeded(path)) {
      return [_pageRoute<dynamic>(path, const SizedBox.shrink())];
    }
    if (path == home) {
      return [_pageRoute<dynamic>(home, const WebHomePage())];
    }
    if (isDirectPublicRoute(path)) {
      return [_pageRoute<dynamic>(path, pageFor(path))];
    }
    return [_pageRoute<dynamic>(root, const WebHomePage())];
  }

  static void _forceUrl(String path, {required bool replace}) {
    if (!kIsWeb) return;
    final p = normalize(path);
    if (replace) {
      browserReplacePath(p);
    } else {
      browserPushPath(p);
    }
    WebSeo.applyForPath(p);
  }

  static Future<T?> push<T extends Object?>(BuildContext context, String route) {
    final path = normalize(route);
    if (WebHosts.isAppPath(path)) {
      redirectAppPathIfNeeded(path);
      return Future<T?>.value(null);
    }
    _forceUrl(path, replace: false);
    return Navigator.of(context).push<T>(_pageRoute<T>(path, pageFor(path)));
  }

  static Future<T?> replace<T extends Object?, TO extends Object?>(
    BuildContext context,
    String route,
  ) {
    final path = normalize(route);
    if (WebHosts.isAppPath(path)) {
      redirectAppPathIfNeeded(path);
      return Future<T?>.value(null);
    }
    _forceUrl(path, replace: true);
    return Navigator.of(context).pushReplacement<T, TO>(
      _pageRoute<T>(path, pageFor(path)),
    );
  }

  static Future<T?> goHome<T extends Object?>(BuildContext context) {
    _forceUrl(home, replace: true);
    return Navigator.of(context).pushAndRemoveUntil<T>(
      _pageRoute<T>(home, const WebHomePage()),
      (_) => false,
    );
  }
}
