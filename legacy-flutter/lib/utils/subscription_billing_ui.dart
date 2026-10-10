import 'package:flutter/material.dart';
import 'package:web_teamital/app_colors.dart';
import 'package:web_teamital/utils/ios_store_policy.dart';
import 'package:web_teamital/utils/subscription_plan_helpers.dart';

/// Shared Monthly / 1 Year / 5 Years toggle + active subscription details card.
class SubscriptionBillingUi {
  SubscriptionBillingUi._();

  static Widget plansToggle({
    required String selectedTab,
    required ValueChanged<String> onChanged,
    List<String>? tabs,
  }) {
    return SubscriptionPlanHelpers.billingSegTabs(
      selected: selectedTab,
      onChanged: onChanged,
      tabs: tabs,
    );
  }

  static Widget activeSubscriptionCard(Map<String, dynamic> purchase) {
    final sub = purchase['subscription'] as Map<String, dynamic>? ?? {};
    final name = (sub['name'] as String?)?.trim().isNotEmpty == true
        ? (sub['name'] as String).trim()
        : 'Subscription';
    final billing = sub['billing'] as String? ?? 'monthly';
    final billingLabel = SubscriptionPlanHelpers.billingLabel(billing);
    final price = SubscriptionPlanHelpers.amountForPlan(sub);
    final priceStr =
        price == 0 ? 'Custom' : SubscriptionPlanHelpers.priceLabel(sub);
    final purchasedAt =
        SubscriptionPlanHelpers.parseDate(purchase['created_at']);
    final purchaseStr = purchasedAt != null
        ? SubscriptionPlanHelpers.formatDateLong(purchasedAt)
        : '—';
    final expiry = SubscriptionPlanHelpers.parseDate(purchase['expires_at']) ??
        (purchasedAt != null
            ? SubscriptionPlanHelpers.expiryFromPurchase(purchasedAt, billing)
            : null);
    final expiryStr = expiry != null
        ? SubscriptionPlanHelpers.formatDateLong(expiry)
        : '—';
    final daysLeft = SubscriptionPlanHelpers.daysUntil(expiry);
    final isActive = expiry == null || !expiry.isBefore(DateTime.now());
    final provider = (purchase['payment_provider'] as String?)?.trim() ?? '';
    final paymentLabel = switch (provider.toLowerCase()) {
      'stripe' => 'Stripe',
      'revolut' => 'Revolut',
      'apple' => 'App Store',
      SubscriptionPlanHelpers.adminGrantProvider => 'Granted by admin',
      '' => IosStorePolicy.isIosAppStore ? 'App Store' : 'Recorded purchase',
      _ => provider,
    };
    final appleAutoRenew = IosStorePolicy.isIosAppStore ||
        provider.toLowerCase() == 'apple';
    final daysLabel = daysLeft == null
        ? '—'
        : daysLeft < 0
            ? 'Expired ${-daysLeft} day${-daysLeft == 1 ? '' : 's'} ago'
            : daysLeft == 0
                ? 'Expires today'
                : '$daysLeft day${daysLeft == 1 ? '' : 's'} left';
    final nextRenewalLabel = isActive && expiry != null
        ? (appleAutoRenew ? 'Renews $expiryStr' : 'Pay again by $expiryStr')
        : '—';

    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        color: AppColors.background,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: AppColors.border),
        boxShadow: [
          BoxShadow(
            color: AppColors.primary.withValues(alpha: 0.08),
            blurRadius: 18,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      clipBehavior: Clip.antiAlias,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Container(
            padding: const EdgeInsets.fromLTRB(18, 16, 18, 16),
            decoration: const BoxDecoration(gradient: AppColors.masterPrimaryGradient),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Text(
                      'Current subscription',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: Colors.white.withValues(alpha: 0.85),
                      ),
                    ),
                    const Spacer(),
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.2),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(
                        isActive ? 'Active' : 'Expired',
                        style: const TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w700,
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                Text(
                  name,
                  style: const TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.w800,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  '${billingLabel} · $priceStr',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w600,
                    color: Colors.white.withValues(alpha: 0.92),
                  ),
                ),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 14, 16, 16),
            child: Column(
              children: [
                detailRow(Icons.shopping_bag_outlined, 'Purchased', purchaseStr),
                detailRow(Icons.event_busy_rounded, 'Expiry date', expiryStr),
                detailRow(
                  Icons.timelapse_rounded,
                  'Time remaining',
                  daysLabel,
                  valueColor: !isActive
                      ? AppColors.error
                      : (daysLeft != null && daysLeft <= 7
                          ? AppColors.warning
                          : AppColors.success),
                ),
                detailRow(
                  Icons.payments_outlined,
                  'Amount paid',
                  price == 0 ? 'Custom' : priceStr,
                ),
                detailRow(
                  Icons.autorenew_rounded,
                  'Billing cycle',
                  billingLabel,
                ),
                detailRow(
                  Icons.credit_card_rounded,
                  'Payment method',
                  paymentLabel,
                ),
                detailRow(
                  Icons.sync_rounded,
                  'Auto-renewal',
                  appleAutoRenew ? 'On (App Store)' : 'Off',
                  valueColor: appleAutoRenew
                      ? AppColors.success
                      : AppColors.textSecondary,
                ),
                detailRow(
                  Icons.calendar_month_rounded,
                  'Next renewal',
                  nextRenewalLabel,
                  isLast: true,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  static Widget detailRow(
    IconData icon,
    String label,
    String value, {
    Color? valueColor,
    bool isLast = false,
  }) {
    return Container(
      padding: EdgeInsets.only(bottom: isLast ? 0 : 12, top: 2),
      decoration: isLast
          ? null
          : BoxDecoration(
              border: Border(
                bottom: BorderSide(
                  color: AppColors.border.withValues(alpha: 0.7),
                ),
              ),
            ),
      margin: EdgeInsets.only(bottom: isLast ? 0 : 10),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, size: 18, color: AppColors.primary),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              label,
              style: TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w500,
                color: AppColors.textSecondary,
              ),
            ),
          ),
          const SizedBox(width: 8),
          Flexible(
            child: Text(
              value,
              textAlign: TextAlign.right,
              style: TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w700,
                color: valueColor ?? AppColors.textPrimary,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
