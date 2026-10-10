import 'dart:async';

import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_web_plugins/url_strategy.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:web_teamital/app_colors.dart';
import 'package:web_teamital/app_config.dart';
import 'package:web_teamital/app_theme.dart';
import 'package:web_teamital/config/web_public_env.dart';
import 'package:web_teamital/services/tenant_context.dart';
import 'package:web_teamital/web/cms_content_service.dart';
import 'package:web_teamital/web/initial_web_uri.dart';
import 'package:web_teamital/web/web_routes.dart';
import 'package:web_teamital/web/web_url_observer.dart';

final GlobalKey<NavigatorState> appNavigatorKey = GlobalKey<NavigatorState>();
final WebUrlObserver webUrlObserver =
    WebUrlObserver(navigatorKey: appNavigatorKey);

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  GoogleFonts.config.allowRuntimeFetching = false;
  if (kIsWeb) {
    InitialWebUri.capture();
    usePathUrlStrategy();
  }
  dotenv.loadFromString(envString: WebPublicEnv.dotenvContents);
  await Supabase.initialize(
    url: dotenv.env['SUPABASE_URL']!,
    anonKey: dotenv.env['SUPABASE_ANON_KEY']!,
  );
  await TenantContext.resolveFromCurrentHost();
  unawaited(CmsContentService.instance.start());
  runApp(const MarketingApp());
}

/// Public marketing website only (teamital.com).
class MarketingApp extends StatelessWidget {
  const MarketingApp({super.key});

  @override
  Widget build(BuildContext context) {
    const primary = Color(0xFF1A56DB);
    return MaterialApp(
      navigatorKey: appNavigatorKey,
      navigatorObservers:
          kIsWeb ? <NavigatorObserver>[webUrlObserver] : const [],
      debugShowCheckedModeBanner: false,
      title: AppConfig.displayName,
      theme: AppTheme.light(primary: primary),
      themeMode: ThemeMode.light,
      builder: (context, child) {
        AppColors.applyBrightness(false);
        return child ?? const SizedBox.shrink();
      },
      onGenerateRoute: WebRoutes.onGenerateRoute,
      onGenerateInitialRoutes: WebRoutes.onGenerateInitialRoutes,
    );
  }
}
