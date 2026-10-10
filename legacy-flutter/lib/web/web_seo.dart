import 'package:web_teamital/app_config.dart';
import 'package:web_teamital/web/cms_content_service.dart';
import 'package:web_teamital/web/web_document_meta.dart';
import 'package:web_teamital/web/web_routes.dart';

/// Applies CMS SEO (when present) or static defaults for public web routes.
class WebSeo {
  WebSeo._();

  static const _brand = 'Teamital';
  static const _defaultDescription =
      'Complete workforce intelligence in one place — attendance, GPS, leave, tasks and live insights.';

  static void applyForPath(String path) {
    final p = WebRoutes.normalize(path);
    final cmsSlug = p == WebRoutes.home ? 'home' : WebRoutes.cmsSlugFromPath(p);
    if (cmsSlug != null) {
      final page = CmsContentService.instance.page(cmsSlug);
      if (page != null) {
        final title = page.metaTitle.trim().isNotEmpty
            ? page.metaTitle.trim()
            : (page.title.trim().isNotEmpty
                ? '${page.title.trim()} | $_brand'
                : '$_brand — Workforce Intelligence');
        final desc = page.metaDescription.trim().isNotEmpty
            ? page.metaDescription.trim()
            : (page.h1.trim().isNotEmpty ? page.h1.trim() : _defaultDescription);
        applyWebDocumentMeta(
          title: title,
          description: desc,
          canonicalPath: p,
        );
        return;
      }
    }

    final (title, desc) = _defaults(p);
    applyWebDocumentMeta(title: title, description: desc, canonicalPath: p);
  }

  static (String, String) _defaults(String path) {
    switch (path) {
      case WebRoutes.home:
        return (
          '$_brand — Complete Workforce Intelligence in One Place',
          _defaultDescription,
        );
      case WebRoutes.signIn:
        return ('Sign in | $_brand', 'Sign in to your Teamital account.');
      case WebRoutes.signUp:
        return ('Sign up | $_brand', 'Create your Teamital account.');
      case WebRoutes.pricing:
        return ('Pricing | $_brand', 'Teamital plans for teams of every size.');
      case WebRoutes.contact:
        return ('Contact | $_brand', 'Talk to the Teamital team.');
      case WebRoutes.privacyPolicy:
        return ('Privacy Policy | $_brand', 'How Teamital handles personal data under GDPR.');
      case WebRoutes.deleteAccount:
        return ('Delete account | $_brand', 'How to request deletion of your Teamital account.');
      case WebRoutes.about:
        return ('About | $_brand', 'About Teamital workforce intelligence.');
      case WebRoutes.features:
        return ('Features | $_brand', 'Teamital attendance, GPS, leave and task features.');
      case WebRoutes.security:
        return ('Security Policy | $_brand', 'How Teamital protects customer and workforce data.');
      case WebRoutes.terms:
        return ('Terms & Conditions | $_brand', 'Terms for using Teamital.');
      case WebRoutes.cookies:
        return ('Cookie Policy | $_brand', 'How Teamital uses cookies and similar technologies.');
      case WebRoutes.careers:
        return ('Careers | $_brand', 'Careers at Teamital.');
      case WebRoutes.blog:
        return ('Blog | $_brand', 'Guides on attendance, GPS and HR ops.');
      case WebRoutes.howItWorks:
        return ('How it works | $_brand', 'How Teamital workforce tracking works.');
      default:
        return (
          '${AppConfig.displayName} — Workforce Intelligence',
          _defaultDescription,
        );
    }
  }
}
