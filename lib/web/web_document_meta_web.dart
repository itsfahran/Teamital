// ignore_for_file: avoid_web_libraries_in_flutter, deprecated_member_use

import 'dart:html' as html;

/// Updates `<title>` + description / Open Graph meta so CMS SEO reflects in
/// the live browser tab and crawlers that execute JS.
void applyWebDocumentMeta({
  required String title,
  String? description,
  String? canonicalPath,
  String? ogImage,
}) {
  final t = title.trim();
  if (t.isNotEmpty) {
    html.document.title = t;
    _setMeta('property', 'og:title', t);
    _setMeta('name', 'twitter:title', t);
  }

  final d = description?.trim() ?? '';
  if (d.isNotEmpty) {
    _setMeta('name', 'description', d);
    _setMeta('property', 'og:description', d);
    _setMeta('name', 'twitter:description', d);
  }

  final path = (canonicalPath ?? html.window.location.pathname ?? '/').trim();
  final origin = html.window.location.origin;
  final canonical = path.startsWith('http')
      ? path
      : '$origin${path.startsWith('/') ? path : '/$path'}';
  _setLinkCanonical(canonical);
  _setMeta('property', 'og:url', canonical);

  final img = ogImage?.trim() ?? '';
  if (img.isNotEmpty) {
    _setMeta('property', 'og:image', img);
    _setMeta('name', 'twitter:image', img);
  }
}

void _setMeta(String attr, String key, String content) {
  final head = html.document.head;
  if (head == null) return;
  html.Element? el = head.querySelector('meta[$attr="$key"]');
  if (el == null) {
    el = html.MetaElement()..setAttribute(attr, key);
    head.append(el);
  }
  el.setAttribute('content', content);
}

void _setLinkCanonical(String href) {
  final head = html.document.head;
  if (head == null) return;
  html.LinkElement? link = head.querySelector('link[rel="canonical"]') as html.LinkElement?;
  if (link == null) {
    link = html.LinkElement()..rel = 'canonical';
    head.append(link);
  }
  link.href = href;
}
