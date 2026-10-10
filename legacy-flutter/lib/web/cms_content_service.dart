import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

/// Realtime CMS content for Flutter web marketing pages.
/// Backed by Next.js admin-dashboard tables (`cms_pages`, `cms_seo`, `cms_nav_items`).
class CmsContentService {
  CmsContentService._();
  static final CmsContentService instance = CmsContentService._();

  final _db = Supabase.instance.client;
  final _pageCtrl = StreamController<Map<String, CmsPageContent>>.broadcast();
  final _navCtrl = StreamController<List<CmsNavLink>>.broadcast();

  Map<String, CmsPageContent> _pages = {};
  List<CmsNavLink> _nav = [];
  RealtimeChannel? _pageCh;
  RealtimeChannel? _navCh;
  bool _started = false;

  Stream<Map<String, CmsPageContent>> get pagesStream => _pageCtrl.stream;
  Stream<List<CmsNavLink>> get navStream => _navCtrl.stream;
  Map<String, CmsPageContent> get pages => _pages;
  List<CmsNavLink> get nav => _nav;

  CmsPageContent? page(String slug) => _pages[slug];

  Future<void> start() async {
    if (_started) return;
    _started = true;
    await refresh();
    _pageCh = _db
        .channel('cms-pages-web')
        .onPostgresChanges(
          event: PostgresChangeEvent.all,
          schema: 'public',
          table: 'cms_pages',
          callback: (_) => refreshPages(),
        )
        .onPostgresChanges(
          event: PostgresChangeEvent.all,
          schema: 'public',
          table: 'cms_seo',
          callback: (_) => refreshPages(),
        )
        .subscribe();
    _navCh = _db
        .channel('cms-nav-web')
        .onPostgresChanges(
          event: PostgresChangeEvent.all,
          schema: 'public',
          table: 'cms_nav_items',
          callback: (_) => refreshNav(),
        )
        .subscribe();
  }

  Future<void> refresh() async {
    await Future.wait([refreshPages(), refreshNav()]);
  }

  Future<void> refreshPages() async {
    try {
      final rows = await _db
          .from('cms_pages')
          .select('*, cms_seo(*)')
          .eq('status', 'published');
      final map = <String, CmsPageContent>{};
      for (final raw in rows as List) {
        final r = Map<String, dynamic>.from(raw as Map);
        final slug = (r['slug'] as String?) ?? '';
        if (slug.isEmpty) continue;
        Map<String, dynamic>? seo;
        final seoRaw = r['cms_seo'];
        if (seoRaw is List && seoRaw.isNotEmpty) {
          seo = Map<String, dynamic>.from(seoRaw.first as Map);
        } else if (seoRaw is Map) {
          seo = Map<String, dynamic>.from(seoRaw);
        }
        map[slug] = CmsPageContent.fromRow(r, seo);
      }
      _pages = map;
      if (!_pageCtrl.isClosed) _pageCtrl.add(_pages);
    } catch (e) {
      debugPrint('[CmsContentService] pages: $e');
    }
  }

  Future<void> refreshNav() async {
    try {
      final rows = await _db
          .from('cms_nav_items')
          .select()
          .order('sort_order');
      _nav = (rows as List)
          .map((e) => CmsNavLink.fromRow(Map<String, dynamic>.from(e as Map)))
          .toList();
      if (!_navCtrl.isClosed) _navCtrl.add(_nav);
    } catch (e) {
      debugPrint('[CmsContentService] nav: $e');
    }
  }

  void dispose() {
    if (_pageCh != null) _db.removeChannel(_pageCh!);
    if (_navCh != null) _db.removeChannel(_navCh!);
    _pageCtrl.close();
    _navCtrl.close();
    _started = false;
  }
}

class CmsBlock {
  const CmsBlock({
    required this.type,
    this.variant = '',
    this.slot,
    this.heading = '',
    this.body = '',
    this.buttonLabel = '',
    this.buttonHref = '',
    this.button2Label = '',
    this.button2Href = '',
    this.imageUrl = '',
    this.items = const [],
  });

  final String type;
  final String variant;
  final int? slot;
  final String heading;
  final String body;
  final String buttonLabel;
  final String buttonHref;
  final String button2Label;
  final String button2Href;
  final String imageUrl;
  final List<String> items;

  factory CmsBlock.fromMap(Map block) {
    final rawItems = block['items'] ?? block['faqs'];
    final items = <String>[];
    if (rawItems is List) {
      for (final e in rawItems) {
        if (e is String) {
          final t = e.trim();
          if (t.isNotEmpty) items.add(t);
        } else if (e is Map) {
          final title = (e['title'] ?? e['q'] ?? e['name'] ?? e['label'] ?? '')
              .toString()
              .trim();
          final text = (e['text'] ?? e['a'] ?? e['quote'] ?? e['body'] ?? '')
              .toString()
              .trim();
          if (title.isEmpty && text.isEmpty) continue;
          items.add(text.isEmpty ? title : (title.isEmpty ? text : '$title|$text'));
        }
      }
    }
    final slotN = int.tryParse('${block['slot']}');
    return CmsBlock(
      type: (block['type'] ?? '').toString(),
      variant: (block['variant'] ?? '').toString(),
      slot: slotN,
      heading: (block['heading'] ?? block['headline'] ?? block['label'] ?? '')
          .toString(),
      body: (block['body'] ?? block['subheadline'] ?? block['description'] ?? '')
          .toString(),
      buttonLabel: (block['buttonLabel'] ?? '').toString(),
      buttonHref: (block['buttonHref'] ?? block['href'] ?? '').toString(),
      button2Label: (block['button2Label'] ?? '').toString(),
      button2Href: (block['button2Href'] ?? '').toString(),
      imageUrl: (block['imageUrl'] ?? block['image_url'] ?? '').toString(),
      items: items,
    );
  }

  HomeSlot toHomeSlot() => HomeSlot(
        slot: slot ?? 4,
        variant: variant,
        heading: heading,
        body: body,
        button: buttonLabel,
        button2: button2Label,
        items: items,
      );
}

class CmsPageContent {
  const CmsPageContent({
    required this.id,
    required this.title,
    required this.slug,
    required this.h1,
    required this.body,
    required this.metaTitle,
    required this.metaDescription,
    this.heroVariant = 'split-product',
    this.buttonLabel = '',
    this.buttonHref = '',
    this.button2Label = '',
    this.button2Href = '',
    this.h2Variant = '',
    this.h2Heading = '',
    this.h2Body = '',
    this.h2Button = '',
    this.h2Items = const [],
    this.h3Variant = '',
    this.h3Heading = '',
    this.h3Body = '',
    this.h3Button = '',
    this.h3Items = const [],
    this.slots = const {},
    this.blocks = const [],
  });

  final String id;
  final String title;
  final String slug;
  final String h1;
  final String body;
  final String metaTitle;
  final String metaDescription;
  final String heroVariant;
  final String buttonLabel;
  final String buttonHref;
  final String button2Label;
  final String button2Href;
  final String h2Variant;
  final String h2Heading;
  final String h2Body;
  final String h2Button;
  final List<String> h2Items;
  final String h3Variant;
  final String h3Heading;
  final String h3Body;
  final String h3Button;
  final List<String> h3Items;
  final Map<int, HomeSlot> slots;
  /// Ordered content blocks for dynamic CMS pages (same shapes as Landing).
  final List<CmsBlock> blocks;

  factory CmsPageContent.fromRow(
    Map<String, dynamic> row,
    Map<String, dynamic>? seo,
  ) {
    final content = row['content'];
    String body = '';
    var heroVariant = 'split-product';
    var buttonLabel = '';
    var buttonHref = '';
    var button2Label = '';
    var button2Href = '';
    var h2Variant = '';
    var h2Heading = '';
    var h2Body = '';
    var h2Button = '';
    var h2Items = const <String>[];
    var h3Variant = '';
    var h3Heading = '';
    var h3Body = '';
    var h3Button = '';
    var h3Items = const <String>[];
    final slots = <int, HomeSlot>{};
    final blocks = <CmsBlock>[];
    if (content is List && content.isNotEmpty) {
      Map? hero;
      Map? h2;
      Map? h3;
      for (final block in content) {
        if (block is! Map) continue;
        final cmsBlock = CmsBlock.fromMap(block);
        if (cmsBlock.type.isNotEmpty) blocks.add(cmsBlock);
        if (block['type'] == 'hero' && hero == null) hero = block;
        if (block['type'] == 'h2' && h2 == null) h2 = block;
        if (block['type'] == 'h3' && h3 == null) h3 = block;
        if (block['type'] == 'slot') {
          final n = int.tryParse('${block['slot']}') ?? 0;
          if (n >= 4 && n <= 10) {
            slots[n] = cmsBlock.toHomeSlot();
          }
        }
      }
      hero ??= content.first is Map ? content.first as Map : null;
      if (hero != null) {
        body = (hero['subheadline'] ?? hero['body'] ?? hero['headline'] ?? '')
            .toString();
        final variant = (hero['variant'] ?? '').toString().trim();
        if (variant.isNotEmpty) heroVariant = variant;
        buttonLabel = (hero['buttonLabel'] ?? '').toString();
        buttonHref = (hero['buttonHref'] ?? '').toString();
        button2Label = (hero['button2Label'] ?? '').toString();
        button2Href = (hero['button2Href'] ?? '').toString();
      }
      if (h2 != null) {
        h2Variant = (h2['variant'] ?? '').toString().trim();
        h2Heading = (h2['heading'] ?? h2['headline'] ?? '').toString();
        h2Body = (h2['body'] ?? h2['subheadline'] ?? '').toString();
        h2Button = (h2['buttonLabel'] ?? '').toString();
        final rawItems = h2['items'];
        if (rawItems is List) {
          h2Items = rawItems
              .map((e) {
                if (e is String) return e.trim();
                if (e is Map) {
                  return (e['title'] ?? e['text'] ?? '').toString().trim();
                }
                return '';
              })
              .where((e) => e.isNotEmpty)
              .toList();
        }
      }
      if (h3 != null) {
        h3Variant = (h3['variant'] ?? '').toString().trim();
        h3Heading = (h3['heading'] ?? h3['headline'] ?? '').toString();
        h3Body = (h3['body'] ?? h3['subheadline'] ?? '').toString();
        h3Button = (h3['buttonLabel'] ?? '').toString();
        final rawItems = h3['items'];
        if (rawItems is List) {
          h3Items = rawItems
              .map((e) => e is String ? e.trim() : '')
              .where((e) => e.isNotEmpty)
              .toList();
        }
      }
    }
    return CmsPageContent(
      id: '${row['id']}',
      title: (row['title'] as String?) ?? '',
      slug: (row['slug'] as String?) ?? '',
      h1: (row['h1'] as String?) ?? (row['title'] as String?) ?? '',
      body: body,
      metaTitle: (seo?['meta_title'] as String?) ?? '',
      metaDescription: (seo?['meta_description'] as String?) ?? '',
      heroVariant: heroVariant,
      buttonLabel: buttonLabel,
      buttonHref: buttonHref,
      button2Label: button2Label,
      button2Href: button2Href,
      h2Variant: h2Variant,
      h2Heading: h2Heading,
      h2Body: h2Body,
      h2Button: h2Button,
      h2Items: h2Items,
      h3Variant: h3Variant,
      h3Heading: h3Heading,
      h3Body: h3Body,
      h3Button: h3Button,
      h3Items: h3Items,
      slots: slots,
      blocks: blocks,
    );
  }
}

class HomeSlot {
  const HomeSlot({
    required this.slot,
    required this.variant,
    this.heading = '',
    this.body = '',
    this.button = '',
    this.button2 = '',
    this.items = const [],
  });

  final int slot;
  final String variant;
  final String heading;
  final String body;
  final String button;
  final String button2;
  final List<String> items;
}

class CmsNavLink {
  const CmsNavLink({
    required this.label,
    required this.href,
    required this.location,
  });

  final String label;
  final String href;
  final String location;

  factory CmsNavLink.fromRow(Map<String, dynamic> row) => CmsNavLink(
        label: (row['label'] as String?) ?? '',
        href: (row['href'] as String?) ?? '',
        location: (row['location'] as String?) ?? 'header',
      );
}
