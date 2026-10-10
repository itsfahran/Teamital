// ignore_for_file: avoid_web_libraries_in_flutter, deprecated_member_use

import 'dart:html' as html;

/// Snapshot of the real browser URL before Flutter path routing strips `?query`.
class InitialWebUri {
  static Uri? value;

  static void capture() {
    value ??= Uri.parse(html.window.location.href);
  }
}
