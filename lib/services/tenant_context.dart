import 'package:flutter/foundation.dart';

/// Marketing site only — no white-label portal resolution in this repo.
class TenantContext {
  TenantContext._();

  static TenantContext? get instance => null;
  static final ValueNotifier<int> revision = ValueNotifier<int>(0);

  static Future<void> resolveFromCurrentHost() async {}
}
