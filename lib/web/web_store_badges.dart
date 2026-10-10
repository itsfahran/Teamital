import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:web_teamital/config/web_hosts.dart';
import 'package:web_teamital/web/web_routes.dart';
import 'package:url_launcher/url_launcher.dart';

/// Official store listings used by marketing header / footer / platforms.
class WebStoreLinks {
  static const microsoftStore =
      'https://apps.microsoft.com/detail/9p2170pdcn0j';
  static const playStore =
      'https://play.google.com/store/apps/details?id=com.employeetracking.app';
  static const appStore =
      'https://apps.apple.com/us/app/employee-tracking-app/id6775207232';

  /// Product web app (sign-in) lives on the app subdomain.
  static String get webApp => WebHosts.appAbsolute(WebRoutes.signIn);
}

Future<void> openWebStoreUrl(String url) async {
  final uri = Uri.tryParse(url);
  if (uri == null) return;
  await launchUrl(uri, mode: LaunchMode.externalApplication);
}

Size _badgeBox(bool compact) =>
    compact ? const Size(168, 50) : const Size(196, 58);

/// App Store · Google Play · Windows Store · Web — same size everywhere.
class WebStoreBadgeRow extends StatelessWidget {
  const WebStoreBadgeRow({
    super.key,
    this.alignment = WrapAlignment.start,
    this.compact = false,
  });

  final WrapAlignment alignment;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    final badges = <Widget>[
      AppStoreBadge(compact: compact),
      GooglePlayStoreBadge(compact: compact),
      MicrosoftStoreBadge(compact: compact),
      WebAppBadge(compact: compact),
    ];
    if (alignment == WrapAlignment.start) {
      return Row(
        children: [
          for (var i = 0; i < badges.length; i++) ...[
            if (i > 0) SizedBox(width: compact ? 10 : 14),
            badges[i],
          ],
        ],
      );
    }
    return Wrap(
      spacing: compact ? 10 : 14,
      runSpacing: compact ? 10 : 14,
      alignment: alignment,
      children: badges,
    );
  }
}

class MicrosoftStoreBadge extends StatelessWidget {
  const MicrosoftStoreBadge({super.key, this.compact = false});

  final bool compact;

  @override
  Widget build(BuildContext context) {
    return _ImageStoreBadge(
      compact: compact,
      asset: 'assets/window-store.png',
      url: WebStoreLinks.microsoftStore,
      semanticLabel: 'Download from Windows Store',
    );
  }
}

class GooglePlayStoreBadge extends StatelessWidget {
  const GooglePlayStoreBadge({super.key, this.compact = false});

  final bool compact;

  @override
  Widget build(BuildContext context) {
    return _ImageStoreBadge(
      compact: compact,
      asset: 'assets/play-store.png',
      url: WebStoreLinks.playStore,
      semanticLabel: 'Get it on Google Play',
    );
  }
}

class AppStoreBadge extends StatelessWidget {
  const AppStoreBadge({super.key, this.compact = false});

  final bool compact;

  @override
  Widget build(BuildContext context) {
    return _ImageStoreBadge(
      compact: compact,
      asset: 'assets/app-store.png',
      url: WebStoreLinks.appStore,
      semanticLabel: 'Download on the App Store',
    );
  }
}

class WebAppBadge extends StatelessWidget {
  const WebAppBadge({super.key, this.compact = false});

  final bool compact;

  @override
  Widget build(BuildContext context) {
    final box = _badgeBox(compact);
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: () {
          if (ModalRoute.of(context) != null) {
            WebRoutes.push(context, WebRoutes.signIn);
            return;
          }
          openWebStoreUrl(WebStoreLinks.webApp);
        },
        borderRadius: BorderRadius.circular(8),
        child: Semantics(
          button: true,
          label: 'Open web app',
          child: SizedBox(
            width: box.width,
            height: box.height,
            child: DecoratedBox(
              decoration: BoxDecoration(
                color: const Color(0xFF000000),
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: Colors.white, width: 1.2),
              ),
              child: Padding(
                padding: EdgeInsets.symmetric(horizontal: compact ? 10 : 12),
                child: Row(
                  children: [
                    Icon(
                      Icons.language_rounded,
                      color: Colors.white,
                      size: compact ? 26 : 30,
                    ),
                    SizedBox(width: compact ? 8 : 10),
                    Expanded(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Open in',
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: GoogleFonts.poppins(
                              color: Colors.white,
                              fontSize: compact ? 10 : 11,
                              fontWeight: FontWeight.w400,
                              height: 1.1,
                            ),
                          ),
                          Text(
                            'Web App',
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: GoogleFonts.poppins(
                              color: Colors.white,
                              fontSize: compact ? 16 : 18,
                              fontWeight: FontWeight.w600,
                              height: 1.15,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _ImageStoreBadge extends StatelessWidget {
  const _ImageStoreBadge({
    required this.asset,
    required this.url,
    required this.semanticLabel,
    this.compact = false,
  });

  final String asset;
  final String url;
  final String semanticLabel;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    final box = _badgeBox(compact);
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: () => openWebStoreUrl(url),
        borderRadius: BorderRadius.circular(8),
        child: Semantics(
          button: true,
          label: semanticLabel,
          child: SizedBox(
            width: box.width,
            height: box.height,
            child: DecoratedBox(
              decoration: BoxDecoration(
                color: const Color(0xFF000000),
                borderRadius: BorderRadius.circular(8),
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(8),
                child: Image.asset(
                  asset,
                  width: box.width,
                  height: box.height,
                  fit: BoxFit.contain,
                  filterQuality: FilterQuality.high,
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
