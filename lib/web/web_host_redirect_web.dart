// ignore_for_file: avoid_web_libraries_in_flutter, deprecated_member_use

import 'dart:html' as html;

/// Hard navigation to another origin (marketing ↔ app subdomain).
bool redirectToExternalUrl(String url) {
  final uri = Uri.tryParse(url);
  if (uri == null) return false;
  html.window.location.href = uri.toString();
  return true;
}
