import 'package:flutter/material.dart';

/// Official Teamital brand mark (icon + optional web wordmark).
class BrandLogo extends StatelessWidget {
  const BrandLogo({
    super.key,
    this.height = 40,
    this.width,
    this.fit = BoxFit.contain,
    this.borderRadius = 10,
    this.asset = markAssetPath,
    this.alignment = Alignment.center,
  });

  /// App icon only (no wordmark) — login / signup / sidebars / splash.
  static const markAssetPath = 'assets/logo.jpg';

  /// Wide Teamital wordmark for the public website header / footer.
  static const assetPath = 'assets/brand_logo_web.png';
  static const headerAssetPath = 'assets/brand_logo_web.png';

  /// Native aspect of [headerAssetPath].
  static const headerAspectRatio = 1000 / 300;

  final double height;
  final double? width;
  final BoxFit fit;
  final double borderRadius;
  final String asset;
  final Alignment alignment;

  /// Compact square icon (no name) for mobile chrome and auth.
  const BrandLogo.mark({
    super.key,
    double size = 48,
    this.borderRadius = 10,
  })  : height = size,
        width = size,
        fit = BoxFit.contain,
        alignment = Alignment.center,
        asset = markAssetPath;

  /// Full wordmark for the public site header / footer.
  const BrandLogo.header({
    super.key,
    this.height = 120,
    this.width,
    this.fit = BoxFit.contain,
    this.borderRadius = 0,
    this.alignment = Alignment.centerLeft,
  }) : asset = headerAssetPath;

  bool get _isHeader =>
      fit == BoxFit.contain &&
      (width != null || asset == headerAssetPath);

  @override
  Widget build(BuildContext context) {
    final resolvedWidth = width ??
        (_isHeader
            ? height * headerAspectRatio
            : (fit == BoxFit.cover ? height : null));

    final dpr = MediaQuery.maybeDevicePixelRatioOf(context) ?? 2;
    final cacheH = (height * dpr).round();
    final cacheW =
        resolvedWidth == null ? null : (resolvedWidth * dpr).round();

    final image = Image.asset(
      asset,
      height: height,
      width: resolvedWidth,
      fit: fit,
      alignment: alignment,
      filterQuality: FilterQuality.high,
      isAntiAlias: true,
      cacheHeight: cacheH,
      cacheWidth: cacheW,
      errorBuilder: (_, __, ___) => SizedBox(
        height: height,
        width: resolvedWidth ?? height,
      ),
    );

    final sized = _isHeader
        ? SizedBox(height: height, width: resolvedWidth, child: image)
        : image;

    if (borderRadius <= 0) return sized;
    return ClipRRect(
      borderRadius: BorderRadius.circular(borderRadius),
      child: sized,
    );
  }
}
