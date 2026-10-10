import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';
import 'package:web_teamital/web/browser_url.dart';
import 'package:web_teamital/web/web_home_page.dart';
import 'package:web_teamital/web/web_routes.dart';

/// Keeps the browser address bar in sync with marketing routes.
class WebUrlObserver extends NavigatorObserver {
  WebUrlObserver({this.navigatorKey});

  final GlobalKey<NavigatorState>? navigatorKey;
  bool _fromBrowser = false;
  bool _listening = false;

  void ensurePopStateListener() {
    if (!kIsWeb || _listening) return;
    _listening = true;
    browserListenPopState((path) {
      final nav = navigatorKey?.currentState;
      if (nav == null) return;
      _fromBrowser = true;
      try {
        final normalized = WebRoutes.normalize(path);
        if (WebRoutes.redirectAppPathIfNeeded(normalized)) return;

        if (nav.canPop()) {
          nav.pop();
          return;
        }

        final page = normalized == WebRoutes.home
            ? const WebHomePage()
            : WebRoutes.pageFor(normalized);
        nav.pushAndRemoveUntil(
          MaterialPageRoute<void>(
            settings: RouteSettings(name: normalized),
            builder: (_) => page,
          ),
          (_) => false,
        );
      } finally {
        _fromBrowser = false;
      }
    });
  }

  String? _nameOf(Route<dynamic>? route) {
    final name = route?.settings.name;
    if (name == null || name.isEmpty) return null;
    return WebRoutes.normalize(name);
  }

  void _syncPush(Route<dynamic> route) {
    if (!kIsWeb || _fromBrowser) return;
    final name = _nameOf(route);
    if (name == null) return;
    browserPushPath(name);
  }

  void _syncReplace(Route<dynamic>? route) {
    if (!kIsWeb || _fromBrowser) return;
    final name = _nameOf(route);
    if (name == null) return;
    browserReplacePath(name);
  }

  @override
  void didPush(Route<dynamic> route, Route<dynamic>? previousRoute) {
    ensurePopStateListener();
    _syncPush(route);
  }

  @override
  void didReplace({Route<dynamic>? newRoute, Route<dynamic>? oldRoute}) {
    _syncReplace(newRoute);
  }

  @override
  void didPop(Route<dynamic> route, Route<dynamic>? previousRoute) {
    if (!kIsWeb || _fromBrowser) return;
    _syncReplace(previousRoute);
  }
}
