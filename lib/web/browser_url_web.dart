// ignore_for_file: avoid_web_libraries_in_flutter, deprecated_member_use

import 'dart:html' as html;

void browserPushPath(String path) {
  final p = _norm(path);
  if (html.window.location.pathname == p) return;
  html.window.history.pushState(null, '', p);
}

void browserReplacePath(String path) {
  final p = _norm(path);
  if (html.window.location.pathname == p) return;
  html.window.history.replaceState(null, '', p);
}

void browserListenPopState(void Function(String path) onPop) {
  html.window.onPopState.listen((_) {
    onPop(_norm(html.window.location.pathname));
  });
}

String _norm(String? path) {
  if (path == null || path.isEmpty) return '/';
  return path.startsWith('/') ? path : '/$path';
}
