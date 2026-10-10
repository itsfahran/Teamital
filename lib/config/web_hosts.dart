import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter_dotenv/flutter_dotenv.dart';

/// Marketing site (teamital.com) vs product app (app.teamital.com).
class WebHosts {
  WebHosts._();

  static const defaultMarketingUrl = 'https://teamital.com';
  static const defaultAppUrl = 'https://app.teamital.com';

  static String get marketingUrl {
    final v = (dotenv.env['APP_PUBLIC_URL'] ?? '').trim();
    return v.isNotEmpty ? v.replaceAll(RegExp(r'/+$'), '') : defaultMarketingUrl;
  }

  static String get appUrl {
    final v = (dotenv.env['APP_APP_URL'] ?? '').trim();
    return v.isNotEmpty ? v.replaceAll(RegExp(r'/+$'), '') : defaultAppUrl;
  }

  static String get currentHost {
    if (!kIsWeb) return '';
    return Uri.base.host.trim().toLowerCase();
  }

  static Set<String> get marketingHosts {
    final out = <String>{
      'teamital.com',
      'www.teamital.com',
      'employeetracking.app',
      'www.employeetracking.app',
    };
    final extras = dotenv.env['APP_MAIN_HOSTS']?.trim() ?? '';
    for (final raw in extras.split(',')) {
      final h = raw.trim().toLowerCase();
      if (h.isNotEmpty) out.add(h);
    }
    final pub = Uri.tryParse(marketingUrl)?.host.toLowerCase();
    if (pub != null && pub.isNotEmpty) {
      out.add(pub);
      out.add('www.$pub');
    }
    return out;
  }

  static Set<String> get appHosts {
    final out = <String>{'app.teamital.com'};
    final app = Uri.tryParse(appUrl)?.host.toLowerCase();
    if (app != null && app.isNotEmpty) out.add(app);
    final extras = dotenv.env['APP_APP_HOSTS']?.trim() ?? '';
    for (final raw in extras.split(',')) {
      final h = raw.trim().toLowerCase();
      if (h.isNotEmpty) out.add(h);
    }
    return out;
  }

  static bool get isMarketingHost {
    if (!kIsWeb) return false;
    final h = currentHost;
    if (h.isEmpty || h == 'localhost' || h == '127.0.0.1') return false;
    return marketingHosts.contains(h);
  }

  static bool get isAppHost {
    if (!kIsWeb) return true; // native builds are the product app
    final h = currentHost;
    if (h.isEmpty || h == 'localhost' || h == '127.0.0.1') return true;
    if (appHosts.contains(h)) return true;
    // Preview / vercel.app hosts behave as the app.
    if (h.endsWith('.vercel.app')) return true;
    return !isMarketingHost;
  }

  /// Auth + dashboard paths that must live on the app subdomain.
  static bool isAppPath(String path) {
    final p = path.split('?').first.split('#').first.trim();
    final n = p.isEmpty ? '/' : (p.startsWith('/') ? p : '/$p');
    if (n == '/sign-in' ||
        n == '/sign-up' ||
        n == '/forgot-password' ||
        n == '/reset-password' ||
        n == '/confirm-signup' ||
        n.startsWith('/confirm-signup/')) {
      return true;
    }
    if (n.startsWith('/employee') ||
        n.startsWith('/company') ||
        n.startsWith('/wl') ||
        n.startsWith('/admin')) {
      return true;
    }
    return false;
  }

  /// Public marketing paths that should live on the apex site.
  static bool isMarketingPath(String path) {
    final p = path.split('?').first.split('#').first.trim();
    final n = p.isEmpty ? '/' : (p.startsWith('/') ? p : '/$p');
    if (n == '/') return true;
    const marketing = {
      '/pricing',
      '/contact',
      '/privacy-policy',
      '/delete-account',
      '/about',
      '/features',
      '/security-policy',
      '/security',
      '/terms-and-conditions',
      '/terms',
      '/cookie-policy',
      '/cookies',
      '/careers',
      '/blog',
      '/how-it-works',
    };
    return marketing.contains(n);
  }

  static String appAbsolute(String path) {
    final p = path.startsWith('/') ? path : '/$path';
    return '$appUrl$p';
  }

  static String marketingAbsolute(String path) {
    final p = path.startsWith('/') ? path : '/$path';
    if (p == '/') return marketingUrl;
    return '$marketingUrl$p';
  }
}
