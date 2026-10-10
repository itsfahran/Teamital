import 'package:flutter/material.dart';
import '../app_colors.dart';

/// Shared helpers for subscription plan display and billing filters.
class SubscriptionPlanHelpers {
  SubscriptionPlanHelpers._();

  /// UI tabs for plan browse / custom employee-details billing.
  static const billingTabs = ['Monthly', '1 Year', '5 Years'];
  static const webBillingTabs = ['Monthly', '1 Year'];

  /// App Store does not sell 5-year auto-renew plans.
  static const iosBillingTabs = ['Monthly', '1 Year'];

  /// App Store Connect product id. Optional DB column `apple_product_id` wins.
  static String appleProductId(Map<String, dynamic> plan) {
    final explicit = (plan['apple_product_id'] as String?)?.trim();
    if (explicit != null && explicit.isNotEmpty) return explicit;
    final name = (plan['name'] as String? ?? 'plan')
        .toLowerCase()
        .replaceAll(RegExp(r'[^a-z0-9]+'), '-')
        .replaceAll(RegExp(r'^-|-$'), '');
    final slug = name.isEmpty ? 'plan' : name;
    switch (billingTabFor(plan['billing'] as String?)) {
      case '1 Year':
        return 'eta.yearly.$slug';
      default:
        return 'eta.monthly.$slug';
    }
  }

  static bool isFiveYearBilling(String? billing) {
    return normalizeBillingTab(billing) == '5 Years';
  }

  /// All markets display and charge in EUR.
  static const displayCurrency = 'EUR';

  static String billingKey(String tab) {
    switch (normalizeBillingTab(tab)) {
      case '1 Year':
        return 'annual';
      case '5 Years':
        return '5year';
      default:
        return 'monthly';
    }
  }

  /// Maps free-text / legacy UI labels onto [billingTabs] values.
  static String normalizeBillingTab(String? tab) {
    final t = (tab ?? '').trim().toLowerCase();
    if (t == '5 years' || t == '5 year' || t == '5years' || t == '5year') {
      return '5 Years';
    }
    if (t == '1 year' ||
        t == '1 years' ||
        t == 'yearly' ||
        t == 'annual' ||
        t == 'annually' ||
        t == 'year') {
      return '1 Year';
    }
    return 'Monthly';
  }

  static String billingTabFor(String? billing) {
    final b = (billing ?? 'monthly')
        .toLowerCase()
        .replaceAll('_', '')
        .replaceAll(' ', '')
        .replaceAll('-', '');
    if (b == '5year' || b == '5years' || b == 'quinquennial') return '5 Years';
    if (b == 'annual' ||
        b == 'yearly' ||
        b == 'year' ||
        b == '1year' ||
        b == '1years') {
      return '1 Year';
    }
    // Legacy daily (and anything else) treated as Monthly for display filters.
    return 'Monthly';
  }

  static bool matchesBilling(String? billing, String tab) {
    return billingTabFor(billing) == normalizeBillingTab(tab);
  }

  static String billingLabel(String? billing) {
    final raw = (billing ?? '').trim();
    if (RegExp(r'^\d').hasMatch(raw)) return raw;
    return billingTabFor(billing);
  }

  /// Always EUR — geo / locale currency switching is disabled.
  static String currencyForCountry(String? countryCode) => displayCurrency;

  static String currencySymbol(String currency) {
    switch (currency.toUpperCase()) {
      case 'EUR':
        return '€';
      case 'USD':
        return '\$';
      default:
        return '€';
    }
  }

  /// EUR amount from plan `price_eur`, falling back to `price` when EUR is unset.
  static double amountForPlan(
    Map<String, dynamic> plan, {
    String? countryCode,
    String? currency,
  }) {
    final eur = (plan['price_eur'] as num?)?.toDouble();
    if (eur != null && eur > 0) return eur;
    return (plan['price'] as num?)?.toDouble() ?? 0;
  }

  static String priceLabel(
    Map<String, dynamic> plan, {
    String? countryCode,
    String? currency,
  }) {
    final price = amountForPlan(plan);
    if (price == 0) return 'Custom';
    final tab = billingTabFor(plan['billing'] as String?);
    final amount = price >= 100
        ? price.toInt().toString()
        : (price == price.roundToDouble()
            ? price.toInt().toString()
            : price.toStringAsFixed(2));
    switch (tab) {
      case '1 Year':
        return '€$amount/yr';
      case '5 Years':
        return '€$amount/5yr';
      default:
        return '€$amount/mo';
    }
  }

  /// Length of the subscription period for App Store paywall copy.
  static String durationLabel(String? billing) {
    switch (billingTabFor(billing)) {
      case '1 Year':
        return '1 year';
      case '5 Years':
        return '5 years';
      default:
        return '1 month';
    }
  }

  /// `payment_provider` written when a super admin grants a plan without
  /// checkout. Clients cannot set `purchases.is_paid`, so this marks the row as
  /// a real entitlement instead.
  static const adminGrantProvider = 'admin_grant';

  /// True for a plan the super admin handed out from Companies → Edit access.
  static bool isAdminGrantPurchase(Map<String, dynamic> purchase) {
    final provider =
        (purchase['payment_provider'] as String?)?.trim().toLowerCase() ?? '';
    return provider == adminGrantProvider;
  }

  /// True when this purchase should unlock premium (paid, Apple IAP proof, or
  /// a super-admin grant).
  static bool isEntitlingPurchase(Map<String, dynamic> purchase) {
    if (purchase['is_paid'] == true) return true;
    final provider =
        (purchase['payment_provider'] as String?)?.trim().toLowerCase() ?? '';
    if (provider == 'apple' || provider == adminGrantProvider) return true;
    final tx = (purchase['apple_transaction_id'] as String?)?.trim() ?? '';
    if (tx.isNotEmpty) return true;
    final intent =
        (purchase['stripe_payment_intent_id'] as String?)?.trim() ?? '';
    return intent.startsWith('appl_');
  }

  /// Admin / customer card price label (EUR).
  static String dualPriceLabel(Map<String, dynamic> plan) => priceLabel(plan);

  /// True for priced-at-zero plans or plans named Custom.
  static bool isCustomPlan(Map<String, dynamic> plan) {
    final name = (plan['name'] as String? ?? '').trim().toLowerCase();
    return amountForPlan(plan) <= 0 || name.contains('custom');
  }

  /// Custom [features] jsonb list, or legacy max_users/storage/support fields.
  static List<String> featureLines(Map<String, dynamic> plan) {
    final raw = plan['features'];
    if (raw is List && raw.isNotEmpty) {
      return raw
          .map((e) => e?.toString().trim() ?? '')
          .where((s) => s.isNotEmpty)
          .toList();
    }
    final users = plan['max_users'];
    final storage = plan['storage_gb'];
    final support = plan['support_tier'] as String? ?? 'email';
    final out = <String>[];
    if (users != null) out.add('$users Users');
    if (storage != null) out.add('${storage}GB Storage');
    out.add('${_capitalize(support)} Support');
    return out;
  }

  static String formatPurchaseDate(dynamic when) {
    final d = parseDate(when);
    if (d == null) return '';
    return formatDate(d);
  }

  static DateTime? parseDate(dynamic when) {
    if (when is DateTime) return when;
    if (when is! String || when.isEmpty) return null;
    return DateTime.tryParse(when);
  }

  static String formatDate(DateTime d) {
    final local = d.toLocal();
    return '${local.year}-${local.month.toString().padLeft(2, '0')}-${local.day.toString().padLeft(2, '0')}';
  }

  static const _months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  /// Human-readable date, e.g. `4 Aug 2026`.
  static String formatDateLong(DateTime d) {
    final local = d.toLocal();
    return '${local.day} ${_months[local.month - 1]} ${local.year}';
  }

  static int? daysUntil(DateTime? expiry) {
    if (expiry == null) return null;
    final today = DateTime.now();
    final start = DateTime(today.year, today.month, today.day);
    final end = DateTime(expiry.year, expiry.month, expiry.day);
    return end.difference(start).inDays;
  }

  static const durationUnits = ['days', 'months', 'years'];

  static String normalizeDurationUnit(String? unit) {
    final u = (unit ?? '').trim().toLowerCase();
    if (u.startsWith('year')) return 'years';
    if (u.startsWith('month')) return 'months';
    return 'days';
  }

  static String durationUnitLabel(String? unit) {
    switch (normalizeDurationUnit(unit)) {
      case 'years':
        return 'Years';
      case 'months':
        return 'Months';
      default:
        return 'Days';
    }
  }

  static String customDurationLabel(int? value, String? unit) {
    if (value == null || value < 1) return 'Custom';
    final n = value;
    switch (normalizeDurationUnit(unit)) {
      case 'years':
        return n == 1 ? '1 Year' : '$n Years';
      case 'months':
        return n == 1 ? '1 Month' : '$n Months';
      default:
        return n == 1 ? '1 Day' : '$n Days';
    }
  }

  /// Custom package: start + N days / months / years (calendar math).
  static DateTime? expiryFromDuration(
    DateTime start,
    int? value,
    String? unit,
  ) {
    if (value == null || value < 1) return null;
    final p = DateTime(start.year, start.month, start.day);
    switch (normalizeDurationUnit(unit)) {
      case 'years':
        return DateTime(p.year + value, p.month, p.day);
      case 'months':
        return DateTime(p.year, p.month + value, p.day);
      default:
        return p.add(Duration(days: value));
    }
  }

  /// Expiry from purchase date + billing period (monthly / 1 year / 5 years).
  static DateTime? expiryFromPurchase(DateTime purchased, String? billing) {
    final p = DateTime(purchased.year, purchased.month, purchased.day);
    switch (billingTabFor(billing)) {
      case '5 Years':
        return DateTime(p.year + 5, p.month, p.day);
      case '1 Year':
        return DateTime(p.year + 1, p.month, p.day);
      default:
        return DateTime(p.year, p.month + 1, p.day);
    }
  }

  /// Next billing end that is still in the future (admin-granted packages).
  static DateTime? nextExpiryFrom(DateTime purchased, String? billing) {
    final first = expiryFromPurchase(purchased, billing);
    if (first == null) return null;
    var expiry = first;
    final today = DateTime.now();
    final start = DateTime(today.year, today.month, today.day);
    var i = 0;
    while (!expiry.isAfter(start) && i < 120) {
      final next = expiryFromPurchase(expiry, billing);
      if (next == null) break;
      expiry = next;
      i++;
    }
    return expiry;
  }

  static Widget billingChip(String? billing) {
    final tab = billingTabFor(billing);
    Color bg;
    Color fg;
    switch (tab) {
      case '1 Year':
        bg = AppColors.successLight;
        fg = AppColors.success;
        break;
      case '5 Years':
        bg = AppColors.warningLight;
        fg = AppColors.warning;
        break;
      default:
        bg = AppColors.infoLight;
        fg = AppColors.primary;
    }
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Text(
        tab,
        style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: fg),
      ),
    );
  }

  static Widget billingSegTabs({
    required String selected,
    required ValueChanged<String> onChanged,
    List<String>? tabs,
  }) {
    final selectedNorm = normalizeBillingTab(selected);
    final shown = tabs ?? billingTabs;
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      child: Row(
        children: shown.map((t) {
          final active = t == selectedNorm;
          return Padding(
            padding: const EdgeInsets.only(right: 8),
            child: GestureDetector(
              onTap: () => onChanged(t),
              child: Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 16, vertical: 9),
                decoration: BoxDecoration(
                  color: active ? AppColors.primary : AppColors.background,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(
                    color: active ? AppColors.primary : AppColors.border,
                  ),
                ),
                child: Text(
                  t,
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    color: active ? Colors.white : AppColors.textSecondary,
                  ),
                ),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }

  static Widget featureRow(String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(Icons.check_circle_rounded,
              size: 20, color: AppColors.success),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              text,
              style: TextStyle(
                fontSize: 14,
                color: AppColors.textSecondary,
              ),
            ),
          ),
        ],
      ),
    );
  }

  static String _capitalize(String s) {
    if (s.isEmpty) return s;
    return s[0].toUpperCase() + s.substring(1);
  }

  /// Reads `max_users` or parses the first "N users" line from [features].
  static int? parseMaxUsers(Map<String, dynamic> plan) {
    final direct = plan['max_users'];
    if (direct is num && direct > 0) return direct.toInt();
    final raw = plan['features'];
    if (raw is List) {
      return parseMaxUsersFromFeatureLines(
        raw.map((e) => e?.toString() ?? '').toList(),
      );
    }
    return null;
  }

  /// Parses e.g. "50 users", "50 Users Included", "Up to 50 employees".
  static int? parseMaxUsersFromFeatureLines(List<String> lines) {
    for (final line in lines) {
      final s = line.trim().toLowerCase();
      if (s.isEmpty) continue;
      if (s.contains('unlimited')) return null;
      final m = RegExp(r'(\d+)\s*(users?|employees?|seats?)').firstMatch(s);
      if (m != null) return int.tryParse(m.group(1)!);
    }
    return null;
  }

  /// Payload for create/update on `subscription_plans`.
  static Map<String, dynamic> savePayload({
    required String name,
    required double price,
    required String billing,
    required List<String> features,
    bool isActive = true,
    double? priceEur,
    double? pricePkr,
    double? priceSar,
  }) {
    final maxUsers = parseMaxUsersFromFeatureLines(features);
    // Clients read price_eur first and fall back to price. Keep both filled so
    // a plan saved with only one of them never renders as "Custom".
    final eur = (priceEur != null && priceEur > 0) ? priceEur : null;
    final legacy = price > 0 ? price : (eur ?? 0);
    return {
      'name': name.trim(),
      'price': legacy,
      'billing': billing,
      'features': features,
      'is_active': isActive,
      if (eur != null || price > 0) 'price_eur': eur ?? price,
      if (pricePkr != null) 'price_pkr': pricePkr,
      if (priceSar != null) 'price_sar': priceSar,
      if (maxUsers != null) 'max_users': maxUsers,
    };
  }
}
